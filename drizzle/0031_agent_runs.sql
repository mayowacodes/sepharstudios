-- R+4: AI Layer 3 — autonomous agent runs. One row per cron-fired agent
-- invocation. Bounded by max-steps + max-cost per run.
-- Idempotent — IF NOT EXISTS throughout.

CREATE TABLE IF NOT EXISTS "agent_runs" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent" varchar(60) NOT NULL,
	"status" varchar(20) DEFAULT 'running' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"steps" integer DEFAULT 0 NOT NULL,
	"cost_cents" integer DEFAULT 0 NOT NULL,
	"items_processed" integer DEFAULT 0 NOT NULL,
	"items_actioned" integer DEFAULT 0 NOT NULL,
	"summary" text,
	"error" text
);
CREATE INDEX IF NOT EXISTS "agent_runs_agent_idx" ON "agent_runs" ("agent", "started_at");
CREATE INDEX IF NOT EXISTS "agent_runs_status_idx" ON "agent_runs" ("status");
