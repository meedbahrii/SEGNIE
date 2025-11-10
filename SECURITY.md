# Security Documentation

## Current Security Implementation

### ✅ Implemented

1. **Password Hashing**
   - Uses bcrypt with salt rounds = 10
   - Passwords never stored in plaintext
   - Login verifies hashed passwords using bcrypt.compare()

2. **Session Management**
   - Express-session with httpOnly cookies
   - Session regeneration on login/register (prevents session fixation)
   - SameSite=None for browser extension compatibility
   - 7-day session expiration
   - **⚠️ Development Config**: secure=false with SameSite=None for localhost testing
     - This configuration is ONLY for development with the Chrome extension
     - Production MUST use secure=true with HTTPS
     - See production requirements below

3. **Authentication Middleware**
   - `requireAuth` middleware protects all sensitive routes
   - No direct X-User-Id header trust
   - Session-based user identification

4. **API Security**
   - Input validation using Zod schemas
   - Per-user data scoping (users can only access their own data)
   - Error handling doesn't leak sensitive information

### ⚠️ Production Requirements (NOT YET IMPLEMENTED)

1. **CSRF Protection** - CRITICAL
   ```bash
   npm install csurf
   ```
   - Add CSRF token validation for all mutating operations
   - Implement double-submit cookie pattern
   - Required before production deployment

2. **Session Store** - CRITICAL
   - Current: MemoryStore (dev only, loses sessions on restart)
   - Production: Redis or connect-pg-simple required
   ```bash
   npm install connect-redis redis
   # OR
   npm install connect-pg-simple
   ```

3. **Environment Variables**
   - Set SESSION_SECRET in production
   - Use strong, random session secret (min 32 characters)
   - Never commit secrets to version control

4. **HTTPS and Cookie Security**
   - **CRITICAL**: Production MUST use HTTPS
   - Update cookie configuration for production:
     ```javascript
     cookie: {
       secure: true,  // MUST be true in production
       httpOnly: true,
       sameSite: 'none', // Required for extension
       maxAge: 7 * 24 * 60 * 60 * 1000,
     }
     ```
   - Extension must connect via HTTPS in production
   - **Current development config uses secure=false** for localhost testing only

5. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   - Protect login endpoint from brute force
   - Limit API requests per user/IP

6. **Browser Extension Auth**
   - Current: Cookie-based (requires same-origin or CORS)
   - Production consideration: Issue API tokens for extension
   - Tokens should be short-lived and refreshable

## Security Best Practices

### For Development

1. **Never commit**:
   - .env files
   - SESSION_SECRET values
   - User credentials
   - API keys

2. **Use**:
   - Environment variables for secrets
   - HTTPS in production
   - Strong SESSION_SECRET (generate with: `openssl rand -base64 32`)

### For Production

1. **Setup Redis for sessions**:
   ```javascript
   import RedisStore from 'connect-redis';
   import { createClient } from 'redis';

   const redisClient = createClient({
     url: process.env.REDIS_URL
   });
   
   app.use(session({
     store: new RedisStore({ client: redisClient }),
     // ... other options
   }));
   ```

2. **Add CSRF protection**:
   ```javascript
   import csrf from 'csurf';
   
   const csrfProtection = csrf({ cookie: true });
   app.use(csrfProtection);
   
   // Send token to frontend
   app.get('/api/csrf-token', (req, res) => {
     res.json({ csrfToken: req.csrfToken() });
   });
   ```

3. **Add rate limiting**:
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5 // limit each IP to 5 requests per windowMs
   });
   
   app.post('/api/auth/login', loginLimiter, ...);
   ```

4. **Environment configuration**:
   ```env
   NODE_ENV=production
   SESSION_SECRET=<strong-random-secret-here>
   REDIS_URL=redis://localhost:6379
   DATABASE_URL=postgresql://...
   ```

## Known Vulnerabilities (Current Implementation)

### High Priority

1. **Session Store**: MemoryStore will lose all sessions on server restart
2. **CSRF**: No CSRF protection on mutating routes
3. **Extension Auth**: Cookie-based auth may not work cross-origin in production

### Medium Priority

1. **Rate Limiting**: No protection against brute force attacks
2. **Password Policy**: No minimum password requirements enforced
3. **Session Timeout**: No automatic logout on inactivity

### Low Priority

1. **Audit Logging**: No logging of authentication events
2. **2FA**: No two-factor authentication support
3. **Password Reset**: No password recovery mechanism

## Security Checklist for Production

- [ ] Replace MemoryStore with Redis or connect-pg-simple
- [ ] Add CSRF protection to all mutating routes
- [ ] Set strong SESSION_SECRET via environment variable
- [ ] Enable HTTPS and set secure cookie flag
- [ ] Add rate limiting to authentication endpoints
- [ ] Implement password strength requirements
- [ ] Consider API token auth for browser extension
- [ ] Add security headers (helmet.js)
- [ ] Implement audit logging
- [ ] Set up monitoring and alerting
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning (npm audit)

## Reporting Security Issues

If you discover a security vulnerability, please email [security@example.com] instead of using the issue tracker.

## References

- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Express Session Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [CSRF Protection](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
