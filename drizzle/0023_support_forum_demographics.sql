-- support_tickets: backs /creator/tech-support + /admin/submissions tickets tab.
CREATE TABLE IF NOT EXISTS "support_tickets" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
	"email" varchar(320) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"category" varchar(40),
	"priority" varchar(20) DEFAULT 'normal' NOT NULL,
	"description" text NOT NULL,
	"attachments" jsonb,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"admin_response" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
CREATE INDEX IF NOT EXISTS "support_tickets_status_created_idx" ON "support_tickets" ("status", "created_at");

-- forum_threads + replies + likes.
CREATE TABLE IF NOT EXISTS "forum_threads" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"title" varchar(255) NOT NULL,
	"category" varchar(40) NOT NULL,
	"body" text NOT NULL,
	"is_sticky" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"last_reply_at" timestamp,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"moderation_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "forum_threads_category_activity_idx" ON "forum_threads" ("category", "last_reply_at");

CREATE TABLE IF NOT EXISTS "forum_replies" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" text NOT NULL REFERENCES "forum_threads"("id") ON DELETE CASCADE,
	"author_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"parent_reply_id" text,
	"body" text NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "forum_replies_thread_created_idx" ON "forum_replies" ("thread_id", "created_at");

-- Self-ref FK for nested replies. Done as ALTER so the table create above stays portable.
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'forum_replies_parent_reply_id_fk'
	) THEN
		ALTER TABLE "forum_replies"
			ADD CONSTRAINT "forum_replies_parent_reply_id_fk"
			FOREIGN KEY ("parent_reply_id") REFERENCES "forum_replies"("id") ON DELETE CASCADE;
	END IF;
END $$;

CREATE TABLE IF NOT EXISTS "forum_likes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"thread_id" text REFERENCES "forum_threads"("id") ON DELETE CASCADE,
	"reply_id" text REFERENCES "forum_replies"("id") ON DELETE CASCADE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "forum_likes_target_check" CHECK ("thread_id" IS NOT NULL OR "reply_id" IS NOT NULL)
);
-- One like per user per target. Partial unique because either thread_id or reply_id is null.
CREATE UNIQUE INDEX IF NOT EXISTS "forum_likes_user_thread_unique" ON "forum_likes" ("user_id", "thread_id") WHERE "thread_id" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "forum_likes_user_reply_unique" ON "forum_likes" ("user_id", "reply_id") WHERE "reply_id" IS NOT NULL;

-- Sponsorship documents column (script/budget/storyboard URLs).
ALTER TABLE "sponsorship_applications"
	ADD COLUMN IF NOT EXISTS "documents" jsonb;

-- Notification preference: event reminders.
ALTER TABLE "notification_preferences"
	ADD COLUMN IF NOT EXISTS "event_reminders" boolean DEFAULT true;

-- User demographics (self-reported, optional).
ALTER TABLE "user"
	ADD COLUMN IF NOT EXISTS "date_of_birth" date;
ALTER TABLE "user"
	ADD COLUMN IF NOT EXISTS "gender" varchar(30);
