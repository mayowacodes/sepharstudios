-- Track which admin is assigned to review each pending media item.
-- Distinct from `reviewed_by` (set only after the review completes).
-- Idempotent — safe to re-run.

ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "assigned_to" text REFERENCES "user"("id") ON DELETE SET NULL;

ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "assigned_at" timestamp;

CREATE INDEX IF NOT EXISTS "media_library_assigned_to_idx"
	ON "media_library" ("assigned_to")
	WHERE "assigned_to" IS NOT NULL;
