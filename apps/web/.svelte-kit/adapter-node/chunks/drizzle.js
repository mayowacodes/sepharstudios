import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { p as private_env } from "./shared-server.js";
import { pgTable, timestamp, text, integer, boolean, jsonb, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
const files = pgTable("files", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  remoteId: text("remote_id").notNull(),
  // The MinIO object name
  url: text("url").notNull(),
  // Public/Direct URL
  bucket: text("bucket").notNull(),
  // Which bucket it's in
  size: integer("size"),
  type: text("type"),
  // MIME type
  name: text("name"),
  // Original filename
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url").notNull(),
  // Registry Links
  videoId: text("video_file_id").references(() => files.id),
  thumbnailId: text("thumbnail_file_id").references(() => files.id),
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
  creatorType: varchar("creator_type", { length: 20 }).default("individual"),
  legalName: varchar("legal_name", { length: 255 }),
  organizationName: varchar("organization_name", { length: 255 }),
  organizationType: varchar("organization_type", { length: 100 }),
  organizationWebsite: text("organization_website"),
  organizationAddress: text("organization_address"),
  taxId: varchar("tax_id", { length: 100 }),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  denomination: varchar("denomination", { length: 100 }),
  yearsInMinistry: integer("years_in_ministry"),
  ministryDescription: text("ministry_description"),
  ministryAddress: text("ministry_address"),
  verificationDocuments: jsonb("verification_documents").$type(),
  socialLinks: jsonb("social_links").$type(),
  preferences: jsonb("preferences").$type(),
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
const creatorApplications = pgTable("creator_applications", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  creatorType: varchar("creator_type", { length: 20 }).notNull().default("individual"),
  displayName: varchar("display_name", { length: 255 }),
  legalName: varchar("legal_name", { length: 255 }),
  organizationName: varchar("organization_name", { length: 255 }),
  organizationType: varchar("organization_type", { length: 100 }),
  organizationWebsite: text("organization_website"),
  organizationAddress: text("organization_address"),
  taxId: varchar("tax_id", { length: 100 }),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  bio: text("bio"),
  portfolioUrl: text("portfolio_url"),
  socialLinks: jsonb("social_links").$type(),
  documents: jsonb("documents").$type(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // pending | approved | rejected
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by").references(() => user.id),
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
const mediaLibrary = pgTable("media_library", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  backdropUrl: text("backdrop_url"),
  posterUrl: text("poster_url"),
  trailerUrl: text("trailer_url"),
  videoUrl: text("video_url"),
  // actual streaming link
  encoderJobId: text("encoder_job_id"),
  processingStatus: varchar("processing_status", { length: 30 }).default("not_started").notNull(),
  processingError: text("processing_error"),
  processedAt: timestamp("processed_at"),
  creatorId: text("creator_id").references(() => user.id, { onDelete: "set null" }),
  // Registry Links
  videoId: text("video_file_id").references(() => files.id),
  thumbnailId: text("thumbnail_file_id").references(() => files.id),
  backdropId: text("backdrop_file_id").references(() => files.id),
  posterId: text("poster_file_id").references(() => files.id),
  trailerId: text("trailer_file_id").references(() => files.id),
  link: text("link").notNull(),
  // page link
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  // Media type and categorization
  mediaType: varchar("media_type", { length: 50 }).notNull(),
  // 'movie', 'show', 'documentary'
  category: varchar("category", { length: 50 }),
  // 'faith', 'kids', 'teens'
  genres: jsonb("genres").$type(),
  topics: jsonb("topics").$type(),
  keywords: jsonb("keywords").$type(),
  // Ratings and metadata
  rating: varchar("rating", { length: 10 }),
  // IMDb rating
  ageRating: varchar("age_rating", { length: 10 }),
  // 'All', '7+', '12+', etc.
  duration: varchar("duration", { length: 50 }),
  // '2h 7m'
  quality: varchar("quality", { length: 20 }),
  // 'HD', '4K'
  year: varchar("year", { length: 4 }),
  releaseDate: varchar("release_date", { length: 20 }),
  language: varchar("language", { length: 50 }).default("English"),
  // Faith-based specific
  bibleReference: varchar("bible_reference", { length: 100 }),
  // Status flags
  featured: boolean("featured").default(false),
  isNew: boolean("is_new").default(false),
  isActive: boolean("is_active").default(true),
  status: varchar("status", { length: 30 }).default("submitted").notNull(),
  reviewNotes: text("review_notes"),
  rejectionReason: text("rejection_reason"),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
  // Statistics
  viewCount: integer("view_count").default(0),
  voteAverage: varchar("vote_average", { length: 10 }),
  voteCount: varchar("vote_count", { length: 20 }),
  popularity: varchar("popularity", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const episodes = pgTable("episodes", {
  id: text("id").primaryKey(),
  showId: text("show_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  videoUrl: text("video_url"),
  // Registry Links
  videoId: text("video_file_id").references(() => files.id),
  thumbnailId: text("thumbnail_file_id").references(() => files.id),
  duration: varchar("duration", { length: 50 }),
  airDate: varchar("air_date", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const profiles = pgTable("profiles", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("adult"),
  // adult | teen | kids
  avatarColor: varchar("avatar_color", { length: 20 }),
  avatarEmoji: varchar("avatar_emoji", { length: 10 }),
  pin: text("pin"),
  // bcrypt hash, null = no PIN
  pinSetAt: timestamp("pin_set_at"),
  contentRating: varchar("content_rating", { length: 10 }).default("all"),
  // G | PG | PG13 | R | all
  safeModeEnabled: boolean("safe_mode_enabled").default(false),
  isKidsMode: boolean("is_kids_mode").default(false),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const paystackSubscriptions = pgTable("paystack_subscriptions", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  plan: varchar("plan", { length: 20 }).notNull(),
  // basic | premium | creator
  status: varchar("status", { length: 20 }).notNull().default("trial"),
  // trial | active | cancelled | expired | paused
  trialStartDate: timestamp("trial_start_date"),
  trialEndDate: timestamp("trial_end_date"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  // Paystack identifiers
  paystackCustomerCode: varchar("paystack_customer_code", { length: 100 }),
  paystackSubscriptionCode: varchar("paystack_subscription_code", { length: 100 }),
  paystackAuthorizationCode: varchar("paystack_authorization_code", { length: 100 }),
  // Anti-abuse fingerprints
  cardSignature: varchar("card_signature", { length: 200 }),
  cardLast4: varchar("card_last4", { length: 4 }),
  cardBrand: varchar("card_brand", { length: 50 }),
  phoneNumber: text("phone_number"),
  // hashed
  deviceFingerprint: text("device_fingerprint"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const familyAddons = pgTable("family_addons", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriptionId: text("subscription_id").notNull().references(() => paystackSubscriptions.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  maxProfiles: integer("max_profiles").default(8),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  // active | cancelled
  paystackAuthorizationCode: varchar("paystack_authorization_code", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const trialBlacklist = pgTable("trial_blacklist", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  cardSignature: varchar("card_signature", { length: 200 }),
  phoneHash: text("phone_hash"),
  deviceFingerprint: text("device_fingerprint"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const ppvContent = pgTable("ppv_content", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
  suggestedPriceCents: integer("suggested_price_cents"),
  // from creator
  finalPriceCents: integer("final_price_cents").notNull(),
  // set by admin
  currency: varchar("currency", { length: 10 }).default("usd"),
  isActive: boolean("is_active").default(false),
  creatorNote: text("creator_note"),
  adminApprovedAt: timestamp("admin_approved_at"),
  adminApprovedBy: text("admin_approved_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const ppvPurchases = pgTable("ppv_purchases", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  contentId: text("content_id").notNull().references(() => mediaLibrary.id),
  amountPaidCents: integer("amount_paid_cents").notNull(),
  currency: varchar("currency", { length: 10 }).default("usd"),
  paystackReference: varchar("paystack_reference", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const mediaWatchProgress = pgTable("media_watch_progress", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
  contentType: varchar("content_type", { length: 20 }).default("movie"),
  // movie | show | documentary
  episodeId: text("episode_id").references(() => episodes.id),
  positionSeconds: integer("position_seconds").default(0),
  durationSeconds: integer("duration_seconds"),
  completionPercent: integer("completion_percent").default(0),
  isCompleted: boolean("is_completed").default(false),
  watchedAt: timestamp("watched_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const playlists = pgTable("playlists", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull().default("My List"),
  description: text("description"),
  isDefault: boolean("is_default").default(false),
  // the auto "My List" playlist
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const playlistItems = pgTable("playlist_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  playlistId: text("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
  contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
  contentType: varchar("content_type", { length: 20 }).default("movie"),
  sortOrder: integer("sort_order").default(0),
  addedAt: timestamp("added_at").defaultNow().notNull()
});
const reviews = pgTable("reviews", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  profileId: text("profile_id").references(() => profiles.id),
  contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
  contentType: varchar("content_type", { length: 20 }).default("movie"),
  rating: integer("rating").notNull(),
  // 1–5
  reviewText: text("review_text"),
  isApproved: boolean("is_approved").default(false),
  // admin moderated
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const reviewHelpful = pgTable("review_helpful", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: text("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  isHelpful: boolean("is_helpful").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const notificationPreferences = pgTable("notification_preferences", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
  newReleases: boolean("new_releases").default(true),
  trialExpiry: boolean("trial_expiry").default(true),
  paymentConfirmation: boolean("payment_confirmation").default(true),
  weeklyDigest: boolean("weekly_digest").default(false),
  creatorUpdates: boolean("creator_updates").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const streaks = pgTable("streaks", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
  profileId: text("profile_id").references(() => profiles.id),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastWatchDate: timestamp("last_watch_date"),
  streakStartDate: timestamp("streak_start_date"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const achievements = pgTable("achievements", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  stcReward: integer("stc_reward").default(0),
  category: varchar("category", { length: 50 })
  // watch | streak | social | token
});
const userAchievements = pgTable("user_achievements", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  profileId: text("profile_id").references(() => profiles.id),
  achievementCode: varchar("achievement_code", { length: 100 }).notNull().references(() => achievements.code),
  stcAwarded: boolean("stc_awarded").default(false),
  earnedAt: timestamp("earned_at").defaultNow().notNull()
});
const userMilestones = pgTable("user_milestones", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 100 }).notNull(),
  // e.g. stc_100, stc_500, stake_first, year_1
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  stcBonus: integer("stc_bonus").default(0),
  earnedAt: timestamp("earned_at").defaultNow().notNull()
});
const quizSessions = pgTable("quiz_sessions", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  contentId: text("content_id").references(() => mediaLibrary.id),
  questions: jsonb("questions").$type(),
  answers: jsonb("answers").$type(),
  score: integer("score"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const bibleStoryProgress = pgTable("bible_story_progress", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  contentId: text("content_id").references(() => mediaLibrary.id),
  isCompleted: boolean("is_completed").default(false),
  lastReadPage: integer("last_read_page").default(0),
  stcEarned: boolean("stc_earned").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const parentalReports = pgTable("parental_reports", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  parentProfileId: text("parent_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  childProfileId: text("child_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  reportDate: timestamp("report_date").defaultNow().notNull(),
  totalWatchTimeSeconds: integer("total_watch_time_seconds").default(0),
  contentWatched: jsonb("content_watched").$type(),
  generatedAt: timestamp("generated_at").defaultNow().notNull()
});
const governanceProposals = pgTable("governance_proposals", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  payload: jsonb("payload").$type().notNull().default(sql`'{}'::jsonb`),
  createdBy: text("created_by").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdByName: varchar("created_by_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("submitted"),
  riskLevel: varchar("risk_level", { length: 10 }).notNull().default("low"),
  guardrailWarnings: jsonb("guardrail_warnings").$type().notNull().default(sql`'[]'::jsonb`),
  requiredApprovals: integer("required_approvals").notNull().default(4),
  eta: timestamp("eta"),
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const governanceProposalApprovals = pgTable("governance_proposal_approvals", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: text("proposal_id").notNull().references(() => governanceProposals.id, { onDelete: "cascade" }),
  actorId: text("actor_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  actorName: varchar("actor_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const governancePauseEvents = pgTable("governance_pause_events", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  reason: text("reason").notNull(),
  triggeredBy: text("triggered_by").notNull().references(() => user.id, { onDelete: "cascade" }),
  triggeredByName: varchar("triggered_by_name", { length: 255 }).notNull(),
  triggeredAt: timestamp("triggered_at").defaultNow().notNull(),
  active: boolean("active").notNull().default(true),
  resolvedAt: timestamp("resolved_at")
});
const governanceAuditEntries = pgTable("governance_audit_entries", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: text("proposal_id").references(() => governanceProposals.id, { onDelete: "set null" }),
  action: varchar("action", { length: 40 }).notNull(),
  actorId: text("actor_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  actorName: varchar("actor_name", { length: 255 }).notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const governanceMemberships = pgTable("governance_memberships", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
  label: varchar("label", { length: 100 }).notNull().default("governance_admin"),
  permissions: jsonb("permissions").$type().notNull().default(sql`'[]'::jsonb`),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const adminMessages = pgTable("admin_messages", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: text("content_id").references(() => mediaLibrary.id, { onDelete: "set null" }),
  creatorId: text("creator_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  adminId: text("admin_id").references(() => user.id, { onDelete: "set null" }),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 30 }).notNull().default("general"),
  status: varchar("status", { length: 20 }).notNull().default("sent"),
  isFromAdmin: boolean("is_from_admin").notNull().default(true),
  attachments: jsonb("attachments").$type().notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
const adminMessageTemplates = pgTable("admin_message_templates", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 30 }).notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const adminPolicies = pgTable("admin_policies", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").$type().notNull().default(sql`'[]'::jsonb`),
  violations: jsonb("violations").$type().notNull().default(sql`'[]'::jsonb`),
  severity: varchar("severity", { length: 20 }).notNull().default("medium"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const adminWorkflowRules = pgTable("admin_workflow_rules", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  conditions: jsonb("conditions").$type().notNull().default(sql`'[]'::jsonb`),
  actions: jsonb("actions").$type().notNull().default(sql`'[]'::jsonb`),
  isActive: boolean("is_active").notNull().default(true),
  priority: integer("priority").notNull().default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const adminSettings = pgTable("admin_settings", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: jsonb("platform").$type().notNull().default(sql`'{}'::jsonb`),
  payment: jsonb("payment").$type().notNull().default(sql`'{}'::jsonb`),
  notifications: jsonb("notifications").$type().notNull().default(sql`'{}'::jsonb`),
  security: jsonb("security").$type().notNull().default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
const adminTokenomicsSettings = pgTable("admin_tokenomics_settings", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  revenueDistribution: jsonb("revenue_distribution").$type().notNull().default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
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
  deviceType: text("device_type"),
  // desktop, tablet, mobile, tv
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
  achievements,
  adminMessageTemplates,
  adminMessages,
  adminPolicies,
  adminSettings,
  adminTokenomicsSettings,
  adminWorkflowRules,
  bibleStoryProgress,
  creatorApplications,
  creators,
  episodes,
  familyAddons,
  files,
  governanceAuditEntries,
  governanceMemberships,
  governancePauseEvents,
  governanceProposalApprovals,
  governanceProposals,
  mediaLibrary,
  mediaWatchProgress,
  notificationPreferences,
  parentalReports,
  paystackSubscriptions,
  playlistItems,
  playlists,
  ppvContent,
  ppvPurchases,
  profiles,
  quizSessions,
  reviewHelpful,
  reviews,
  schema,
  session,
  streaks,
  subscriptions,
  transactions,
  trialBlacklist,
  user,
  userAchievements,
  userMilestones,
  verification,
  videos,
  watchHistory
}, Symbol.toStringTag, { value: "Module" }));
const client = postgres(private_env.DATABASE_URL);
const db = drizzle(client, { schema: schema$1 });
export {
  familyAddons as A,
  playlists as B,
  playlistItems as C,
  reviewHelpful as D,
  session as E,
  files as F,
  governanceProposals as G,
  governanceProposalApprovals as H,
  governanceAuditEntries as I,
  governancePauseEvents as J,
  account as K,
  schema as L,
  achievements as a,
  user as b,
  adminMessages as c,
  db as d,
  adminMessageTemplates as e,
  creatorApplications as f,
  creators as g,
  governanceMemberships as h,
  paystackSubscriptions as i,
  ppvPurchases as j,
  mediaWatchProgress as k,
  adminPolicies as l,
  mediaLibrary as m,
  notificationPreferences as n,
  adminSettings as o,
  ppvContent as p,
  adminTokenomicsSettings as q,
  reviews as r,
  streaks as s,
  transactions as t,
  userAchievements as u,
  adminWorkflowRules as v,
  quizSessions as w,
  userMilestones as x,
  profiles as y,
  trialBlacklist as z
};
