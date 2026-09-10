# Outstanding Work — Master Plan

> Covers every open workstream as of 2026-09-01: native app completion, the
> free-tier business model change, the interactive ad platform, the five adopted
> Xepho sections, and the Temporal encoder cleanup.
>
> Companion docs: [BUILD_PLAN.md](BUILD_PLAN.md) (feature backlog),
> [TECHDEBT.md](TECHDEBT.md) (deferred work). This file supersedes neither; it
> sequences what is actually next.

---

## Context

Three things happened that together set this agenda.

**1. The app now ships as three targets, not one.** `apps/web` builds to a Docker
adapter-node server (unchanged), *and* to an adapter-static SPA that is bundled
into a Capacitor Android APK and a Tauri desktop app. The SPA has no server, so
every route's data must come from `/api/*` over HTTPS. Five layout loads are
migrated; **22 `+page.server.ts` files remain**, and until they are gone the APK
builds but renders only a shell.

**2. The Xepho Composition Engine doc was reviewed.** It specs a different
product (AI video *generation*), so §7–20 and §25 do not apply. Five sections
were adopted: §21 cost ledger, §29 adaptive delivery/offline, §23 atomic
publishing, §24 QC gates, §34 observability.

**3. The business model is changing.** The platform is likely going **free for
all**, monetised by ads plus pay-per-view on Sephar-sponsored titles, to drive
user acquisition. This is why ads are non-skippable, and it moves the ad
platform from a side feature to the primary revenue path.

---

## Phase 0 — Pre-existing bugs — ✅ DONE (2026-09-01)

All six landed. `bun run check` reports **0 errors / 0 warnings across 10,583
files**; both the node and static builds are green.

> **A seventh issue surfaced while verifying, and it is the most serious of the
> set — see "Dead auth guards" below.**

| Fix | File | Why |
|---|---|---|
| Capture `startAt` into a non-reactive local that `initHls` reads | [VideoPlayer.svelte:451,465,503-510](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L451) | `initHls` reads the `startAt` prop and is called from the `$effect` at [:875](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L875), making `startAt` an **implicit dependency**. [watch/[id]/+page.svelte:133](apps/web/src/routes/watch/%5Bid%5D/+page.svelte#L133) passes `startAt={startAt()}` from a `$derived` — if it re-evaluates (e.g. after the PPV `invalidateAll()`), the entire HLS instance is destroyed and rebuilt mid-playback. **Verified reachable today.** |
| Extract `endScreenVisible` as one `$derived` | [VideoPlayer.svelte:147-171](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L147) and [:985](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L985) | The `currentTime/duration > 0.9` predicate is duplicated in an effect and in markup. They can disagree, leaving a countdown interval running behind an invisible overlay that then navigates the user away. |
| Add the `Escape` case to `handleKeyDown` | [VideoPlayer.svelte:668-713](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L668) | The comment at :707 claims the shortcuts overlay closes on Esc. It does not — there is no Escape case at all. |
| Prefer the *active* subscription row, not the newest | [api/ads/vast-tag/+server.ts:55](apps/web/src/routes/api/ads/vast-tag/+server.ts#L55) | `ORDER BY createdAt DESC LIMIT 1` picks the newest row. An upgrade/downgrade/re-subscribe sequence can therefore show ads to a paying premium subscriber. |
| Regenerate `pwa-512x512.png` and `pwa-maskable-512x512.png` | [apps/web/static/](apps/web/static/) | Both are actually **262×255**. The PWA manifest advertises 512×512 icons it does not ship, degrading install prompts. |

Also done, as the second of the two named findings: the ad endpoint moved from
`/api/ads/vast-tag` to **`/api/promo/vast-tag`**. EasyList — the filter list
behind uBlock Origin, AdBlock Plus and most mobile content blockers — blocks the
substring `/api/ads/` by default, so the old path was silently unreachable for a
large share of viewers. Every future ad endpoint belongs under `/api/promo/`.

### Dead auth guards (found during Phase 0 verification)

`(admin)/+layout.ts` and `(creator)/+layout.ts` **never ran**. The
`+layout@.svelte` files at `(admin)/admin/` and `(creator)/creator/` reset the
layout hierarchy to the root, which removes the group-level node from the route
chain entirely. The generated client manifest confirmed it: the chain for
`/admin/dashboard` is `[0, 3]` — root, then the reset layout — and the `(admin)`
group node appeared in **no chain at all**.

This predates the SPA migration. The original `(admin)/+layout.server.ts` was
equally dead, despite a comment claiming it guarded "every route under
(admin)/*" as defence in depth.

Why it mattered: [hooks.server.ts:252](apps/web/src/hooks.server.ts#L252)
enforces the admin role **only when the request arrives on the `admin.`
subdomain**. An `/admin/*` path on the apex domain therefore reached the router
with no role check from either layer — so the admin UI would render for any
signed-in user. No data leaked (every `/api/admin/*` endpoint calls
`requireAdmin()` independently), but the interface should not paint.

**Fixed** by moving both guards to the layout nodes that are actually in the
route chain — `(admin)/admin/+layout.ts` and `(creator)/creator/+layout.ts` —
and verifying against the regenerated manifest that both now appear as USED.

**Verify:** watch a movie, scrub, buy a PPV title, press Escape. A dev-only
assertion on `initSeq` (the existing monotonic guard at
[:249-255](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L249)) must
stay at `1` through all of it. Then hit `sepharstudios.com/admin/dashboard` as a
non-admin and confirm a 403 instead of a rendered page.

---

## Track A — Finish the native build — ✅ DONE (2026-09-01)

All 22 `+page.server.ts` files migrated; **zero server loads remain** in
`apps/web/src/routes`. `bun run check` 0 errors / 0 warnings (10,612 files);
node build ✅, static SPA ✅, APK ✅ 7.5 MB.

Fourteen endpoints were created, mostly by collapsing duplication rather than
transcribing each load — `/api/catalog/[kind]` alone replaced three pages that
ran identical queries, and `/api/catalog/detail/[scope]/[slug]` replaced five
that each wrapped the same `loadMediaDetail` helper.

**Two things learned during the work, worth keeping:**

1. **Do not derive payload types from a handler's `Response`.** The obvious trick
   — `Awaited<ReturnType<typeof GET>>['json']` — silently yields `any`, because
   SvelteKit's `json()` returns a plain `Response` and `Response.json()` is
   `Promise<any>`. That erases the typing a `+page.server.ts` gave components for
   free, and it fails silently. Every endpoint now exports a **named payload
   type** built from a `buildXPayload()` function, and the page imports it.
2. **`activeProfileId` is a cookie**, so native clients (bearer auth,
   `credentials: 'omit'`) never send it. `/api/playback/[id]` accepts
   `?profileId=` as an explicit fallback; the cookie still wins on web. Any
   future endpoint reading a cookie has the same gap.

The migration pattern, for reference when adding routes:

**The pattern**, applied per file:
1. Replace direct `db.select(...)` calls with `api()` / `apiSafe()` from
   [$lib/api/client.ts](apps/web/src/lib/api/client.ts), always passing the
   load's `fetch`.
2. Where no endpoint exists, create one under `/api/*`. Catalog endpoints
   (`/api/movies`, `/api/shows`, `/api/documentaries`, `/api/browse`) **do not
   exist yet** and are the bulk of this work.
3. Auth guards read `user` from `await parent()` rather than `locals`.
4. Keep error behaviour identical — the catalog loads currently swallow errors
   and render empty rows; `apiSafe()` preserves that.

**Representative files:** [(app)/movies/+page.server.ts](apps/web/src/routes/(app)/movies/+page.server.ts),
[(app)/shows/+page.server.ts](apps/web/src/routes/(app)/shows/+page.server.ts),
[watch/[id]/+page.server.ts](apps/web/src/routes/watch/%5Bid%5D/+page.server.ts) (the
largest, 433 lines, with PPV gating that **must stay server-side** — see the
security note below).

**The two form-action cases**, both resolved: `(app)/sponsorships` submitted
multipart file uploads via `use:enhance`, and now posts `FormData` to
`/api/sponsorships` with `fetch` (deliberately no `Content-Type` header, so the
browser sets the multipart boundary). `(app)/+page.server.ts` exported an empty
`actions` map solely to make `POST /` return a clean 405 — that could not move
to an endpoint, but nothing regresses because `isFormProbePost()` in
hooks.server.ts short-circuits `POST /` before the router sees it, and that was
always the real filter.

**Security constraint that survives the migration:**
[watch/[id]/+page.server.ts:407-418](apps/web/src/routes/watch/%5Bid%5D/+page.server.ts#L407)
nulls every playback URL server-side when a PPV paywall applies, because load
return values are readable in the network tab. The equivalent endpoint must do
the same check — do not move paywall logic to the client.

**Verify:** `bun run build` (node target) stays green; `bun run build:static`
produces `build-static/`; `bun run build:android:debug` produces an APK that
renders past the shell and can sign in.

---

## Track B — Free tier restructure — ✅ DONE (2026-09-10)

Decisions taken: **reprice `freemium` to $0**, **kids access included on free**,
**no ads on kids/teens content on any tier**.

What shipped:
- `freemium` is now **$0 / 2 profiles / kidsAllowed: true / hasAds: true**.
  Profile cap moved 1 → 2 as a direct consequence of kids access — a kids
  profile occupies a slot, so a 1-profile plan could not hold both a parent and
  a child and `kidsAllowed` would have been decorative.
- **A $0 price is falsy, and three call sites used `!PLAN_PRICES_CENTS[plan]` as
  a plan-validity check** — they would have rejected the free tier as an unknown
  plan the moment the price changed. Replaced with `isPlanName()`, plus an
  `isPaidPlan()` guard so `/api/payment/initialize` and
  `/api/subscriptions/start-trial` refuse free plans outright rather than taking
  a $0.50 card-verification charge to activate something free.
- New `POST /api/subscriptions/start-free`: no Paystack, no OTP, no
  device-fingerprint blacklist (those exist to stop *trial farming*, and a
  permanently-free tier has nothing to farm). Creates the row with
  `nextChargeAt: null` and no authorization code, which is precisely what keeps
  it out of the renewal cron's query.
- `adsAllowedOnCategory()` / `shouldShowAdsFor()` in
  [ads.ts](apps/web/src/lib/subscription/ads.ts) — the category rule is the
  **outer** check, so a freemium viewer on a kids title gets no ads despite
  `hasAds: true`.
- Plans page renders **"Free"**, not `$0.00`; settings dropdown updated.
- [SUBSCRIPTION_TIERS.md](SUBSCRIPTION_TIERS.md) rewritten — it described a
  $10/$15/$25 three-tier model with no freemium and no ads that was **never
  shipped**. Now carries a pointer to `paystack.ts` as the authority.

**Follow-up not done:** the STC staking discount tables were computed against
the old $10/$15/$25 prices and are stale. They need recomputing against $4/$10
before being re-published.

<details>
<summary>Original Track B analysis (superseded)</summary>

There is **no $0 tier today**. [paystack.ts:149-174](apps/web/src/lib/payment/paystack.ts#L149)
defines `freemium` at **$1 per 2 months** with `hasAds: true`; `basic` $4,
`premium` $10, `creator` $10 all have `hasAds: false`. "Free for all" requires:

1. A genuine `free` plan (`$0`, `hasAds: true`) in `PLAN_PRICES_CENTS` and
   `PLAN_FEATURES`, or repricing `freemium` to 0.
2. Deciding what free includes — `maxProfiles`, `kidsAllowed` (currently `false`
   on freemium, which would put the whole kids section behind a paywall).
3. Updating [(app)/plans/+page.svelte](apps/web/src/routes/(app)/plans/+page.svelte),
   which carries an explicit warning that it duplicates `PLAN_FEATURES` manually.
4. Deciding whether `/watch/[id]` stays session-gated. It currently requires a
   session but **no subscription** — so signed-in users with zero subscription
   rows already watch free.
5. **Rewriting [SUBSCRIPTION_TIERS.md](SUBSCRIPTION_TIERS.md).** It documents a
   3-tier $10/$15/$25 model with no freemium and no mention of ads — it does not
   describe the shipped system at all, and every price in it is wrong.

PPV infrastructure already exists (`ppvContent`, `ppvPurchases`,
`contentPricing` with per-region prices) and needs no schema work. Note
`ppvPurchases` has **no expiry column** — a purchase is permanent, so "rental"
is not currently possible.

</details>

---

## Track C — Interactive squeeze-back ads — 🔨 IN PROGRESS

**Done:** schema (7 tables, [0044](drizzle/0044_ads_platform.sql) + apply
script), decisioning ([decision.ts](apps/web/src/lib/server/ads/decision.ts)),
3 endpoints (`/api/promo/plan`, `/decision`, `/e`), and the player squeeze
behind `enableBreakAds` (default **false**, so only the watch page opts in and
the live / creator-preview / admin-review consumers are untouched).

Also done: `/api/cron/promo-rollup` (CRON_SECRET bearer, every 15 min) — the
2-day re-aggregation, the delivered-impressions refresh, and the flight sweep.
`delivered_impressions` is **recomputed from the rollup, never incremented at
serve time**: an increment double-counts on any retry and drifts permanently
with no way to reconcile, whereas recomputing is cheap and self-healing.
New env vars are documented in `.env.example` — `ADS_EVENT_SECRET` is
**required**, and decisioning fails closed without it.

Admin CRUD is in: `/api/admin/promo/{advertisers,campaigns,creatives,breaks,preview,reports}`
plus a Promotions screen at `/admin/promo` (nav entry added under a new
"Monetization" group).

Two decisions in there worth keeping:

- **`/api/admin/promo/preview` writes nothing.** It dry-runs the real auction
  and returns the winner *plus every loser with its rejection reason*, but
  records no impression and does not tick the frequency counter — so an
  operator can run it repeatedly while diagnosing a cap without polluting
  delivery numbers or exhausting the very cap they are investigating.
- **Break placement is validated at creation, not only at decision time.** The
  policy is re-checked in the decision path because breaks reach the table by
  three routes, but an admin deserves the error when they place the break —
  not silence followed by an ad that never fires. `/api/admin/promo/breaks`
  also refuses kids/teens titles outright, since a break there could never serve.
- **Reports keep `served` and `started` as separate columns.** Their ratio is
  the fill-to-render gap — ads decided server-side that never began playing on
  the client, predominantly ad-blocking. Collapsing them into one "impressions"
  figure would hide the most useful health signal this feature has.

**Remaining:** VAST parsing, and retiring the old destructive pre-roll.

**Not yet verified visually.** The squeeze type-checks and builds, but no ad has
actually rendered — that needs campaign rows in a live database. The first real
test should watch `initSeq`: it must stay at `1` through a full break cycle, or
ad state has leaked into the playback-init effect.

Notes from building it that are not obvious from the code:

- **`mediaLibrary.duration` is a display string** (`'2h 7m'`), not seconds —
  there is **no numeric runtime column anywhere on the row**. The true duration
  exists only client-side via `videoEl.duration`, which is why
  `/api/promo/plan` takes `?runtime=` and is called after `loadedmetadata`. An
  early draft did arithmetic on that string; TypeScript caught it, but nothing
  would have caught it at runtime if the column had been `numeric`-typed text.
- **A `$derived` evaluates where it is written.** `adPhase`/`adActive` had to be
  declared far above the rest of the ad controller because `endScreenVisible`
  reads `adActive`, and a derived cannot reference a binding declared later —
  even though an `$effect` can. This bit twice in this session.
- **The ad panes carry no `z-index` deliberately.** The existing stack works by
  DOM order (`<video>` → end screen z-10 → controls overlay *unset* → skip
  buttons z-30 → failure/shortcuts z-40). Inserting the panes right after the
  video stage puts them above the movie and below the controls, which is
  correct. Adding an explicit z-index to the controls to "fix" ordering would
  silently invert today's end-screen-covers-controls behaviour.
- **Volume now has exactly one writer.** `applyVolume()` computes
  `volume × (ducking ? 0.2 : 1)`; `volume` state holds user intent. Three
  places used to write the element directly, so ducking made the slider jump
  and a mid-ad adjustment permanently lost the user's level.

<details>
<summary>Original Track C design (still accurate for the remaining phases)</summary>

**Confirmed product decisions:** movie squeezes to **60%** (broadcast standard,
L-shaped), **max 4 breaks** at least 5 minutes apart with none after 90%,
**non-skippable**. Ads ≤30s duck the movie audio to 20% and let it play on; ads
>30s pause the movie and resume at full size after. Desktop squeezes; **mobile
pauses and the ad takes over full-frame**. Full platform, **excluding** creator
revenue attribution.

### C1. The cardinal constraint

The existing pre-roll is **destructive** — it swaps `src` on the same `<video>`
element. The squeeze must not. Three rules:

- **No new state may be read by the `$effect` at [:875](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L875).**
  It calls `initHls`, which unconditionally does `hls.destroy()`. Keep ad state
  on a separate controller module.
- **The `<video>` must never be unmounted.** The new layout wrapper is an
  unconditional `<div>` — never inside `{#if}`/`{#each}`/`{#key}`.
- **A second `<video>` renders the ad**, which also keeps
  [`reportProgress()`](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L404)
  correct, since it reads `videoEl.currentTime` directly.

Dev assertion: `initSeq` must remain `1` through a full break cycle. This is the
single most valuable test in the feature.

### C2. Layout

Introduce one always-rendered wrapper around `<video>`, `absolute inset-0
origin-top-left`, with a `$derived` `transform: scale(0.6)` when squeezed —
transform, not width/height, so the compositor handles it and the decoded video
surface isn't re-scaled. `motion-reduce:transition-none` handles
`prefers-reduced-motion` in pure Tailwind (the file has **no `<style>` block**;
keep it that way).

**Do not assign z-indices to the ad panes.** The current stack works by DOM
order: `<video>` → end screen (z-10) → controls overlay (*no z-index*, later in
DOM) → skip buttons (z-30) → failure/shortcuts (z-40). Inserting the ad panes
right after the video wrapper with no z-index puts them above the video and
below the controls, which is correct. Adding an explicit z-index to the controls
to "fix" ordering would silently invert today's end-screen behaviour.

Both ad panes need `onclick={(e) => e.stopPropagation()}` — the container's
`onclick` toggles play ([:897](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L897)).

**Chrome during a squeeze:** confine the controls overlay to the movie's 60% box;
disable (duck mode) or hide (pause mode) the seek bar; hide speed/quality/CC/PiP/
next-episode via a `compact` derived; hide the title strip, skip-intro button and
centre play button; gate the end screen on `&& !adActive` **in both places**.

### C3. Behaviour branch

Ad duration must be known **before** the ad element exists, because it decides
pause-vs-duck. Sources, in order: `ad_creatives.durationSeconds` (first-party,
validated 1–180s), server-parsed VAST `<Duration>`, then `loadedmetadata` for
reconciliation only. **If duration is unknown, default to pause** — never leave
the movie running under an ad of unknown length.

**Escalation watchdog:** an advertiser declaring 15s can serve 60s. In duck mode,
set a timer for `declared + 2s`; if still playing, log `ad_duration_mismatch` and
escalate to pause.

**Audio ducking — refactor to a single writer.** Three places currently write
`videoEl.volume` ([:549](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L549),
[:688-689](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L688)) and a
`volumechange` listener writes back into state. Naively setting volume to 0.2
makes the slider jump and loses the user's setting. Introduce one
`applyVolume()` that computes `volume * (ducking ? 0.2 : 1)`; `volume` state
always holds user intent. Mute always wins — **if the player is muted the ad is
muted**, and record `wasMuted` on the impression so reporting is honest.

**Responsive** is two different questions with two different answers: **layout**
is decided client-side (`matchMedia('(min-width: 768px)')` + a `ResizeObserver`
on the container + an explicit iOS exclusion — iOS Safari refuses two
simultaneous video decoders, so duck mode is *physically impossible* there);
**targeting and reporting** use server-derived `deviceType` from
`fingerprintFromHeaders()`, the same helper `watchSessionMeta` uses. Record both.

**PiP:** add `&& !adActive` to the auto-PiP condition at
[:635-640](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L635), exit PiP
at break start (the squeeze is invisible in a PiP window), and set
`disablepictureinpicture` on the ad element.

### C4. Data model

Seven tables in [sepharstudios.ts](apps/web/src/lib/db/schema/sepharstudios.ts)
(all 77 tables live in that one file; it will need `uniqueIndex` added to its
import line): `ad_advertisers` → `ad_campaigns` (flight window, pacing, priority,
targeting, `trackingMode`) → `ad_creatives` (kind video|vast, duration, bitrate,
mobile behaviour) → `ad_breaks` (cue points) → `ad_content_settings` (per-title
opt-out) → `ad_impressions` (one row per served ad, updated in place) →
`ad_campaign_daily` (rollup mirroring `mediaAnalyticsDaily`). Frequency caps live
in Redis, not a table. Global policy goes in the existing `adminSettings.platform`
jsonb — no new settings table.

### C5. Endpoints

**Name everything `/api/promo/*`, not `/api/ads/*`** — EasyList blocks `/api/ads/`
by default, which likely contributes to the existing path appearing inert.

`GET /api/promo/plan` (break schedule), `POST /api/promo/decision` (the auction),
`POST /api/promo/e` (events), `POST /api/promo/c` (click). Plus admin CRUD under
`/api/admin/promo/*` guarded by `requireAdmin(locals)`.

**Never call `/api/promo/decision` during SSR** — it must work identically from a
`capacitor://localhost` WebView, which the CORS rules in
[hooks.server.ts](apps/web/src/hooks.server.ts) already allow.

**Event integrity** must improve on the existing thumbnail-counter pattern
(an unauthenticated `col = col + 1` with no dedup — trivially inflatable):
HMAC-signed `decisionId`, a monotonic status state machine so replays are no-ops,
the existing Redis token bucket from `$lib/server/rate-limit.ts`, and a billable
definition of `status >= started AND watched_seconds >= 2`. The gap between
`served` and `started` is your ad-block measurement.

### C6. VAST

**Server-side parsing; do not take the IMA SDK dependency.** IMA wants to own the
content video element (a direct collision with C1), only surfaces duration after
`LOADED` (too late for the pause/duck decision), forces fullscreen on iOS
(destroying the squeeze), has no story for `capacitor://` origins, and is blocked
by ad blockers. Parse VAST server-side, normalise to the same shape as
first-party creatives so the player has one rendering path, and fan out
third-party pixels server-side by default (`trackingMode` allows per-partner
client-side firing where contracts demand it).

**Untrusted XML from an admin-supplied URL** — guard XXE (no entity expansion)
and SSRF (https only, reject private/loopback ranges, cap body at 256KB, cap
wrapper depth at 5).

### C7. Reuse, don't reinvent

- Deterministic per-user selection: `chooseThumbnail()` djb2 pattern in
  [thumbnail-rotation.ts:27-49](apps/web/src/lib/server/thumbnail-rotation.ts#L27).
- Bayesian winner selection: [ab-promote.ts](apps/web/src/lib/server/ab-promote.ts).
- Cron rollup shape: [api/cron/analytics-rollup](apps/web/src/routes/api/cron/analytics-rollup/+server.ts).
- Presigned creative URLs: `getPresignedUrl()` in [minio.ts:124](apps/web/src/lib/server/minio.ts#L124).
- Screen-reader announcements: the existing debounced `announce()` in
  `$lib/stores/live-region` — **not** `aria-live` on a per-second countdown,
  which spams AT.

### C8. Sequencing

Phase 1 schema → Phase 2 admin CRUD (valuable alone: inventory planning) →
Phase 3 decisioning (dark-launchable, measure fill rate before any UI) →
Phase 4 player behind `enableBreakAds=false` so the other three VideoPlayer
consumers are untouched (4a wrapper only → 4b panes + simulated break → 4c wire
to decision → 4d duck/pause/mobile/PiP/seek → 4e a11y + telemetry) → Phase 5
VAST → Phase 6 rollup, reports, and delete the destructive pre-roll so the src
effect reduces to `if (videoEl && src) initHls(...)` with no ad state at all.

Include an admin `/api/promo/preview` dry-run returning the winner **and every
loser with its rejection reason** — "why isn't my campaign serving?" is the
number-one ad-ops question and without it every answer is database archaeology.

---

</details>

## Track D — §21 AI cost ledger

~15 AI features run today (`ai-tagging`, `ai-moderation`, `ai-companion`,
`ai-creator-insights`, `ai-nft`, `ai-token-scoring`, …) and **no cost table
exists** — tracking lives in exactly one endpoint, `/api/ai/copilot`. On a free
platform, unbounded AI COGS with no attribution is the exact risk the Xepho doc
was written about.

Build `estimate → reserve → execute → record actual → reconcile`, with a ledger
row per paid call carrying `userId`, `creatorId`, `contentId`, `provider`,
`model`, `operation`, input/output units, estimated vs actual cost, and retry
number. Categories trimmed to Sephar's reality: **Planning** (LLM), **Speech**
(TTS/subtitles), **QC** (moderation), **Compute** (encode), **Delivery**
(egress). Budget ceilings per user/month and per creator/month, plus a platform
daily emergency cap and a provider circuit breaker.

Wire through [ai-provider.ts](apps/web/src/lib/server/ai-provider.ts) so no call
site can bypass it.

---

## Track E — §29 Adaptive delivery + offline

1. **Audio-only rendition** from the encoder — the strongest low-bandwidth lever,
   and cheap to add to an existing HLS ladder.
2. **Offline downloads** (BUILD_PLAN §5.2, unchecked). This is the main reason
   the APK bundles assets rather than wrapping a URL. Needs the download manager,
   IndexedDB metadata, and the existing
   [/api/downloads/manifest/[id]](apps/web/src/routes/api/downloads/manifest/%5Bid%5D/+server.ts)
   endpoint wired to real segment caching. **Depends on Track A.**
3. **Playback telemetry** — error rate and effective bitrate by geography and
   device, extending `watchSessionMeta`. The `LEVEL_SWITCHED` hls.js event is
   already wired at [:469-471](apps/web/src/lib/components/widgets/VideoPlayer.svelte#L469).

---

## Track F — §23 atomic publishing + §24 QC gates

Both land in the Temporal encoder workflow. **Atomic publish:** the live version
stays available until the new version passes every check and the publish
transaction commits — never expose a half-encoded swap. **QC gates**, trimmed to
what applies to a streaming platform (drop Xepho's pedagogical/factual/presenter
checks): technical (duration, codec, black frames, corruption), accessibility
(captions present), rights/provenance, and safety via the existing
[ai-moderation.ts](apps/web/src/lib/server/ai-moderation.ts). Block publish on
failure. Add idempotency against double-charge, a dead-letter queue, and
per-creator fairness.

---

## Track G — §34 Observability

Extend `mediaAnalyticsDaily` and [analytics.ts](apps/web/src/lib/server/analytics.ts):
playback error rate and effective bitrate by geography/device, encode failure
reason distribution, AI cost per user and per creator (from Track D), ad fill
rate and served-vs-started gap (from Track C). Note `track()` has no typed event
union today — event names are free-form strings at seven call sites; a typed
union is cheap to add and prevents silent drift.

---

## Track H — Retire the legacy encoder services

Per [TECHDEBT.md](TECHDEBT.md), after ~7 days at 100% Temporal traffic: back up
the orchestrator Postgres, stop the `encoder-orchestrator` and `encoder-service`
Dokploy services, delete
[api/encoder/job-state/[jobId]](apps/web/src/routes/api/encoder/job-state/%5BjobId%5D/+server.ts)
and [api/cron/encoder-poll](apps/web/src/routes/api/cron/encoder-poll/+server.ts),
remove `ORCHESTRATOR_*` env vars, and delete the legacy repos. Drop the volume
after 30 days. ~2 hours, mostly ops.

---

## Recommended order

1. **Phase 0** — small, independent, unblocks everything else cleanly.
2. **Track A** — nothing native works until it's done; Track E depends on it.
3. **Track B** — decide the tier model before building ad economics on top of it.
4. **Track C** — the revenue path, in its own six phases.
5. **Track D** — grows more urgent with every AI feature and every free user.
6. **Tracks E, F, G** — parallelisable; F and G share the encoder workflow.
7. **Track H** — ops cleanup, any time after the Temporal soak.

---

## Verification

| Track | How to verify |
|---|---|
| Phase 0 | Watch, scrub, buy PPV, press Escape — `initSeq` stays `1` |
| A | `bun run build` green; `bun run build:android:debug` → APK that renders and signs in |
| B | Sign up with no payment method and watch a title; confirm ads serve and kids access matches intent |
| C | `initSeq === 1` after a full break cycle; pathological cases: seek across a break, tab away mid-ad, kill network mid-ad, ad 404, `play()` rejection, ad longer than declared |
| D | Every AI call produces a ledger row; a user over budget is refused |
| E | Airplane mode plays a downloaded title in the APK |
| F | Publish a corrupt file — it must be blocked and the live version must survive |
| G | Dashboards show non-zero playback and cost metrics |
| H | Encoder pipeline still completes with the legacy services stopped |

CI ([.github/workflows/build.yml](.github/workflows/build.yml)) builds Docker,
the SPA, the APK and the desktop app on every push to `main`.

---

## Open questions

1. **Desktop Tauri is unverified.** crates.io is blocked at TLS/443 on the dev
   machine (all of `index.crates.io`, `static.crates.io`, `crates.io` time out
   with 0 bytes over both IPv4 and IPv6, while ICMP answers in 60ms and GitHub
   and npm are fine). The Tauri config has therefore never been compiled — the
   first CI run is what will confirm it. This also breaks pip/PyPI. Test on a
   phone hotspot to determine whether it is the ISP or the machine (Reason
   Cybersecurity is installed alongside Defender and is the first thing to
   uninstall-test).
2. **Does duck mode apply to pre-roll?** A pre-roll has no movie playing to duck
   against, so pre-roll should always be full-frame. Assumed yes.
3. **Kids section and ads** — `freemium` currently has `kidsAllowed: false`. On a
   free platform, does the kids section carry ads at all? Faith-based children's
   content with non-skippable ads is a reputational decision, not a technical one.
4. **Non-skippable + 60s pause** is the harshest combination in the design. It is
   coherent for a free platform, but worth measuring completion-rate impact
   before making it the default across all inventory.
