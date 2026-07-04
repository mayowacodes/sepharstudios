-- Per-day analytics rollup. The creator analytics endpoint used to
-- aggregate the raw media_watch_progress table on every request (and
-- the page polls every 60s per open tab) — cost grows linearly with
-- watch history. This table holds one row per (content, day); the
-- trends/sparkline queries read ~30 rows instead of scanning history.
--
-- Maintained by /api/cron/analytics-rollup (re-aggregates the last 2
-- days every run, so rows whose updated_at moved between days are
-- corrected). Backfilled below from existing data. avg completion for
-- a day = completion_pct_sum / views.
--
-- Idempotent — safe to re-run.

CREATE TABLE IF NOT EXISTS "media_analytics_daily" (
	"content_id" text NOT NULL REFERENCES "media_library"("id") ON DELETE CASCADE,
	"day" date NOT NULL,
	"views" integer NOT NULL DEFAULT 0,
	"watch_seconds" bigint NOT NULL DEFAULT 0,
	"completed_watches" integer NOT NULL DEFAULT 0,
	"completion_pct_sum" double precision NOT NULL DEFAULT 0,
	"updated_at" timestamp NOT NULL DEFAULT now(),
	PRIMARY KEY ("content_id", "day")
);

CREATE INDEX IF NOT EXISTS "media_analytics_daily_day_idx"
	ON "media_analytics_daily" ("day");

-- Backfill from the raw table. ON CONFLICT keeps re-runs safe.
INSERT INTO "media_analytics_daily"
	("content_id", "day", "views", "watch_seconds", "completed_watches", "completion_pct_sum", "updated_at")
SELECT
	mwp."content_id",
	date_trunc('day', mwp."updated_at")::date AS day,
	count(*)::int,
	coalesce(sum(mwp."position_seconds"), 0)::bigint,
	sum(CASE WHEN mwp."is_completed" THEN 1 ELSE 0 END)::int,
	coalesce(sum(mwp."completion_percent"), 0)::double precision,
	now()
FROM "media_watch_progress" mwp
GROUP BY mwp."content_id", date_trunc('day', mwp."updated_at")::date
ON CONFLICT ("content_id", "day") DO UPDATE SET
	"views" = EXCLUDED."views",
	"watch_seconds" = EXCLUDED."watch_seconds",
	"completed_watches" = EXCLUDED."completed_watches",
	"completion_pct_sum" = EXCLUDED."completion_pct_sum",
	"updated_at" = now();
