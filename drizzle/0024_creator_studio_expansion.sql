-- Creator Studio expansion: visibility + scheduled publish + missing poster
-- columns + subtitle/caption tracks.
-- Idempotent — IF NOT EXISTS throughout.

-- media_library: extra poster columns so every uploaded asset type maps to
-- its own column 1-to-1 (matches the 6-asset upload step).
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "poster_landscape_url" text;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "poster_square_url" text;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "logo_title_url" text;

-- media_library: visibility + scheduled publish.
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "visibility" varchar(20) DEFAULT 'public' NOT NULL;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "scheduled_publish_at" timestamp;

-- content_subtitle_tracks: one row per attached VTT track per content row.
CREATE TABLE IF NOT EXISTS "content_subtitle_tracks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL REFERENCES "media_library"("id") ON DELETE CASCADE,
	"kind" varchar(20) DEFAULT 'subtitles' NOT NULL,
	"language" varchar(10) NOT NULL,
	"label" varchar(60) NOT NULL,
	"file_url" text NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "content_subtitle_tracks_content_idx"
	ON "content_subtitle_tracks" ("content_id");
