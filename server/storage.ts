import { 
  type User, 
  type InsertUser,
  type SavedItem,
  type InsertSavedItem,
  type IntegrationConnection,
  type InsertIntegrationConnection,
  type BlogPost,
  type InsertBlogPost,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type EmailVerificationToken,
  type InsertEmailVerificationToken,
  type ActivityLog,
  type InsertActivityLog,
  type Notification,
  type InsertNotification,
  users,
  savedItems,
  integrationConnections,
  blogPosts,
  passwordResetTokens,
  emailVerificationTokens,
  activityLogs,
  notifications
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByOAuth(provider: string, oauthId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserPassword(userId: string, newPassword: string): Promise<void>;
  incrementSaveCount(userId: string): Promise<User | undefined>;
  decrementSaveCount(userId: string): Promise<User | undefined>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  getSavedItems(userId: string): Promise<SavedItem[]>;
  getSavedItem(id: string, userId: string): Promise<SavedItem | undefined>;
  getSavedItemById(id: string): Promise<SavedItem | undefined>;
  createSavedItem(item: InsertSavedItem): Promise<SavedItem>;
  deleteSavedItem(id: string, userId: string): Promise<boolean>;
  
  getIntegrationConnections(userId: string): Promise<IntegrationConnection[]>;
  getIntegrationConnection(id: string, userId: string): Promise<IntegrationConnection | undefined>;
  getIntegrationConnectionByType(userId: string, integrationType: string): Promise<IntegrationConnection | undefined>;
  createIntegrationConnection(connection: InsertIntegrationConnection): Promise<IntegrationConnection>;
  updateIntegrationConnection(id: string, userId: string, updates: Partial<IntegrationConnection>): Promise<IntegrationConnection | undefined>;
  deleteIntegrationConnection(id: string, userId: string): Promise<boolean>;
  
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogCategories(): Promise<string[]>;
  
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  deletePasswordResetToken(token: string): Promise<boolean>;
  deletePasswordResetTokensByUserId(userId: string): Promise<void>;
  
  createEmailVerificationToken(token: InsertEmailVerificationToken): Promise<EmailVerificationToken>;
  getEmailVerificationToken(token: string): Promise<EmailVerificationToken | undefined>;
  deleteEmailVerificationToken(token: string): Promise<boolean>;
  
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(userId?: string, limit?: number): Promise<ActivityLog[]>;
  getRecentActivity(limit?: number): Promise<ActivityLog[]>;
  
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  markNotificationRead(id: string, userId: string): Promise<boolean>;
  markAllNotificationsRead(userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private savedItems: Map<string, SavedItem>;
  private integrationConnections: Map<string, IntegrationConnection>;
  private blogPosts: Map<string, BlogPost>;
  private passwordResetTokens: Map<string, PasswordResetToken>;
  private emailVerificationTokens: Map<string, EmailVerificationToken>;
  private activityLogs: Map<string, ActivityLog>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.users = new Map();
    this.savedItems = new Map();
    this.integrationConnections = new Map();
    this.blogPosts = new Map();
    this.passwordResetTokens = new Map();
    this.emailVerificationTokens = new Map();
    this.activityLogs = new Map();
    this.notifications = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByOAuth(provider: string, oauthId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.oauthProvider === provider && user.oauthId === oauthId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = insertUser.password ? await bcrypt.hash(insertUser.password, 10) : null;
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      emailVerified: false,
      oauthProvider: insertUser.oauthProvider ?? null,
      oauthId: insertUser.oauthId ?? null,
      isPremium: false,
      planType: 'free',
      saveCount: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      isAdmin: false,
      createdAt: new Date(),
      lastLoginAt: null
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getSavedItems(userId: string): Promise<SavedItem[]> {
    return Array.from(this.savedItems.values())
      .filter(item => item.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSavedItem(id: string, userId: string): Promise<SavedItem | undefined> {
    const item = this.savedItems.get(id);
    return item && item.userId === userId ? item : undefined;
  }

  async getSavedItemById(id: string): Promise<SavedItem | undefined> {
    return this.savedItems.get(id);
  }

  async createSavedItem(insertItem: InsertSavedItem): Promise<SavedItem> {
    const id = randomUUID();
    const item: SavedItem = {
      ...insertItem,
      id,
      sourceUrl: insertItem.sourceUrl ?? null,
      imageUrl: insertItem.imageUrl ?? null,
      tags: insertItem.tags ?? null,
      createdAt: new Date(),
    };
    this.savedItems.set(id, item);
    return item;
  }

  async deleteSavedItem(id: string, userId: string): Promise<boolean> {
    const item = this.savedItems.get(id);
    if (item && item.userId === userId) {
      return this.savedItems.delete(id);
    }
    return false;
  }

  async getIntegrationConnections(userId: string): Promise<IntegrationConnection[]> {
    return Array.from(this.integrationConnections.values())
      .filter(conn => conn.userId === userId && conn.isActive);
  }

  async getIntegrationConnection(id: string, userId: string): Promise<IntegrationConnection | undefined> {
    const conn = this.integrationConnections.get(id);
    return conn && conn.userId === userId ? conn : undefined;
  }

  async createIntegrationConnection(insertConnection: InsertIntegrationConnection): Promise<IntegrationConnection> {
    const id = randomUUID();
    const connection: IntegrationConnection = {
      ...insertConnection,
      id,
      isActive: insertConnection.isActive ?? true,
      createdAt: new Date(),
    };
    this.integrationConnections.set(id, connection);
    return connection;
  }

  async deleteIntegrationConnection(id: string, userId: string): Promise<boolean> {
    const conn = this.integrationConnections.get(id);
    if (conn && conn.userId === userId) {
      return this.integrationConnections.delete(id);
    }
    return false;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async incrementSaveCount(userId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, saveCount: user.saveCount + 1 };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async decrementSaveCount(userId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, saveCount: Math.max(0, user.saveCount - 1) };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = { ...user, password: hashedPassword };
    this.users.set(userId, updatedUser);
  }

  async getIntegrationConnectionByType(userId: string, integrationType: string): Promise<IntegrationConnection | undefined> {
    return Array.from(this.integrationConnections.values())
      .find(conn => conn.userId === userId && conn.integrationType === integrationType && conn.isActive);
  }

  async updateIntegrationConnection(id: string, userId: string, updates: Partial<IntegrationConnection>): Promise<IntegrationConnection | undefined> {
    const conn = this.integrationConnections.get(id);
    if (!conn || conn.userId !== userId) return undefined;
    
    const updatedConn = { ...conn, ...updates };
    this.integrationConnections.set(id, updatedConn);
    return updatedConn;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published && post.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug && post.published);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async getBlogCategories(): Promise<string[]> {
    const categories = new Set<string>();
    Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .forEach(post => categories.add(post.category));
    return Array.from(categories).sort();
  }

  async createPasswordResetToken(insertToken: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const id = randomUUID();
    const token: PasswordResetToken = {
      ...insertToken,
      id,
      createdAt: new Date(),
    };
    this.passwordResetTokens.set(token.token, token);
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    return this.passwordResetTokens.get(token);
  }

  async deletePasswordResetToken(token: string): Promise<boolean> {
    return this.passwordResetTokens.delete(token);
  }

  async deletePasswordResetTokensByUserId(userId: string): Promise<void> {
    Array.from(this.passwordResetTokens.values())
      .filter(t => t.userId === userId)
      .forEach(t => this.passwordResetTokens.delete(t.token));
  }

  async createEmailVerificationToken(insertToken: InsertEmailVerificationToken): Promise<EmailVerificationToken> {
    const id = randomUUID();
    const token: EmailVerificationToken = {
      ...insertToken,
      id,
      createdAt: new Date(),
    };
    this.emailVerificationTokens.set(token.token, token);
    return token;
  }

  async getEmailVerificationToken(token: string): Promise<EmailVerificationToken | undefined> {
    return this.emailVerificationTokens.get(token);
  }

  async deleteEmailVerificationToken(token: string): Promise<boolean> {
    return this.emailVerificationTokens.delete(token);
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const log: ActivityLog = {
      ...insertLog,
      id,
      userId: insertLog.userId ?? null,
      details: insertLog.details ?? null,
      ipAddress: insertLog.ipAddress ?? null,
      userAgent: insertLog.userAgent ?? null,
      createdAt: new Date(),
    };
    this.activityLogs.set(id, log);
    return log;
  }

  async getActivityLogs(userId?: string, limit?: number): Promise<ActivityLog[]> {
    let logs = Array.from(this.activityLogs.values());
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    logs = logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (limit) {
      logs = logs.slice(0, limit);
    }
    return logs;
  }

  async getRecentActivity(limit: number = 50): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      read: false,
      link: insertNotification.link ?? null,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId && !n.read)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markNotificationRead(id: string, userId: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (notification && notification.userId === userId) {
      const updated = { ...notification, read: true };
      this.notifications.set(id, updated);
      return true;
    }
    return false;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    Array.from(this.notifications.values())
      .filter(n => n.userId === userId && !n.read)
      .forEach(n => {
        const updated = { ...n, read: true };
        this.notifications.set(n.id, updated);
      });
  }
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByOAuth(provider: string, oauthId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.oauthProvider, provider), eq(users.oauthId, oauthId)));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = insertUser.password ? await bcrypt.hash(insertUser.password, 10) : null;
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async incrementSaveCount(userId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    return await this.updateUser(userId, { saveCount: user.saveCount + 1 });
  }

  async decrementSaveCount(userId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    return await this.updateUser(userId, { saveCount: Math.max(0, user.saveCount - 1) });
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getSavedItems(userId: string): Promise<SavedItem[]> {
    return await db
      .select()
      .from(savedItems)
      .where(eq(savedItems.userId, userId))
      .orderBy(desc(savedItems.createdAt));
  }

  async getSavedItem(id: string, userId: string): Promise<SavedItem | undefined> {
    const [item] = await db
      .select()
      .from(savedItems)
      .where(and(eq(savedItems.id, id), eq(savedItems.userId, userId)));
    return item || undefined;
  }

  async getSavedItemById(id: string): Promise<SavedItem | undefined> {
    const [item] = await db
      .select()
      .from(savedItems)
      .where(eq(savedItems.id, id));
    return item || undefined;
  }

  async createSavedItem(insertItem: InsertSavedItem): Promise<SavedItem> {
    const [item] = await db
      .insert(savedItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async deleteSavedItem(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(savedItems)
      .where(and(eq(savedItems.id, id), eq(savedItems.userId, userId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getIntegrationConnections(userId: string): Promise<IntegrationConnection[]> {
    return await db
      .select()
      .from(integrationConnections)
      .where(and(
        eq(integrationConnections.userId, userId),
        eq(integrationConnections.isActive, true)
      ));
  }

  async getIntegrationConnection(id: string, userId: string): Promise<IntegrationConnection | undefined> {
    const [conn] = await db
      .select()
      .from(integrationConnections)
      .where(and(
        eq(integrationConnections.id, id),
        eq(integrationConnections.userId, userId)
      ));
    return conn || undefined;
  }

  async getIntegrationConnectionByType(userId: string, integrationType: string): Promise<IntegrationConnection | undefined> {
    const [conn] = await db
      .select()
      .from(integrationConnections)
      .where(and(
        eq(integrationConnections.userId, userId),
        eq(integrationConnections.integrationType, integrationType),
        eq(integrationConnections.isActive, true)
      ));
    return conn || undefined;
  }

  async createIntegrationConnection(insertConnection: InsertIntegrationConnection): Promise<IntegrationConnection> {
    const [connection] = await db
      .insert(integrationConnections)
      .values(insertConnection)
      .returning();
    return connection;
  }

  async updateIntegrationConnection(id: string, userId: string, updates: Partial<IntegrationConnection>): Promise<IntegrationConnection | undefined> {
    const [conn] = await db
      .update(integrationConnections)
      .set(updates)
      .where(and(
        eq(integrationConnections.id, id),
        eq(integrationConnections.userId, userId)
      ))
      .returning();
    return conn || undefined;
  }

  async deleteIntegrationConnection(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(integrationConnections)
      .where(and(
        eq(integrationConnections.id, id),
        eq(integrationConnections.userId, userId)
      ));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.category, category), eq(blogPosts.published, true)))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true)));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async getBlogCategories(): Promise<string[]> {
    const result = await db
      .selectDistinct({ category: blogPosts.category })
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(blogPosts.category);
    return result.map(r => r.category);
  }

  async createPasswordResetToken(insertToken: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db
      .insert(passwordResetTokens)
      .values(insertToken)
      .returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    return resetToken || undefined;
  }

  async deletePasswordResetToken(token: string): Promise<boolean> {
    const result = await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async deletePasswordResetTokensByUserId(userId: string): Promise<void> {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));
  }

  async createEmailVerificationToken(insertToken: InsertEmailVerificationToken): Promise<EmailVerificationToken> {
    const [token] = await db
      .insert(emailVerificationTokens)
      .values(insertToken)
      .returning();
    return token;
  }

  async getEmailVerificationToken(token: string): Promise<EmailVerificationToken | undefined> {
    const [verificationToken] = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));
    return verificationToken || undefined;
  }

  async deleteEmailVerificationToken(token: string): Promise<boolean> {
    const result = await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.token, token));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getActivityLogs(userId?: string, limit?: number): Promise<ActivityLog[]> {
    let query = db
      .select()
      .from(activityLogs);
    
    if (userId) {
      query = query.where(eq(activityLogs.userId, userId)) as any;
    }
    
    query = query.orderBy(desc(activityLogs.createdAt)) as any;
    
    if (limit) {
      query = query.limit(limit) as any;
    }
    
    return await query;
  }

  async getRecentActivity(limit: number = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationRead(id: string, userId: string): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(and(
        eq(notifications.id, id),
        eq(notifications.userId, userId)
      ));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async markAllNotificationsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ));
  }
}

export const storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
