# Performance Audit — Round 7

> Verified findings from a three-track investigation: frontend bundle/render, backend query patterns, and DB schema. Findings prioritized by impact on real-user load time, not perceived elegance.

## Methodology

Three parallel exploration passes were run:
1. **Frontend** — bundle composition, lazy-loading gaps, image strategy, hydration cost.
2. **Backend** — N+1 query patterns, hot-path endpoint cost, connection pooling, server-side fetch behavior.
3. **Database** — missing indexes, schema-level scan risks, `SELECT *` patterns.

A subset of findings was directly verified by reading source files. Where an agent's claim conflicted with what's in the code (e.g., the postgres-js connection pooling claim), I downgraded severity and rewrote the finding. **Severity reflects verified impact, not the agent's original guess.**

---

## P0 — Pre-launch fixes (load time >5s on 3G, or DB-killer at scale)

### P0-1. `SELECT *` on the home / movies / shows / documentaries pages

**Files:**
- [`apps/web/src/routes/(app)/movies/+page.server.ts:8`](../apps/web/src/routes/(app)/movies/+page.server.ts#L8)
- [`apps/web/src/routes/(app)/shows/+page.server.ts:9-16`](../apps/web/src/routes/(app)/shows/+page.server.ts#L9-L16)
- [`apps/web/src/routes/(app)/documentaries/+page.server.ts:9-16`](../apps/web/src/routes/(app)/documentaries/+page.server.ts#L9-L16)

**What's happening:** `db.select().from(mediaLibrary).where(...)` with no column projection. The `mediaLibrary` table has 30+ columns including large fields (`description` TEXT, `reviewNotes` TEXT, `genres`/`topics`/`keywords` JSONB arrays, `videoUrl`, raw metadata). For a page rendering ~50 cards, only 8 columns are actually displayed.

**Impact:** 60–70% JSON payload bloat. On a typical home feed pull (~50 rows × 6KB each = 300KB), versus a projected select of 8 columns (~50 × 1.5KB = 75KB). At 3G speeds (~50KB/s effective), that's a 4.5s vs 1.5s difference.

**Fix pattern:**
```ts
const movies = await db.select({
  id: mediaLibrary.id,
  title: mediaLibrary.title,
  thumbnail: mediaLibrary.thumbnail,
  posterUrl: mediaLibrary.posterUrl,
  mediaType: mediaLibrary.mediaType,
  duration: mediaLibrary.duration,
  ageRating: mediaLibrary.ageRating,
  year: mediaLibrary.year,
  slug: mediaLibrary.slug
}).from(mediaLibrary).where(...);
```

**Effort:** ~30 min for all three list endpoints. Search for any other `db.select()` without an argument across the repo.

---

### P0-2. Missing indexes on hot tables

**Tables affected (zero indexes beyond PK):**
- `transactions` ([schema.ts:115-125](../apps/web/src/lib/db/schema/sepharstudios.ts#L115)) — used by claim flow, balance, admin analytics. Common filters: `(userId, currency, type, status)`.
- `mediaWatchProgress` ([schema.ts:329-342](../apps/web/src/lib/db/schema/sepharstudios.ts#L329)) — written every 5s during playback. Common filters: `(userId, contentId)`, `(profileId, contentId)`.
- `mediaLibrary` ([schema.ts:137-200](../apps/web/src/lib/db/schema/sepharstudios.ts#L137)) — every list page. Common filters: `(mediaType, isActive, category)`.
- `paystackSubscriptions` — referenced by every subscription check.
- `playlists`, `playlistItems`, `reviews`, `episodes` — all unindexed beyond PK.

**Impact:** Full table scans on every query. At 10k rows scans cost ~50ms; at 1M rows they cost ~5s and block other queries. The `/api/users/me/stc-balance` aggregation already feels slow on the dev server — that's the canary.

**Fix:** A migration `drizzle/0015_add_performance_indexes.sql`:
```sql
-- transactions
CREATE INDEX IF NOT EXISTS transactions_user_status_idx ON transactions (user_id, currency, type, status);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions (created_at DESC);

-- mediaWatchProgress
CREATE INDEX IF NOT EXISTS media_watch_user_content_idx ON media_watch_progress (user_id, content_id);
CREATE INDEX IF NOT EXISTS media_watch_profile_idx ON media_watch_progress (profile_id, updated_at DESC);

-- mediaLibrary
CREATE INDEX IF NOT EXISTS media_library_type_active_idx ON media_library (media_type, is_active);
CREATE INDEX IF NOT EXISTS media_library_category_idx ON media_library (category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS media_library_creator_idx ON media_library (creator_id) WHERE creator_id IS NOT NULL;

-- paystackSubscriptions
CREATE INDEX IF NOT EXISTS paystack_subs_user_status_idx ON paystack_subscriptions (user_id, status);

-- playlists / playlist_items
CREATE INDEX IF NOT EXISTS playlists_user_idx ON playlists (user_id);
CREATE INDEX IF NOT EXISTS playlist_items_playlist_idx ON playlist_items (playlist_id, sort_order);

-- reviews
CREATE INDEX IF NOT EXISTS reviews_content_approved_idx ON reviews (content_id, is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS reviews_user_idx ON reviews (user_id, created_at DESC);

-- episodes
CREATE INDEX IF NOT EXISTS episodes_show_idx ON episodes (show_id, season_number, episode_number);
```

**Effort:** 20 min to write + apply. Re-run on prod via the same Bun-script pattern we used for migrations 0012-0014.

---

### P0-3. HLS.js eagerly imported in VideoPlayer

**File:** [`apps/web/src/lib/components/widgets/VideoPlayer.svelte:3`](../apps/web/src/lib/components/widgets/VideoPlayer.svelte#L3) — `import Hls from 'hls.js'`.

**Impact:** ~120KB minified, parsed synchronously on every page that imports VideoPlayer. Many do — search/browse/category routes preload it.

**Fix:** Dynamic import gated on whether the source is HLS:
```ts
let Hls: typeof import('hls.js').default | null = null;
onMount(async () => {
  if (videoUrl?.includes('.m3u8') || videoUrl?.endsWith('m3u8')) {
    Hls = (await import('hls.js')).default;
    // initialize as before
  }
});
```

**Impact estimate:** ~800ms first-paint improvement on 3G for non-video pages, ~120KB removed from critical chunk.

---

### P0-4. Web3 libraries on every admin route

**Files:**
- [`apps/web/src/routes/(admin)/admin/+page.svelte`](../apps/web/src/routes/(admin)/admin/+page.svelte) — imports `stcToken`, `tokenAMM`, `isConnected`, `walletAddress`
- [`apps/web/src/routes/(admin)/admin/analytics/+page.svelte`](../apps/web/src/routes/(admin)/admin/analytics/+page.svelte) — same

**Impact:** `wagmi/core` + `viem` + connector libs ≈ 400KB minified pulled into every admin chunk, but only used if the admin clicks "connect wallet" (rare on admin routes). On a 4G connection, this adds 1.5–2s to admin dashboard TTI.

**Fix:** Lazy-load the web3-using subcomponents:
```svelte
<script>
  let Web3Stats: any = $state(null);
  onMount(async () => {
    Web3Stats = (await import('$lib/components/admin/Web3Stats.svelte')).default;
  });
</script>

{#if Web3Stats}
  <Web3Stats />
{/if}
```

**Effort:** ~1 hr per admin route. Pick the highest-traffic admin route first (analytics).

---

## P1 — Pre-scale fixes (3–5s impact, or DB pain at moderate load)

### P1-5. Connection pool size is the default (max=10)

**File:** [`apps/web/src/lib/db/drizzle.ts:6`](../apps/web/src/lib/db/drizzle.ts#L6) — `postgres(env.DATABASE_URL!)` with no options.

**What I checked:** the original agent claim was "opens a new connection per query." That's **wrong** — `postgres-js` defaults to a pool. But the default pool is `max: 10`, which is small for production with multiple SvelteKit replicas.

**Impact:** Each replica caps at 10 concurrent DB connections. Under load, queries queue behind the pool. With 3 replicas × 10 = 30 max — fine until ~100 concurrent users hit endpoints with multiple queries each.

**Fix:**
```ts
const client = postgres(env.DATABASE_URL!, {
  max: 25,           // bump per-replica pool
  idle_timeout: 30,  // close idle connections after 30s
  connect_timeout: 10
});
```

If/when you migrate to managed Postgres with PgBouncer (Supabase has this baked in), the per-replica `max` matters less — the pooler handles fan-in.

---

### P1-6. Watch progress writes — every 5s per user per video

**File:** [`apps/web/src/routes/api/watch/progress/+server.ts`](../apps/web/src/routes/api/watch/progress/+server.ts)

**What's happening:** the client fires position updates every few seconds; each call writes to `mediaWatchProgress`. With 100 concurrent viewers, that's 20 writes/sec; with 10k, it's 2000 writes/sec — well into territory where the table needs the index from P0-2 AND batched writes.

**Fix:**
- Index from P0-2 covers read-after-write performance.
- For batching: collect writes into a server-side queue, flush every 30s in a transaction. Big architectural change — defer to its own round.
- Quick win now: bump the client-side update interval from 5s → 15s for non-completion pings. The "just completed" event still fires immediately.

---

### P1-7. Images without `width`/`height` cause CLS

**Files:** [`MovieCard.svelte`](../apps/web/src/lib/components/MovieCard.svelte), [`TVShowCard.svelte`](../apps/web/src/lib/components/TVShowCard.svelte), [`KidsMovieCard.svelte`](../apps/web/src/lib/components/KidsMovieCard.svelte), [`DocumentaryCard.svelte`](../apps/web/src/lib/components/DocumentaryCard.svelte).

**Impact:** Cumulative Layout Shift (CLS) score. The home feed has 30+ cards rendering simultaneously. Without intrinsic dimensions, every image swap-in re-flows the layout, hurting LCP and perceived stability.

**Fix:** Wrap the `<img>` in an aspect-ratio container OR add explicit `width`/`height`:
```svelte
<div class="relative aspect-[2/3] bg-muted rounded-2xl overflow-hidden">
  <img
    src={movie.thumbnail}
    alt={movie.title}
    width="280"
    height="420"
    loading="lazy"
    decoding="async"
    class="w-full h-full object-cover"
  />
</div>
```

**Effort:** ~30 min across the 4 card components.

---

### P1-8. Archive.org fetch with no timeout blocks browse page

**File:** [`apps/web/src/lib/components/browse/ArchiveVideo.svelte:30-35`](../apps/web/src/lib/components/browse/ArchiveVideo.svelte#L30-L35)

**What's happening:** every mount of `ArchiveVideo` hits `archive.org/advancedsearch.php` to pull 20 rows. No `AbortController`, no timeout, no fallback. When archive.org is slow (which it routinely is), the browse page hangs.

**Fix:**
```ts
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 2000);
try {
  const res = await fetch(query, { signal: controller.signal });
  // ...
} catch {
  videos = []; // graceful fallback
} finally {
  clearTimeout(timeout);
}
```

**Effort:** 5 min.

---

### P1-9. Card trailers preload eagerly in grid

**File:** [`apps/web/src/lib/components/MovieCard.svelte:61-69`](../apps/web/src/lib/components/MovieCard.svelte#L61-L69)

**What's happening:** each `MovieCard` renders a `<video>` element for hover-preview. On a 30-card grid, that's 30 `<video>` tags in DOM — even if most never play.

**Fix:** wrap the `<video>` in an `IntersectionObserver`-gated `{#if}` so it only mounts when the card is visible AND hovered:
```ts
let shouldRender = $state(false);
$effect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    shouldRender = entry.isIntersecting;
  });
  if (cardEl) observer.observe(cardEl);
  return () => observer.disconnect();
});

{#if shouldRender && isHovered}
  <video src={movie.trailerUrl} preload="none" />
{/if}
```

**Effort:** ~20 min.

---

### P1-10. Admin analytics fetches everything synchronously on mount

**File:** [`apps/web/src/routes/(admin)/admin/analytics/+page.svelte:127-133`](../apps/web/src/routes/(admin)/admin/analytics/+page.svelte#L127-L133)

**What's happening:** `onMount` kicks off `loadAnalytics()`, `loadTokenomicsData()`, `loadAdminWalletInfo()` in parallel — all three are slow aggregation queries. Page is unusable until all three resolve.

**Fix:** prioritize. Load core analytics first (the visible content above the fold), defer tokenomics to a `setTimeout(1500)` or trigger when the tokenomics section scrolls into view.

---

## P2 — Nice-to-have polish

### P2-11. `date-fns` imported for simple formatting alongside `Intl`
Several admin pages import `date-fns` only to format dates — but already use `Intl.NumberFormat` for currency. Native `Intl.DateTimeFormat` covers the use cases; `date-fns` is 13KB you don't need to ship. Drop on next admin-page touch.

### P2-12. Manual chunks config misses `layerchart`
[`vite.config.ts:20-24`](../apps/web/vite.config.ts#L20) has `manualChunks: { 'ui-libs': [...] }` but doesn't include `layerchart` (~80KB). Add:
```ts
manualChunks: {
  'ui-libs': ['bits-ui', 'vaul-svelte'],
  'chart-lib': ['layerchart']
}
```
Lets the admin-only chart code stay out of the main chunk.

### P2-13. `embla-carousel-svelte` imported but apparently unused on home
Home page uses CSS scroll-snap, not Embla. Verify with `grep -r "embla" apps/web/src` — if dead, remove from dependencies.

### P2-14. Wallet `getAccount(config)` called per-component
[`apps/web/src/lib/auth/accessControl.ts`](../apps/web/src/lib/auth/accessControl.ts) calls `getAccount(config)` on every access check. Memoize against the `walletGeneration` store to cache within a page load.

---

## Recommended execution order

If you want to do these in batches:

**Quick wins batch (4 hours, biggest impact):**
1. P0-1: SELECT * projections
2. P0-2: index migration
3. P1-7: image dimensions
4. P1-8: archive.org timeout
5. P1-5: postgres pool size

**Bundle batch (6 hours, big mobile/3G impact):**
6. P0-3: HLS.js lazy
7. P0-4: admin web3 lazy
8. P1-9: card trailer IntersectionObserver
9. P1-10: admin analytics deferred load

**Polish batch (3 hours, cleanup):**
10. P2-11 through P2-14

Total: ~13 hours of focused work to close the entire audit.

---

## What I explicitly didn't audit

- **Image CDN / responsive `srcset`** — would need Bunny Image Optimizer config review.
- **Service worker / offline cache strategy** — there's a [`offline/+page.svelte`](../apps/web/src/routes/(app)/offline/+page.svelte) but I didn't trace the SW logic.
- **Streaming start-to-first-frame** — that's a Bunny CDN + encoder concern, not app-level.
- **`/api/health` cost on the LB** — should be cheap by construction; not verified.
- **Realtime / WebSocket paths** — there don't appear to be any in this codebase (good).

---

## Tracking

| Finding | Severity | Status |
|---|---|---|
| P0-1 SELECT * | P0 | ✅ done — projection helper in [`lib/db/projections.ts`](../apps/web/src/lib/db/projections.ts); applied to movies/shows/documentaries list endpoints |
| P0-2 indexes | P0 | ✅ done — migration [`drizzle/0015_performance_indexes.sql`](../drizzle/0015_performance_indexes.sql) + applier [`scripts/apply-migration-0015.ts`](../scripts/apply-migration-0015.ts). **Apply to prod when ready** |
| P0-3 HLS lazy | P0 | ✅ done — `hls.js` is type-only import + dynamic load in `loadHls()`; only fetched for HLS streams on non-Safari browsers |
| P0-4 admin web3 lazy | P0 | ✅ done — 3 admin pages converted to type-only imports + dynamic `await import('$lib/web3/contracts')` in onMount; removed dead `stcToken/tokenAMM` import from admin/creators |
| P1-5 pool size | P1 | ✅ done — postgres-js configured `max=25, idle_timeout=30, connect_timeout=10` in [`lib/db/drizzle.ts`](../apps/web/src/lib/db/drizzle.ts) |
| P1-6 watch interval | P1 | ✅ verified no-op — the audit was based on a misread of the 5s "moved at least this much" threshold; the actual poll interval is already 30s in `VideoPlayer.svelte:262` |
| P1-7 image dims | P1 | ✅ done — `width`, `height`, `decoding="async"` added across [MovieCard](../apps/web/src/lib/components/MovieCard.svelte), [TVShowCard](../apps/web/src/lib/components/TVShowCard.svelte), [DocumentaryCard](../apps/web/src/lib/components/DocumentaryCard.svelte), [KidsMovieCard](../apps/web/src/lib/components/kids/KidsMovieCard.svelte) |
| P1-8 archive timeout | P1 | ✅ done — `AbortController` with 2.5s deadline + graceful empty-list fallback in [ArchiveVideo.svelte](../apps/web/src/lib/components/browse/ArchiveVideo.svelte); also reduced `rows=20` → `rows=12` |
| P1-9 trailer observer | P1 | ✅ done — existing `{#if isHovered}` already defers mount (the audit was overly pessimistic); added `preload="none"` on all 3 card trailer videos so even hover-mounted videos don't pre-buffer until play |
| P1-10 analytics defer | P1 | ✅ done — admin/analytics now wraps tokenomics + admin-wallet loaders in `setTimeout(1500)` so the visible KPI cards paint before the slow on-chain reads kick off |
| P2-11 date-fns drop | P2 | ✅ done — replaced `format(...)` in [ListCard.svelte](../apps/web/src/routes/(protected)/users/components/ListCard.svelte) with native `Intl.DateTimeFormat`; `date-fns` removed from package.json entirely |
| P2-12 manual chunks | P2 | ✅ done — `'chart-lib': ['layerchart']` added to [`vite.config.ts`](../apps/web/vite.config.ts); admin-only chart code now isolated from main chunk |
| P2-13 embla unused | P2 | ✅ done — confirmed dead: 7 shadcn carousel files in `lib/components/ui/carousel/` had zero imports anywhere. Whole directory deleted + `embla-carousel-svelte` removed from package.json |
| P2-14 wallet memoize | P2 | ✅ done — `getCachedAccount()` added to [wallet.ts](../apps/web/src/lib/web3/wallet.ts) keyed on `walletGeneration`; 4 call sites in [accessControl.ts](../apps/web/src/lib/auth/accessControl.ts) switched over |
