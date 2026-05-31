-- Migration 0036: Author-curated next-up cards on the end screen.
--
-- When this array is non-empty, the watch page uses the creator's hand-picked
-- recommendations instead of the default "same-creator → same-genre" auto
-- ranking. Order is preserved (creator chooses the sequence).
--
-- Idempotent.

ALTER TABLE "media_library"
  ADD COLUMN IF NOT EXISTS "next_up_content_ids" jsonb DEFAULT '[]'::jsonb NOT NULL;
