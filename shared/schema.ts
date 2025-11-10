import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password"),
  emailVerified: boolean("email_verified").notNull().default(false),
  oauthProvider: text("oauth_provider"),
  oauthId: text("oauth_id"),
  isPremium: boolean("is_premium").notNull().default(false),
  planType: text("plan_type").notNull().default('free'),
  saveCount: integer("save_count").notNull().default(0),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  lastLoginAt: timestamp("last_login_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  username: true,
  password: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const integrationConnections = pgTable("integration_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  integrationType: text("integration_type").notNull(),
  accountName: text("account_name").notNull(),
  credentials: jsonb("credentials").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index("integration_connections_user_id_idx").on(table.userId),
}));

export const insertIntegrationConnectionSchema = createInsertSchema(integrationConnections).omit({
  id: true,
  createdAt: true,
});

export type InsertIntegrationConnection = z.infer<typeof insertIntegrationConnectionSchema>;
export type IntegrationConnection = typeof integrationConnections.$inferSelect;

export const savedItems = pgTable("saved_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  contentType: text("content_type").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sourceUrl: text("source_url"),
  imageUrl: text("image_url"),
  assetUrl: text("asset_url"),
  assetType: text("asset_type"),
  tags: text("tags").array(),
  destinations: jsonb("destinations").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index("saved_items_user_id_idx").on(table.userId),
  createdAtIdx: index("saved_items_created_at_idx").on(table.createdAt),
}));

export const insertSavedItemSchema = createInsertSchema(savedItems).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(1, "Title is required").max(500, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  contentType: z.enum(['text', 'article', 'quote', 'link', 'image', 'note', 'pdf', 'screenshot']),
});

export type InsertSavedItem = z.infer<typeof insertSavedItemSchema>;
export type SavedItem = typeof savedItems.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  readTime: integer("read_time").notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
}, (table) => ({
  slugIdx: index("blog_posts_slug_idx").on(table.slug),
  categoryIdx: index("blog_posts_category_idx").on(table.category),
  createdAtIdx: index("blog_posts_created_at_idx").on(table.createdAt),
}));

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index("password_reset_tokens_user_id_idx").on(table.userId),
  tokenIdx: index("password_reset_tokens_token_idx").on(table.token),
}));

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index("email_verification_tokens_user_id_idx").on(table.userId),
  tokenIdx: index("email_verification_tokens_token_idx").on(table.token),
}));

export const insertEmailVerificationTokenSchema = createInsertSchema(emailVerificationTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertEmailVerificationToken = z.infer<typeof insertEmailVerificationTokenSchema>;
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  action: text("action").notNull(),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index("activity_logs_user_id_idx").on(table.userId),
  createdAtIdx: index("activity_logs_created_at_idx").on(table.createdAt),
  actionIdx: index("activity_logs_action_idx").on(table.action),
}));

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  userIdIdx: index("notifications_user_id_idx").on(table.userId),
  createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
}));

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export const assetTokens = pgTable("asset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  savedItemId: varchar("saved_item_id").notNull().references(() => savedItems.id, { onDelete: 'cascade' }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
}, (table) => ({
  savedItemIdIdx: index("asset_tokens_saved_item_id_idx").on(table.savedItemId),
  tokenHashIdx: index("asset_tokens_token_hash_idx").on(table.tokenHash),
}));

export const insertAssetTokenSchema = createInsertSchema(assetTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertAssetToken = z.infer<typeof insertAssetTokenSchema>;
export type AssetToken = typeof assetTokens.$inferSelect;
