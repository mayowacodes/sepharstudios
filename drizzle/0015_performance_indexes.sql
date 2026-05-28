-- Performance indexes to eliminate full table scans on hot paths.
-- All CREATE INDEX statements use IF NOT EXISTS so this is idempotent
-- and safe to re-run on prod.
--
-- Tables targeted (zero indexes beyond PK before this migration):
--   transactions, media_watch_progress, media_library,
--   paystack_subscriptions, playlists, playlist_items, reviews, episodes
--
-- See docs/performance-audit.md § P0-2 for the rationale and query patterns
-- each index serves.

-- ─────────────────────────────────────────────────────────────────────────────
-- transactions — STC claim flow, balance aggregations, admin analytics
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS transactions_user_currency_type_status_idx
	ON transactions (user_id, currency, type, status);

CREATE INDEX IF NOT EXISTS transactions_created_at_idx
	ON transactions (created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- media_watch_progress — written every ~5s during playback; read on resume
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS media_watch_progress_user_content_idx
	ON media_watch_progress (user_id, content_id);

CREATE INDEX IF NOT EXISTS media_watch_progress_profile_updated_idx
	ON media_watch_progress (profile_id, updated_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- media_library — every list page filters by media_type + is_active
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS media_library_type_active_idx
	ON media_library (media_type, is_active);

CREATE INDEX IF NOT EXISTS media_library_category_idx
	ON media_library (category)
	WHERE category IS NOT NULL;

CREATE INDEX IF NOT EXISTS media_library_creator_idx
	ON media_library (creator_id)
	WHERE creator_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- paystack_subscriptions — checked on most authenticated requests
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS paystack_subscriptions_user_status_idx
	ON paystack_subscriptions (user_id, status);

-- ─────────────────────────────────────────────────────────────────────────────
-- playlists / playlist_items — "My List" + custom playlists
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS playlists_user_idx
	ON playlists (user_id);

CREATE INDEX IF NOT EXISTS playlist_items_playlist_sort_idx
	ON playlist_items (playlist_id, sort_order);

-- ─────────────────────────────────────────────────────────────────────────────
-- reviews — content detail pages render approved reviews; user pages render own
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS reviews_content_approved_idx
	ON reviews (content_id, is_approved)
	WHERE is_approved = true;

CREATE INDEX IF NOT EXISTS reviews_user_created_idx
	ON reviews (user_id, created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- episodes — show detail page enumerates season+episode order
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS episodes_show_season_episode_idx
	ON episodes (show_id, season_number, episode_number);
