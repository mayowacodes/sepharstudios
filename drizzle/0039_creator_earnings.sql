-- Creator earnings ledger — one row per monetizable engagement event
-- on a creator's content. Drives the "This Month" KPI on Creator Studio
-- and the breakdown on /creator/earnings.
--
-- Separate from `transactions` (which is the viewer-side STC reward
-- ledger keyed by user_id = viewer). amount_cents is computed by
-- lib/server/earnings-config.ts -> computeCreatorEarning().
--
-- Idempotent — safe to re-run.

CREATE TABLE IF NOT EXISTS "creator_earnings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"creator_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"content_id" text NOT NULL,
	"viewer_id" text REFERENCES "user"("id") ON DELETE SET NULL,
	"amount_cents" integer NOT NULL,
	"completion_percent" integer NOT NULL,
	"engagement_quality" varchar(20),
	"engagement_multiplier_x100" integer NOT NULL,
	"source" varchar(40) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "creator_earnings_creator_month_idx"
	ON "creator_earnings" ("creator_id", "created_at");

CREATE INDEX IF NOT EXISTS "creator_earnings_content_idx"
	ON "creator_earnings" ("content_id");
