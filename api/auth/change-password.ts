import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { withSession, requireAuth, handleCORS } from '../_middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await withSession(req, res);

    if (!requireAuth(req, res)) return;

    const userId = req.session.userId!;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = await storage.verifyPassword(currentPassword, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    await storage.updateUserPassword(userId, newPassword);

    res.json({ success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
}
