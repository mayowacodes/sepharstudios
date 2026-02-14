import { pgTable, text, timestamp, varchar, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

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
	bio: text('bio'),
	avatarUrl: text('avatar_url'),
	bannerUrl: text('banner_url'),
	subscriberCount: integer('subscriber_count').default(0),
	totalViews: integer('total_views').default(0),
	totalEarnings: integer('total_earnings').default(0), // in tokens
	walletAddress: varchar('wallet_address', { length: 42 }),
	isVerified: boolean('is_verified').default(false),
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
	posterUrl: text('poster_url'),
	trailerUrl: text('trailer_url'),
	videoUrl: text('video_url'), // actual streaming link
	
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

	// Statistics
	viewCount: integer('view_count').default(0),
	voteAverage: varchar('vote_average', { length: 10 }),
	voteCount: varchar('vote_count', { length: 20 }),
	popularity: varchar('popularity', { length: 20 }),

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

// User table extension (add to existing user table)
import { user } from '../schema';
