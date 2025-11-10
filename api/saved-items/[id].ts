import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { withSession, requireAuth, handleCORS } from '../_middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  
  try {
    await withSession(req, res);

    if (!requireAuth(req, res)) return;

    const userId = req.session.userId!;
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    if (req.method === 'GET') {
      const item = await storage.getSavedItem(id, userId);
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      return res.json({ item });
    }

    if (req.method === 'DELETE') {
      const deleted = await storage.deleteSavedItem(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Item not found' });
      }

      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in saved-item:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
