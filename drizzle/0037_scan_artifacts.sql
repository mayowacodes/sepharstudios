-- Migration 0037: Encoder-orchestrator artifact columns.
--
-- The R+5 scan-ready webhook delivers three classes of artifacts:
--   * thumbnails.vtt + spriteUrls (scrubbing previews for the player)
--   * posterUrl (auto-extracted poster from the source)
--   * subtitles[] (multi-track transcription/translation) — stored via
--     existing content_subtitle_tracks rows, no schema change needed
--
-- These columns let the watch page render scrubbing previews without
-- digging into the JSONB scan report on every load.
--
-- Idempotent.

ALTER TABLE "media_library"
  ADD COLUMN IF NOT EXISTS "preview_thumbnails_vtt" text,
  ADD COLUMN IF NOT EXISTS "preview_sprite_urls"   jsonb DEFAULT '[]'::jsonb NOT NULL,
  ADD COLUMN IF NOT EXISTS "poster_auto_url"       text;
