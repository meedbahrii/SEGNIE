import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { insertSavedItemSchema } from '../../shared/schema';
import { z } from 'zod';
import { withSession, requireAuth, handleCORS } from '../_middleware';
import { saveToGoogleSheets } from '../../server/integrations/google-sheets';
import { saveToNotion } from '../../server/integrations/notion';
import { saveToTrello } from '../../server/integrations/trello';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  
  try {
    await withSession(req, res);

    if (!requireAuth(req, res)) return;

    const userId = req.session.userId!;

    if (req.method === 'GET') {
      const items = await storage.getSavedItems(userId);
      return res.json({ items });
    }

    if (req.method === 'POST') {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const saveCount = user.saveCount;
      
      if (!user.isPremium && saveCount >= 3) {
        return res.status(403).json({ 
          error: 'Save limit reached', 
          message: "You've reached your free save limit. Upgrade to premium to continue saving.",
          remaining: 0,
          limit: 3
        });
      }

      const validatedData = insertSavedItemSchema.parse({
        ...req.body,
        userId,
      });

      const item = await storage.createSavedItem(validatedData);
      await storage.incrementSaveCount(userId);

      const destinations = req.body.destinations || {};
      const syncResults: Record<string, { success: boolean; error?: string }> = {};

      if (destinations['google-sheets']) {
        try {
          const connection = await storage.getIntegrationConnectionByType(userId, 'google-sheets');
          
          if (!connection) {
            syncResults['google-sheets'] = { 
              success: false, 
              error: 'Google Sheets not connected' 
            };
          } else {
            const existingSpreadsheetId = connection.credentials?.spreadsheetId;
            
            const baseUrl = process.env.REPLIT_DEPLOYMENT_URL 
              ? `https://${process.env.REPLIT_DEPLOYMENT_URL}` 
              : `http://localhost:5000`;

            const result = await saveToGoogleSheets({
              title: item.title,
              content: item.content,
              contentType: item.contentType,
              sourceUrl: item.sourceUrl,
              tags: item.tags,
              createdAt: item.createdAt,
              imageUrl: item.imageUrl,
              assetUrl: item.assetUrl,
              assetType: item.assetType,
              savedItemId: item.id,
              baseUrl,
            }, connection.credentials, existingSpreadsheetId);
            
            if (result.spreadsheetId && result.spreadsheetId !== existingSpreadsheetId) {
              await storage.updateIntegrationConnection(connection.id, userId, {
                credentials: {
                  ...connection.credentials,
                  spreadsheetId: result.spreadsheetId,
                },
              });
            }
            
            syncResults['google-sheets'] = { success: result.success };
          }
        } catch (error) {
          console.error('Failed to sync to Google Sheets:', error);
          syncResults['google-sheets'] = { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      }

      if (destinations['notion']) {
        try {
          const connection = await storage.getIntegrationConnectionByType(userId, 'notion');
          
          if (!connection) {
            syncResults['notion'] = { 
              success: false, 
              error: 'Notion not connected' 
            };
          } else {
            const accessToken = connection.credentials?.access_token;
            const existingDatabaseId = connection.credentials?.databaseId;
            
            if (!accessToken) {
              syncResults['notion'] = { 
                success: false, 
                error: 'Notion access token missing' 
              };
            } else {
              const baseUrl = process.env.REPLIT_DEPLOYMENT_URL 
                ? `https://${process.env.REPLIT_DEPLOYMENT_URL}` 
                : `http://localhost:5000`;

              const result = await saveToNotion(accessToken, {
                title: item.title,
                content: item.content,
                contentType: item.contentType,
                sourceUrl: item.sourceUrl,
                tags: item.tags,
                createdAt: item.createdAt,
                imageUrl: item.imageUrl,
                assetUrl: item.assetUrl,
                assetType: item.assetType,
                savedItemId: item.id,
                baseUrl,
              }, existingDatabaseId);
              
              if (result.databaseId && result.databaseId !== existingDatabaseId) {
                await storage.updateIntegrationConnection(connection.id, userId, {
                  credentials: {
                    ...connection.credentials,
                    databaseId: result.databaseId,
                  },
                });
              }
              
              syncResults['notion'] = { 
                success: result.success, 
                error: result.error 
              };
            }
          }
        } catch (error) {
          console.error('Failed to sync to Notion:', error);
          syncResults['notion'] = { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      }

      if (destinations['trello']) {
        try {
          const connection = await storage.getIntegrationConnectionByType(userId, 'trello');
          
          if (!connection) {
            syncResults['trello'] = { 
              success: false, 
              error: 'Trello not connected' 
            };
          } else {
            const token = connection.credentials?.token;
            const apiKey = connection.credentials?.apiKey;
            const existingListId = connection.credentials?.listId;
            
            if (!token || !apiKey) {
              syncResults['trello'] = { 
                success: false, 
                error: 'Trello credentials missing' 
              };
            } else {
              const result = await saveToTrello(apiKey, token, {
                title: item.title,
                content: item.content,
                contentType: item.contentType,
                sourceUrl: item.sourceUrl,
                tags: item.tags,
                createdAt: item.createdAt,
              }, existingListId);
              
              if (result.listId && result.listId !== existingListId) {
                await storage.updateIntegrationConnection(connection.id, userId, {
                  credentials: {
                    ...connection.credentials,
                    listId: result.listId,
                  },
                });
              }
              
              syncResults['trello'] = { 
                success: result.success, 
                error: result.error 
              };
            }
          }
        } catch (error) {
          console.error('Failed to sync to Trello:', error);
          syncResults['trello'] = { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      }

      const updatedUser = await storage.getUser(userId);
      const newCount = updatedUser ? updatedUser.saveCount : saveCount + 1;
      const remaining = updatedUser?.isPremium ? -1 : Math.max(0, 3 - newCount);

      return res.json({ 
        item,
        saveInfo: {
          saveCount: newCount,
          remaining,
          isPremium: user.isPremium
        },
        syncResults
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error in saved-items:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
