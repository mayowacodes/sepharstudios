-- R+5: Pre-publish content scan. Adds two columns to media_library — the
-- orchestrator delivers transcript + frame samples; platform runs AI on
-- the actual content (not just metadata) before admin reviews.
-- Idempotent — IF NOT EXISTS throughout.

ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "content_scan_status" varchar(20) DEFAULT 'idle' NOT NULL;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "content_scan_report" jsonb;
