-- 0046 — Playback telemetry (Xepho §29 / §34)
--
-- "Playback error rate and effective bitrate by geography and device" was the
-- one metric in the Xepho observability table with no equivalent here. Views
-- and watch-seconds say how much was watched, not whether it played well — so a
-- region the CDN serves badly looks identical to a region that watches less.
--
-- One row per SESSION, updated in place. A two-hour film emits hundreds of
-- quality switches; a row per event would dwarf every other table on the
-- platform to answer a question that only needs the aggregate.
--
-- Idempotent. No backfill — this was never recorded and cannot be reconstructed.

CREATE TABLE IF NOT EXISTS playback_telemetry (
	id                     text PRIMARY KEY DEFAULT gen_random_uuid(),
	content_id             text REFERENCES media_library(id) ON DELETE SET NULL,
	user_id                text REFERENCES "user"(id)        ON DELETE SET NULL,
	device_type            varchar(20),
	country                varchar(2),
	-- Time-weighted mean of the bitrates hls.js actually selected. A plain mean
	-- over switch events would let a 2-second dip to 360p count as much as an
	-- hour at 1080p.
	effective_bitrate_kbps integer,
	startup_ms             integer,
	-- Stalls degrade the experience; errors end it. Counted separately because
	-- the remedies are different.
	stall_count            integer NOT NULL DEFAULT 0,
	stall_seconds          integer NOT NULL DEFAULT 0,
	error_count            integer NOT NULL DEFAULT 0,
	fatal_error            text,
	-- 'audio' when the viewer fell to the audio-only rung — the signal that the
	-- low-bandwidth lever is being used rather than merely existing.
	final_quality          varchar(20),
	watched_seconds        integer NOT NULL DEFAULT 0,
	created_at             timestamp NOT NULL DEFAULT now(),
	updated_at             timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS playback_telemetry_content_day_idx
	ON playback_telemetry (content_id, created_at);
CREATE INDEX IF NOT EXISTS playback_telemetry_geo_idx
	ON playback_telemetry (country, device_type, created_at);
