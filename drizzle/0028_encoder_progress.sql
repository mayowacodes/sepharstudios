-- R+1: encoder progress tracking. Adds the two columns the webhook + cron
-- write to so the upload wizard and system-health page can render a
-- meaningful progress bar instead of "your video is processing…" forever.
-- Idempotent — IF NOT EXISTS throughout.

ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "processing_progress" integer;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "processing_stage" varchar(40);
