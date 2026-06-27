-- Admin metadata editor audit columns. Track who last touched a
-- media_library row from the admin side + when. The creator's
-- ordinary updatedAt only records the timestamp, not the actor — and
-- that's not enough once two roles (creator + admin) can both write.
--
-- Idempotent — safe to re-run.

ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "edited_by" text REFERENCES "user"("id") ON DELETE SET NULL;

ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "edited_at" timestamp;

-- Lookups on /admin/review/[id] sort the activity feed by recent edits.
CREATE INDEX IF NOT EXISTS "media_library_edited_at_idx"
	ON "media_library" ("edited_at" DESC NULLS LAST);
