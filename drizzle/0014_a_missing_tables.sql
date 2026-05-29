-- Fix migration: every table defined in apps/web/src/lib/db/schema/sepharstudios.ts
-- that was never captured by an earlier migration file (likely from a past
-- `drizzle-kit push` that mutated the DB without writing migrations).
--
-- Inserted between 0014 and 0015 so subsequent migrations can find these
-- tables for their indexes, constraints, and ALTER statements.
--
-- All idempotent — IF NOT EXISTS throughout. Order is dependency-aware.

-- profiles
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"name" varchar(100) NOT NULL,
	"type" varchar(20) DEFAULT 'adult' NOT NULL,
	"avatar_color" varchar(20),
	"avatar_emoji" varchar(10),
	"pin" text,
	"pin_set_at" timestamp,
	"content_rating" varchar(10) DEFAULT 'all',
	"safe_mode_enabled" boolean DEFAULT false,
	"is_kids_mode" boolean DEFAULT false,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- paystack_subscriptions
CREATE TABLE IF NOT EXISTS "paystack_subscriptions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"plan" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'trial' NOT NULL,
	"trial_start_date" timestamp,
	"trial_end_date" timestamp,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"max_profiles" integer DEFAULT 1 NOT NULL,
	"kids_allowed" boolean DEFAULT false NOT NULL,
	"next_charge_at" timestamp,
	"failed_attempts" integer DEFAULT 0 NOT NULL,
	"last_charge_attempt_at" timestamp,
	"paystack_customer_code" varchar(100),
	"paystack_subscription_code" varchar(100) UNIQUE,
	"paystack_authorization_code" varchar(100),
	"card_signature" varchar(200),
	"card_last4" varchar(4),
	"card_brand" varchar(50),
	"phone_number" text,
	"device_fingerprint" text,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- family_addons
CREATE TABLE IF NOT EXISTS "family_addons" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" text NOT NULL REFERENCES "paystack_subscriptions"("id") ON DELETE CASCADE,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"max_profiles" integer DEFAULT 8,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"paystack_authorization_code" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- trial_blacklist
CREATE TABLE IF NOT EXISTS "trial_blacklist" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"card_signature" varchar(200) UNIQUE,
	"phone_hash" text,
	"device_fingerprint" text,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- media_watch_progress
CREATE TABLE IF NOT EXISTS "media_watch_progress" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"profile_id" text REFERENCES "profiles"("id") ON DELETE CASCADE,
	"content_id" text NOT NULL REFERENCES "media_library"("id") ON DELETE CASCADE,
	"content_type" varchar(20) DEFAULT 'movie',
	"episode_id" text REFERENCES "episodes"("id"),
	"position_seconds" integer DEFAULT 0,
	"duration_seconds" integer,
	"completion_percent" integer DEFAULT 0,
	"is_completed" boolean DEFAULT false,
	"watched_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- playlists
CREATE TABLE IF NOT EXISTS "playlists" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"profile_id" text REFERENCES "profiles"("id") ON DELETE CASCADE,
	"name" varchar(200) DEFAULT 'My List' NOT NULL,
	"description" text,
	"is_default" boolean DEFAULT false,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- playlist_items
CREATE TABLE IF NOT EXISTS "playlist_items" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playlist_id" text NOT NULL REFERENCES "playlists"("id") ON DELETE CASCADE,
	"content_id" text NOT NULL REFERENCES "media_library"("id") ON DELETE CASCADE,
	"content_type" varchar(20) DEFAULT 'movie',
	"sort_order" integer DEFAULT 0,
	"added_at" timestamp DEFAULT now() NOT NULL
);

-- reviews
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"profile_id" text REFERENCES "profiles"("id"),
	"content_id" text NOT NULL REFERENCES "media_library"("id") ON DELETE CASCADE,
	"content_type" varchar(20) DEFAULT 'movie',
	"rating" integer NOT NULL,
	"review_text" text,
	"is_approved" boolean DEFAULT false,
	"helpful_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- review_helpful
CREATE TABLE IF NOT EXISTS "review_helpful" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" text NOT NULL REFERENCES "reviews"("id") ON DELETE CASCADE,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"is_helpful" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- notification_preferences
CREATE TABLE IF NOT EXISTS "notification_preferences" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
	"new_releases" boolean DEFAULT true,
	"trial_expiry" boolean DEFAULT true,
	"payment_confirmation" boolean DEFAULT true,
	"weekly_digest" boolean DEFAULT false,
	"creator_updates" boolean DEFAULT false,
	"event_reminders" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- streaks
CREATE TABLE IF NOT EXISTS "streaks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
	"profile_id" text REFERENCES "profiles"("id"),
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_watch_date" timestamp,
	"streak_start_date" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- achievements
CREATE TABLE IF NOT EXISTS "achievements" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(100) NOT NULL UNIQUE,
	"name" varchar(200) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"stc_reward" integer DEFAULT 0,
	"category" varchar(50)
);

-- user_achievements
CREATE TABLE IF NOT EXISTS "user_achievements" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"profile_id" text REFERENCES "profiles"("id"),
	"achievement_code" varchar(100) NOT NULL REFERENCES "achievements"("code"),
	"stc_awarded" boolean DEFAULT false,
	"earned_at" timestamp DEFAULT now() NOT NULL
);

-- user_milestones
CREATE TABLE IF NOT EXISTS "user_milestones" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"code" varchar(100) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"stc_bonus" integer DEFAULT 0,
	"earned_at" timestamp DEFAULT now() NOT NULL
);

-- ppv_content
CREATE TABLE IF NOT EXISTS "ppv_content" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL REFERENCES "media_library"("id") ON DELETE CASCADE,
	"suggested_price_cents" integer,
	"final_price_cents" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'usd',
	"is_active" boolean DEFAULT false,
	"creator_note" text,
	"admin_approved_at" timestamp,
	"admin_approved_by" text REFERENCES "user"("id"),
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ppv_purchases
CREATE TABLE IF NOT EXISTS "ppv_purchases" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"content_id" text NOT NULL REFERENCES "media_library"("id"),
	"amount_paid_cents" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'usd',
	"paystack_reference" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- quiz_sessions
CREATE TABLE IF NOT EXISTS "quiz_sessions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" text NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
	"content_id" text REFERENCES "media_library"("id"),
	"questions" jsonb,
	"answers" jsonb,
	"score" integer,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- bible_story_progress
CREATE TABLE IF NOT EXISTS "bible_story_progress" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" text NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
	"content_id" text REFERENCES "media_library"("id"),
	"is_completed" boolean DEFAULT false,
	"last_read_page" integer DEFAULT 0,
	"stc_earned" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- parental_reports
CREATE TABLE IF NOT EXISTS "parental_reports" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_profile_id" text NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
	"child_profile_id" text NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
	"report_date" timestamp DEFAULT now() NOT NULL,
	"total_watch_time_seconds" integer DEFAULT 0,
	"content_watched" jsonb,
	"generated_at" timestamp DEFAULT now() NOT NULL
);
