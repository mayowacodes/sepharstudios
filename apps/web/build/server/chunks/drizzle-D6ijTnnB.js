import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { p as private_env } from './shared-server-BeisX7n9.js';
import { pgTable, text, timestamp, boolean, integer, jsonb, varchar } from 'drizzle-orm/pg-core';

const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url").notNull(),
  duration: integer("duration"),
  // in seconds
  creatorId: text("creator_id").notNull().references(() => user.id),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags").$type(),
  viewCount: integer("view_count").default(0),
  isPublished: boolean("is_published").default(false),
  isPremium: boolean("is_premium").default(false),
  tokenPrice: integer("token_price"),
  // price in STC tokens
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const creators = pgTable("creators", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  subscriberCount: integer("subscriber_count").default(0),
  totalViews: integer("total_views").default(0),
  totalEarnings: integer("total_earnings").default(0),
  // in tokens
  walletAddress: varchar("wallet_address", { length: 42 }),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  tier: varchar("tier", { length: 50 }).notNull(),
  // basic, premium, vip
  nftTokenId: varchar("nft_token_id", { length: 100 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  autoRenew: boolean("auto_renew").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  type: varchar("type", { length: 50 }).notNull(),
  // purchase, earn, transfer
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 20 }).notNull(),
  // STC, USDC, etc
  txHash: varchar("tx_hash", { length: 66 }),
  // blockchain transaction hash
  status: varchar("status", { length: 20 }).notNull(),
  // pending, completed, failed
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const watchHistory = pgTable("watch_history", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  videoId: text("video_id").notNull().references(() => videos.id),
  watchTime: integer("watch_time").default(0),
  // seconds watched
  completed: boolean("completed").default(false),
  lastWatchedAt: timestamp("last_watched_at").defaultNow().notNull()
});
const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  walletAddress: text("wallet_address")
  // for Web3 integration
});
const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by")
});
const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
const schema = { user, session, account, verification };
const schema$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  account,
  creators,
  schema,
  session,
  subscriptions,
  transactions,
  user,
  verification,
  videos,
  watchHistory
}, Symbol.toStringTag, { value: "Module" }));
const client = postgres(private_env.DATABASE_URL);
const db = drizzle(client, { schema: schema$1 });

export { account as a, db as d, schema as s, user as u };
//# sourceMappingURL=drizzle-D6ijTnnB.js.map
