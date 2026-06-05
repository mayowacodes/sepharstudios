import { t as __exportAll } from "./rolldown-runtime.js";
import { t as private_env } from "./shared-server.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { bigint, boolean, date, index, integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
//#region src/lib/db/schema/sepharstudios.ts
var files = pgTable("files", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	remoteId: text("remote_id").notNull(),
	url: text("url").notNull(),
	bucket: text("bucket").notNull(),
	size: integer("size"),
	type: text("type"),
	name: text("name"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var videos = pgTable("videos", {
	id: text("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	thumbnailUrl: text("thumbnail_url"),
	videoUrl: text("video_url").notNull(),
	videoId: text("video_file_id").references(() => files.id),
	thumbnailId: text("thumbnail_file_id").references(() => files.id),
	duration: integer("duration"),
	creatorId: text("creator_id").notNull().references(() => user.id),
	category: varchar("category", { length: 100 }),
	tags: jsonb("tags").$type(),
	viewCount: integer("view_count").default(0),
	isPublished: boolean("is_published").default(false),
	isPremium: boolean("is_premium").default(false),
	tokenPrice: integer("token_price"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var creators = pgTable("creators", {
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
	walletAddress: varchar("wallet_address", { length: 42 }),
	isVerified: boolean("is_verified").default(false),
	stripeAccountId: text("stripe_account_id").unique(),
	stripeAccountStatus: varchar("stripe_account_status", { length: 20 }),
	stripePayoutsEnabled: boolean("stripe_payouts_enabled").default(false),
	stripeChargesEnabled: boolean("stripe_charges_enabled").default(false),
	stripeCountry: varchar("stripe_country", { length: 2 }),
	payoutProcessor: varchar("payout_processor", { length: 20 }).default("paystack").notNull(),
	preferredPayoutCurrency: varchar("preferred_payout_currency", { length: 3 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var creatorApplications = pgTable("creator_applications", {
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
	reviewNotes: text("review_notes"),
	rejectionReason: text("rejection_reason"),
	reviewedAt: timestamp("reviewed_at"),
	reviewedBy: text("reviewed_by").references(() => user.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var subscriptions = pgTable("subscriptions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id),
	tier: varchar("tier", { length: 50 }).notNull(),
	nftTokenId: varchar("nft_token_id", { length: 100 }),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	isActive: boolean("is_active").default(true),
	autoRenew: boolean("auto_renew").default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var transactions = pgTable("transactions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id),
	type: varchar("type", { length: 50 }).notNull(),
	amount: integer("amount").notNull(),
	currency: varchar("currency", { length: 20 }).notNull(),
	txHash: varchar("tx_hash", { length: 66 }),
	status: varchar("status", { length: 20 }).notNull(),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var watchHistory = pgTable("watch_history", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id),
	videoId: text("video_id").notNull().references(() => videos.id),
	watchTime: integer("watch_time").default(0),
	completed: boolean("completed").default(false),
	lastWatchedAt: timestamp("last_watched_at").defaultNow().notNull()
});
var mediaLibrary = pgTable("media_library", {
	id: text("id").primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	thumbnail: text("thumbnail"),
	backdropUrl: text("backdrop_url"),
	posterUrl: text("poster_url"),
	posterLandscapeUrl: text("poster_landscape_url"),
	posterSquareUrl: text("poster_square_url"),
	logoTitleUrl: text("logo_title_url"),
	trailerUrl: text("trailer_url"),
	videoUrl: text("video_url"),
	encoderJobId: text("encoder_job_id"),
	processingStatus: varchar("processing_status", { length: 30 }).default("not_started").notNull(),
	processingError: text("processing_error"),
	processingProgress: integer("processing_progress"),
	processingStage: varchar("processing_stage", { length: 40 }),
	contentScanStatus: varchar("content_scan_status", { length: 20 }).default("idle").notNull(),
	contentScanReport: jsonb("content_scan_report").$type(),
	processedAt: timestamp("processed_at"),
	creatorId: text("creator_id").references(() => user.id, { onDelete: "set null" }),
	videoId: text("video_file_id").references(() => files.id),
	thumbnailId: text("thumbnail_file_id").references(() => files.id),
	backdropId: text("backdrop_file_id").references(() => files.id),
	posterId: text("poster_file_id").references(() => files.id),
	trailerId: text("trailer_file_id").references(() => files.id),
	link: text("link").notNull(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	mediaType: varchar("media_type", { length: 50 }).notNull(),
	category: varchar("category", { length: 50 }),
	genres: jsonb("genres").$type(),
	topics: jsonb("topics").$type(),
	keywords: jsonb("keywords").$type(),
	rating: varchar("rating", { length: 10 }),
	ageRating: varchar("age_rating", { length: 10 }),
	duration: varchar("duration", { length: 50 }),
	quality: varchar("quality", { length: 20 }),
	year: varchar("year", { length: 4 }),
	releaseDate: varchar("release_date", { length: 20 }),
	language: varchar("language", { length: 50 }).default("English"),
	bibleReference: varchar("bible_reference", { length: 100 }),
	featured: boolean("featured").default(false),
	isNew: boolean("is_new").default(false),
	isActive: boolean("is_active").default(true),
	status: varchar("status", { length: 30 }).default("submitted").notNull(),
	visibility: varchar("visibility", { length: 20 }).default("public").notNull(),
	scheduledPublishAt: timestamp("scheduled_publish_at"),
	chapters: jsonb("chapters").$type(),
	cast: jsonb("cast").$type().default(sql`'[]'::jsonb`).notNull(),
	crew: jsonb("crew").$type().default(sql`'[]'::jsonb`).notNull(),
	geoMode: varchar("geo_mode", { length: 10 }).default("all").notNull(),
	geoRegions: jsonb("geo_regions").$type().default(sql`'[]'::jsonb`).notNull(),
	nextUpContentIds: jsonb("next_up_content_ids").$type().default(sql`'[]'::jsonb`).notNull(),
	previewThumbnailsVtt: text("preview_thumbnails_vtt"),
	previewSpriteUrls: jsonb("preview_sprite_urls").$type().default(sql`'[]'::jsonb`).notNull(),
	posterAutoUrl: text("poster_auto_url"),
	reviewNotes: text("review_notes"),
	rejectionReason: text("rejection_reason"),
	reviewedAt: timestamp("reviewed_at"),
	reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
	viewCount: integer("view_count").default(0),
	voteAverage: varchar("vote_average", { length: 10 }),
	voteCount: varchar("vote_count", { length: 20 }),
	popularity: varchar("popularity", { length: 20 }),
	assignedTo: text("assigned_to").references(() => user.id, { onDelete: "set null" }),
	assignedAt: timestamp("assigned_at"),
	assignedBy: text("assigned_by").references(() => user.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var episodes = pgTable("episodes", {
	id: text("id").primaryKey(),
	showId: text("show_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
	seasonNumber: integer("season_number").notNull(),
	episodeNumber: integer("episode_number").notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	thumbnail: text("thumbnail"),
	videoUrl: text("video_url"),
	videoId: text("video_file_id").references(() => files.id),
	thumbnailId: text("thumbnail_file_id").references(() => files.id),
	duration: varchar("duration", { length: 50 }),
	airDate: varchar("air_date", { length: 20 }),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var contentSubtitleTracks = pgTable("content_subtitle_tracks", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
	kind: varchar("kind", { length: 20 }).notNull().default("subtitles"),
	language: varchar("language", { length: 10 }).notNull(),
	label: varchar("label", { length: 60 }).notNull(),
	fileUrl: text("file_url").notNull(),
	isDefault: boolean("is_default").default(false),
	autoGenerated: boolean("auto_generated").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({ contentIdx: index("content_subtitle_tracks_content_idx").on(t.contentId) }));
var liveStreams = pgTable("live_streams", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text("creator_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	streamKey: text("stream_key").notNull().unique(),
	rtmpIngestUrl: text("rtmp_ingest_url"),
	playbackUrl: text("playback_url"),
	thumbnailUrl: text("thumbnail_url"),
	status: varchar("status", { length: 20 }).default("idle").notNull(),
	visibility: varchar("visibility", { length: 20 }).default("public").notNull(),
	scheduledStartAt: timestamp("scheduled_start_at"),
	startedAt: timestamp("started_at"),
	endedAt: timestamp("ended_at"),
	viewerCount: integer("viewer_count").default(0).notNull(),
	viewerCountPeak: integer("viewer_count_peak").default(0).notNull(),
	recordingMediaId: text("recording_media_id"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => ({
	creatorIdx: index("live_streams_creator_idx").on(t.creatorId, t.createdAt),
	statusIdx: index("live_streams_status_idx").on(t.status)
}));
var liveChatMessages = pgTable("live_chat_messages", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	streamId: text("stream_id").notNull().references(() => liveStreams.id, { onDelete: "cascade" }),
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	body: text("body").notNull(),
	status: varchar("status", { length: 20 }).default("published").notNull(),
	pinned: boolean("pinned").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({ streamIdx: index("live_chat_messages_stream_idx").on(t.streamId, t.createdAt) }));
var contentPricing = pgTable("content_pricing", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
	regionCode: varchar("region_code", { length: 2 }).notNull(),
	priceCents: integer("price_cents").notNull(),
	currency: varchar("currency", { length: 3 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => ({ contentRegionIdx: index("content_pricing_content_region_idx").on(t.contentId, t.regionCode) }));
var profiles = pgTable("profiles", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 100 }).notNull(),
	type: varchar("type", { length: 20 }).notNull().default("adult"),
	avatarColor: varchar("avatar_color", { length: 20 }),
	avatarEmoji: varchar("avatar_emoji", { length: 10 }),
	pin: text("pin"),
	pinSetAt: timestamp("pin_set_at"),
	contentRating: varchar("content_rating", { length: 10 }).default("all"),
	safeModeEnabled: boolean("safe_mode_enabled").default(false),
	isKidsMode: boolean("is_kids_mode").default(false),
	isDefault: boolean("is_default").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var paystackSubscriptions = pgTable("paystack_subscriptions", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	plan: varchar("plan", { length: 20 }).notNull(),
	status: varchar("status", { length: 20 }).notNull().default("trial"),
	trialStartDate: timestamp("trial_start_date"),
	trialEndDate: timestamp("trial_end_date"),
	currentPeriodStart: timestamp("current_period_start"),
	currentPeriodEnd: timestamp("current_period_end"),
	maxProfiles: integer("max_profiles").notNull().default(1),
	kidsAllowed: boolean("kids_allowed").notNull().default(false),
	nextChargeAt: timestamp("next_charge_at"),
	failedAttempts: integer("failed_attempts").notNull().default(0),
	lastChargeAttemptAt: timestamp("last_charge_attempt_at"),
	paystackCustomerCode: varchar("paystack_customer_code", { length: 100 }),
	paystackSubscriptionCode: varchar("paystack_subscription_code", { length: 100 }).unique(),
	paystackAuthorizationCode: varchar("paystack_authorization_code", { length: 100 }),
	cardSignature: varchar("card_signature", { length: 200 }),
	cardLast4: varchar("card_last4", { length: 4 }),
	cardBrand: varchar("card_brand", { length: 50 }),
	phoneNumber: text("phone_number"),
	deviceFingerprint: text("device_fingerprint"),
	cancelledAt: timestamp("cancelled_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var familyAddons = pgTable("family_addons", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	subscriptionId: text("subscription_id").notNull().references(() => paystackSubscriptions.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	maxProfiles: integer("max_profiles").default(8),
	status: varchar("status", { length: 20 }).notNull().default("active"),
	paystackAuthorizationCode: varchar("paystack_authorization_code", { length: 100 }),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var trialBlacklist = pgTable("trial_blacklist", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	cardSignature: varchar("card_signature", { length: 200 }).unique(),
	phoneHash: text("phone_hash"),
	deviceFingerprint: text("device_fingerprint"),
	reason: text("reason"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var paystackEvents = pgTable("paystack_events", {
	eventId: text("event_id").primaryKey(),
	eventType: varchar("event_type", { length: 80 }).notNull(),
	receivedAt: timestamp("received_at").defaultNow().notNull(),
	payload: jsonb("payload")
});
var paymentIntents = pgTable("payment_intents", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	reference: varchar("reference", { length: 100 }).notNull().unique(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	kind: varchar("kind", { length: 30 }).notNull(),
	plan: varchar("plan", { length: 20 }),
	amountCents: integer("amount_cents").notNull(),
	currency: varchar("currency", { length: 10 }).notNull().default("usd"),
	addFamily: boolean("add_family").notNull().default(false),
	isTrial: boolean("is_trial").notNull().default(false),
	contentId: text("content_id"),
	status: varchar("status", { length: 20 }).notNull().default("pending"),
	consumedAt: timestamp("consumed_at"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var events = pgTable("events", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	speaker: varchar("speaker", { length: 255 }),
	speakerRole: varchar("speaker_role", { length: 255 }),
	kind: varchar("kind", { length: 30 }).notNull().default("webinar"),
	track: varchar("track", { length: 30 }),
	audience: varchar("audience", { length: 20 }).notNull().default("public"),
	startsAt: timestamp("starts_at").notNull(),
	endsAt: timestamp("ends_at"),
	durationMinutes: integer("duration_minutes"),
	location: text("location"),
	capacity: integer("capacity"),
	meetingUrl: text("meeting_url"),
	recordingUrl: text("recording_url"),
	status: varchar("status", { length: 20 }).notNull().default("scheduled"),
	createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var eventRegistrations = pgTable("event_registrations", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	status: varchar("status", { length: 20 }).notNull().default("confirmed"),
	reminderSentAt: timestamp("reminder_sent_at"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var creatorFollowers = pgTable("creator_followers", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	status: varchar("status", { length: 20 }).notNull().default("active"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var stcStakes = pgTable("stc_stakes", {
	userAddress: varchar("user_address", { length: 64 }).primaryKey(),
	amount: text("amount").notNull().default("0"),
	stakingTime: integer("staking_time").notNull().default(0),
	lockPeriod: integer("lock_period").notNull().default(0),
	discountTier: integer("discount_tier").notNull().default(0),
	isUnlocked: boolean("is_unlocked").notNull().default(true),
	lastSyncedAt: timestamp("last_synced_at").defaultNow().notNull()
});
var cronState = pgTable("cron_state", {
	jobKey: varchar("job_key", { length: 80 }).primaryKey(),
	lastBlock: text("last_block"),
	lastRunAt: timestamp("last_run_at"),
	notes: text("notes")
});
var newsletterSubscriptions = pgTable("newsletter_subscriptions", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	email: varchar("email", { length: 320 }).notNull(),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
	audience: varchar("audience", { length: 30 }).notNull().default("creator"),
	preferences: jsonb("preferences").$type(),
	status: varchar("status", { length: 20 }).notNull().default("active"),
	unsubscribeToken: text("unsubscribe_token").notNull().default(sql`gen_random_uuid()::text`),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var refunds = pgTable("refunds", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	reference: varchar("reference", { length: 100 }).notNull(),
	amountCents: integer("amount_cents").notNull(),
	currency: varchar("currency", { length: 10 }).notNull().default("usd"),
	reason: text("reason"),
	issuedBy: text("issued_by").notNull().references(() => user.id),
	paystackResponse: jsonb("paystack_response"),
	status: varchar("status", { length: 20 }).notNull().default("pending"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var ppvContent = pgTable("ppv_content", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
	suggestedPriceCents: integer("suggested_price_cents"),
	finalPriceCents: integer("final_price_cents").notNull(),
	currency: varchar("currency", { length: 10 }).default("usd"),
	isActive: boolean("is_active").default(false),
	creatorNote: text("creator_note"),
	adminApprovedAt: timestamp("admin_approved_at"),
	adminApprovedBy: text("admin_approved_by").references(() => user.id),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var ppvPurchases = pgTable("ppv_purchases", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	contentId: text("content_id").notNull().references(() => mediaLibrary.id),
	amountPaidCents: integer("amount_paid_cents").notNull(),
	currency: varchar("currency", { length: 10 }).default("usd"),
	paystackReference: varchar("paystack_reference", { length: 100 }),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var mediaWatchProgress = pgTable("media_watch_progress", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
	contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
	contentType: varchar("content_type", { length: 20 }).default("movie"),
	episodeId: text("episode_id").references(() => episodes.id),
	positionSeconds: integer("position_seconds").default(0),
	durationSeconds: integer("duration_seconds"),
	completionPercent: integer("completion_percent").default(0),
	isCompleted: boolean("is_completed").default(false),
	watchedAt: timestamp("watched_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var playlists = pgTable("playlists", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	profileId: text("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 200 }).notNull().default("My List"),
	description: text("description"),
	isDefault: boolean("is_default").default(false),
	isPublic: boolean("is_public").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var playlistItems = pgTable("playlist_items", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	playlistId: text("playlist_id").notNull().references(() => playlists.id, { onDelete: "cascade" }),
	contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
	contentType: varchar("content_type", { length: 20 }).default("movie"),
	sortOrder: integer("sort_order").default(0),
	addedAt: timestamp("added_at").defaultNow().notNull()
});
var reviews = pgTable("reviews", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	profileId: text("profile_id").references(() => profiles.id),
	contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
	contentType: varchar("content_type", { length: 20 }).default("movie"),
	rating: integer("rating").notNull(),
	reviewText: text("review_text"),
	isApproved: boolean("is_approved").default(false),
	helpfulCount: integer("helpful_count").default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var reviewHelpful = pgTable("review_helpful", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	reviewId: text("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	isHelpful: boolean("is_helpful").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var notificationPreferences = pgTable("notification_preferences", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
	newReleases: boolean("new_releases").default(true),
	trialExpiry: boolean("trial_expiry").default(true),
	paymentConfirmation: boolean("payment_confirmation").default(true),
	weeklyDigest: boolean("weekly_digest").default(false),
	creatorUpdates: boolean("creator_updates").default(false),
	eventReminders: boolean("event_reminders").default(true),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var streaks = pgTable("streaks", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
	profileId: text("profile_id").references(() => profiles.id),
	currentStreak: integer("current_streak").default(0),
	longestStreak: integer("longest_streak").default(0),
	lastWatchDate: timestamp("last_watch_date"),
	streakStartDate: timestamp("streak_start_date"),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var achievements = pgTable("achievements", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	code: varchar("code", { length: 100 }).notNull().unique(),
	name: varchar("name", { length: 200 }).notNull(),
	description: text("description"),
	icon: varchar("icon", { length: 50 }),
	stcReward: integer("stc_reward").default(0),
	category: varchar("category", { length: 50 })
});
var userAchievements = pgTable("user_achievements", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	profileId: text("profile_id").references(() => profiles.id),
	achievementCode: varchar("achievement_code", { length: 100 }).notNull().references(() => achievements.code),
	stcAwarded: boolean("stc_awarded").default(false),
	earnedAt: timestamp("earned_at").defaultNow().notNull()
});
var userMilestones = pgTable("user_milestones", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	code: varchar("code", { length: 100 }).notNull(),
	name: varchar("name", { length: 200 }).notNull(),
	description: text("description"),
	stcBonus: integer("stc_bonus").default(0),
	earnedAt: timestamp("earned_at").defaultNow().notNull()
});
var quizSessions = pgTable("quiz_sessions", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	contentId: text("content_id").references(() => mediaLibrary.id),
	questions: jsonb("questions").$type(),
	answers: jsonb("answers").$type(),
	score: integer("score"),
	completedAt: timestamp("completed_at"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var bibleStoryProgress = pgTable("bible_story_progress", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	contentId: text("content_id").references(() => mediaLibrary.id),
	isCompleted: boolean("is_completed").default(false),
	lastReadPage: integer("last_read_page").default(0),
	stcEarned: boolean("stc_earned").default(false),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var parentalReports = pgTable("parental_reports", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	parentProfileId: text("parent_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	childProfileId: text("child_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
	reportDate: timestamp("report_date").defaultNow().notNull(),
	totalWatchTimeSeconds: integer("total_watch_time_seconds").default(0),
	contentWatched: jsonb("content_watched").$type(),
	generatedAt: timestamp("generated_at").defaultNow().notNull()
});
var governanceProposals = pgTable("governance_proposals", {
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
var governanceProposalApprovals = pgTable("governance_proposal_approvals", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	proposalId: text("proposal_id").notNull().references(() => governanceProposals.id, { onDelete: "cascade" }),
	actorId: text("actor_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	actorName: varchar("actor_name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var governancePauseEvents = pgTable("governance_pause_events", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	reason: text("reason").notNull(),
	triggeredBy: text("triggered_by").notNull().references(() => user.id, { onDelete: "cascade" }),
	triggeredByName: varchar("triggered_by_name", { length: 255 }).notNull(),
	triggeredAt: timestamp("triggered_at").defaultNow().notNull(),
	active: boolean("active").notNull().default(true),
	resolvedAt: timestamp("resolved_at")
});
var governanceAuditEntries = pgTable("governance_audit_entries", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	proposalId: text("proposal_id").references(() => governanceProposals.id, { onDelete: "set null" }),
	action: varchar("action", { length: 40 }).notNull(),
	actorId: text("actor_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	actorName: varchar("actor_name", { length: 255 }).notNull(),
	note: text("note").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var governanceMemberships = pgTable("governance_memberships", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
	label: varchar("label", { length: 100 }).notNull().default("governance_admin"),
	permissions: jsonb("permissions").$type().notNull().default(sql`'[]'::jsonb`),
	active: boolean("active").notNull().default(true),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var adminMessages = pgTable("admin_messages", {
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
var adminMessageTemplates = pgTable("admin_message_templates", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	name: text("name").notNull(),
	subject: text("subject").notNull(),
	content: text("content").notNull(),
	type: varchar("type", { length: 30 }).notNull().default("general"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var adminPolicies = pgTable("admin_policies", {
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
var adminWorkflowRules = pgTable("admin_workflow_rules", {
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
var adminSettings = pgTable("admin_settings", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	platform: jsonb("platform").$type().notNull().default(sql`'{}'::jsonb`),
	payment: jsonb("payment").$type().notNull().default(sql`'{}'::jsonb`),
	notifications: jsonb("notifications").$type().notNull().default(sql`'{}'::jsonb`),
	security: jsonb("security").$type().notNull().default(sql`'{}'::jsonb`),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var adminTokenomicsSettings = pgTable("admin_tokenomics_settings", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	revenueDistribution: jsonb("revenue_distribution").$type().notNull().default(sql`'{}'::jsonb`),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var notifications = pgTable("notifications", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	kind: varchar("kind", { length: 40 }).notNull(),
	title: text("title").notNull(),
	message: text("message").notNull(),
	actionUrl: text("action_url"),
	read: boolean("read").notNull().default(false),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({ userCreatedIdx: index("notifications_user_created_idx").on(t.userId, t.createdAt) }));
var contentShares = pgTable("content_shares", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	contentId: text("content_id").notNull(),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
	channel: varchar("channel", { length: 30 }).notNull().default("link"),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({ contentIdx: index("content_shares_content_idx").on(t.contentId, t.createdAt) }));
var watchSessionMeta = pgTable("watch_session_meta", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	contentId: text("content_id").notNull(),
	deviceType: varchar("device_type", { length: 20 }),
	browser: varchar("browser", { length: 40 }),
	osName: varchar("os_name", { length: 40 }),
	country: varchar("country", { length: 2 }),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({
	contentIdx: index("watch_session_meta_content_idx").on(t.contentId, t.createdAt),
	deviceIdx: index("watch_session_meta_device_idx").on(t.contentId, t.deviceType)
}));
var pushSubscriptions = pgTable("push_subscriptions", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	endpoint: text("endpoint").notNull(),
	p256dh: text("p256dh").notNull(),
	auth: text("auth").notNull(),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	lastSeenAt: timestamp("last_seen_at").defaultNow().notNull()
}, (t) => ({
	userIdx: index("push_subscriptions_user_idx").on(t.userId),
	endpointIdx: index("push_subscriptions_endpoint_idx").on(t.endpoint)
}));
var successStories = pgTable("success_stories", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
	name: varchar("name", { length: 120 }).notNull(),
	channel: varchar("channel", { length: 160 }),
	story: text("story").notNull(),
	status: varchar("status", { length: 20 }).notNull().default("pending"),
	moderationNote: text("moderation_note"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	reviewedAt: timestamp("reviewed_at")
});
var sponsorshipApplications = pgTable("sponsorship_applications", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
	projectTitle: varchar("project_title", { length: 255 }).notNull(),
	genre: varchar("genre", { length: 60 }),
	synopsis: text("synopsis").notNull(),
	requestedAmount: integer("requested_amount"),
	timelineMonths: integer("timeline_months"),
	contactEmail: varchar("contact_email", { length: 320 }),
	documents: jsonb("documents").$type(),
	status: varchar("status", { length: 20 }).notNull().default("pending"),
	adminNote: text("admin_note"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	reviewedAt: timestamp("reviewed_at")
});
var supportTickets = pgTable("support_tickets", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
	email: varchar("email", { length: 320 }).notNull(),
	subject: varchar("subject", { length: 255 }).notNull(),
	category: varchar("category", { length: 40 }),
	priority: varchar("priority", { length: 20 }).notNull().default("normal"),
	description: text("description").notNull(),
	attachments: jsonb("attachments").$type(),
	status: varchar("status", { length: 20 }).notNull().default("open"),
	adminResponse: text("admin_response"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at")
}, (t) => ({ statusCreatedIdx: index("support_tickets_status_created_idx").on(t.status, t.createdAt) }));
var forumThreads = pgTable("forum_threads", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	title: varchar("title", { length: 255 }).notNull(),
	category: varchar("category", { length: 40 }).notNull(),
	body: text("body").notNull(),
	isSticky: boolean("is_sticky").notNull().default(false),
	isLocked: boolean("is_locked").notNull().default(false),
	likeCount: integer("like_count").notNull().default(0),
	replyCount: integer("reply_count").notNull().default(0),
	lastReplyAt: timestamp("last_reply_at"),
	status: varchar("status", { length: 20 }).notNull().default("published"),
	moderationNote: text("moderation_note"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => ({ categoryActivityIdx: index("forum_threads_category_activity_idx").on(t.category, t.lastReplyAt) }));
var forumReplies = pgTable("forum_replies", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	threadId: text("thread_id").notNull().references(() => forumThreads.id, { onDelete: "cascade" }),
	authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	parentReplyId: text("parent_reply_id"),
	body: text("body").notNull(),
	likeCount: integer("like_count").notNull().default(0),
	status: varchar("status", { length: 20 }).notNull().default("published"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => ({ threadCreatedIdx: index("forum_replies_thread_created_idx").on(t.threadId, t.createdAt) }));
var forumLikes = pgTable("forum_likes", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	threadId: text("thread_id"),
	replyId: text("reply_id"),
	createdAt: timestamp("created_at").defaultNow().notNull()
});
var abuseReports = pgTable("abuse_reports", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	reporterId: text("reporter_id").references(() => user.id, { onDelete: "set null" }),
	targetType: varchar("target_type", { length: 20 }).notNull(),
	targetId: text("target_id").notNull(),
	category: varchar("category", { length: 40 }).notNull(),
	description: text("description"),
	status: varchar("status", { length: 20 }).default("open").notNull(),
	resolution: varchar("resolution", { length: 40 }),
	resolvedBy: text("resolved_by").references(() => user.id),
	resolvedAt: timestamp("resolved_at"),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({
	statusIdx: index("abuse_reports_status_idx").on(t.status),
	targetIdx: index("abuse_reports_target_idx").on(t.targetType, t.targetId)
}));
var payouts = pgTable("payouts", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text("creator_id").notNull().references(() => creators.id),
	processor: varchar("processor", { length: 20 }).notNull(),
	processorPayoutId: text("processor_payout_id"),
	periodStart: timestamp("period_start").notNull(),
	periodEnd: timestamp("period_end").notNull(),
	grossCents: bigint("gross_cents", { mode: "number" }).notNull(),
	platformFeeCents: bigint("platform_fee_cents", { mode: "number" }).notNull(),
	netCents: bigint("net_cents", { mode: "number" }).notNull(),
	currency: varchar("currency", { length: 3 }).notNull(),
	status: varchar("status", { length: 20 }).default("pending").notNull(),
	failureReason: text("failure_reason"),
	approvedBy: text("approved_by").references(() => user.id),
	approvedAt: timestamp("approved_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	paidAt: timestamp("paid_at"),
	heldUntil: timestamp("held_until")
}, (t) => ({
	creatorIdx: index("payouts_creator_idx").on(t.creatorId),
	statusIdx: index("payouts_status_idx").on(t.status)
}));
var payoutDisputes = pgTable("payout_disputes", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	processor: varchar("processor", { length: 20 }).notNull(),
	processorDisputeId: text("processor_dispute_id").notNull().unique(),
	payoutId: text("payout_id").references(() => payouts.id),
	ppvPurchaseId: text("ppv_purchase_id"),
	amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
	currency: varchar("currency", { length: 3 }).notNull(),
	reason: varchar("reason", { length: 60 }),
	status: varchar("status", { length: 20 }).default("open").notNull(),
	evidenceDueAt: timestamp("evidence_due_at"),
	rawPayload: jsonb("raw_payload"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	closedAt: timestamp("closed_at")
}, (t) => ({
	statusIdx: index("payout_disputes_status_idx").on(t.status),
	payoutIdx: index("payout_disputes_payout_idx").on(t.payoutId)
}));
var taxForms = pgTable("tax_forms", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
	formKind: varchar("form_kind", { length: 20 }).notNull(),
	taxYear: integer("tax_year").notNull(),
	formData: jsonb("form_data").notNull(),
	status: varchar("status", { length: 20 }).default("submitted").notNull(),
	verifiedBy: text("verified_by").references(() => user.id),
	verifiedAt: timestamp("verified_at"),
	rejectionReason: text("rejection_reason"),
	pdfUrl: text("pdf_url"),
	submittedAt: timestamp("submitted_at").defaultNow().notNull()
}, (t) => ({
	creatorIdx: index("tax_forms_creator_idx").on(t.creatorId, t.taxYear),
	statusIdx: index("tax_forms_status_idx").on(t.status)
}));
var tax1099Forms = pgTable("tax_1099_forms", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text("creator_id").notNull().references(() => creators.id, { onDelete: "cascade" }),
	taxYear: integer("tax_year").notNull(),
	totalPaidCents: bigint("total_paid_cents", { mode: "number" }).notNull(),
	pdfUrl: text("pdf_url"),
	emailedAt: timestamp("emailed_at"),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({ creatorIdx: index("tax_1099_forms_creator_idx").on(t.creatorId, t.taxYear) }));
var contentThumbnailVariants = pgTable("content_thumbnail_variants", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	contentId: text("content_id").notNull().references(() => mediaLibrary.id, { onDelete: "cascade" }),
	url: text("url").notNull(),
	label: varchar("label", { length: 40 }),
	isActive: boolean("is_active").default(true).notNull(),
	isWinner: boolean("is_winner").default(false).notNull(),
	impressions: integer("impressions").default(0).notNull(),
	clicks: integer("clicks").default(0).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	promotedAt: timestamp("promoted_at")
}, (t) => ({ contentIdx: index("content_thumbnail_variants_content_idx").on(t.contentId) }));
var copilotConversations = pgTable("copilot_conversations", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	variant: varchar("variant", { length: 10 }).notNull(),
	title: text("title"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => ({ userIdx: index("copilot_conversations_user_idx").on(t.userId, t.updatedAt) }));
var copilotMessages = pgTable("copilot_messages", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	conversationId: text("conversation_id").notNull().references(() => copilotConversations.id, { onDelete: "cascade" }),
	role: varchar("role", { length: 20 }).notNull(),
	content: text("content").notNull(),
	toolName: varchar("tool_name", { length: 60 }),
	toolInput: jsonb("tool_input").$type(),
	toolOutput: jsonb("tool_output").$type(),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({ convoIdx: index("copilot_messages_convo_idx").on(t.conversationId, t.createdAt) }));
var aiActionLog = pgTable("ai_action_log", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	conversationId: text("conversation_id"),
	tool: varchar("tool", { length: 60 }).notNull(),
	input: jsonb("input").$type(),
	output: jsonb("output").$type(),
	approved: boolean("approved").default(false).notNull(),
	executedAt: timestamp("executed_at"),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({
	userIdx: index("ai_action_log_user_idx").on(t.userId, t.createdAt),
	toolIdx: index("ai_action_log_tool_idx").on(t.tool)
}));
var agentRuns = pgTable("agent_runs", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	agent: varchar("agent", { length: 60 }).notNull(),
	status: varchar("status", { length: 20 }).default("running").notNull(),
	startedAt: timestamp("started_at").defaultNow().notNull(),
	finishedAt: timestamp("finished_at"),
	steps: integer("steps").default(0).notNull(),
	costCents: integer("cost_cents").default(0).notNull(),
	itemsProcessed: integer("items_processed").default(0).notNull(),
	itemsActioned: integer("items_actioned").default(0).notNull(),
	summary: text("summary"),
	error: text("error")
}, (t) => ({
	agentIdx: index("agent_runs_agent_idx").on(t.agent, t.startedAt),
	statusIdx: index("agent_runs_status_idx").on(t.status)
}));
var aiCallLog = pgTable("ai_call_log", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
	surface: varchar("surface", { length: 60 }).notNull(),
	model: varchar("model", { length: 80 }),
	provider: varchar("provider", { length: 20 }),
	tokensIn: integer("tokens_in").default(0).notNull(),
	tokensOut: integer("tokens_out").default(0).notNull(),
	costCents: integer("cost_cents").default(0).notNull(),
	latencyMs: integer("latency_ms").default(0).notNull(),
	ok: boolean("ok").default(true).notNull(),
	error: text("error"),
	createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => ({
	userIdx: index("ai_call_log_user_idx").on(t.userId, t.createdAt),
	surfaceIdx: index("ai_call_log_surface_idx").on(t.surface)
}));
//#endregion
//#region src/lib/db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	abuseReports: () => abuseReports,
	account: () => account,
	achievements: () => achievements,
	adminMessageTemplates: () => adminMessageTemplates,
	adminMessages: () => adminMessages,
	adminPolicies: () => adminPolicies,
	adminSettings: () => adminSettings,
	adminTokenomicsSettings: () => adminTokenomicsSettings,
	adminWorkflowRules: () => adminWorkflowRules,
	agentRuns: () => agentRuns,
	aiActionLog: () => aiActionLog,
	aiCallLog: () => aiCallLog,
	bibleStoryProgress: () => bibleStoryProgress,
	contentPricing: () => contentPricing,
	contentShares: () => contentShares,
	contentSubtitleTracks: () => contentSubtitleTracks,
	contentThumbnailVariants: () => contentThumbnailVariants,
	copilotConversations: () => copilotConversations,
	copilotMessages: () => copilotMessages,
	creatorApplications: () => creatorApplications,
	creatorFollowers: () => creatorFollowers,
	creators: () => creators,
	cronState: () => cronState,
	episodes: () => episodes,
	eventRegistrations: () => eventRegistrations,
	events: () => events,
	familyAddons: () => familyAddons,
	files: () => files,
	forumLikes: () => forumLikes,
	forumReplies: () => forumReplies,
	forumThreads: () => forumThreads,
	governanceAuditEntries: () => governanceAuditEntries,
	governanceMemberships: () => governanceMemberships,
	governancePauseEvents: () => governancePauseEvents,
	governanceProposalApprovals: () => governanceProposalApprovals,
	governanceProposals: () => governanceProposals,
	liveChatMessages: () => liveChatMessages,
	liveStreams: () => liveStreams,
	mediaLibrary: () => mediaLibrary,
	mediaWatchProgress: () => mediaWatchProgress,
	newsletterSubscriptions: () => newsletterSubscriptions,
	notificationPreferences: () => notificationPreferences,
	notifications: () => notifications,
	parentalReports: () => parentalReports,
	paymentIntents: () => paymentIntents,
	payoutDisputes: () => payoutDisputes,
	payouts: () => payouts,
	paystackEvents: () => paystackEvents,
	paystackSubscriptions: () => paystackSubscriptions,
	playlistItems: () => playlistItems,
	playlists: () => playlists,
	ppvContent: () => ppvContent,
	ppvPurchases: () => ppvPurchases,
	profiles: () => profiles,
	pushSubscriptions: () => pushSubscriptions,
	quizSessions: () => quizSessions,
	refunds: () => refunds,
	reviewHelpful: () => reviewHelpful,
	reviews: () => reviews,
	schema: () => schema,
	session: () => session,
	sponsorshipApplications: () => sponsorshipApplications,
	stcStakes: () => stcStakes,
	streaks: () => streaks,
	subscriptions: () => subscriptions,
	successStories: () => successStories,
	supportTickets: () => supportTickets,
	tax1099Forms: () => tax1099Forms,
	taxForms: () => taxForms,
	transactions: () => transactions,
	trialBlacklist: () => trialBlacklist,
	user: () => user,
	userAchievements: () => userAchievements,
	userMilestones: () => userMilestones,
	verification: () => verification,
	videos: () => videos,
	watchHistory: () => watchHistory,
	watchSessionMeta: () => watchSessionMeta
});
var user = pgTable("user", {
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
	walletAddress: text("wallet_address"),
	dateOfBirth: date("date_of_birth"),
	gender: varchar("gender", { length: 30 })
});
var session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	deviceType: text("device_type"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	impersonatedBy: text("impersonated_by")
});
var account = pgTable("account", {
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
var verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow()
});
var schema = {
	user,
	session,
	account,
	verification
};
var db = drizzle(postgres(private_env.DATABASE_URL, {
	max: 25,
	idle_timeout: 30,
	connect_timeout: 10
}), { schema: schema_exports });
//#endregion
export { playlists as $, familyAddons as A, liveChatMessages as B, creatorApplications as C, episodes as D, cronState as E, governanceAuditEntries as F, notificationPreferences as G, mediaLibrary as H, governanceMemberships as I, payoutDisputes as J, notifications as K, governancePauseEvents as L, forumLikes as M, forumReplies as N, eventRegistrations as O, forumThreads as P, playlistItems as Q, governanceProposalApprovals as R, copilotMessages as S, creators as T, mediaWatchProgress as U, liveStreams as V, newsletterSubscriptions as W, paystackEvents as X, payouts as Y, paystackSubscriptions as Z, contentPricing as _, trialBlacklist as _t, user as a, refunds as at, contentThumbnailVariants as b, watchSessionMeta as bt, adminMessageTemplates as c, sponsorshipApplications as ct, adminSettings as d, subscriptions as dt, ppvContent as et, adminTokenomicsSettings as f, successStories as ft, aiCallLog as g, transactions as gt, aiActionLog as h, taxForms as ht, session as i, quizSessions as it, files as j, events as k, adminMessages as l, stcStakes as lt, agentRuns as m, tax1099Forms as mt, account as n, profiles as nt, abuseReports as o, reviewHelpful as ot, adminWorkflowRules as p, supportTickets as pt, paymentIntents as q, schema as r, pushSubscriptions as rt, achievements as s, reviews as st, db as t, ppvPurchases as tt, adminPolicies as u, streaks as ut, contentShares as v, userAchievements as vt, creatorFollowers as w, copilotConversations as x, contentSubtitleTracks as y, userMilestones as yt, governanceProposals as z };
