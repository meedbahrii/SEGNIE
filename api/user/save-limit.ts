import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { withSession, requireAuth, handleCORS } from '../_middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await withSession(req, res);

    if (!requireAuth(req, res)) return;

    const userId = req.session.userId!;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const saveCount = user.saveCount;
    const limit = user.isPremium ? -1 : 3;
    const remaining = user.isPremium ? -1 : Math.max(0, limit - saveCount);

    res.json({ 
      saveCount, 
      limit, 
      remaining,
      isPremium: user.isPremium,
      canSave: user.isPremium || saveCount < 3
    });
  } catch (error) {
    console.error('Error fetching save limit:', error);
    res.status(500).json({ error: 'Failed to fetch save limit' });
  }
}
