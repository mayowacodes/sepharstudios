-- Events + event registrations. Powers /webinars (audience='public') and
-- /creator/events (audience='creator'). Idempotent — safe to re-run.

CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"description" text,
	"speaker" varchar(255),
	"speaker_role" varchar(255),
	"kind" varchar(30) NOT NULL DEFAULT 'webinar',
	"track" varchar(30),
	"audience" varchar(20) NOT NULL DEFAULT 'public',
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp,
	"duration_minutes" integer,
	"location" text,
	"capacity" integer,
	"meeting_url" text,
	"recording_url" text,
	"status" varchar(20) NOT NULL DEFAULT 'scheduled',
	"created_by" text REFERENCES "user"("id") ON DELETE SET NULL,
	"created_at" timestamp NOT NULL DEFAULT now(),
	"updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "events_audience_status_starts_idx"
	ON "events" ("audience", "status", "starts_at");

CREATE INDEX IF NOT EXISTS "events_starts_at_idx"
	ON "events" ("starts_at");

CREATE TABLE IF NOT EXISTS "event_registrations" (
	"id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"event_id" text NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"status" varchar(20) NOT NULL DEFAULT 'confirmed',
	"created_at" timestamp NOT NULL DEFAULT now()
);

-- One registration per (event, user). Subsequent registrations no-op.
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'event_registrations_event_user_unique'
	) THEN
		ALTER TABLE "event_registrations"
			ADD CONSTRAINT "event_registrations_event_user_unique"
			UNIQUE ("event_id", "user_id");
	END IF;
END $$;

CREATE INDEX IF NOT EXISTS "event_registrations_user_idx"
	ON "event_registrations" ("user_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "event_registrations_event_status_idx"
	ON "event_registrations" ("event_id", "status");
