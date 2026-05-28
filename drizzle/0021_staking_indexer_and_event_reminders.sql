-- stc_stakes: per-address snapshot maintained by the staking indexer cron.
CREATE TABLE IF NOT EXISTS "stc_stakes" (
	"user_address" varchar(64) PRIMARY KEY NOT NULL,
	"amount" text DEFAULT '0' NOT NULL,
	"staking_time" integer DEFAULT 0 NOT NULL,
	"lock_period" integer DEFAULT 0 NOT NULL,
	"discount_tier" integer DEFAULT 0 NOT NULL,
	"is_unlocked" boolean DEFAULT true NOT NULL,
	"last_synced_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "stc_stakes_tier_idx" ON "stc_stakes" ("discount_tier");

-- cron_state: tiny key/value store for cron workers (last block, last run, …).
CREATE TABLE IF NOT EXISTS "cron_state" (
	"job_key" varchar(80) PRIMARY KEY NOT NULL,
	"last_block" text,
	"last_run_at" timestamp,
	"notes" text
);

-- event_registrations.reminder_sent_at: per-row idempotency for the 1h-before
-- reminder sent by the event-status-sweep cron.
ALTER TABLE "event_registrations"
	ADD COLUMN IF NOT EXISTS "reminder_sent_at" timestamp;
