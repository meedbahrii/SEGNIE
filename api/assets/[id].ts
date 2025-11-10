import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { handleCORS } from '../_middleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCORS(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid asset ID' });
    }

    const item = await storage.getSavedItemById(id);

    if (!item) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const assetData = item.assetUrl || item.imageUrl;

    if (!assetData) {
      return res.status(404).json({ error: 'No asset data found' });
    }

    const matches = assetData.match(/^data:([^;]+);base64,(.+)$/);
    
    if (!matches) {
      return res.status(400).json({ error: 'Invalid asset data format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const extension = mimeType.split('/')[1] || 'bin';
    const filename = `${item.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.${extension}`;

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.send(buffer);
  } catch (error) {
    console.error('Error serving asset:', error);
    return res.status(500).json({ error: 'Failed to serve asset' });
  }
}
