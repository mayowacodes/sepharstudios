-- Catalog completion round: chapters, cast, crew, region restrictions,
-- A/B thumbnail variants. Item 1 (admin↔creator threads) reuses the
-- existing admin_messages table — no schema in this migration for it.
-- Idempotent — IF NOT EXISTS throughout.

-- media_library: chapters (jsonb), cast (jsonb), crew (jsonb), and the
-- geo gate columns. cast/crew default to [] so existing rows are usable
-- without a backfill.
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "chapters" jsonb;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "cast" jsonb DEFAULT '[]'::jsonb NOT NULL;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "crew" jsonb DEFAULT '[]'::jsonb NOT NULL;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "geo_mode" varchar(10) DEFAULT 'all' NOT NULL;
ALTER TABLE "media_library"
	ADD COLUMN IF NOT EXISTS "geo_regions" jsonb DEFAULT '[]'::jsonb NOT NULL;

-- content_thumbnail_variants: A/B testing for thumbnails. Multiple
-- variants per content; rotation picks one per (user, content); promoting
-- the winner copies its URL into media_library.thumbnail.
CREATE TABLE IF NOT EXISTS "content_thumbnail_variants" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" text NOT NULL REFERENCES "media_library"("id") ON DELETE CASCADE,
	"url" text NOT NULL,
	"label" varchar(40),
	"is_active" boolean DEFAULT true NOT NULL,
	"is_winner" boolean DEFAULT false NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "content_thumbnail_variants_content_idx"
	ON "content_thumbnail_variants" ("content_id");
