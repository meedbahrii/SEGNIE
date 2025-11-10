import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { insertIntegrationConnectionSchema } from '../../shared/schema';
import { z } from 'zod';
import { withSession, requireAuth, handleCORS } from '../_middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  
  try {
    await withSession(req, res);

    if (!requireAuth(req, res)) return;

    const userId = req.session.userId!;

    if (req.method === 'GET') {
      const connections = await storage.getIntegrationConnections(userId);
      return res.json({ connections });
    }

    if (req.method === 'POST') {
      const validatedData = insertIntegrationConnectionSchema.parse({
        ...req.body,
        userId,
      });

      const connection = await storage.createIntegrationConnection(validatedData);
      return res.json({ connection });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error in integrations:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
