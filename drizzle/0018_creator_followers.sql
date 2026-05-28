-- Creator-follower relationship. Each row = "user follows creator". Used for
-- the creator profile follow button, follower-count badges, and the
-- followerGrowth30d metric in the AI creator insights endpoint.
--
-- Idempotent — safe to re-run.

CREATE TABLE IF NOT EXISTS "creator_followers" (
	"id" text PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"creator_id" text NOT NULL REFERENCES "creators"("id") ON DELETE CASCADE,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"status" varchar(20) NOT NULL DEFAULT 'active',
	"created_at" timestamp NOT NULL DEFAULT now()
);

-- One row per (creator, user). Subsequent follow attempts no-op via
-- onConflictDoNothing in the endpoint.
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'creator_followers_creator_user_unique'
	) THEN
		ALTER TABLE "creator_followers"
			ADD CONSTRAINT "creator_followers_creator_user_unique"
			UNIQUE ("creator_id", "user_id");
	END IF;
END $$;

-- For "who do I follow?" queries
CREATE INDEX IF NOT EXISTS "creator_followers_user_idx"
	ON "creator_followers" ("user_id", "created_at" DESC);

-- For "how many followers do I have?" + "who follows me?" + growth queries
CREATE INDEX IF NOT EXISTS "creator_followers_creator_idx"
	ON "creator_followers" ("creator_id", "status", "created_at" DESC);
