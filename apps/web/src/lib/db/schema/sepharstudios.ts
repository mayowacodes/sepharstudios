import { pgTable, text, timestamp, varchar, integer, boolean, jsonb, index, bigint } from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';

// Files table - tracking all MinIO objects across the platform
export const files = pgTable('files', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	remoteId: text('remote_id').notNull(), // The MinIO object name
	url: text('url').notNull(),            // Public/Direct URL
	bucket: text('bucket').notNull(),      // Which bucket it's in
	size: integer('size'),
	type: text('type'),                    // MIME type
	name: text('name'),                    // Original filename
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Videos table - for streaming content
export const videos = pgTable('videos', {
	id: text('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	thumbnailUrl: text('thumbnail_url'),
	videoUrl: text('video_url').notNull(),
	// Registry Links
	videoId: text('video_file_id').references(() => files.id),
	thumbnailId: text('thumbnail_file_id').references(() => files.id),
	
	duration: integer('duration'), // in seconds
	creatorId: text('creator_id').notNull().references(() => user.id),
	category: varchar('category', { length: 100 }),
	tags: jsonb('tags').$type<string[]>(),
	viewCount: integer('view_count').default(0),
	isPublished: boolean('is_published').default(false),
	isPremium: boolean('is_premium').default(false),
	tokenPrice: integer('token_price'), // price in STC tokens
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Creators table - extended user info for content creators
export const creators = pgTable('creators', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	displayName: varchar('display_name', { length: 255 }).notNull(),
	creatorType: varchar('creator_type', { length: 20 }).default('individual'),
	legalName: varchar('legal_name', { length: 255 }),
	organizationName: varchar('organization_name', { length: 255 }),
	organizationType: varchar('organization_type', { length: 100 }),
	organizationWebsite: text('organization_website'),
	organizationAddress: text('organization_address'),
	taxId: varchar('tax_id', { length: 100 }),
	contactEmail: text('contact_email'),
	contactPhone: text('contact_phone'),
	denomination: varchar('denomination', { length: 100 }),
	yearsInMinistry: integer('years_in_ministry'),
	ministryDescription: text('ministry_description'),
	ministryAddress: text('ministry_address'),
	verificationDocuments: jsonb('verification_documents').$type<Array<{ id: string; url: string; name: string; size?: number }>>(),
	socialLinks: jsonb('social_links').$type<Record<string, string>>(),
	preferences: jsonb('preferences').$type<Record<string, boolean>>(),
	bio: text('bio'),
	avatarUrl: text('avatar_url'),
	bannerUrl: text('banner_url'),
	subscriberCount: integer('subscriber_count').default(0),
	totalViews: integer('total_views').default(0),
	totalEarnings: integer('total_earnings').default(0), // in tokens
	walletAddress: varchar('wallet_address', { length: 42 }),
	isVerified: boolean('is_verified').default(false),
	// Stripe Connect (Item 4A). `payoutProcessor` chooses between Paystack
	// (default — African region) and Stripe (USD / global). Stripe-specific
	// columns mirror the connected account state so we don't round-trip to
	// Stripe on every render.
	stripeAccountId: text('stripe_account_id').unique(),
	stripeAccountStatus: varchar('stripe_account_status', { length: 20 }),
	stripePayoutsEnabled: boolean('stripe_payouts_enabled').default(false),
	stripeChargesEnabled: boolean('stripe_charges_enabled').default(false),
	stripeCountry: varchar('stripe_country', { length: 2 }),
	payoutProcessor: varchar('payout_processor', { length: 20 }).default('paystack').notNull(),
	preferredPayoutCurrency: varchar('preferred_payout_currency', { length: 3 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Creator applications - approvals before granting creator role
export const creatorApplications = pgTable('creator_applications', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	creatorType: varchar('creator_type', { length: 20 }).notNull().default('individual'),
	displayName: varchar('display_name', { length: 255 }),
	legalName: varchar('legal_name', { length: 255 }),
	organizationName: varchar('organization_name', { length: 255 }),
	organizationType: varchar('organization_type', { length: 100 }),
	organizationWebsite: text('organization_website'),
	organizationAddress: text('organization_address'),
	taxId: varchar('tax_id', { length: 100 }),
	contactEmail: text('contact_email'),
	contactPhone: text('contact_phone'),
	bio: text('bio'),
	portfolioUrl: text('portfolio_url'),
	socialLinks: jsonb('social_links').$type<Record<string, string>>(),
	documents: jsonb('documents').$type<Array<{ id: string; url: string; name: string; size?: number }>>(),
	status: varchar('status', { length: 20 }).notNull().default('pending'), // pending | approved | rejected
	reviewNotes: text('review_notes'),
	rejectionReason: text('rejection_reason'),
	reviewedAt: timestamp('reviewed_at'),
	reviewedBy: text('reviewed_by').references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Subscriptions table - tracking NFT subscriptions
export const subscriptions = pgTable('subscriptions', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	tier: varchar('tier', { length: 50 }).notNull(), // basic, premium, vip
	nftTokenId: varchar('nft_token_id', { length: 100 }),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date').notNull(),
	isActive: boolean('is_active').default(true),
	autoRenew: boolean('auto_renew').default(true),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Transactions table - token/payment tracking
export const transactions = pgTable('transactions', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	type: varchar('type', { length: 50 }).notNull(), // purchase, earn, transfer
	amount: integer('amount').notNull(),
	currency: varchar('currency', { length: 20 }).notNull(), // STC, USDC, etc
	txHash: varchar('tx_hash', { length: 66 }), // blockchain transaction hash
	status: varchar('status', { length: 20 }).notNull(), // pending, completed, failed
	metadata: jsonb('metadata'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Watch history
export const watchHistory = pgTable('watch_history', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	videoId: text('video_id').notNull().references(() => videos.id),
	watchTime: integer('watch_time').default(0), // seconds watched
	completed: boolean('completed').default(false),
	lastWatchedAt: timestamp('last_watched_at').defaultNow().notNull()
});

// Media Library - Platform-provided content (Movies, Shows, Documentaries)
export const mediaLibrary = pgTable('media_library', {
	id: text('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	thumbnail: text('thumbnail'),
	backdropUrl: text('backdrop_url'),
	posterUrl: text('poster_url'),                    // portrait poster (2:3) — main movie cards
	posterLandscapeUrl: text('poster_landscape_url'), // landscape poster (16:9) — horizontal cards
	posterSquareUrl: text('poster_square_url'),       // square poster (1:1) — mobile / compact
	logoTitleUrl: text('logo_title_url'),             // transparent PNG title logo
	trailerUrl: text('trailer_url'),
	videoUrl: text('video_url'), // actual streaming link
	encoderJobId: text('encoder_job_id'),
	processingStatus: varchar('processing_status', { length: 30 }).default('not_started').notNull(),
	processingError: text('processing_error'),
	// Encoder progress (R+1): % done (0-100) + active pipeline stage so the
	// UI can render a meaningful progress bar while jobs are running.
	processingProgress: integer('processing_progress'),
	processingStage: varchar('processing_stage', { length: 40 }),
	// Pre-publish content scan (R+5). The orchestrator delivers a transcript
	// + sampled frames to /api/encoder/scan-ready; the platform runs AI
	// doctrinal + family-safety checks on the actual content (not metadata).
	// Status: 'idle' | 'in_progress' | 'complete' | 'failed' | 'skipped'.
	// Report shape: see ContentScanReport in lib/types/content-scan.ts.
	contentScanStatus: varchar('content_scan_status', { length: 20 }).default('idle').notNull(),
	contentScanReport: jsonb('content_scan_report').$type<{
		// Legacy single-track shape — kept for backwards compat with rows
		// produced before the multi-track contract. Newer rows use subtitles[].
		transcript?: { vttUrl?: string; txtUrl?: string; durationSec?: number; language?: string; wordCount?: number };
		// New multi-track shape from the orchestrator's scan-ready webhook.
		// One entry per language; the `default: true` row is the source-language
		// auto-detected transcription. Translations are machine-translated.
		subtitles?: Array<{
			language: string;
			kind: 'transcription' | 'translation';
			default: boolean;
			vttUrl?: string;
			txtUrl?: string;
			durationSec?: number;
			wordCount?: number;
			quality?: {
				parseOk?: boolean;
				cueCount?: number;
				avgLogProb?: number;
				noSpeechRatio?: number;
				avgCompressionRatio?: number;
				wordRate?: number;
				suspectedHallucination?: boolean;
				machineTranslated?: boolean;
			};
		}>;
		// Player scrubbing-preview artifacts (also mirrored to dedicated
		// columns for fast lookup).
		thumbnails?: { posterUrl?: string; spriteUrls?: string[]; vttUrl?: string };
		frames?: Array<{ index: number; timestampSec: number; url: string }>;
		audioAvailable?: boolean;
		videoDurationSec?: number;
		aiVerdict?: {
			verdict: 'approve' | 'flag' | 'reject';
			theologyScore: number;
			familySafeScore: number;
			recommendedAgeRating: string;
			flags: string[];
			reason: string;
			transcriptExcerpts?: Array<{ text: string; reason: string }>;
		};
		startedAt?: string;
		completedAt?: string;
		/** When set, the orchestrator timed out the scan and the payload is
		 *  partial (subtitles or frames may be empty). */
		partial?: boolean;
	}>(),
	processedAt: timestamp('processed_at'),
	creatorId: text('creator_id').references(() => user.id, { onDelete: 'set null' }),
	
	// Registry Links
	videoId: text('video_file_id').references(() => files.id),
	thumbnailId: text('thumbnail_file_id').references(() => files.id),
	backdropId: text('backdrop_file_id').references(() => files.id),
	posterId: text('poster_file_id').references(() => files.id),
	trailerId: text('trailer_file_id').references(() => files.id),

	link: text('link').notNull(), // page link
	slug: varchar('slug', { length: 255 }).notNull().unique(),

	// Media type and categorization
	mediaType: varchar('media_type', { length: 50 }).notNull(), // 'movie', 'show', 'documentary'
	category: varchar('category', { length: 50 }), // 'faith', 'kids', 'teens'
	genres: jsonb('genres').$type<string[]>(),
	topics: jsonb('topics').$type<string[]>(),
	keywords: jsonb('keywords').$type<string[]>(),

	// Ratings and metadata
	rating: varchar('rating', { length: 10 }), // IMDb rating
	ageRating: varchar('age_rating', { length: 10 }), // 'All', '7+', '12+', etc.
	duration: varchar('duration', { length: 50 }), // '2h 7m'
	quality: varchar('quality', { length: 20 }), // 'HD', '4K'
	year: varchar('year', { length: 4 }),
	releaseDate: varchar('release_date', { length: 20 }),
	language: varchar('language', { length: 50 }).default('English'),

	// Faith-based specific
	bibleReference: varchar('bible_reference', { length: 100 }),

	// Status flags
	featured: boolean('featured').default(false),
	isNew: boolean('is_new').default(false),
	isActive: boolean('is_active').default(true),
	status: varchar('status', { length: 30 }).default('submitted').notNull(),
	// Creator-controlled visibility. 'public' shows up in browse + search;
	// 'unlisted' is accessible via direct watch link only; 'private' is owner-
	// only. Independent of `status` (which is the admin review workflow).
	visibility: varchar('visibility', { length: 20 }).default('public').notNull(),
	// When set, the scheduled-publish cron flips status to 'published' +
	// isActive=true at this time (provided status='approved' already).
	scheduledPublishAt: timestamp('scheduled_publish_at'),
	// Viewer-engagement round additions:
	//   chapters: [{ start: number (sec), title: string }, ...]
	//   cast:     [{ name, role, photoUrl?, characterName? }, ...]
	//   crew:     [{ name, role, photoUrl? }, ...]
	chapters: jsonb('chapters').$type<Array<{ start: number; title: string }>>(),
	cast: jsonb('cast').$type<Array<{ name: string; role: string; photoUrl?: string; characterName?: string }>>().default(sql`'[]'::jsonb`).notNull(),
	crew: jsonb('crew').$type<Array<{ name: string; role: string; photoUrl?: string }>>().default(sql`'[]'::jsonb`).notNull(),
	// Region gating. geoMode='all' = no restriction; 'allow' = whitelist; 'block' = blacklist.
	geoMode: varchar('geo_mode', { length: 10 }).default('all').notNull(),
	geoRegions: jsonb('geo_regions').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
	// Creator-curated end-screen next-up. When non-empty, the watch page
	// uses these IDs (in this order) instead of the auto-rec algorithm.
	nextUpContentIds: jsonb('next_up_content_ids').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
	// Player scrubbing-preview artifacts produced by the encoder
	// orchestrator's scan-ready webhook. The VTT cues reference sprite
	// sheet regions via `sprite_N.jpg#xywh=x,y,w,h`. posterAutoUrl is the
	// fallback we use when the creator hasn't uploaded their own poster.
	previewThumbnailsVtt: text('preview_thumbnails_vtt'),
	previewSpriteUrls: jsonb('preview_sprite_urls').$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
	posterAutoUrl: text('poster_auto_url'),
	reviewNotes: text('review_notes'),
	rejectionReason: text('rejection_reason'),
	reviewedAt: timestamp('reviewed_at'),
	reviewedBy: text('reviewed_by').references(() => user.id, { onDelete: 'set null' }),

	// Statistics
	viewCount: integer('view_count').default(0),
	voteAverage: varchar('vote_average', { length: 10 }),
	voteCount: varchar('vote_count', { length: 20 }),
	popularity: varchar('popularity', { length: 20 }),

	// Review-queue assignment — admin currently working this item. Distinct
	// from `reviewedBy` which is set only once the review completes.
	// `assignedBy` records WHO performed the assignment (the acting admin),
	// not the assignee — so audit logs show whether admin A self-claimed
	// the item or whether admin B reassigned it from admin C.
	assignedTo: text('assigned_to').references(() => user.id, { onDelete: 'set null' }),
	assignedAt: timestamp('assigned_at'),
	assignedBy: text('assigned_by').references(() => user.id, { onDelete: 'set null' }),

	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Episodes table - for TV shows
export const episodes = pgTable('episodes', {
	id: text('id').primaryKey(),
	showId: text('show_id').notNull().references(() => mediaLibrary.id, { onDelete: 'cascade' }),
	seasonNumber: integer('season_number').notNull(),
	episodeNumber: integer('episode_number').notNull(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	thumbnail: text('thumbnail'),
	videoUrl: text('video_url'),

	// Registry Links
	videoId: text('video_file_id').references(() => files.id),
	thumbnailId: text('thumbnail_file_id').references(() => files.id),

	duration: varchar('duration', { length: 50 }),
	airDate: varchar('air_date', { length: 20 }),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// Subtitle / caption / audio-description tracks attached to a media row.
// Multiple per content (one per language + kind). Created by creators via the
// content detail page; read by the watch page and fed to VideoPlayer's
// `subtitles` / `descriptions` props.
// ─────────────────────────────────────────────────────────────────────────────
export const contentSubtitleTracks = pgTable('content_subtitle_tracks', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	contentId: text('content_id').notNull().references(() => mediaLibrary.id, { onDelete: 'cascade' }),
	kind: varchar('kind', { length: 20 }).notNull().default('subtitles'), // subtitles | captions | descriptions
	language: varchar('language', { length: 10 }).notNull(),               // BCP-47-ish: en, es, pt-BR
	label: varchar('label', { length: 60 }).notNull(),                     // human-readable
	fileUrl: text('file_url').notNull(),                                   // VTT URL from /api/files
	isDefault: boolean('is_default').default(false),
	// True when this track was generated by the orchestrator's Whisper pass
	// (R+5 transcript). Lets the creator distinguish auto from manually
	// uploaded captions and re-run when the AI model improves.
	autoGenerated: boolean('auto_generated').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	contentIdx: index('content_subtitle_tracks_content_idx').on(t.contentId)
}));

// Live streaming foundation. One row per live stream the creator has set
// up; status transitions: idle → ingest → live → ending → ended. After
// `ended`, if `recordingMediaId` is set, the VOD recording lives in
// media_library.
export const liveStreams = pgTable('live_streams', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text('creator_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	streamKey: text('stream_key').notNull().unique(),
	rtmpIngestUrl: text('rtmp_ingest_url'),
	playbackUrl: text('playback_url'),
	thumbnailUrl: text('thumbnail_url'),
	status: varchar('status', { length: 20 }).default('idle').notNull(),
	// 'idle' | 'ingest' | 'live' | 'ending' | 'ended' | 'errored'
	visibility: varchar('visibility', { length: 20 }).default('public').notNull(),
	scheduledStartAt: timestamp('scheduled_start_at'),
	startedAt: timestamp('started_at'),
	endedAt: timestamp('ended_at'),
	viewerCount: integer('viewer_count').default(0).notNull(),
	viewerCountPeak: integer('viewer_count_peak').default(0).notNull(),
	recordingMediaId: text('recording_media_id'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (t) => ({
	creatorIdx: index('live_streams_creator_idx').on(t.creatorId, t.createdAt),
	statusIdx: index('live_streams_status_idx').on(t.status)
}));

// Live chat messages. Per-stream chat, AI-moderated on POST. Creator can
// pin / delete; admin can purge.
export const liveChatMessages = pgTable('live_chat_messages', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	streamId: text('stream_id').notNull().references(() => liveStreams.id, { onDelete: 'cascade' }),
	authorId: text('author_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	body: text('body').notNull(),
	status: varchar('status', { length: 20 }).default('published').notNull(),
	// 'published' | 'pending' | 'hidden' | 'removed'
	pinned: boolean('pinned').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	streamIdx: index('live_chat_messages_stream_idx').on(t.streamId, t.createdAt)
}));

// Per-region PPV pricing. The platform resolves an exact-region match
// first, then a wildcard ('*') default row, then falls back to the
// admin-approved ppvContent.finalPriceCents. Currency code is ISO-4217.
export const contentPricing = pgTable('content_pricing', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	contentId: text('content_id').notNull().references(() => mediaLibrary.id, { onDelete: 'cascade' }),
	regionCode: varchar('region_code', { length: 2 }).notNull(), // ISO-3166-1 alpha-2; '*' = default
	priceCents: integer('price_cents').notNull(),
	currency: varchar('currency', { length: 3 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (t) => ({
	contentRegionIdx: index('content_pricing_content_region_idx').on(t.contentId, t.regionCode)
}));

// User table extension (add to existing user table)
import { user } from '../schema';

// ─────────────────────────────────────────────────────────────────────────────
// PROFILES — named profiles per user account (Who's Watching?)
// ─────────────────────────────────────────────────────────────────────────────
export const profiles = pgTable('profiles', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 100 }).notNull(),
	type: varchar('type', { length: 20 }).notNull().default('adult'), // adult | teen | kids
	avatarColor: varchar('avatar_color', { length: 20 }),
	avatarEmoji: varchar('avatar_emoji', { length: 10 }),
	pin: text('pin'), // bcrypt hash, null = no PIN
	pinSetAt: timestamp('pin_set_at'),
	contentRating: varchar('content_rating', { length: 10 }).default('all'), // G | PG | PG13 | R | all
	safeModeEnabled: boolean('safe_mode_enabled').default(false),
	isKidsMode: boolean('is_kids_mode').default(false),
	isDefault: boolean('is_default').default(false),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// PAYSTACK SUBSCRIPTIONS — fiat billing (separate from on-chain NFT subscriptions)
// ─────────────────────────────────────────────────────────────────────────────
export const paystackSubscriptions = pgTable('paystack_subscriptions', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	plan: varchar('plan', { length: 20 }).notNull(), // freemium | basic | premium | creator
	status: varchar('status', { length: 20 }).notNull().default('trial'), // trial | active | cancelled | expired | paused
	trialStartDate: timestamp('trial_start_date'),
	trialEndDate: timestamp('trial_end_date'),
	currentPeriodStart: timestamp('current_period_start'),
	currentPeriodEnd: timestamp('current_period_end'),
	// Per-plan capability snapshot (set from PLAN_FEATURES at sub creation)
	maxProfiles: integer('max_profiles').notNull().default(1),
	kidsAllowed: boolean('kids_allowed').notNull().default(false),
	// Recurring-billing worker state
	nextChargeAt: timestamp('next_charge_at'),
	failedAttempts: integer('failed_attempts').notNull().default(0),
	lastChargeAttemptAt: timestamp('last_charge_attempt_at'),
	// Paystack identifiers
	paystackCustomerCode: varchar('paystack_customer_code', { length: 100 }),
	paystackSubscriptionCode: varchar('paystack_subscription_code', { length: 100 }).unique(),
	paystackAuthorizationCode: varchar('paystack_authorization_code', { length: 100 }),
	// Anti-abuse fingerprints
	cardSignature: varchar('card_signature', { length: 200 }),
	cardLast4: varchar('card_last4', { length: 4 }),
	cardBrand: varchar('card_brand', { length: 50 }),
	phoneNumber: text('phone_number'), // hashed
	deviceFingerprint: text('device_fingerprint'),
	cancelledAt: timestamp('cancelled_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY ADD-ONS — +$5/month unlocks up to 8 profiles
// ─────────────────────────────────────────────────────────────────────────────
export const familyAddons = pgTable('family_addons', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	subscriptionId: text('subscription_id').notNull().references(() => paystackSubscriptions.id, { onDelete: 'cascade' }),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	maxProfiles: integer('max_profiles').default(8),
	status: varchar('status', { length: 20 }).notNull().default('active'), // active | cancelled
	paystackAuthorizationCode: varchar('paystack_authorization_code', { length: 100 }),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// TRIAL BLACKLIST — anti-abuse: blocks re-use of same card/phone/device
// ─────────────────────────────────────────────────────────────────────────────
export const trialBlacklist = pgTable('trial_blacklist', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	cardSignature: varchar('card_signature', { length: 200 }).unique(),
	phoneHash: text('phone_hash'),
	deviceFingerprint: text('device_fingerprint'),
	reason: text('reason'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// PAYSTACK EVENTS — webhook idempotency. Insert event_id before processing;
// unique violation = retry → ack without re-processing.
// ─────────────────────────────────────────────────────────────────────────────
export const paystackEvents = pgTable('paystack_events', {
	eventId: text('event_id').primaryKey(),
	eventType: varchar('event_type', { length: 80 }).notNull(),
	receivedAt: timestamp('received_at').defaultNow().notNull(),
	payload: jsonb('payload')
});

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT INTENTS — server-side record of what user agreed to pay BEFORE
// hitting Paystack. The verify endpoint validates the Paystack response
// against the matching intent, instead of trusting client-controlled metadata.
// ─────────────────────────────────────────────────────────────────────────────
export const paymentIntents = pgTable('payment_intents', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	reference: varchar('reference', { length: 100 }).notNull().unique(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	kind: varchar('kind', { length: 30 }).notNull(), // subscription | ppv | family_addon | renewal
	plan: varchar('plan', { length: 20 }),
	amountCents: integer('amount_cents').notNull(),
	currency: varchar('currency', { length: 10 }).notNull().default('usd'),
	addFamily: boolean('add_family').notNull().default(false),
	isTrial: boolean('is_trial').notNull().default(false),
	contentId: text('content_id'),
	status: varchar('status', { length: 20 }).notNull().default('pending'), // pending | consumed | expired
	consumedAt: timestamp('consumed_at'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS — webinars, workshops, conferences, AMAs. Powers /webinars (public
// audience) and /creator/events (creator audience).
// ─────────────────────────────────────────────────────────────────────────────
export const events = pgTable('events', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description'),
	speaker: varchar('speaker', { length: 255 }),
	speakerRole: varchar('speaker_role', { length: 255 }),
	kind: varchar('kind', { length: 30 }).notNull().default('webinar'),
	track: varchar('track', { length: 30 }),
	audience: varchar('audience', { length: 20 }).notNull().default('public'),
	startsAt: timestamp('starts_at').notNull(),
	endsAt: timestamp('ends_at'),
	durationMinutes: integer('duration_minutes'),
	location: text('location'),
	capacity: integer('capacity'),
	meetingUrl: text('meeting_url'),
	recordingUrl: text('recording_url'),
	status: varchar('status', { length: 20 }).notNull().default('scheduled'),
	createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const eventRegistrations = pgTable('event_registrations', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	status: varchar('status', { length: 20 }).notNull().default('confirmed'),
	reminderSentAt: timestamp('reminder_sent_at'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATOR FOLLOWERS — `user_id` follows `creator_id`. Surfaces follow buttons,
// follower-count badges, and the followerGrowth30d metric in AI insights.
// ─────────────────────────────────────────────────────────────────────────────
export const creatorFollowers = pgTable('creator_followers', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text('creator_id').notNull().references(() => creators.id, { onDelete: 'cascade' }),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	status: varchar('status', { length: 20 }).notNull().default('active'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// STC STAKES — snapshot of on-chain stakes maintained by the staking indexer
// cron (api/cron/staking-indexer). One row per address that has ever staked.
// `amount` is the current stake (0 if unstaked). `discountTier` is what
// admin tokenomics aggregates by.
// ─────────────────────────────────────────────────────────────────────────────
export const stcStakes = pgTable('stc_stakes', {
	userAddress: varchar('user_address', { length: 64 }).primaryKey(),
	amount: text('amount').notNull().default('0'),
	stakingTime: integer('staking_time').notNull().default(0),
	lockPeriod: integer('lock_period').notNull().default(0),
	discountTier: integer('discount_tier').notNull().default(0),
	isUnlocked: boolean('is_unlocked').notNull().default(true),
	lastSyncedAt: timestamp('last_synced_at').defaultNow().notNull()
});

// Single-row state table used by long-running cron workers to remember where
// they left off (last indexed block, last run timestamp, etc.) keyed by job.
export const cronState = pgTable('cron_state', {
	jobKey: varchar('job_key', { length: 80 }).primaryKey(),
	lastBlock: text('last_block'),
	lastRunAt: timestamp('last_run_at'),
	notes: text('notes')
});

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER SUBSCRIPTIONS — creator newsletter signup + future general lists
// ─────────────────────────────────────────────────────────────────────────────
export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	email: varchar('email', { length: 320 }).notNull(),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	audience: varchar('audience', { length: 30 }).notNull().default('creator'),
	preferences: jsonb('preferences').$type<Record<string, boolean>>(),
	status: varchar('status', { length: 20 }).notNull().default('active'),
	unsubscribeToken: text('unsubscribe_token').notNull().default(sql`gen_random_uuid()::text`),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// REFUNDS — admin-issued refund audit log
// ─────────────────────────────────────────────────────────────────────────────
export const refunds = pgTable('refunds', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	reference: varchar('reference', { length: 100 }).notNull(),
	amountCents: integer('amount_cents').notNull(),
	currency: varchar('currency', { length: 10 }).notNull().default('usd'),
	reason: text('reason'),
	issuedBy: text('issued_by').notNull().references(() => user.id),
	paystackResponse: jsonb('paystack_response'),
	status: varchar('status', { length: 20 }).notNull().default('pending'), // pending | success | failed
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// PPV CONTENT — pay-per-view pricing on content
// ─────────────────────────────────────────────────────────────────────────────
export const ppvContent = pgTable('ppv_content', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	contentId: text('content_id').notNull().references(() => mediaLibrary.id, { onDelete: 'cascade' }),
	suggestedPriceCents: integer('suggested_price_cents'), // from creator
	finalPriceCents: integer('final_price_cents').notNull(), // set by admin
	currency: varchar('currency', { length: 10 }).default('usd'),
	isActive: boolean('is_active').default(false),
	creatorNote: text('creator_note'),
	adminApprovedAt: timestamp('admin_approved_at'),
	adminApprovedBy: text('admin_approved_by').references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// PPV PURCHASES — record of what each user has unlocked
// ─────────────────────────────────────────────────────────────────────────────
export const ppvPurchases = pgTable('ppv_purchases', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	contentId: text('content_id').notNull().references(() => mediaLibrary.id),
	amountPaidCents: integer('amount_paid_cents').notNull(),
	currency: varchar('currency', { length: 10 }).default('usd'),
	paystackReference: varchar('paystack_reference', { length: 100 }),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA WATCH PROGRESS — profile-scoped progress for mediaLibrary items
// ─────────────────────────────────────────────────────────────────────────────
export const mediaWatchProgress = pgTable('media_watch_progress', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	profileId: text('profile_id').references(() => profiles.id, { onDelete: 'cascade' }),
	contentId: text('content_id').notNull().references(() => mediaLibrary.id, { onDelete: 'cascade' }),
	contentType: varchar('content_type', { length: 20 }).default('movie'), // movie | show | documentary
	episodeId: text('episode_id').references(() => episodes.id),
	positionSeconds: integer('position_seconds').default(0),
	durationSeconds: integer('duration_seconds'),
	completionPercent: integer('completion_percent').default(0),
	isCompleted: boolean('is_completed').default(false),
	watchedAt: timestamp('watched_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// PLAYLISTS + WATCHLISTS
// ─────────────────────────────────────────────────────────────────────────────
export const playlists = pgTable('playlists', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	profileId: text('profile_id').references(() => profiles.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 200 }).notNull().default('My List'),
	description: text('description'),
	isDefault: boolean('is_default').default(false), // the auto "My List" playlist
	isPublic: boolean('is_public').default(false),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const playlistItems = pgTable('playlist_items', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	playlistId: text('playlist_id').notNull().references(() => playlists.id, { onDelete: 'cascade' }),
	contentId: text('content_id').notNull().references(() => mediaLibrary.id, { onDelete: 'cascade' }),
	contentType: varchar('content_type', { length: 20 }).default('movie'),
	sortOrder: integer('sort_order').default(0),
	addedAt: timestamp('added_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS + RATINGS
// ─────────────────────────────────────────────────────────────────────────────
export const reviews = pgTable('reviews', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	profileId: text('profile_id').references(() => profiles.id),
	contentId: text('content_id').notNull().references(() => mediaLibrary.id, { onDelete: 'cascade' }),
	contentType: varchar('content_type', { length: 20 }).default('movie'),
	rating: integer('rating').notNull(), // 1–5
	reviewText: text('review_text'),
	isApproved: boolean('is_approved').default(false), // admin moderated
	helpfulCount: integer('helpful_count').default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const reviewHelpful = pgTable('review_helpful', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	reviewId: text('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	isHelpful: boolean('is_helpful').notNull().default(true),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────
export const notificationPreferences = pgTable('notification_preferences', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }).unique(),
	newReleases: boolean('new_releases').default(true),
	trialExpiry: boolean('trial_expiry').default(true),
	paymentConfirmation: boolean('payment_confirmation').default(true),
	weeklyDigest: boolean('weekly_digest').default(false),
	creatorUpdates: boolean('creator_updates').default(false),
	eventReminders: boolean('event_reminders').default(true),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// STREAKS
// ─────────────────────────────────────────────────────────────────────────────
export const streaks = pgTable('streaks', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }).unique(),
	profileId: text('profile_id').references(() => profiles.id),
	currentStreak: integer('current_streak').default(0),
	longestStreak: integer('longest_streak').default(0),
	lastWatchDate: timestamp('last_watch_date'),
	streakStartDate: timestamp('streak_start_date'),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// ACHIEVEMENTS (seed catalogue) + USER ACHIEVEMENTS (earned records)
// ─────────────────────────────────────────────────────────────────────────────
export const achievements = pgTable('achievements', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	code: varchar('code', { length: 100 }).notNull().unique(),
	name: varchar('name', { length: 200 }).notNull(),
	description: text('description'),
	icon: varchar('icon', { length: 50 }),
	stcReward: integer('stc_reward').default(0),
	category: varchar('category', { length: 50 }) // watch | streak | social | token
});

export const userAchievements = pgTable('user_achievements', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	profileId: text('profile_id').references(() => profiles.id),
	achievementCode: varchar('achievement_code', { length: 100 }).notNull().references(() => achievements.code),
	stcAwarded: boolean('stc_awarded').default(false),
	earnedAt: timestamp('earned_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// USER MILESTONES (STC-linked personal milestones)
// ─────────────────────────────────────────────────────────────────────────────
export const userMilestones = pgTable('user_milestones', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	code: varchar('code', { length: 100 }).notNull(), // e.g. stc_100, stc_500, stake_first, year_1
	name: varchar('name', { length: 200 }).notNull(),
	description: text('description'),
	stcBonus: integer('stc_bonus').default(0),
	earnedAt: timestamp('earned_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// KIDS QUIZ SESSIONS
// ─────────────────────────────────────────────────────────────────────────────
export const quizSessions = pgTable('quiz_sessions', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	profileId: text('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
	contentId: text('content_id').references(() => mediaLibrary.id),
	questions: jsonb('questions').$type<{ question: string; options: string[]; correctIndex: number }[]>(),
	answers: jsonb('answers').$type<number[]>(),
	score: integer('score'),
	completedAt: timestamp('completed_at'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const bibleStoryProgress = pgTable('bible_story_progress', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	profileId: text('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
	contentId: text('content_id').references(() => mediaLibrary.id),
	isCompleted: boolean('is_completed').default(false),
	lastReadPage: integer('last_read_page').default(0),
	stcEarned: boolean('stc_earned').default(false),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// PARENTAL REPORTS
// ─────────────────────────────────────────────────────────────────────────────
export const parentalReports = pgTable('parental_reports', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	parentProfileId: text('parent_profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
	childProfileId: text('child_profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
	reportDate: timestamp('report_date').defaultNow().notNull(),
	totalWatchTimeSeconds: integer('total_watch_time_seconds').default(0),
	contentWatched: jsonb('content_watched').$type<{ contentId: string; title: string; durationSeconds: number }[]>(),
	generatedAt: timestamp('generated_at').defaultNow().notNull()
});

export const governanceProposals = pgTable('governance_proposals', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(),
	type: varchar('type', { length: 40 }).notNull(),
	payload: jsonb('payload').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
	createdBy: text('created_by').notNull().references(() => user.id, { onDelete: 'cascade' }),
	createdByName: varchar('created_by_name', { length: 255 }).notNull(),
	status: varchar('status', { length: 30 }).notNull().default('submitted'),
	riskLevel: varchar('risk_level', { length: 10 }).notNull().default('low'),
	guardrailWarnings: jsonb('guardrail_warnings').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
	requiredApprovals: integer('required_approvals').notNull().default(4),
	eta: timestamp('eta'),
	executedAt: timestamp('executed_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const governanceProposalApprovals = pgTable('governance_proposal_approvals', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	proposalId: text('proposal_id').notNull().references(() => governanceProposals.id, { onDelete: 'cascade' }),
	actorId: text('actor_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	actorName: varchar('actor_name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const governancePauseEvents = pgTable('governance_pause_events', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	reason: text('reason').notNull(),
	triggeredBy: text('triggered_by').notNull().references(() => user.id, { onDelete: 'cascade' }),
	triggeredByName: varchar('triggered_by_name', { length: 255 }).notNull(),
	triggeredAt: timestamp('triggered_at').defaultNow().notNull(),
	active: boolean('active').notNull().default(true),
	resolvedAt: timestamp('resolved_at')
});

export const governanceAuditEntries = pgTable('governance_audit_entries', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	proposalId: text('proposal_id').references(() => governanceProposals.id, { onDelete: 'set null' }),
	action: varchar('action', { length: 40 }).notNull(),
	actorId: text('actor_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	actorName: varchar('actor_name', { length: 255 }).notNull(),
	note: text('note').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const governanceMemberships = pgTable('governance_memberships', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }).unique(),
	label: varchar('label', { length: 100 }).notNull().default('governance_admin'),
	permissions: jsonb('permissions').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
	active: boolean('active').notNull().default(true),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ADMIN MESSAGES + TEMPLATES
export const adminMessages = pgTable('admin_messages', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	contentId: text('content_id').references(() => mediaLibrary.id, { onDelete: 'set null' }),
	creatorId: text('creator_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	adminId: text('admin_id').references(() => user.id, { onDelete: 'set null' }),
	subject: text('subject').notNull(),
	message: text('message').notNull(),
	type: varchar('type', { length: 30 }).notNull().default('general'),
	status: varchar('status', { length: 20 }).notNull().default('sent'),
	isFromAdmin: boolean('is_from_admin').notNull().default(true),
	attachments: jsonb('attachments').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const adminMessageTemplates = pgTable('admin_message_templates', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	name: text('name').notNull(),
	subject: text('subject').notNull(),
	content: text('content').notNull(),
	type: varchar('type', { length: 30 }).notNull().default('general'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ADMIN POLICIES
export const adminPolicies = pgTable('admin_policies', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	title: text('title').notNull(),
	category: varchar('category', { length: 40 }).notNull(),
	description: text('description').notNull(),
	requirements: jsonb('requirements').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
	violations: jsonb('violations').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
	severity: varchar('severity', { length: 20 }).notNull().default('medium'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ADMIN WORKFLOW RULES
export const adminWorkflowRules = pgTable('admin_workflow_rules', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	name: text('name').notNull(),
	description: text('description').notNull(),
	conditions: jsonb('conditions').$type<{ field: string; operator: string; value: string }[]>().notNull().default(sql`'[]'::jsonb`),
	actions: jsonb('actions').$type<{ type: string; target: string; value: string }[]>().notNull().default(sql`'[]'::jsonb`),
	isActive: boolean('is_active').notNull().default(true),
	priority: integer('priority').notNull().default(5),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ADMIN SETTINGS
export const adminSettings = pgTable('admin_settings', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	platform: jsonb('platform').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
	payment: jsonb('payment').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
	notifications: jsonb('notifications').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
	security: jsonb('security').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ADMIN TOKENOMICS SETTINGS
export const adminTokenomicsSettings = pgTable('admin_tokenomics_settings', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	revenueDistribution: jsonb('revenue_distribution').$type<Record<string, number>>().notNull().default(sql`'{}'::jsonb`),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ─────────────────────────────────────────────────────────────────────────────
// In-app notifications. Frontend reads via /api/notifications and renders in
// NotificationCenter.svelte. Each row is per-user; opt-in flags live in the
// existing notificationPreferences table and gate the email side-effect.
// ─────────────────────────────────────────────────────────────────────────────
export const notifications = pgTable('notifications', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	kind: varchar('kind', { length: 40 }).notNull(),       // 'subscription' | 'creator_application' | 'content_publish' | 'achievement' | etc.
	title: text('title').notNull(),
	message: text('message').notNull(),
	actionUrl: text('action_url'),                          // optional deep-link
	read: boolean('read').notNull().default(false),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	userCreatedIdx: index('notifications_user_created_idx').on(t.userId, t.createdAt)
}));

// ─────────────────────────────────────────────────────────────────────────────
// Content shares — append-only log of share events. Powers `totalShares` in
// creator analytics and lets us spot virality patterns later. One row per
// click on the share button (anonymous users get a null userId).
// ─────────────────────────────────────────────────────────────────────────────
export const contentShares = pgTable('content_shares', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	contentId: text('content_id').notNull(),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	channel: varchar('channel', { length: 30 }).notNull().default('link'), // 'link' | 'twitter' | 'facebook' | 'whatsapp' | 'email' | 'native'
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	contentIdx: index('content_shares_content_idx').on(t.contentId, t.createdAt)
}));

// ─────────────────────────────────────────────────────────────────────────────
// Per-row capture of device + country at watch-progress write time. Lets the
// analytics endpoint aggregate `viewsByDevice` and `topCountries` without
// triggering a per-row UA/IP parse on every read. Population is best-effort —
// rows without a header still get inserted (just with NULLs).
// ─────────────────────────────────────────────────────────────────────────────
export const watchSessionMeta = pgTable('watch_session_meta', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
	contentId: text('content_id').notNull(),
	deviceType: varchar('device_type', { length: 20 }),  // 'mobile' | 'tablet' | 'desktop' | 'tv' | 'bot'
	browser: varchar('browser', { length: 40 }),
	osName: varchar('os_name', { length: 40 }),
	country: varchar('country', { length: 2 }),          // ISO-3166-1 alpha-2
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	contentIdx: index('watch_session_meta_content_idx').on(t.contentId, t.createdAt),
	deviceIdx: index('watch_session_meta_device_idx').on(t.contentId, t.deviceType)
}));

// ─────────────────────────────────────────────────────────────────────────────
// Web Push subscriptions. Each row is one browser/device registration —
// users can have many (laptop + phone). When a notify() targets a user we
// look up active subscriptions here and dispatch via web-push.
// ─────────────────────────────────────────────────────────────────────────────
export const pushSubscriptions = pgTable('push_subscriptions', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	endpoint: text('endpoint').notNull(),
	p256dh: text('p256dh').notNull(),
	auth: text('auth').notNull(),
	userAgent: text('user_agent'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	lastSeenAt: timestamp('last_seen_at').defaultNow().notNull()
}, (t) => ({
	userIdx: index('push_subscriptions_user_idx').on(t.userId),
	endpointIdx: index('push_subscriptions_endpoint_idx').on(t.endpoint)
}));

// ─────────────────────────────────────────────────────────────────────────────
// Success stories — testimonies submitted by creators about content impact.
// Admin moderates before publishing to /creator/success-stories.
// ─────────────────────────────────────────────────────────────────────────────
export const successStories = pgTable('success_stories', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	name: varchar('name', { length: 120 }).notNull(),
	channel: varchar('channel', { length: 160 }),
	story: text('story').notNull(),
	status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'approved' | 'rejected'
	moderationNote: text('moderation_note'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	reviewedAt: timestamp('reviewed_at')
});

// ─────────────────────────────────────────────────────────────────────────────
// Sponsorship intake — creators pitch content concepts for studio sponsorship.
// Admin reviews via the admin panel.
// ─────────────────────────────────────────────────────────────────────────────
export const sponsorshipApplications = pgTable('sponsorship_applications', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	projectTitle: varchar('project_title', { length: 255 }).notNull(),
	genre: varchar('genre', { length: 60 }),
	synopsis: text('synopsis').notNull(),
	requestedAmount: integer('requested_amount'),
	timelineMonths: integer('timeline_months'),
	contactEmail: varchar('contact_email', { length: 320 }),
	documents: jsonb('documents').$type<Array<{ kind: string; url: string; name: string; size?: number }>>(),
	status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending' | 'reviewing' | 'approved' | 'rejected'
	adminNote: text('admin_note'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	reviewedAt: timestamp('reviewed_at')
});

// ─────────────────────────────────────────────────────────────────────────────
// SUPPORT TICKETS — backs /creator/tech-support submissions. Admin reviews
// via /admin/submissions.
// ─────────────────────────────────────────────────────────────────────────────
export const supportTickets = pgTable('support_tickets', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	email: varchar('email', { length: 320 }).notNull(),
	subject: varchar('subject', { length: 255 }).notNull(),
	category: varchar('category', { length: 40 }),
	priority: varchar('priority', { length: 20 }).notNull().default('normal'),  // 'low' | 'normal' | 'high' | 'urgent'
	description: text('description').notNull(),
	attachments: jsonb('attachments').$type<Array<{ id: string; url: string; name: string; size?: number }>>(),
	status: varchar('status', { length: 20 }).notNull().default('open'), // 'open' | 'in_progress' | 'resolved' | 'closed'
	adminResponse: text('admin_response'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	resolvedAt: timestamp('resolved_at')
}, (t) => ({
	statusCreatedIdx: index('support_tickets_status_created_idx').on(t.status, t.createdAt)
}));

// ─────────────────────────────────────────────────────────────────────────────
// CREATOR FORUM — threads + nested replies + likes. AI-moderated on submit.
// Soft-delete via `status='removed'`. Admin can sticky/lock/hide.
// ─────────────────────────────────────────────────────────────────────────────
export const forumThreads = pgTable('forum_threads', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	authorId: text('author_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 255 }).notNull(),
	category: varchar('category', { length: 40 }).notNull(),
	body: text('body').notNull(),
	isSticky: boolean('is_sticky').notNull().default(false),
	isLocked: boolean('is_locked').notNull().default(false),
	likeCount: integer('like_count').notNull().default(0),
	replyCount: integer('reply_count').notNull().default(0),
	lastReplyAt: timestamp('last_reply_at'),
	status: varchar('status', { length: 20 }).notNull().default('published'), // 'published' | 'hidden' | 'removed'
	moderationNote: text('moderation_note'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (t) => ({
	categoryActivityIdx: index('forum_threads_category_activity_idx').on(t.category, t.lastReplyAt)
}));

export const forumReplies = pgTable('forum_replies', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	threadId: text('thread_id').notNull().references(() => forumThreads.id, { onDelete: 'cascade' }),
	authorId: text('author_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	parentReplyId: text('parent_reply_id'),  // self-ref enforced at SQL level (FK added in migration)
	body: text('body').notNull(),
	likeCount: integer('like_count').notNull().default(0),
	status: varchar('status', { length: 20 }).notNull().default('published'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (t) => ({
	threadCreatedIdx: index('forum_replies_thread_created_idx').on(t.threadId, t.createdAt)
}));

export const forumLikes = pgTable('forum_likes', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	threadId: text('thread_id'),
	replyId: text('reply_id'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Abuse reports — universal moderation queue. One table targets any
// moderatable entity (review, forum thread/reply, content, user) so the
// reporter UX and the admin queue are uniform. (Item 1A)
export const abuseReports = pgTable('abuse_reports', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	reporterId: text('reporter_id').references(() => user.id, { onDelete: 'set null' }),
	targetType: varchar('target_type', { length: 20 }).notNull(),
	targetId: text('target_id').notNull(),
	category: varchar('category', { length: 40 }).notNull(),
	description: text('description'),
	status: varchar('status', { length: 20 }).default('open').notNull(),
	resolution: varchar('resolution', { length: 40 }),
	resolvedBy: text('resolved_by').references(() => user.id),
	resolvedAt: timestamp('resolved_at'),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	statusIdx: index('abuse_reports_status_idx').on(t.status),
	targetIdx: index('abuse_reports_target_idx').on(t.targetType, t.targetId)
}));

// Creator payouts. Supersedes the loose `transactions` rows with
// `type='creator_payout'` once the read path is migrated. Branches by
// processor (paystack | stripe). (Item 4A)
export const payouts = pgTable('payouts', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text('creator_id').notNull().references(() => creators.id),
	processor: varchar('processor', { length: 20 }).notNull(),
	processorPayoutId: text('processor_payout_id'),
	periodStart: timestamp('period_start').notNull(),
	periodEnd: timestamp('period_end').notNull(),
	grossCents: bigint('gross_cents', { mode: 'number' }).notNull(),
	platformFeeCents: bigint('platform_fee_cents', { mode: 'number' }).notNull(),
	netCents: bigint('net_cents', { mode: 'number' }).notNull(),
	currency: varchar('currency', { length: 3 }).notNull(),
	status: varchar('status', { length: 20 }).default('pending').notNull(),
	failureReason: text('failure_reason'),
	approvedBy: text('approved_by').references(() => user.id),
	approvedAt: timestamp('approved_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	paidAt: timestamp('paid_at'),
	// Reserve hold (Payouts 4C). When set, the payout cron skips this row
	// until `held_until` passes. Used to cover dispute window + chargebacks.
	heldUntil: timestamp('held_until')
}, (t) => ({
	creatorIdx: index('payouts_creator_idx').on(t.creatorId),
	statusIdx: index('payouts_status_idx').on(t.status)
}));

// Payout disputes (Payouts 4C). Created by Stripe webhook on
// `charge.dispute.created`; closed by `charge.dispute.closed`.
export const payoutDisputes = pgTable('payout_disputes', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	processor: varchar('processor', { length: 20 }).notNull(),       // 'stripe' | 'paystack'
	processorDisputeId: text('processor_dispute_id').notNull().unique(),
	payoutId: text('payout_id').references(() => payouts.id),
	ppvPurchaseId: text('ppv_purchase_id'),
	amountCents: bigint('amount_cents', { mode: 'number' }).notNull(),
	currency: varchar('currency', { length: 3 }).notNull(),
	reason: varchar('reason', { length: 60 }),
	status: varchar('status', { length: 20 }).default('open').notNull(),
	// 'open' | 'won' | 'lost' | 'withdrawn' | 'warning_closed'
	evidenceDueAt: timestamp('evidence_due_at'),
	rawPayload: jsonb('raw_payload'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	closedAt: timestamp('closed_at')
}, (t) => ({
	statusIdx: index('payout_disputes_status_idx').on(t.status),
	payoutIdx: index('payout_disputes_payout_idx').on(t.payoutId)
}));

// Tax forms (Payouts 4B). One row per creator + form_kind + tax_year.
// W-9 (US persons), W-8BEN (foreign individuals), W-8BEN-E (foreign
// entities). Sensitive fields (TIN/SSN) are stored encrypted at the
// application layer before insert; this column is jsonb just so we can
// roundtrip the form schema.
export const taxForms = pgTable('tax_forms', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text('creator_id').notNull().references(() => creators.id, { onDelete: 'cascade' }),
	formKind: varchar('form_kind', { length: 20 }).notNull(),
	// 'W-9' | 'W-8BEN' | 'W-8BEN-E'
	taxYear: integer('tax_year').notNull(),
	formData: jsonb('form_data').notNull(),
	status: varchar('status', { length: 20 }).default('submitted').notNull(),
	// 'submitted' | 'verified' | 'rejected' | 'expired'
	verifiedBy: text('verified_by').references(() => user.id),
	verifiedAt: timestamp('verified_at'),
	rejectionReason: text('rejection_reason'),
	pdfUrl: text('pdf_url'),
	submittedAt: timestamp('submitted_at').defaultNow().notNull()
}, (t) => ({
	creatorIdx: index('tax_forms_creator_idx').on(t.creatorId, t.taxYear),
	statusIdx: index('tax_forms_status_idx').on(t.status)
}));

// 1099 forms (Payouts 4B). Generated annually for US creators (with W-9
// on file) whose total annual earnings ≥ $600. PDF rendered + uploaded
// to MinIO; URL stored here.
export const tax1099Forms = pgTable('tax_1099_forms', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	creatorId: text('creator_id').notNull().references(() => creators.id, { onDelete: 'cascade' }),
	taxYear: integer('tax_year').notNull(),
	totalPaidCents: bigint('total_paid_cents', { mode: 'number' }).notNull(),
	pdfUrl: text('pdf_url'),
	emailedAt: timestamp('emailed_at'),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	creatorIdx: index('tax_1099_forms_creator_idx').on(t.creatorId, t.taxYear)
}));

// A/B thumbnail testing — multiple poster variants per content with
// impression + click counters. The rotation helper picks one per (user,
// content) deterministically. Promoting a winner copies its URL into
// mediaLibrary.thumbnail.
export const contentThumbnailVariants = pgTable('content_thumbnail_variants', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	contentId: text('content_id').notNull().references(() => mediaLibrary.id, { onDelete: 'cascade' }),
	url: text('url').notNull(),
	label: varchar('label', { length: 40 }),
	isActive: boolean('is_active').default(true).notNull(),
	isWinner: boolean('is_winner').default(false).notNull(),
	impressions: integer('impressions').default(0).notNull(),
	clicks: integer('clicks').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	// Auto-promote timestamp. Set by the cron when a winner emerges with
	// statistical significance (see lib/server/ab-promote.ts).
	promotedAt: timestamp('promoted_at')
}, (t) => ({
	contentIdx: index('content_thumbnail_variants_content_idx').on(t.contentId)
}));

// Copilot conversations + messages (R+3 — AI Layer 2). One conversation
// per chat session per user. Messages store the rolling transcript so the
// Copilot can resume across page navigations.
export const copilotConversations = pgTable('copilot_conversations', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	variant: varchar('variant', { length: 10 }).notNull(),
	title: text('title'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (t) => ({
	userIdx: index('copilot_conversations_user_idx').on(t.userId, t.updatedAt)
}));

export const copilotMessages = pgTable('copilot_messages', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	conversationId: text('conversation_id').notNull().references(() => copilotConversations.id, { onDelete: 'cascade' }),
	role: varchar('role', { length: 20 }).notNull(),
	content: text('content').notNull(),
	toolName: varchar('tool_name', { length: 60 }),
	toolInput: jsonb('tool_input').$type<Record<string, unknown>>(),
	toolOutput: jsonb('tool_output').$type<Record<string, unknown>>(),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	convoIdx: index('copilot_messages_convo_idx').on(t.conversationId, t.createdAt)
}));

// AI tool-call audit (R+3). Every mutating tool call logs here so admins
// can answer "the AI did what?" later.
export const aiActionLog = pgTable('ai_action_log', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	conversationId: text('conversation_id'),
	tool: varchar('tool', { length: 60 }).notNull(),
	input: jsonb('input').$type<Record<string, unknown>>(),
	output: jsonb('output').$type<Record<string, unknown>>(),
	approved: boolean('approved').default(false).notNull(),
	executedAt: timestamp('executed_at'),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	userIdx: index('ai_action_log_user_idx').on(t.userId, t.createdAt),
	toolIdx: index('ai_action_log_tool_idx').on(t.tool)
}));

// AI Layer 3 agent runs (R+4). One row per autonomous agent invocation.
// `summary` is a short human-readable description for the admin run list.
export const agentRuns = pgTable('agent_runs', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	agent: varchar('agent', { length: 60 }).notNull(),
	status: varchar('status', { length: 20 }).default('running').notNull(),
	startedAt: timestamp('started_at').defaultNow().notNull(),
	finishedAt: timestamp('finished_at'),
	steps: integer('steps').default(0).notNull(),
	costCents: integer('cost_cents').default(0).notNull(),
	itemsProcessed: integer('items_processed').default(0).notNull(),
	itemsActioned: integer('items_actioned').default(0).notNull(),
	summary: text('summary'),
	error: text('error')
}, (t) => ({
	agentIdx: index('agent_runs_agent_idx').on(t.agent, t.startedAt),
	statusIdx: index('agent_runs_status_idx').on(t.status)
}));

// AI Layer 1 call audit (R+2). One row per inline-AI call. Drives the
// admin "AI usage" view and powers the per-user monthly budget cap.
export const aiCallLog = pgTable('ai_call_log', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
	surface: varchar('surface', { length: 60 }).notNull(),
	model: varchar('model', { length: 80 }),
	provider: varchar('provider', { length: 20 }),
	tokensIn: integer('tokens_in').default(0).notNull(),
	tokensOut: integer('tokens_out').default(0).notNull(),
	costCents: integer('cost_cents').default(0).notNull(),
	latencyMs: integer('latency_ms').default(0).notNull(),
	ok: boolean('ok').default(true).notNull(),
	error: text('error'),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
	userIdx: index('ai_call_log_user_idx').on(t.userId, t.createdAt),
	surfaceIdx: index('ai_call_log_surface_idx').on(t.surface)
}));
