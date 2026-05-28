-- In-app notifications. Frontend reads via /api/notifications and renders in
-- NotificationCenter.svelte. Idempotent (IF NOT EXISTS) so it can be re-run.

CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"kind" varchar(40) NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"action_url" text,
	"read" boolean NOT NULL DEFAULT false,
	"created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "notifications_user_created_idx"
	ON "notifications" ("user_id", "created_at");
