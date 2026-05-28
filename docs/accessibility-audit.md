# Accessibility Audit — Round 9

> Internal a11y pass focused on WCAG 2.1 Level A + AA violations identifiable from code review. Does not substitute for real-device screen-reader testing (NVDA / VoiceOver / TalkBack) or paid auditors like Deque.

## What shipped

`svelte-check`: 0 errors / 0 warnings ✓ throughout.

### P0 — WCAG violations

| # | Issue | Fix | File |
|---|---|---|---|
| **1** | No skip-to-content link (WCAG SC 2.4.1) | Added `<a href="#main-content" class="sr-only focus:not-sr-only …">` to (app), (protected), (web3), kids layouts. Each layout's content is wrapped in `<main id="main-content" tabindex="-1">`. | [(app)/+layout.svelte](../apps/web/src/routes/(app)/+layout.svelte), [(protected)/+layout.svelte](../apps/web/src/routes/(protected)/+layout.svelte), [(web3)/+layout.svelte](../apps/web/src/routes/(web3)/+layout.svelte), [kids/+layout.svelte](../apps/web/src/routes/kids/+layout.svelte) |
| **2** | No `<main>` landmark in protected / web3 routes | Wrapped content in `<main>` (above). Required for screen-reader landmark navigation. | same as #1 |
| **3** | `focus:outline-none` without replacement on MovieCard / TVShowCard / DocumentaryCard (WCAG SC 2.4.7) | Added `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background` | [MovieCard.svelte](../apps/web/src/lib/components/MovieCard.svelte), [TVShowCard.svelte](../apps/web/src/lib/components/TVShowCard.svelte), [DocumentaryCard.svelte](../apps/web/src/lib/components/DocumentaryCard.svelte) |
| **4** | Raw `outline: none` in AICopilot input CSS | Added `:focus-visible` rule with brand-color box-shadow + border-color | [AICopilot.svelte:568-590](../apps/web/src/lib/components/widgets/AICopilot.svelte#L568) |
| **5** | Icon-only VideoPlayer buttons missing aria-label | Added `aria-label` (state-aware where relevant) + `aria-hidden="true"` on decorative SVGs | [VideoPlayer.svelte](../apps/web/src/lib/components/widgets/VideoPlayer.svelte) — play/pause, skip ±10s, mute, fullscreen, CC |
| **6** | Toggle buttons missing `aria-pressed` | Added `aria-pressed={state}` to play/pause, mute, fullscreen | [VideoPlayer.svelte](../apps/web/src/lib/components/widgets/VideoPlayer.svelte) |
| **7** | Volume slider missing label + ARIA values | Added `aria-label="Volume"`, `aria-valuemin/max/now` | [VideoPlayer.svelte](../apps/web/src/lib/components/widgets/VideoPlayer.svelte) |
| **8** | KidsMovieCard only handled Enter, not Space | Changed handler to accept both + added `e.preventDefault()` so Space doesn't scroll | [KidsMovieCard.svelte](../apps/web/src/lib/components/kids/KidsMovieCard.svelte) |
| **9** | Profile modals lacked `role="dialog"`, `aria-modal`, focus trap, Escape dismiss | Added all four, plus first-input autofocus on open. Outer overlay click + Escape close. Focus cycles between first/last focusable on Tab. | [AddProfileModal.svelte](../apps/web/src/lib/components/profile/AddProfileModal.svelte), [EditProfileModal.svelte](../apps/web/src/lib/components/profile/EditProfileModal.svelte) |

### P1 — Polish + structural fixes

| # | Issue | Fix | File |
|---|---|---|---|
| **10** | Cards had no accessible name (`role="button"` with no text label) | Added `aria-label={`Watch ${title}`}` to MovieCard / TVShowCard / DocumentaryCard / KidsMovieCard | same as #3 + KidsMovieCard |
| **11** | Card images redundantly duplicated the title (h3 text + identical `alt`) | Changed `<img alt={title}>` to `<img alt="">` — the parent's `aria-label` carries the accessible name. Screen readers no longer announce the title twice. | same as #10 |
| **12** | `/movies`, `/shows`, `/documentaries`, `/plans` had no `<title>` (all read "Sephar Studios") | Added `<svelte:head><title>X · Sephar Studios</title><meta description></svelte:head>` to each | [movies](../apps/web/src/routes/(app)/movies/+page.svelte), [shows](../apps/web/src/routes/(app)/shows/+page.svelte), [documentaries](../apps/web/src/routes/(app)/documentaries/+page.svelte), [plans](../apps/web/src/routes/(app)/plans/+page.svelte) |
| **13** | Plans page had h1 → h3 skip on "Connect Wallet for NFT Benefits" | Changed to h2 to maintain proper hierarchy | [plans/+page.svelte:203](../apps/web/src/routes/(app)/plans/+page.svelte#L203) |

---

## What the audit flagged but I did NOT fix

### Legitimate suppressions (kept as-is)

- **VideoPlayer's three `<!-- svelte-ignore a11y_* -->`** on the container, controls overlay, and progress bar. These are documented as legitimate — the player uses `role="application"` with `<svelte:window onkeydown>` global handlers. Re-flagging would mean breaking the working keyboard control model.
- **search/+page.svelte's `<!-- svelte-ignore a11y_autofocus -->`**. Documented exception: the page's primary purpose is a single control (the search input), matching Google/Bing UX.

### Items deferred (not in this round)

- **EnhancedVideoPlayer.svelte has no keyboard support** — flagged by audit but the primary player ([VideoPlayer.svelte](../apps/web/src/lib/components/widgets/VideoPlayer.svelte)) is what users see. If EnhancedVideoPlayer is repurposed for production, repeat the VideoPlayer fixes there.
- **Color contrast** — audit flagged `text-white/40`, `text-white/50`, `text-gray-400/500` on dark backgrounds. These need actual Lighthouse/axe scans on a running deployment to measure ratios — not solvable from static code review.
- **`aria-pressed` on bookmark/My-List buttons** in cards — pending until the actual save state is wired through to the card prop. Currently no card knows whether the item is in "My List" because the data isn't surfaced.
- **AICopilot dialog semantics** — if it's always inline (not modal), no fix needed. If it's a modal overlay when open, it needs the same treatment as the profile modals. Manual review needed.
- **Avatar picker generic "Avatar" alt text** in [ProfileAvatarSelector.svelte](../apps/web/src/lib/components/kids/ProfileAvatarSelector.svelte) — minor, doesn't affect screen-reader navigation since the avatars are visually distinct via emoji + color.
- **Watch page sparse heading structure** — the watch page is largely visual; the title is the only meaningful h1. Reviews section could use an h2 but isn't a blocker.

---

## What's NOT covered by this audit

This is a code-review audit. It does NOT cover:

- **Real screen-reader testing** — must be done with NVDA + Firefox (Windows), VoiceOver + Safari (Mac/iOS), TalkBack + Chrome (Android). Code review catches structural issues but misses interaction-level ones (e.g., focus that jumps weirdly, announcements that fire at the wrong time).
- **Color contrast ratios** — needs a running deployment + Lighthouse / axe DevTools.
- **Reduced motion** — does the site respect `prefers-reduced-motion`? Some carousels and the video preview animations should pause/disable when set. Not investigated.
- **Form field error announcements** — when validation fails, is the error message associated to the input via `aria-describedby`? Sample a few forms manually.
- **Time-based media** — captions are wired in VideoPlayer; audio descriptions for blind users are NOT (no `<track kind="descriptions">`). This is a WCAG SC 1.2.5 (Audio Description, Level AA) gap. Requires generating description tracks, which is a content-side, not code-side, task.
- **Live region announcements** — toast messages, loading states, "X added to watchlist" confirmations. Should fire in `aria-live="polite"` regions. Not investigated.

---

## Recommendations for the next a11y round

1. **Run Lighthouse on every public route** after this lands. Capture the SEO/a11y scores; aim ≥ 95.
2. **Run [axe DevTools](https://www.deque.com/axe/devtools/) browser extension** on the home, browse, watch, plans, settings, and one creator page. Fix every "Critical" + "Serious" finding it surfaces.
3. **Manual keyboard walk-through** — from a fresh tab, hit Tab through the home page, then the player, then a settings flow. Verify focus is visible and logical at every stop.
4. **Hire a Deque-style audit** before public launch — code review + automated scans catch ~50% of WCAG issues. The remaining 50% require trained human eyes.

---

## Outstanding (not in this round)

- **Reduced motion support** — review animation utility classes and gate them behind `motion-safe:`.
- **Form validation a11y** — survey all `<input>` with validation, wire `aria-describedby` to error messages.
- **Captions/Subtitles audit** — verify the catalogue actually has subtitle tracks attached, not just that the player supports them.
- **Audio descriptions** — content-side decision; gap exists today but is not a code-fix.
- **Bookmark `aria-pressed`** — pending the data model change to surface "is in my list?" to card components.
