import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import rateLimit from "express-rate-limit";
import csurf from "csurf";
import compression from "compression";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { pool } from "./db";
import { storage } from "./storage";
import { allBlogPosts } from "./blog-data";

const app = express();

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

const isProduction = process.env.NODE_ENV === 'production';

const ALLOWED_EXTENSION_IDS = (process.env.ALLOWED_EXTENSION_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

if (ALLOWED_EXTENSION_IDS.length > 0) {
  log(`✅ Configured ${ALLOWED_EXTENSION_IDS.length} allowed extension ID(s)`);
} else {
  log('⚠️  No extension IDs configured - extension access will be blocked in production');
}

// Build allowed origins list; allow adding via environment variables for production (e.g. Vercel)
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
];

// Add replit domains if configured (existing behavior)
if (isProduction && process.env.REPLIT_DOMAINS) {
  const replitDomains = process.env.REPLIT_DOMAINS.split(',');
  replitDomains.forEach(domain => {
    allowedOrigins.push(`https://${domain.trim()}`);
  });
}

// Add any comma-separated additional origins from ALLOWED_ORIGINS env var
if (process.env.ALLOWED_ORIGINS) {
  process.env.ALLOWED_ORIGINS.split(',').forEach(o => {
    const trimmed = o.trim();
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

// Convenience: allow a VERCEL_FRONTEND_URL env var (e.g. "segnie.vercel.app")
if (process.env.VERCEL_FRONTEND_URL) {
  let url = process.env.VERCEL_FRONTEND_URL.trim();
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;
  allowedOrigins.push(url);
}

log(`CORS allowed origins: ${JSON.stringify(allowedOrigins)}`);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true);

    // allow browser extensions by origin scheme if configured
    if (origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://')) {
      const extensionId = origin.split('://')[1];
      const isAllowed = ALLOWED_EXTENSION_IDS.includes(extensionId) || (!isProduction && extensionId);

      if (isAllowed) {
        return callback(null, true);
      } else {
        log(`🚫 Blocked unauthorized extension: ${extensionId}`);
        return callback(null, false);
      }
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    log(`🚫 CORS blocked origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

if (isProduction) {
  app.set('trust proxy', 1);
} else {
  app.set('trust proxy', true);
}

const MemoryStore = createMemoryStore(session);
const PostgresStore = connectPgSimple(session);

const sessionStore = pool 
  ? new PostgresStore({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true,
    })
  : new MemoryStore({
      checkPeriod: 86400000,
    });

if (pool) {
  log('✅ Using PostgreSQL session store');
} else {
  log('⚠️  Using in-memory session store - sessions will be lost on restart');
}

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'saveto-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? 'none' : 'lax',
    },
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again after 15 minutes' },
  skipSuccessfulRequests: true,
  skip: (req) => req.originalUrl.startsWith('/api/blog'),
  validate: isProduction ? {} : { trustProxy: false },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  skip: (req) => req.originalUrl.startsWith('/api/blog') || req.originalUrl.startsWith('/api/csrf-token'),
  validate: isProduction ? {} : { trustProxy: false },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiLimiter);

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

const csrfProtection = csurf({ 
  cookie: false,
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
});

const csrfTokenGeneration = csurf({ 
  cookie: false,
  ignoreMethods: []
});

app.get('/api/csrf-token', csrfTokenGeneration, (req, res) => {
  res.json({ csrfToken: (req as any).csrfToken() });
});

app.use((req, res, next) => {
  if (req.path === '/api/webhook/stripe') {
    return next();
  }
  
  const origin = req.get('origin') || '';
  let isAuthorizedExtension = false;
  
  if (origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://')) {
    const extensionId = origin.split('://')[1];
    isAuthorizedExtension = ALLOWED_EXTENSION_IDS.includes(extensionId) || 
                            (!isProduction && extensionId);
    
    if (!isAuthorizedExtension) {
      log(`🚫 CSRF bypass denied for unauthorized extension: ${extensionId}`);
    }
  }
  
  if (isAuthorizedExtension) {
    return next();
  }
  
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/saved-items') || 
        req.path.startsWith('/api/integrations') || req.path.startsWith('/api/user') ||
        req.path.startsWith('/api/create-subscription')) {
      return csrfProtection(req, res, next);
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  setImmediate(async () => {
    log('🌱 Initializing blog posts...');
    try {
      const existingPosts = await storage.getAllBlogPosts();
      if (existingPosts.length === 0) {
        await Promise.all(
          allBlogPosts.map(post => storage.createBlogPost(post))
        );
        log(`✅ Initialized ${allBlogPosts.length} blog posts`);
      } else {
        log(`ℹ️  Blog posts already initialized (${existingPosts.length} posts)`);
      }
    } catch (error) {
      log('⚠️  Error initializing blog posts:', error);
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN') {
      log('❌ CSRF token validation failed');
      return res.status(403).json({ 
        error: 'Invalid CSRF token',
        message: 'Form security validation failed. Please refresh the page and try again.'
      });
    }

    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (status >= 500) {
      console.error('Server error:', err);
    }

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
