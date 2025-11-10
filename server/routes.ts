import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { createHash, randomBytes } from "crypto";
import { storage } from "./storage";
import { insertUserSchema, insertSavedItemSchema, insertIntegrationConnectionSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";
import { saveToGoogleSheets } from "./integrations/google-sheets";
import { getNotionOAuthUrl, exchangeNotionCode, saveToNotion } from "./integrations/notion";

function generateETag(data: any): string {
  return createHash('md5').update(JSON.stringify(data)).digest('hex');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  storage.getUser(req.session.userId).then(user => {
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  }).catch(err => {
    return res.status(500).json({ error: "Failed to verify admin status" });
  });
}

async function logActivity(userId: string | undefined, action: string, details?: any, req?: Request) {
  try {
    await storage.createActivityLog({
      userId: userId ?? null,
      action,
      details: details ?? null,
      ipAddress: req?.ip ?? null,
      userAgent: req?.get('user-agent') ?? null,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

async function createNotification(userId: string, type: string, title: string, message: string, link?: string) {
  try {
    await storage.createNotification({
      userId,
      type,
      title,
      message,
      link: link ?? null,
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const user = await storage.createUser(validatedData);
      const { password, ...userWithoutPassword } = user;
      
      await logActivity(user.id, 'user_registered', { username: user.username, email: user.email }, req);
      await createNotification(
        user.id,
        'welcome',
        'Welcome to SaveTo!',
        'Thanks for joining. Start saving your content now!',
        '/dashboard'
      );
      
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session error" });
        }
        req.session.userId = user.id;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save error" });
          }
          res.json({ user: userWithoutPassword });
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { username, password } = validatedData;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      await storage.updateUser(user.id, { lastLoginAt: new Date() });
      await logActivity(user.id, 'user_login', { username: user.username }, req);

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session error" });
        }
        req.session.userId = user.id;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save error" });
          }
          const { password: _, ...userWithoutPassword } = user;
          res.json({ user: userWithoutPassword });
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      await logActivity(userId, 'user_logout', null, req);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
  });

  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const validatedData = changePasswordSchema.parse(req.body);
      const { currentPassword, newPassword } = validatedData;

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isValidPassword = await storage.verifyPassword(currentPassword, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      await storage.updateUserPassword(userId, newPassword);
      await logActivity(userId, 'password_changed', null, req);

      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  const passwordResetRequestSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
  });

  app.post("/api/auth/request-password-reset", async (req, res) => {
    try {
      const validatedData = passwordResetRequestSchema.parse(req.body);

      const user = await storage.getUserByEmail(validatedData.email);
      
      if (!user) {
        return res.json({ message: "If an account exists with this email, a password reset link will be sent." });
      }

      await storage.deletePasswordResetTokensByUserId(user.id);

      const token = generateResetToken();
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + 3600000);

      await storage.createPasswordResetToken({
        userId: user.id,
        token: tokenHash,
        expiresAt,
      });

      await logActivity(user.id, 'password_reset_requested', { email: validatedData.email }, req);
      await createNotification(
        user.id,
        'info',
        'Password Reset Requested',
        'A password reset link has been sent to your email.',
      );

      res.json({ message: "If an account exists with this email, a password reset link will be sent." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error requesting password reset:", error);
      res.status(500).json({ error: "Failed to request password reset" });
    }
  });

  const passwordResetSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const validatedData = passwordResetSchema.parse(req.body);

      const tokenHash = hashToken(validatedData.token);
      const resetToken = await storage.getPasswordResetToken(tokenHash);

      if (!resetToken || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      await storage.updateUserPassword(resetToken.userId, validatedData.newPassword);
      await storage.deletePasswordResetToken(tokenHash);
      await logActivity(resetToken.userId, 'password_reset_completed', null, req);
      await createNotification(
        resetToken.userId,
        'success',
        'Password Reset Complete',
        'Your password has been successfully updated.',
      );

      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  app.post("/api/auth/send-verification-email", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ error: "Email is already verified" });
      }

      const token = generateResetToken();
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + 86400000);

      await storage.createEmailVerificationToken({
        userId: user.id,
        token: tokenHash,
        expiresAt,
      });

      await logActivity(userId, 'verification_email_sent', null, req);

      res.json({ message: "Verification email sent" });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ error: "Failed to send verification email" });
    }
  });

  app.get("/api/auth/verify-email/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const tokenHash = hashToken(token);

      const verificationToken = await storage.getEmailVerificationToken(tokenHash);

      if (!verificationToken || verificationToken.expiresAt < new Date()) {
        return res.redirect('/login?error=invalid_verification_token');
      }

      await storage.updateUser(verificationToken.userId, { emailVerified: true });
      await storage.deleteEmailVerificationToken(tokenHash);
      await logActivity(verificationToken.userId, 'email_verified');
      await createNotification(
        verificationToken.userId,
        'success',
        'Email Verified',
        'Your email has been successfully verified!'
      );

      res.redirect('/dashboard?verified=true');
    } catch (error) {
      console.error("Error verifying email:", error);
      res.redirect('/login?error=verification_failed');
    }
  });

  app.post("/api/auth/google", async (req, res) => {
    try {
      const { googleId, email, firstName, lastName } = req.body;

      if (!googleId || !email) {
        return res.status(400).json({ error: "Invalid OAuth data" });
      }

      let user = await storage.getUserByOAuth('google', googleId);

      if (!user) {
        user = await storage.getUserByEmail(email);
        
        if (user) {
          if (user.oauthProvider && user.oauthProvider !== 'google') {
            return res.status(400).json({ error: "Email already associated with another provider" });
          }
          await storage.updateUser(user.id, {
            oauthProvider: 'google',
            oauthId: googleId,
            emailVerified: true,
          });
        } else {
          user = await storage.createUser({
            email,
            firstName: firstName || 'User',
            lastName: lastName || '',
            username: email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5),
            password: null,
            oauthProvider: 'google',
            oauthId: googleId,
            emailVerified: true,
          } as any);
          
          await createNotification(
            user.id,
            'welcome',
            'Welcome to SaveTo!',
            'Thanks for signing up. Start saving your content now!',
            '/dashboard'
          );
        }
      }

      await storage.updateUser(user.id, { lastLoginAt: new Date() });
      await logActivity(user.id, 'login_oauth', { provider: 'google' }, req);

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session error" });
        }
        req.session.userId = user.id;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save error" });
          }
          const { password: _, ...userWithoutPassword } = user;
          res.json({ user: userWithoutPassword });
        });
      });
    } catch (error) {
      console.error("Error with Google OAuth:", error);
      res.status(500).json({ error: "Failed to authenticate with Google" });
    }
  });

  app.get("/api/saved-items", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const items = await storage.getSavedItems(userId);
      res.json({ items });
    } catch (error) {
      console.error("Error fetching saved items:", error);
      res.status(500).json({ error: "Failed to fetch saved items" });
    }
  });

  app.get("/api/saved-items/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { id } = req.params;

      const item = await storage.getSavedItem(id, userId);
      
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ item });
    } catch (error) {
      console.error("Error fetching saved item:", error);
      res.status(500).json({ error: "Failed to fetch saved item" });
    }
  });

  app.post("/api/saved-items", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      const updatedUser = await storage.incrementSaveCount(userId);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!updatedUser.isPremium && updatedUser.saveCount > 3) {
        await storage.decrementSaveCount(userId);
        return res.status(403).json({ 
          error: "Save limit reached", 
          message: "You've reached your free save limit. Upgrade to premium to continue saving.",
          saveCount: 3,
          remaining: 0,
          limit: 3
        });
      }

      let item: SavedItem;
      try {
        const validatedData = insertSavedItemSchema.parse({
          ...req.body,
          userId,
        });

        item = await storage.createSavedItem(validatedData);
      } catch (error) {
        await storage.decrementSaveCount(userId);
        throw error;
      }

      const destinations = req.body.destinations || {};
      const syncResults: Record<string, { success: boolean; error?: string }> = {};

      if (destinations['google-sheets']) {
        try {
          const connection = await storage.getIntegrationConnectionByType(userId, 'google-sheets');
          
          if (!connection) {
            syncResults['google-sheets'] = { 
              success: false, 
              error: 'Google Sheets not connected' 
            };
          } else {
            const existingSpreadsheetId = connection.credentials?.spreadsheetId;
            
            const result = await saveToGoogleSheets({
              title: item.title,
              content: item.content,
              contentType: item.contentType,
              sourceUrl: item.sourceUrl,
              tags: item.tags,
              createdAt: item.createdAt,
            }, connection.credentials, existingSpreadsheetId);
            
            if (result.spreadsheetId && result.spreadsheetId !== existingSpreadsheetId) {
              await storage.updateIntegrationConnection(connection.id, userId, {
                credentials: {
                  ...connection.credentials,
                  spreadsheetId: result.spreadsheetId,
                },
              });
            }
            
            syncResults['google-sheets'] = { success: result.success };
          }
        } catch (error) {
          console.error('Failed to sync to Google Sheets:', error);
          syncResults['google-sheets'] = { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      }

      if (destinations['notion']) {
        try {
          const connection = await storage.getIntegrationConnectionByType(userId, 'notion');
          
          if (!connection) {
            syncResults['notion'] = { 
              success: false, 
              error: 'Notion not connected' 
            };
          } else {
            const accessToken = connection.credentials?.access_token;
            const existingDatabaseId = connection.credentials?.databaseId;
            
            if (!accessToken) {
              syncResults['notion'] = { 
                success: false, 
                error: 'Notion connection invalid' 
              };
            } else {
              const result = await saveToNotion(accessToken, {
                title: item.title,
                content: item.content,
                contentType: item.contentType,
                sourceUrl: item.sourceUrl,
                tags: item.tags,
                createdAt: item.createdAt,
              }, existingDatabaseId);
              
              if (result.databaseId && result.databaseId !== existingDatabaseId) {
                await storage.updateIntegrationConnection(connection.id, userId, {
                  credentials: {
                    ...connection.credentials,
                    databaseId: result.databaseId,
                  },
                });
              }
              
              syncResults['notion'] = { 
                success: result.success,
                error: result.error
              };
            }
          }
        } catch (error) {
          console.error('Failed to sync to Notion:', error);
          syncResults['notion'] = { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      }

      const remaining = updatedUser.isPremium ? -1 : Math.max(0, 3 - updatedUser.saveCount);

      res.json({ 
        item,
        saveInfo: {
          saveCount: updatedUser.saveCount,
          remaining,
          isPremium: updatedUser.isPremium
        },
        syncResults
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating saved item:", error);
      res.status(500).json({ error: "Failed to create saved item" });
    }
  });

  app.delete("/api/saved-items/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { id } = req.params;

      const deleted = await storage.deleteSavedItem(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting saved item:", error);
      res.status(500).json({ error: "Failed to delete saved item" });
    }
  });

  app.get("/api/integrations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;

      const connections = await storage.getIntegrationConnections(userId);
      res.json({ connections });
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ error: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;

      const validatedData = insertIntegrationConnectionSchema.parse({
        ...req.body,
        userId,
      });

      const connection = await storage.createIntegrationConnection(validatedData);
      res.json({ connection });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating integration connection:", error);
      res.status(500).json({ error: "Failed to create integration connection" });
    }
  });

  app.delete("/api/integrations/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { id } = req.params;

      const deleted = await storage.deleteIntegrationConnection(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Integration not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting integration connection:", error);
      res.status(500).json({ error: "Failed to delete integration connection" });
    }
  });

  app.get("/api/oauth/notion/auth", requireAuth, (req, res) => {
    try {
      const redirectUri = `${req.protocol}://${req.get('host')}/api/oauth/notion/callback`;
      const userId = req.session.userId!;
      const authUrl = getNotionOAuthUrl(redirectUri, userId);
      
      res.json({ authUrl });
    } catch (error) {
      console.error('Error generating Notion auth URL:', error);
      res.status(500).json({ error: "Notion integration not configured" });
    }
  });

  app.get("/api/oauth/notion/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return res.redirect('/connections?error=no_code');
      }

      const userId = state as string || req.session.userId;
      
      if (!userId) {
        return res.redirect('/login?error=not_authenticated');
      }

      const redirectUri = `${req.protocol}://${req.get('host')}/api/oauth/notion/callback`;
      const tokenData = await exchangeNotionCode(code as string, redirectUri);
      
      const existingConnection = await storage.getIntegrationConnectionByType(userId, 'notion');
      
      if (existingConnection) {
        await storage.updateIntegrationConnection(existingConnection.id, userId, {
          credentials: tokenData,
          accountName: tokenData.workspace_name || 'Notion Workspace',
        });
      } else {
        await storage.createIntegrationConnection({
          userId,
          integrationType: 'notion',
          accountName: tokenData.workspace_name || 'Notion Workspace',
          credentials: tokenData,
          isActive: true,
        });
      }

      res.redirect('/connections?connected=notion');
    } catch (error) {
      console.error('Notion OAuth error:', error);
      res.redirect('/connections?error=oauth_failed');
    }
  });

  app.get("/api/oauth/google-sheets/auth", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      const existingConnection = await storage.getIntegrationConnectionByType(userId, 'google-sheets');
      if (existingConnection) {
        return res.json({ 
          success: true, 
          message: 'Google Sheets already connected via Replit connector' 
        });
      }
      
      await storage.createIntegrationConnection({
        userId,
        integrationType: 'google-sheets',
        accountName: 'Google Sheets (Replit Connector)',
        credentials: { connector: 'replit' },
        isActive: true,
      });
      
      res.json({ 
        success: true, 
        message: 'Google Sheets connected successfully',
        redirect: '/connections?connected=google-sheets'
      });
    } catch (error) {
      console.error('Google Sheets connection error:', error);
      res.status(500).json({ error: "Failed to connect Google Sheets" });
    }
  });

  app.get("/api/oauth/google/callback", requireAuth, async (req, res) => {
    try {
      const { code } = req.query;
      const userId = req.session.userId!;
      
      if (!code) {
        return res.redirect('/?error=no_code');
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        return res.redirect('/?error=config_error');
      }

      const redirectUri = `${req.protocol}://${req.get('host')}/api/oauth/google/callback`;
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: code as string,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        return res.redirect('/?error=token_exchange_failed');
      }

      const tokenData = await tokenResponse.json();
      
      const existingConnection = await storage.getIntegrationConnectionByType(userId, 'google-sheets');
      
      if (existingConnection) {
        await storage.updateIntegrationConnection(existingConnection.id, userId, {
          credentials: tokenData,
          accountName: 'Google Sheets',
        });
      } else {
        await storage.createIntegrationConnection({
          userId,
          integrationType: 'google-sheets',
          accountName: 'Google Sheets',
          credentials: tokenData,
          isActive: true,
        });
      }

      res.redirect('/?connected=google-sheets');
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.redirect('/?error=oauth_failed');
    }
  });

  app.get("/api/user/save-limit", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
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
      console.error("Error fetching save limit:", error);
      res.status(500).json({ error: "Failed to fetch save limit" });
    }
  });

  app.post("/api/user/increment-save", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const saveCount = user.saveCount;
      
      if (!user.isPremium && saveCount >= 3) {
        return res.status(403).json({ 
          error: "Save limit reached", 
          message: "You've reached your free save limit. Upgrade to premium to continue saving." 
        });
      }

      const updatedUser = await storage.incrementSaveCount(userId);
      
      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update save count" });
      }

      const newCount = updatedUser.saveCount;
      const remaining = updatedUser.isPremium ? -1 : Math.max(0, 3 - newCount);

      res.json({ 
        success: true, 
        saveCount: newCount,
        remaining,
        isPremium: updatedUser.isPremium 
      });
    } catch (error) {
      console.error("Error incrementing save count:", error);
      res.status(500).json({ error: "Failed to increment save count" });
    }
  });

  app.post("/api/create-subscription", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }

      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.isPremium && user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
          expand: ['latest_invoice.payment_intent']
        });
        
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          const invoice = subscription.latest_invoice as Stripe.Invoice;
          const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
          
          return res.json({
            subscriptionId: subscription.id,
            clientSecret: paymentIntent?.client_secret || null,
          });
        }
      }

      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: {
            userId: user.id,
            username: user.username,
          },
        });
        customerId = customer.id;
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      const priceId = process.env.STRIPE_PRICE_ID || await (async () => {
        const price = await stripe.prices.create({
          currency: 'usd',
          unit_amount: 999,
          recurring: {
            interval: 'month',
          },
          product_data: {
            name: 'SaveTo Premium',
            description: 'Unlimited saves and all premium features',
          },
        });
        return price.id;
      })();

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUser(user.id, { 
        stripeSubscriptionId: subscription.id 
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription: " + error.message });
    }
  });

  app.post("/api/webhook/stripe", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig) {
      return res.status(400).json({ error: "No signature" });
    }

    if (!webhookSecret) {
      console.error("⚠️  STRIPE_WEBHOOK_SECRET not set - rejecting webhook for security");
      return res.status(500).json({ error: "Webhook secret not configured" });
    }

    let event: Stripe.Event;

    try {
      const rawBody = req.rawBody as Buffer;
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

      switch (event.type) {
        case 'customer.subscription.updated':
        case 'customer.subscription.created': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          
          const customer = await stripe.customers.retrieve(customerId);
          const userId = (customer as Stripe.Customer).metadata?.userId;
          
          if (userId) {
            const isPremium = subscription.status === 'active' || subscription.status === 'trialing';
            await storage.updateUser(userId, { 
              isPremium,
              stripeSubscriptionId: subscription.id 
            });
            await logActivity(userId, isPremium ? 'subscription_activated' : 'subscription_updated', { 
              subscriptionId: subscription.id,
              status: subscription.status 
            });
            console.log(`✅ Updated user ${userId} premium status: ${isPremium}`);
          }
          break;
        }
        
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          
          const customer = await stripe.customers.retrieve(customerId);
          const userId = (customer as Stripe.Customer).metadata?.userId;
          
          if (userId) {
            await storage.updateUser(userId, { isPremium: false });
            await logActivity(userId, 'subscription_cancelled', { subscriptionId: subscription.id });
            await createNotification(
              userId,
              'info',
              'Subscription Cancelled',
              'Your premium subscription has been cancelled.',
            );
            console.log(`✅ Cancelled premium for user ${userId}`);
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("❌ Webhook error:", error);
      res.status(400).json({ error: "Webhook signature verification failed: " + error.message });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { category } = req.query;
      let posts;
      
      if (category && typeof category === 'string') {
        posts = await storage.getBlogPostsByCategory(category);
      } else {
        posts = await storage.getAllBlogPosts();
      }
      
      const responseData = { posts };
      const etag = `"${generateETag(responseData)}"`;
      
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
      res.set('ETag', etag);
      
      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }
      
      res.json(responseData);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      const responseData = { post };
      const etag = `"${generateETag(responseData)}"`;
      
      res.set('Cache-Control', 'public, max-age=600, s-maxage=1800');
      res.set('ETag', etag);
      
      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }

      res.json(responseData);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/categories", async (req, res) => {
    try {
      const categories = await storage.getBlogCategories();
      const responseData = { categories };
      const etag = `"${generateETag(responseData)}"`;
      
      res.set('Cache-Control', 'public, max-age=600, s-maxage=1800');
      res.set('ETag', etag);
      
      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }
      
      res.json(responseData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const notifications = await storage.getNotifications(userId);
      res.json({ notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const notifications = await storage.getUnreadNotifications(userId);
      res.json({ notifications });
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      res.status(500).json({ error: "Failed to fetch unread notifications" });
    }
  });

  app.post("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { id } = req.params;
      const success = await storage.markNotificationRead(id, userId);
      
      if (!success) {
        return res.status(404).json({ error: "Notification not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.post("/api/notifications/read-all", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      await storage.markAllNotificationsRead(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const totalUsers = users.length;
      const premiumUsers = users.filter(u => u.isPremium).length;
      const freeUsers = totalUsers - premiumUsers;
      const newUsersToday = users.filter(u => {
        const createdAt = u.createdAt || new Date(0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return createdAt >= today;
      }).length;

      const revenue = premiumUsers * 9.99;

      res.json({
        totalUsers,
        premiumUsers,
        freeUsers,
        newUsersToday,
        estimatedMonthlyRevenue: revenue,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.post("/api/admin/users/:id/upgrade", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, { isPremium: true, planType: 'premium' });
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await logActivity(id, 'admin_upgraded_user', { adminId: req.session.userId }, req);
      await createNotification(
        id,
        'success',
        'Premium Upgrade',
        'Your account has been upgraded to Premium!',
        '/subscribe'
      );

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error upgrading user:", error);
      res.status(500).json({ error: "Failed to upgrade user" });
    }
  });

  app.post("/api/admin/users/:id/downgrade", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, { isPremium: false, planType: 'free' });
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await logActivity(id, 'admin_downgraded_user', { adminId: req.session.userId }, req);

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error downgrading user:", error);
      res.status(500).json({ error: "Failed to downgrade user" });
    }
  });

  app.get("/api/admin/activity", requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const activity = await storage.getRecentActivity(limit);
      res.json({ activity });
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  app.get("/api/activity/me", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const limit = parseInt(req.query.limit as string) || 50;
      const activity = await storage.getActivityLogs(userId, limit);
      res.json({ activity });
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ error: "Failed to fetch user activity" });
    }
  });

  app.post("/api/stripe/create-checkout-session", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }

      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
            username: user.username,
          },
        });
        customerId = customer.id;
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_PRICE_ID || 'price_default',
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/subscribe?success=true`,
        cancel_url: `${req.headers.origin}/subscribe?canceled=true`,
      });

      await logActivity(userId, 'checkout_session_created', null, req);

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session: " + error.message });
    }
  });

  app.post("/api/stripe/create-portal-session", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe is not configured" });
      }

      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeCustomerId) {
        return res.status(400).json({ error: "No billing account found" });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${req.headers.origin}/subscribe`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ error: "Failed to create portal session: " + error.message });
    }
  });

  app.post("/api/save/notion", requireAuth, async (req, res) => {
    try {
      const { type, data, url, timestamp } = req.body;

      if (!type || !data) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const itemData = {
        title: data,
        content: data,
        contentType: type === 'page' ? 'article' : 'image',
        sourceUrl: url || null,
        tags: null,
        createdAt: new Date(timestamp || Date.now()),
      };

      const accessToken = process.env.NOTION_ACCESS_TOKEN;
      
      if (!accessToken) {
        return res.status(400).json({ 
          error: "Notion integration not configured. Please set up your Notion connection first." 
        });
      }

      const result = await saveToNotion(accessToken, itemData);

      if (result.success) {
        res.json({ 
          success: true, 
          message: "Saved to Notion successfully",
          pageId: result.pageId 
        });
      } else {
        res.status(500).json({ 
          error: result.error || "Failed to save to Notion" 
        });
      }
    } catch (error: any) {
      console.error("Error in save to Notion:", error);
      res.status(500).json({ error: error.message || "Failed to save to Notion" });
    }
  });

  app.post("/api/save/google-sheets", requireAuth, async (req, res) => {
    try {
      const { type, data, url, timestamp } = req.body;

      if (!type || !data) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const itemData = {
        title: data,
        content: data,
        contentType: type === 'page' ? 'article' : 'image',
        sourceUrl: url || null,
        tags: null,
        createdAt: new Date(timestamp || Date.now()),
      };

      const credentials = { connector: 'replit' };
      
      const result = await saveToGoogleSheets(itemData, credentials);

      if (result.success) {
        res.json({ 
          success: true, 
          message: "Saved to Google Sheets successfully",
          spreadsheetId: result.spreadsheetId 
        });
      } else {
        res.status(500).json({ 
          error: "Failed to save to Google Sheets. Please ensure your integration is configured." 
        });
      }
    } catch (error: any) {
      console.error("Error in save to Google Sheets:", error);
      res.status(500).json({ 
        error: error.message || "Failed to save to Google Sheets. Please set up your Google Sheets connection first." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
