import type { VercelRequest, VercelResponse } from '@vercel/node';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';

const PgSession = connectPgSimple(session);

let pool: Pool | null = null;
let sessionMiddleware: any = null;

export function getSessionMiddleware() {
  if (sessionMiddleware) {
    return sessionMiddleware;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for session storage');
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  const store = new PgSession({
    pool,
    tableName: 'user_sessions',
    createTableIfMissing: true,
  });

  sessionMiddleware = session({
    store,
    secret: process.env.SESSION_SECRET || 'saveto-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  });

  return sessionMiddleware;
}

export function runMiddleware(req: VercelRequest, res: VercelResponse, fn: Function): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

declare module 'http' {
  interface IncomingMessage {
    session: {
      userId?: string;
      regenerate: (callback: (err?: any) => void) => void;
      save: (callback: (err?: any) => void) => void;
      destroy: (callback: (err?: any) => void) => void;
    };
  }
}

export async function withSession(req: VercelRequest, res: VercelResponse): Promise<void> {
  const middleware = getSessionMiddleware();
  await runMiddleware(req, res, middleware);
}

export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  if (!req.session?.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return false;
  }
  return true;
}

export function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  
  return false;
}
