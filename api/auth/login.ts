import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { withSession, handleCORS } from '../_middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await withSession(req, res);

    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await storage.verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    req.session.userId = user.id;
    
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
}
