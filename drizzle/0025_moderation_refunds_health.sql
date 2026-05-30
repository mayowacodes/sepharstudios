-- Operations round migration 1/2: moderation surfaces.
-- The refunds + health work is pure code (no schema changes) — only this
-- file's abuse_reports primitive is new.
-- Idempotent — IF NOT EXISTS throughout.

-- Universal reports table. One row per report, polymorphic over
-- target_type ∈ ('review','forum_thread','forum_reply','content','user').
CREATE TABLE IF NOT EXISTS "abuse_reports" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" text REFERENCES "user"("id") ON DELETE SET NULL,
	"target_type" varchar(20) NOT NULL,
	"target_id" text NOT NULL,
	"category" varchar(40) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"resolution" varchar(40),
	"resolved_by" text REFERENCES "user"("id"),
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "abuse_reports_status_idx"
	ON "abuse_reports" ("status");
CREATE INDEX IF NOT EXISTS "abuse_reports_target_idx"
	ON "abuse_reports" ("target_type", "target_id");
