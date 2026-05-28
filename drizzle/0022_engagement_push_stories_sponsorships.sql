-- content_shares: append-only share-button event log.
CREATE TABLE IF NOT EXISTS "content_shares" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL,
	"user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
	"channel" varchar(30) DEFAULT 'link' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "content_shares_content_idx" ON "content_shares" ("content_id", "created_at");

-- watch_session_meta: device + country captured at watch-progress write.
CREATE TABLE IF NOT EXISTS "watch_session_meta" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text REFERENCES "user"("id") ON DELETE CASCADE,
	"content_id" text NOT NULL,
	"device_type" varchar(20),
	"browser" varchar(40),
	"os_name" varchar(40),
	"country" varchar(2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "watch_session_meta_content_idx" ON "watch_session_meta" ("content_id", "created_at");
CREATE INDEX IF NOT EXISTS "watch_session_meta_device_idx" ON "watch_session_meta" ("content_id", "device_type");

-- push_subscriptions: one row per registered browser/device for Web Push.
CREATE TABLE IF NOT EXISTS "push_subscriptions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "push_subscriptions_user_idx" ON "push_subscriptions" ("user_id");
CREATE INDEX IF NOT EXISTS "push_subscriptions_endpoint_idx" ON "push_subscriptions" ("endpoint");

-- success_stories: testimonies submitted via /creator/success-stories.
CREATE TABLE IF NOT EXISTS "success_stories" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
	"name" varchar(120) NOT NULL,
	"channel" varchar(160),
	"story" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"moderation_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp
);

-- sponsorship_applications: content pitches submitted via /sponsorships.
CREATE TABLE IF NOT EXISTS "sponsorship_applications" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
	"project_title" varchar(255) NOT NULL,
	"genre" varchar(60),
	"synopsis" text NOT NULL,
	"requested_amount" integer,
	"timeline_months" integer,
	"contact_email" varchar(320),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"admin_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp
);
