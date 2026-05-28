-- Newsletter subscriptions. Used by the creator newsletter signup page and any
-- future general newsletter form. Idempotent (IF NOT EXISTS), safe to re-run.

CREATE TABLE IF NOT EXISTS "newsletter_subscriptions" (
	"id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"email" varchar(320) NOT NULL,
	"user_id" text REFERENCES "user"("id") ON DELETE SET NULL,
	"audience" varchar(30) NOT NULL DEFAULT 'creator',
	"preferences" jsonb,
	"status" varchar(20) NOT NULL DEFAULT 'active',
	"unsubscribe_token" text NOT NULL DEFAULT gen_random_uuid()::text,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

-- A given email subscribes at most once per audience. Re-submitting toggles
-- preferences via UPDATE rather than creating duplicate rows.
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'newsletter_subscriptions_email_audience_unique'
	) THEN
		ALTER TABLE "newsletter_subscriptions"
			ADD CONSTRAINT "newsletter_subscriptions_email_audience_unique"
			UNIQUE ("email", "audience");
	END IF;
END $$;

CREATE INDEX IF NOT EXISTS "newsletter_subscriptions_status_idx"
	ON "newsletter_subscriptions" ("status", "created_at" DESC);
