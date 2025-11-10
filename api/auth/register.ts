import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { insertUserSchema } from '../../shared/schema';
import { z } from 'zod';
import { withSession, handleCORS } from '../_middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await withSession(req, res);

    const validatedData = insertUserSchema.parse(req.body);
    const existingUser = await storage.getUserByUsername(validatedData.username);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = await storage.createUser(validatedData);
    const { password, ...userWithoutPassword } = user;
    
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

    res.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
}
