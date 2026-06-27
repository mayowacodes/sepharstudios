<!--
  MediaDetailPage — the shared "description page" for movies, TV series,
  and documentaries. Lives between the catalog and the watch page:

    /movies              → catalog grid
    /movies/<slug>       → THIS page (description + 60s preview + Watch CTA)
    /watch/<slug>        → full playback

  Layout:
    Top:    Full-bleed backdrop with gradient overlay
    Hero:   Left column = title/metadata/description/cast/crew/CTAs
            Right column = 60-second muted auto-play preview
    Below:  Episodes (TV series only)
    Below:  Reviews

  Mode prop allows kids/teens variants in a future pass — for now only
  `standard` is implemented; the other branches just fall through to
  the standard rendering. Kept here so the route's load function can
  pass it through without coupling future variants to new files.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { PlayCircle, Bookmark, BookmarkCheck, RotateCcw, Check, CheckCheck, Bell, BellRing } from '@lucide/svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
  import MediaPreviewPlayer from '$lib/components/widgets/MediaPreviewPlayer.svelte';
  import ShareButton from '$lib/components/widgets/ShareButton.svelte';
  import ReviewSection from '$lib/components/widgets/ReviewSection.svelte';
  import ParentalGate from '$lib/components/widgets/ParentalGate.svelte';
  import { myList } from '$lib/stores/myList';

  interface CastMember { name: string; role: string; characterName?: string; photoUrl?: string }
  interface CrewMember { name: string; role: string; photoUrl?: string }
  interface Episode {
    id: string;
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    description?: string | null;
    thumbnail?: string | null;
    duration?: string | null;
  }

  interface ContentRow {
    id: string;
    slug: string | null;
    title: string;
    description: string | null;
    thumbnail: string | null;
    backdropUrl: string | null;
    posterUrl: string | null;
    // Transparent PNG title treatment overlaid on the hero. When
    // present, swaps the plain-text H1 for a real branded logo.
    logoTitleUrl: string | null;
    trailerUrl: string | null;
    /** Resolved master playlist URL (server load runs encoder-playback helper). */
    playbackUrl: string | null;
    ageRating: string | null;
    genres: string[] | null;
    topics: string[] | null;
    year: string | null;
    duration: string | null;
    language: string | null;
    bibleReference: string | null;
    cast: CastMember[] | null;
    crew: CrewMember[] | null;
    mediaType: string | null;
    /** Workflow state. When 'coming_soon', the page replaces the
     *  Watch CTA with a Notify-me toggle and hides Mark as Watched.
     *  Other values render the normal playable layout. */
    status?: string | null;
    /** Planned go-live timestamp for coming_soon rows. Drives the
     *  "Releases [date]" copy under the title. */
    scheduledPublishAt?: string | Date | null;
  }

  interface WatchProgress {
    positionSeconds: number;
    durationSeconds: number | null;
    completionPercent: number;
    episodeId: string | null;
    /** Set when the most-recent progress row is for a TV episode.
     *  Used to enrich the Resume CTA label ("Resume S2 E5 · 12:34"). */
    episodeSeason?: number | null;
    episodeNumber?: number | null;
    episodeTitle?: string | null;
    /** True when the loader has advanced us to the next unwatched
     *  episode (last one was complete). Drives a "Watch Next" CTA
     *  instead of "Resume". */
    isNextEpisode?: boolean;
  }

  interface Props {
    content: ContentRow;
    /** TV series episodes — empty/undefined for movies & documentaries. */
    episodes?: Episode[];
    /** Server-supplied progress for this title (signed-in viewers only).
     *  When present + non-trivial, the hero shows a Resume CTA next to
     *  the standard Watch button. */
    watchProgress?: WatchProgress | null;
    /** True when this content is already in the user's default
     *  playlist ("My List"). Drives the initial bookmark button state. */
    isInMyList?: boolean;
    /** Future hook for kids/teens variants; defaults to standard. */
    mode?: 'standard' | 'kids' | 'teens';
    /** Length of the auto-play preview clip. Detail-page default is 60s
     *  for adults; kids/teens will pass shorter values in their routes. */
    previewDurationSec?: number;
  }

  let { content, episodes = [], watchProgress = null, isInMyList = false, mode = 'standard', previewDurationSec = 60 }: Props = $props();

  // My List membership now lives in the shared `myList` store so all
  // surfaces (catalog cards, hover-cards, this detail page) stay in
  // sync without prop drilling. We seed the store on mount with the
  // server's membership snapshot — initial SSR render uses the `prop`
  // directly to avoid any server-side store pollution across requests,
  // then the client takes over once mounted. The store handles the
  // optimistic toggle + toast.
  let mounted = $state(false);
  onMount(async () => {
    mounted = true;
    if (isInMyList) myList.seedIds([content.id]);
    // Hydrate the Coming Soon notify-me bell. Skipped for non-coming-soon
    // rows so we don't waste a request on every detail-page load.
    if (content.status === 'coming_soon') {
      try {
        const res = await fetch(`/api/coming-soon/${content.id}/notify`);
        if (res.ok) {
          const body = await res.json();
          notifySubscribed = !!body.subscribed;
          notifySignedIn = body.signedIn ?? true;
        }
      } catch {
        // ignore — the CTA still renders, just without a hydrated state
      }
    }
  });

  const inList = $derived(mounted ? $myList.ids.has(content.id) : isInMyList);
  const togglingList = $derived($myList.pending.has(content.id));

  async function toggleMyList(): Promise<void> {
    await myList.toggle({
      contentId: content.id,
      contentTitle: content.title,
      contentType: content.mediaType ?? 'movie'
    });
  }

  // Coming Soon notify-me — only meaningful when content.status ===
  // 'coming_soon'. Hydrates from /api/coming-soon/<id>/notify on
  // mount, toggled by the bell CTA below. Anonymous viewers see a
  // sign-in prompt before they can subscribe.
  const isComingSoon = $derived(content.status === 'coming_soon');
  let notifySubscribed = $state(false);
  let notifySignedIn = $state(true);
  let notifyBusy = $state(false);

  const releaseLabel = $derived.by(() => {
    const raw = content.scheduledPublishAt ?? null;
    if (!raw) return null;
    const ts = raw instanceof Date ? raw.getTime() : Date.parse(String(raw));
    if (Number.isNaN(ts)) return null;
    return new Date(ts).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  });

  async function toggleNotify(): Promise<void> {
    if (notifyBusy) return;
    if (!notifySignedIn) {
      void goto(`/auth/login?redirectTo=${encodeURIComponent(`/movies/${content.slug || content.id}`)}`);
      return;
    }
    notifyBusy = true;
    const previous = notifySubscribed;
    notifySubscribed = !notifySubscribed; // optimistic
    try {
      const res = await fetch(`/api/coming-soon/${content.id}/notify`, { method: 'POST' });
      if (!res.ok) {
        notifySubscribed = previous;
        toast.error("Couldn't update reminder");
        return;
      }
      const body = await res.json();
      notifySubscribed = !!body.subscribed;
      toast.success(notifySubscribed
        ? `We'll notify you when ${content.title} drops`
        : `Reminder removed for ${content.title}`);
    } catch {
      notifySubscribed = previous;
      toast.error('Network error');
    } finally {
      notifyBusy = false;
    }
  }

  // Mark as Watched / Unwatch — manual override over the auto-tracked
  // progress. Only relevant for signed-in viewers; we optimistically
  // flip the local "looks watched" flag then invalidate so server
  // state catches up (Resume CTA + Continue Watching row react).
  let markingWatched = $state(false);
  // A row is considered "watched" when the server told us the
  // progress is in finished territory (>=95%) OR the user just
  // pressed Mark as Watched. Local override lives until the next
  // server load supersedes it.
  let manualWatched: boolean | null = $state(null);
  const looksWatched = $derived(
    manualWatched !== null
      ? manualWatched
      : (watchProgress?.completionPercent ?? 0) >= 95
  );

  async function toggleWatched(): Promise<void> {
    if (markingWatched) return;
    markingWatched = true;
    const next = !looksWatched;
    manualWatched = next; // optimistic
    try {
      const res = await fetch(`/api/watch/mark/${content.id}?as=${next ? 'watched' : 'unwatched'}`, {
        method: 'POST'
      });
      if (!res.ok) {
        manualWatched = !next;
        toast.error("Couldn't update watch status", {
          description: 'Please try again in a moment.'
        });
        return;
      }
      toast.success(next ? 'Marked as watched' : 'Removed watched status', {
        description: content.title
      });
      // Refresh the page's load data so the Resume CTA + progress bar
      // re-render based on the server's new view of the row.
      await invalidateAll();
    } catch (err) {
      manualWatched = !next;
      console.error('mark-as-watched failed', err);
      toast.error('Network error', { description: 'Please try again.' });
    } finally {
      markingWatched = false;
    }
  }

  let descExpanded = $state(false);
  let gateOpen = $state(false);
  // When the parental gate intercepts a click, we need to remember which
  // CTA the user pressed so the success path can navigate to the right
  // URL (Resume vs Start over).
  let pendingHref = $state<string | null>(null);

  // Theme registry — every visual difference between standard / kids /
  // teens lives in one place so the layout JSX stays linear. The
  // structural skeleton (hero, preview, description, cast, episodes,
  // reviews) is identical across modes; only palette + sizing change.
  // Tailwind requires full class literals (the JIT can't see dynamic
  // class names), so every variant lists its classes in full strings.
  const theme = $derived.by(() => {
    switch (mode) {
      case 'kids':
        return {
          pageBg: 'bg-gradient-to-br from-yellow-50 via-pink-50 to-pink-100 text-pink-900',
          backdropOpacity: 'opacity-20',
          backdropGradient: 'bg-gradient-to-b from-transparent via-pink-50/60 to-yellow-50',
          titleClasses: 'text-pink-700',
          titleSize: 'text-5xl sm:text-6xl',
          metaTextColor: 'text-pink-700/80',
          ageChipClasses: 'border-pink-400 text-pink-700',
          genreChipClasses: 'bg-pink-200 text-pink-800 border-pink-300 text-sm',
          descTextColor: 'text-pink-900/80',
          descToggleColor: 'text-pink-600 hover:text-pink-800',
          bibleColor: 'text-amber-600',
          chipBoxClasses: 'bg-white border-pink-200',
          chipTextPrimary: 'text-pink-800',
          chipTextSecondary: 'text-pink-500',
          watchClass: 'bg-pink-500 hover:bg-pink-600 text-white shadow-[0_0_24px_rgba(236,72,153,0.5)] hover:scale-110 transition-all',
          watchLabel: 'Play!',
          outlineBtnClass: 'border-pink-400 text-pink-700 hover:bg-pink-100',
          ctaSize: 'lg' as const,
          previewBorder: 'border-pink-300',
          avatarSize: 'w-8 h-8',
          featuringHeading: 'You\'ll see',
          showMoreLabel: 'Read more',
          showLessLabel: 'Show less'
        };
      case 'teens':
        return {
          pageBg: 'bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white',
          backdropOpacity: 'opacity-30',
          backdropGradient: 'bg-gradient-to-b from-transparent via-indigo-950/60 to-indigo-950',
          titleClasses: 'text-white',
          titleSize: 'text-4xl sm:text-5xl',
          metaTextColor: 'text-indigo-100/80',
          ageChipClasses: 'border-indigo-300/40 text-indigo-100',
          genreChipClasses: 'bg-indigo-500/20 border-indigo-300/30 text-indigo-100 text-xs',
          descTextColor: 'text-indigo-50/90',
          descToggleColor: 'text-indigo-200/70 hover:text-white',
          bibleColor: 'text-amber-300',
          chipBoxClasses: 'bg-indigo-500/10 border-indigo-300/20',
          chipTextPrimary: 'text-indigo-50',
          chipTextSecondary: 'text-indigo-200/60',
          watchClass: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.45)] hover:scale-105 transition-all',
          watchLabel: 'Watch',
          outlineBtnClass: 'border-indigo-300/40 text-white hover:bg-indigo-500/20',
          ctaSize: 'lg' as const,
          previewBorder: 'border-indigo-300/30',
          avatarSize: 'w-6 h-6',
          featuringHeading: 'Featuring',
          showMoreLabel: 'Show more',
          showLessLabel: 'Show less'
        };
      default:
        return {
          pageBg: 'bg-[#0b0c10] text-white',
          backdropOpacity: 'opacity-40',
          backdropGradient: 'bg-gradient-to-b from-transparent via-[#0b0c10]/40 to-[#0b0c10]',
          titleClasses: 'text-white',
          titleSize: 'text-4xl sm:text-5xl',
          metaTextColor: 'text-white/70',
          ageChipClasses: 'border-white/30 text-white',
          genreChipClasses: 'bg-white/8 backdrop-blur-sm border-white/10 text-white/90 text-xs',
          descTextColor: 'text-white/80',
          descToggleColor: 'text-white/60 hover:text-white',
          bibleColor: 'text-amber-300/90',
          chipBoxClasses: 'bg-white/5 border-white/10',
          chipTextPrimary: 'text-white/90',
          chipTextSecondary: 'text-white/50',
          watchClass: 'bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_24px_rgba(255,94,14,0.5)] hover:scale-105 transition-all',
          watchLabel: 'Watch',
          outlineBtnClass: 'border-white/20 text-white hover:bg-white/10 backdrop-blur-sm',
          ctaSize: 'lg' as const,
          previewBorder: 'border-white/10',
          avatarSize: 'w-6 h-6',
          featuringHeading: 'Featuring',
          showMoreLabel: 'Show more',
          showLessLabel: 'Show less'
        };
    }
  });

  // Watch URL prefers slug to keep the address bar friendly (we already
  // made the watch route accept both slug and uuid earlier in the project).
  //
  // For SERIES, default to deep-linking the FIRST episode. Without this,
  // hitting Watch on a series plays back the series-row's videoUrl (which
  // is fine — the encoder writes it onto the series row in the new wizard
  // flow), but the watch page treats `?episode` as missing and tracks
  // progress against `episodeId IS NULL`. The viewer's "Continue watching"
  // card on the dashboard then shows the show-level row instead of
  // "Resume · S1 E1 · 4:12". Pointing the CTA at the first episode keeps
  // the watch-progress row episode-scoped from the first second.
  //
  // Episode 1 in the new wizard flow has `videoUrl: null` — the watch
  // route already falls back to the show's playbackUrl when the active
  // episode's videoUrl is missing, so playback works correctly.
  const firstEpisodeId = $derived.by<string | null>(() => {
    if (!episodes || episodes.length === 0) return null;
    const sorted = [...episodes].sort((a, b) =>
      a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber
    );
    return sorted[0]?.id ?? null;
  });
  const watchHref = $derived.by(() => {
    const base = `/watch/${content.slug || content.id}`;
    return firstEpisodeId ? `${base}?episode=${firstEpisodeId}` : base;
  });

  // Resume URL — when watch-progress exists, the Resume CTA passes the
  // saved second offset via `?t=`. Episode-progress also includes
  // `&episode=<id>` so the watch page picks the right rendition.
  //
  // The base `watchHref` may itself carry `?episode=<first-episode-id>`
  // for series (see watchHref derivation above), so we strip the query
  // string before re-appending params here. Otherwise the URL ends up
  // with two `?` and the second-onwards segment gets parsed as the
  // path, breaking the route match.
  const resumeHref = $derived.by(() => {
    if (!watchProgress) return watchHref;
    const base = `/watch/${content.slug || content.id}`;
    const params = new URLSearchParams();
    params.set('t', String(watchProgress.positionSeconds));
    // Prefer the explicit episodeId from the progress row; fall back to
    // the first-episode default for series so resume still scopes to
    // an episode when the row predates the new schema.
    const episodeId = watchProgress.episodeId ?? firstEpisodeId;
    if (episodeId) params.set('episode', episodeId);
    return `${base}?${params.toString()}`;
  });

  // Whether the page has a meaningful Resume CTA to show. The loader
  // already guards against trivial scrubbing (<15s) and near-complete
  // (>=95%) — this just nullsafes the prop.
  const showResume = $derived(!!watchProgress);

  // Pretty-format the resume position for the button label. Uses the
  // shorter `MM:SS` form for sub-hour positions; H:MM:SS otherwise.
  const resumeTimeLabel = $derived.by(() => {
    if (!watchProgress) return '';
    const total = Math.max(0, Math.floor(watchProgress.positionSeconds));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  });

  // Episode-level resume label — `S2 E5 · 12:34` when the most-recent
  // progress row is for an episode; bare `12:34` otherwise. Keeps the
  // CTA self-explanatory: viewer knows which episode they're jumping
  // back into before clicking.
  // For "watch next" path (last episode was complete) we drop the
  // timestamp since we're starting at 0 — just the episode coordinates.
  const resumeEpisodeLabel = $derived.by(() => {
    if (!watchProgress) return '';
    const ep = watchProgress.episodeSeason != null && watchProgress.episodeNumber != null
      ? `S${watchProgress.episodeSeason} E${watchProgress.episodeNumber}`
      : null;
    if (watchProgress.isNextEpisode) return ep ?? '';
    return ep ? `${ep} · ${resumeTimeLabel}` : resumeTimeLabel;
  });

  const primaryCtaLabel = $derived(
    watchProgress?.isNextEpisode ? 'Watch Next' : 'Resume'
  );

  // Parental-gate session memory. After a successful pass we stash the
  // expiry into sessionStorage so the next 15 minutes of clicks bypass
  // the gate (industry standard — matches Disney+/YouTube Kids). The
  // key lives in sessionStorage rather than localStorage so it resets
  // when the browser/tab closes; a parent leaving a tab open for the
  // kid is intentional, leaving the device forever shouldn't bypass
  // forever. 15 minutes was picked to cover an episode + a couple of
  // back-button hops, but stay short enough that an unattended toddler
  // can't go on a long binge.
  const PARENTAL_GATE_TTL_MS = 15 * 60 * 1000;
  const PARENTAL_GATE_KEY = 'sephar.parentalGate.passedUntil';

  function readGateExpiry(): number {
    if (typeof sessionStorage === 'undefined') return 0;
    const raw = sessionStorage.getItem(PARENTAL_GATE_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  }

  function writeGateExpiry(epochMs: number): void {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(PARENTAL_GATE_KEY, String(epochMs));
  }

  // CTA click handler — for kids mode the parental gate intercepts and
  // delays the navigation until the math question is answered. Other
  // modes navigate immediately. Within the 15-min memory window, kids
  // mode behaves like standard.
  function onCtaClick(href: string, e: MouseEvent): void {
    if (mode !== 'kids') return; // <a href> handles it natively
    if (readGateExpiry() > Date.now()) return; // bypass: still within session window
    e.preventDefault();
    pendingHref = href;
    gateOpen = true;
  }

  function onGatePass(): void {
    writeGateExpiry(Date.now() + PARENTAL_GATE_TTL_MS);
    const href = pendingHref;
    gateOpen = false;
    pendingHref = null;
    if (href) void goto(href);
  }

  function onGateClose(): void {
    gateOpen = false;
    pendingHref = null;
  }

  // Group episodes by season — TV detail pages render a season-by-season
  // accordion. Pure derivation; no $state needed.
  const seasonMap = $derived.by(() => {
    const map = new Map<number, Episode[]>();
    for (const ep of episodes ?? []) {
      const list = map.get(ep.seasonNumber) ?? [];
      list.push(ep);
      map.set(ep.seasonNumber, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.episodeNumber - b.episodeNumber);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  });

  const hasPreview = $derived(!!content.playbackUrl);
  const hasDescription = $derived((content.description ?? '').trim().length > 0);
  // Cap the in-page chip list so the hero stays clean — full list still
  // surfaces below via the topics row.
  const heroGenres = $derived((content.genres ?? []).slice(0, 4));
</script>

<div class="relative min-h-screen {theme.pageBg}">
  <!-- Backdrop image. Falls back through backdrop → poster → thumbnail so
       a row missing any single asset still renders something. The
       gradient overlay keeps the hero text readable — mode-specific
       palette so kids/teens get their lighter / cooler tone. -->
  <div class="absolute inset-x-0 top-0 h-[60vh] overflow-hidden">
    <img
      src={content.backdropUrl || content.posterUrl || content.thumbnail || '/placeholder-vertical.jpg'}
      alt=""
      class="w-full h-full object-cover {theme.backdropOpacity}"
    />
    <div class="absolute inset-0 {theme.backdropGradient}"></div>
  </div>

  <main class="relative z-10 container mx-auto px-4 pt-24 pb-12">
    <!-- Hero row: left = metadata, right = preview -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center mb-12">
      <div class="space-y-5 max-w-2xl">
        <!-- Mode + content type chip (audience cue, sits above title) -->
        <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider {theme.metaTextColor}">
          {#if content.mediaType}
            <span class="px-2 py-0.5 rounded-full {theme.chipBoxClasses} border">{content.mediaType}</span>
          {/if}
          {#if mode !== 'standard'}
            <span class="px-2 py-0.5 rounded-full bg-[#FFBF00]/20 text-[#FFBF00] border border-[#FFBF00]/30">{mode}</span>
          {/if}
        </div>

        <!--
          Branded title treatment when a transparent PNG title logo
          was uploaded — renders the logo in place of the plain text
          H1 so the detail hero reads as a cinematic title card, not
          system font. The plain H1 stays as visually-hidden text so
          screen readers + SEO still see the title.
        -->
        {#if content.logoTitleUrl}
          <img
            src={content.logoTitleUrl}
            alt={content.title}
            class="max-h-28 sm:max-h-36 lg:max-h-44 w-auto object-contain drop-shadow-lg"
          />
          <h1 class="sr-only">{content.title}</h1>
        {:else}
          <h1 class="{theme.titleSize} font-extrabold leading-tight text-display drop-shadow-lg {theme.titleClasses}">
            {content.title}
          </h1>
        {/if}

        <!-- Metadata strip: age + year + duration + language. Mirrors the
             in-player overlay so creators see one consistent vocabulary. -->
        <div class="flex flex-wrap items-center gap-3 text-sm {theme.metaTextColor}">
          {#if content.ageRating}
            <span class="px-2 py-0.5 border rounded text-[11px] uppercase tracking-wider {theme.ageChipClasses}">
              {content.ageRating}
            </span>
          {/if}
          {#if content.year}<span>{content.year}</span>{/if}
          {#if content.duration}<span>{content.duration} min</span>{/if}
          {#if content.language && content.language !== 'English'}<span>{content.language}</span>{/if}
        </div>

        <!-- Genre chips -->
        {#if heroGenres.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each heroGenres as g (g)}
              <span class="px-3 py-1 rounded-full border {theme.genreChipClasses}">
                {g}
              </span>
            {/each}
          </div>
        {/if}

        <!-- Description with expand/collapse — same pattern as the watch page -->
        {#if hasDescription}
          <div>
            <p class="leading-relaxed {theme.descTextColor} {descExpanded ? '' : 'line-clamp-2'}">
              {content.description}
            </p>
            {#if (content.description?.length ?? 0) > 140}
              <button
                type="button"
                class="text-xs mt-1 underline-offset-2 hover:underline {theme.descToggleColor}"
                onclick={() => (descExpanded = !descExpanded)}
              >
                {descExpanded ? theme.showLessLabel : theme.showMoreLabel}
              </button>
            {/if}
          </div>
        {/if}

        <!-- Bible reference highlight (faith-first platform identity) -->
        {#if content.bibleReference}
          <div class="flex items-center gap-2 text-sm {theme.bibleColor}">
            <span>📖</span>
            <span>{content.bibleReference}</span>
          </div>
        {/if}

        <!-- Cast & crew avatar row -->
        {#if (content.cast && content.cast.length > 0) || (content.crew && content.crew.length > 0)}
          <div class="pt-2">
            <div class="text-xs uppercase tracking-wider {theme.metaTextColor} mb-2">{theme.featuringHeading}</div>
            <div class="flex flex-wrap gap-3">
              {#each (content.cast ?? []).slice(0, 6) as p (p.name + p.role)}
                <div class="flex items-center gap-2 px-2 py-1 rounded-full border {theme.chipBoxClasses}">
                  {#if p.photoUrl}
                    <img src={p.photoUrl} alt="" class="{theme.avatarSize} rounded-full object-cover" />
                  {:else}
                    <div class="{theme.avatarSize} rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {(p.name ?? '?').charAt(0).toUpperCase()}
                    </div>
                  {/if}
                  <div class="text-xs">
                    <div class="{theme.chipTextPrimary} leading-tight">{p.name}</div>
                    {#if p.characterName}
                      <div class="{theme.chipTextSecondary} leading-tight">as {p.characterName}</div>
                    {/if}
                  </div>
                </div>
              {/each}
              {#each (content.crew ?? []).slice(0, 3) as p (p.name + p.role)}
                <div class="flex items-center gap-2 px-2 py-1 rounded-full border {theme.chipBoxClasses}">
                  {#if p.photoUrl}
                    <img src={p.photoUrl} alt="" class="{theme.avatarSize} rounded-full object-cover" />
                  {:else}
                    <div class="{theme.avatarSize} rounded-full bg-zinc-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {(p.name ?? '?').charAt(0).toUpperCase()}
                    </div>
                  {/if}
                  <div class="text-xs">
                    <div class="{theme.chipTextPrimary} leading-tight">{p.name}</div>
                    <div class="{theme.chipTextSecondary} leading-tight">{p.role}</div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Primary CTAs. When a meaningful watch-progress row exists,
             Resume becomes the leading button and the standard Watch
             demotes to "Start over". When no progress exists, only the
             standard Watch button renders.

             Coming Soon rows replace the Watch CTA entirely with a
             Notify-me bell — the title isn't playable yet. The trailer
             still plays in the preview pane above.

             Kids mode intercepts the click and shows the parental gate
             modal; everyone else gets a normal anchor navigation. -->
        <div class="flex flex-wrap items-center gap-3 pt-3">
          {#if isComingSoon}
            {#if releaseLabel}
              <p class="w-full text-sm text-white/70">
                Releases <span class="font-semibold text-white">{releaseLabel}</span>
              </p>
            {/if}
            <Button
              size={theme.ctaSize}
              onclick={toggleNotify}
              disabled={notifyBusy}
              class={notifySubscribed
                ? 'bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]'
                : theme.outlineBtnClass}
            >
              {#if notifySubscribed}
                <BellRing class="mr-2 h-5 w-5" />
                You'll be notified
              {:else}
                <Bell class="mr-2 h-5 w-5" />
                Notify me when it drops
              {/if}
            </Button>
          {:else if showResume}
            <Button
              size={theme.ctaSize}
              href={resumeHref}
              onclick={(e: MouseEvent) => onCtaClick(resumeHref, e)}
              class={theme.watchClass}
            >
              <PlayCircle class="mr-2 h-5 w-5" />
              {primaryCtaLabel}{resumeEpisodeLabel ? ` · ${resumeEpisodeLabel}` : ''}
            </Button>
            {#if !watchProgress?.isNextEpisode}
              <!-- "Start over" only makes sense when the primary CTA is
                   resuming mid-watch. In the "watch next" case we drop
                   it — clicking S2E5 already implies "fresh start" for
                   that episode, and Netflix-style flows don't offer to
                   jump back to the pilot from here. -->
              <Button
                size={theme.ctaSize}
                variant="outline"
                href={watchHref}
                onclick={(e: MouseEvent) => onCtaClick(watchHref, e)}
                class={theme.outlineBtnClass}
              >
                <RotateCcw class="mr-2 h-4 w-4" />
                Start over
              </Button>
            {/if}
          {:else}
            <Button
              size={theme.ctaSize}
              href={watchHref}
              onclick={(e: MouseEvent) => onCtaClick(watchHref, e)}
              class={theme.watchClass}
            >
              <PlayCircle class="mr-2 h-5 w-5" />
              {theme.watchLabel}
            </Button>
          {/if}
          <Button
            size={theme.ctaSize}
            variant="outline"
            class={theme.outlineBtnClass}
            disabled={togglingList}
            onclick={toggleMyList}
          >
            {#if inList}
              <BookmarkCheck class="mr-2 h-4 w-4" />
              In My List
            {:else}
              <Bookmark class="mr-2 h-4 w-4" />
              My List
            {/if}
          </Button>
          <ShareButton
            contentId={content.slug || content.id}
            title={content.title}
            description={content.description ?? ''}
          />
          <!-- Mark as Watched / Unwatch — small icon-only chip so it
               doesn't compete with Watch / My List for hierarchy.
               Only renders for the standard + teens modes; kids mode
               assumes auto-tracking is the only honest signal. Hidden
               on Coming Soon rows (you can't have watched something
               that hasn't released). -->
          {#if mode !== 'kids' && !isComingSoon}
            <button
              type="button"
              onclick={toggleWatched}
              disabled={markingWatched}
              aria-pressed={looksWatched}
              aria-label={looksWatched ? `Remove watched status from ${content.title}` : `Mark ${content.title} as watched`}
              class="inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed {looksWatched
                ? 'border-green-500/50 bg-green-500/15 text-green-200 hover:bg-green-500/25'
                : theme.outlineBtnClass}"
            >
              {#if looksWatched}
                <CheckCheck class="h-4 w-4" />
                Watched
              {:else}
                <Check class="h-4 w-4" />
                Mark watched
              {/if}
            </button>
          {/if}
        </div>

        {#if showResume && watchProgress && !watchProgress.isNextEpisode}
          <!-- Tiny progress bar under the CTAs to visualise how far the
               viewer got. Mode-themed so kids/teens stay in palette.
               Hidden on the "watch next" path since the next episode is
               at 0% — showing an empty bar would be misleading. -->
          <div class="pt-2 max-w-md">
            <div class="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                class="h-full {mode === 'kids' ? 'bg-pink-500' : mode === 'teens' ? 'bg-indigo-500' : 'bg-[#FF5E0E]'}"
                style="width: {Math.max(2, Math.min(100, watchProgress.completionPercent))}%"
              ></div>
            </div>
            <div class="text-[10px] uppercase tracking-wider {theme.metaTextColor} mt-1">
              {watchProgress.completionPercent}% watched
            </div>
          </div>
        {/if}
      </div>

      <!-- Right column: preview clip (or backdrop fallback when no
           playback URL). Preview duration is mode-controlled by the
           parent (60s adults, 15s kids/teens). -->
      <div class="aspect-video w-full rounded-xl overflow-hidden border shadow-2xl {theme.previewBorder}">
        {#if hasPreview && content.playbackUrl}
          <MediaPreviewPlayer
            src={content.playbackUrl}
            poster={content.backdropUrl ?? content.thumbnail ?? undefined}
            maxDurationSec={previewDurationSec}
          />
        {:else}
          <div class="w-full h-full bg-zinc-900 flex flex-col items-center justify-center text-center p-6">
            <PlayCircle class="w-12 h-12 text-white/30 mb-3" />
            <div class="text-white/60 text-sm">Preview will be available once encoding completes.</div>
          </div>
        {/if}
      </div>
    </div>

    <!-- TV-series episode list, grouped by season. Movies + docs skip this. -->
    {#if seasonMap.length > 0}
      <section class="mb-12">
        <h2 class="text-xl font-bold text-white mb-4">Episodes</h2>
        <div class="space-y-6">
          {#each seasonMap as [season, eps] (season)}
            <div>
              <div class="text-sm uppercase tracking-wider text-white/50 mb-3">Season {season}</div>
              <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {#each eps as ep (ep.id)}
                  <li>
                    <a
                      href={`/watch/${content.slug || content.id}?episode=${ep.id}`}
                      class="block rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#FF5E0E]/60 hover:bg-white/8 transition-colors"
                    >
                      <div class="aspect-video bg-black/40 relative">
                        {#if ep.thumbnail}
                          <img src={ep.thumbnail} alt="" class="w-full h-full object-cover" />
                        {/if}
                        <div class="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] uppercase tracking-wider">
                          E{ep.episodeNumber}
                        </div>
                        {#if ep.duration}
                          <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px]">
                            {ep.duration}
                          </div>
                        {/if}
                      </div>
                      <div class="p-3 space-y-1">
                        <div class="text-sm font-semibold text-white truncate">{ep.title}</div>
                        {#if ep.description}
                          <div class="text-xs text-white/60 line-clamp-2">{ep.description}</div>
                        {/if}
                      </div>
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Reviews -->
    <section class="mb-12">
      <ReviewSection contentId={content.id} contentType={content.mediaType ?? 'movie'} />
    </section>
  </main>

  <!-- Parental gate — rendered globally so any CTA in this page can
       intercept and route through it when `mode='kids'`. No-op in
       teens/standard since `onCtaClick` short-circuits there. -->
  <ParentalGate open={gateOpen} onPass={onGatePass} onClose={onGateClose} />
</div>
