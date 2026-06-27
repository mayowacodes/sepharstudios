-- Per-title notify-me list for Coming Soon releases. When a user
-- subscribes on a Coming Soon detail page, a row lands here. The
-- scheduled-publish cron reads these on flip-to-live and dispatches
-- a notification + stamps notified_at to dedup.
--
-- Idempotent — safe to re-run.

CREATE TABLE IF NOT EXISTS "coming_soon_subscriptions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"content_id" text NOT NULL REFERENCES "media_library"("id") ON DELETE CASCADE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"notified_at" timestamp,
	CONSTRAINT "coming_soon_subscriptions_user_content_uniq" UNIQUE ("user_id", "content_id")
);

-- Partial index: most lookups are "who's still waiting to be notified
-- for this content?". Excluding already-notified rows keeps the index
-- small and the cron query fast.
CREATE INDEX IF NOT EXISTS "css_content_pending_idx"
	ON "coming_soon_subscriptions" ("content_id")
	WHERE "notified_at" IS NULL;
