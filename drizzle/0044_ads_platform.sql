-- 0044 — Advertising platform
--
-- Seven tables backing the squeeze-back ad format. Idempotent throughout so a
-- partial apply can be re-run safely, matching the style of 0043.
--
-- Named ad_* in the database but served from /api/promo/* on the wire: EasyList
-- blocks the substring "/api/ads/" by default, which made the previous endpoint
-- unreachable for a large share of viewers.
--
-- No backfill — there is no existing ad data anywhere in the system.

-- ── Advertisers ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_advertisers (
	id            text PRIMARY KEY DEFAULT gen_random_uuid(),
	name          varchar(200) NOT NULL,
	slug          varchar(120) NOT NULL,
	kind          varchar(20)  NOT NULL DEFAULT 'external',
	contact_email varchar(320),
	is_active     boolean      NOT NULL DEFAULT true,
	created_at    timestamp    NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ad_advertisers_slug_uq ON ad_advertisers (slug);

-- ── Campaigns ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_campaigns (
	id                    text PRIMARY KEY DEFAULT gen_random_uuid(),
	advertiser_id         text NOT NULL REFERENCES ad_advertisers(id) ON DELETE CASCADE,
	name                  varchar(200) NOT NULL,
	status                varchar(20)  NOT NULL DEFAULT 'draft',
	priority              integer      NOT NULL DEFAULT 50,
	starts_at             timestamp    NOT NULL,
	ends_at               timestamp,
	goal_impressions      integer,
	delivered_impressions integer      NOT NULL DEFAULT 0,
	cap_per_viewer        integer,
	cap_window_hours      integer      NOT NULL DEFAULT 24,
	target_genres         jsonb        NOT NULL DEFAULT '[]'::jsonb,
	target_regions        jsonb        NOT NULL DEFAULT '[]'::jsonb,
	target_device_types   jsonb        NOT NULL DEFAULT '[]'::jsonb,
	exclude_content_ids   jsonb        NOT NULL DEFAULT '[]'::jsonb,
	kids_safe             boolean      NOT NULL DEFAULT false,
	tracking_mode         varchar(10)  NOT NULL DEFAULT 'server',
	vast_cache_seconds    integer      NOT NULL DEFAULT 0,
	created_at            timestamp    NOT NULL DEFAULT now(),
	updated_at            timestamp    NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ad_campaigns_status_flight_idx ON ad_campaigns (status, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS ad_campaigns_advertiser_idx    ON ad_campaigns (advertiser_id);

-- A flight that ends before it starts never serves and is always a data-entry
-- error; priority outside 0-100 silently breaks auction ordering.
DO $$ BEGIN
	ALTER TABLE ad_campaigns ADD CONSTRAINT ad_campaigns_flight_ck
		CHECK (ends_at IS NULL OR ends_at > starts_at);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE ad_campaigns ADD CONSTRAINT ad_campaigns_priority_ck
		CHECK (priority BETWEEN 0 AND 100);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Creatives ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_creatives (
	id                text PRIMARY KEY DEFAULT gen_random_uuid(),
	campaign_id       text NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
	kind              varchar(10)  NOT NULL DEFAULT 'video',
	name              varchar(200) NOT NULL,
	video_object_key  text,
	poster_object_key text,
	duration_seconds  integer,
	bitrate_kbps      integer,
	width             integer,
	height            integer,
	vast_tag_url      text,
	click_url         text,
	cta_label         varchar(60),
	headline          varchar(140),
	body              text,
	mobile_behavior   varchar(10) NOT NULL DEFAULT 'takeover',
	weight            integer     NOT NULL DEFAULT 1,
	is_active         boolean     NOT NULL DEFAULT true,
	created_at        timestamp   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ad_creatives_campaign_idx ON ad_creatives (campaign_id, is_active);

-- A first-party video creative is useless without a file and a duration: the
-- duration decides pause-vs-duck BEFORE the ad element exists, so it cannot be
-- discovered at playback time. A VAST creative needs its tag instead; the
-- duration arrives from the parsed <Duration>. The 1-180s bound rejects
-- mis-entered milliseconds and anything longer than the format tolerates.
DO $$ BEGIN
	ALTER TABLE ad_creatives ADD CONSTRAINT ad_creatives_kind_ck CHECK (
		(kind = 'video' AND video_object_key IS NOT NULL
		              AND duration_seconds IS NOT NULL
		              AND duration_seconds BETWEEN 1 AND 180)
		OR (kind = 'vast' AND vast_tag_url IS NOT NULL)
	);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Breaks (cue points) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_breaks (
	id               text PRIMARY KEY DEFAULT gen_random_uuid(),
	content_id       text NOT NULL REFERENCES media_library(id) ON DELETE CASCADE,
	position_seconds integer     NOT NULL,
	kind             varchar(12) NOT NULL DEFAULT 'midroll',
	format           varchar(12),
	is_active        boolean     NOT NULL DEFAULT true,
	created_at       timestamp   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ad_breaks_content_idx ON ad_breaks (content_id, is_active);
CREATE UNIQUE INDEX IF NOT EXISTS ad_breaks_position_uq ON ad_breaks (content_id, position_seconds);

-- "preroll" and "position 0" must mean each other, in both directions —
-- otherwise a midroll at 0 and a preroll at 90s are both representable and the
-- player has to guess which field to trust.
DO $$ BEGIN
	ALTER TABLE ad_breaks ADD CONSTRAINT ad_breaks_position_ck CHECK (
		position_seconds >= 0 AND ((kind = 'preroll') = (position_seconds = 0))
	);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Per-title opt-out ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_content_settings (
	content_id   text PRIMARY KEY REFERENCES media_library(id) ON DELETE CASCADE,
	ads_enabled  boolean   NOT NULL DEFAULT true,
	note         text,
	updated_at   timestamp NOT NULL DEFAULT now()
);

-- ── Impressions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_impressions (
	id              text PRIMARY KEY DEFAULT gen_random_uuid(),
	decision_id     text NOT NULL,
	campaign_id     text NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
	creative_id     text NOT NULL REFERENCES ad_creatives(id) ON DELETE CASCADE,
	break_id        text REFERENCES ad_breaks(id)   ON DELETE SET NULL,
	content_id      text REFERENCES media_library(id) ON DELETE SET NULL,
	creator_id      text,
	user_id         text REFERENCES "user"(id) ON DELETE SET NULL,
	status          varchar(12) NOT NULL DEFAULT 'served',
	watched_seconds integer     NOT NULL DEFAULT 0,
	skipped         boolean     NOT NULL DEFAULT false,
	clicked         boolean     NOT NULL DEFAULT false,
	was_muted       boolean     NOT NULL DEFAULT false,
	device_type     varchar(20),
	country         varchar(2),
	layout          varchar(12),
	behavior        varchar(10),
	created_at      timestamp   NOT NULL DEFAULT now(),
	started_at      timestamp,
	completed_at    timestamp
);
CREATE UNIQUE INDEX IF NOT EXISTS ad_impressions_decision_uq      ON ad_impressions (decision_id);
CREATE INDEX        IF NOT EXISTS ad_impressions_campaign_day_idx ON ad_impressions (campaign_id, created_at);
CREATE INDEX        IF NOT EXISTS ad_impressions_content_idx      ON ad_impressions (content_id, created_at);

-- Monotonic ordering for the event state machine.
--
-- The beacon endpoint updates only when the incoming status outranks the stored
-- one, which makes replays no-ops without a read-modify-write. IMMUTABLE so the
-- planner can inline it; unknown values sort to -1 so a malformed beacon can
-- never advance a row.
CREATE OR REPLACE FUNCTION ad_status_rank(s text) RETURNS integer
	LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
	SELECT CASE s
		WHEN 'served'   THEN 0
		WHEN 'started'  THEN 1
		WHEN 'q1'       THEN 2
		WHEN 'q2'       THEN 3
		WHEN 'q3'       THEN 4
		WHEN 'complete' THEN 5
		ELSE -1
	END
$$;

-- ── Daily rollup ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ad_campaign_daily (
	campaign_id   text   NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
	day           date   NOT NULL,
	served        integer NOT NULL DEFAULT 0,
	started       integer NOT NULL DEFAULT 0,
	completed     integer NOT NULL DEFAULT 0,
	skipped       integer NOT NULL DEFAULT 0,
	clicks        integer NOT NULL DEFAULT 0,
	watch_seconds bigint  NOT NULL DEFAULT 0,
	PRIMARY KEY (campaign_id, day)
);

-- ── Seed ────────────────────────────────────────────────────────────────────
-- A house advertiser so the backfill tier is never empty. Without a guaranteed
-- fill path, a break with no eligible campaign leaves the player mid-squeeze
-- with nothing to show.
INSERT INTO ad_advertisers (name, slug, kind)
VALUES ('Sephar Studios (House)', 'sephar-house', 'house')
ON CONFLICT (slug) DO NOTHING;
