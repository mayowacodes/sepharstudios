-- Performance indexes + data-integrity constraint.
-- Idempotent — safe to re-run.

-- 1. media_watch_progress (content_id, updated_at DESC)
--    The hottest write table in the app (a row-write every 30s per
--    active viewer). Creator analytics runs ~5 aggregate queries
--    filtered by content_id + updated_at, re-polled every 60s per open
--    tab; the watch page and detail pages also filter by content_id.
--    The only prior indexes led with user_id / profile_id, so every
--    one of those queries seq-scanned the table.
CREATE INDEX IF NOT EXISTS "media_watch_progress_content_updated_idx"
	ON "media_watch_progress" ("content_id", "updated_at" DESC);

-- 2. media_library (status, scheduled_publish_at)
--    The coming-soon carousels (/movies, home) and the scheduled-publish
--    cron all filter status + order by scheduled_publish_at. There was
--    no status index at all.
CREATE INDEX IF NOT EXISTS "media_library_status_scheduled_idx"
	ON "media_library" ("status", "scheduled_publish_at");

-- 3. episodes: one row per (show, season, episode).
--    The POST handler now pre-checks for duplicates, but the constraint
--    is the real guarantee — a double-submit race can pass two
--    pre-checks simultaneously. Dedupe any existing duplicates first
--    (keep the earliest row) so the unique index can build.
DELETE FROM "episodes" a
	USING "episodes" b
	WHERE a."show_id" = b."show_id"
		AND a."season_number" = b."season_number"
		AND a."episode_number" = b."episode_number"
		AND a."created_at" > b."created_at";

CREATE UNIQUE INDEX IF NOT EXISTS "episodes_show_season_episode_unique"
	ON "episodes" ("show_id", "season_number", "episode_number");
