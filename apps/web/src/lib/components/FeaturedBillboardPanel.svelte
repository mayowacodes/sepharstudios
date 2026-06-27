<script lang="ts">
  import { onMount } from 'svelte';
  import { PlayCircle, Volume2, VolumeX } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';

  type Featured = {
    id: string;
    slug?: string | null;
    title: string;
    description?: string | null;
    thumbnail?: string | null;
    backdropUrl?: string | null;
    trailerUrl?: string | null;
    // Transparent PNG title treatment. When set, replaces the plain-
    // text H2 so the cinematic billboard reads as a real branded
    // logo over the trailer instead of a generic system font.
    logoTitleUrl?: string | null;
    year?: string | null;
    duration?: string | null;
    quality?: string | null;
    category?: 'kids' | 'teens' | string | null;
  };

  // Cinematic billboard panel for catalog landing pages.
  // The trailer fills the whole panel; title / pill / description /
  // Watch Now anchor to the bottom-left over a gradient veil.
  // Shared between /movies, /shows, /documentaries.
  let {
    featured,
    label = 'Just Added',
    watchHref,
    detailHref
  }: {
    featured: Featured;
    label?: string;
    watchHref?: string;
    detailHref?: string;
  } = $props();

  // Audio handling — browsers block unmuted autoplay, so the panel
  // starts muted (autoplay works) and surfaces a small speaker chip
  // viewers can tap to bring sound in. The choice persists for the
  // session under sephar.billboardAudio so it carries between
  // /movies → /shows → /documentaries.
  let muted = $state(true);
  let videoEl: HTMLVideoElement | undefined = $state();
  let panelEl: HTMLElement | undefined = $state();
  // True when the panel is even partially visible. Drives pause-on-scroll —
  // when the viewer scrolls past, we stop playback so audio + battery aren't
  // wasted on an off-screen frame.
  let onScreen = $state(true);
  const AUDIO_KEY = 'sephar.billboardAudio';

  onMount(() => {
    try {
      if (sessionStorage.getItem(AUDIO_KEY) === 'on') {
        muted = false;
        if (videoEl) {
          videoEl.muted = false;
          videoEl.volume = 0.6;
        }
      }
    } catch {
      // sessionStorage can throw in private browsing — ignore.
    }
    const onVis = () => {
      if (!videoEl) return;
      if (document.hidden || !onScreen) videoEl.pause();
      else videoEl.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);

    // Pause when scrolled off-screen, resume when scrolled back.
    //
    // We track multiple thresholds + a negative rootMargin so the
    // trailer pauses as soon as the panel's center band leaves the
    // viewport — NOT only when the very last pixel scrolls off.
    // The old threshold of 0.1 kept isIntersecting=true while a 70vh
    // panel still had ~7vh visible, so the trailer kept playing
    // (and audio kept emitting) well after the viewer had scrolled
    // past it. With threshold: [0, 0.25, 0.5] + rootMargin '-15%
    // top/bottom', we pause as soon as <25% of the panel is in the
    // centered visible band — which matches viewer expectation.
    let io: IntersectionObserver | undefined;
    if (panelEl && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry || !videoEl) return;
          const visible = entry.intersectionRatio >= 0.25;
          onScreen = visible;
          if (!visible) {
            videoEl.pause();
          } else if (!document.hidden) {
            videoEl.play().catch(() => {});
          }
        },
        {
          threshold: [0, 0.25, 0.5],
          rootMargin: '-15% 0px -15% 0px'
        }
      );
      io.observe(panelEl);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
    };
  });

  function toggleAudio(event: MouseEvent): void {
    // Don't bubble — the panel root is clickable (navigates to detail).
    event.stopPropagation();
    muted = !muted;
    if (videoEl) {
      videoEl.muted = muted;
      if (!muted) videoEl.volume = 0.6;
    }
    try {
      sessionStorage.setItem(AUDIO_KEY, muted ? 'off' : 'on');
    } catch {
      // ignore — session-storage failures shouldn't break playback.
    }
  }

  const resolvedWatchHref = $derived(
    watchHref ?? `/watch/${featured.slug || featured.id}`
  );

  // Detail-page route mirrors the audience routing on MovieCard: kids
  // titles land on /kids/kiddies/<slug>, teens on /kids/teens/<slug>,
  // everything else on /movies/<slug>. Callers can override via prop.
  const resolvedDetailHref = $derived.by(() => {
    if (detailHref) return detailHref;
    const slug = featured.slug || featured.id;
    if (featured.category === 'kids') return `/kids/kiddies/${slug}`;
    if (featured.category === 'teens') return `/kids/teens/${slug}`;
    return `/movies/${slug}`;
  });

  function handlePanelClick(event: MouseEvent): void {
    // Clicks on interactive children (Watch Now button, audio toggle) shouldn't
    // also navigate. We only navigate on clicks that bubble up to here.
    const target = event.target as HTMLElement | null;
    if (target?.closest('a, button')) return;
    void goto(resolvedDetailHref);
  }

  function handlePanelKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void goto(resolvedDetailHref);
    }
  }
</script>

<div
  bind:this={panelEl}
  role="button"
  tabindex="0"
  aria-label={`Open ${featured.title}`}
  onclick={handlePanelClick}
  onkeydown={handlePanelKeyDown}
  class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 min-h-[70vh] lg:min-h-[80vh] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5E0E]/70"
>
  <!-- Layer 1: trailer (or backdrop image fallback) fills the entire panel. -->
  {#if featured.trailerUrl}
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      bind:this={videoEl}
      src={featured.trailerUrl}
      poster={featured.thumbnail ?? undefined}
      class="absolute inset-0 h-full w-full object-cover"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
    ></video>
  {:else}
    <img
      src={featured.backdropUrl || featured.thumbnail || ''}
      alt={featured.title}
      class="absolute inset-0 h-full w-full object-cover"
    />
  {/if}

  <!-- Layer 2: gradient veil — keeps the bottom-left text readable
       without darkening the upper-right of the frame. -->
  <div
    class="absolute inset-0 bg-linear-to-tr from-black via-black/70 to-transparent pointer-events-none"
  ></div>
  <div
    class="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent pointer-events-none"
  ></div>

  <!-- Audio toggle chip — top-right so it doesn't compete with the
       bottom-left text block. Visually distinct between muted (dim
       glass) and sound-on (orange brand glow) so the state is obvious
       at a glance, not just an icon swap. -->
  {#if featured.trailerUrl}
    <button
      type="button"
      onclick={toggleAudio}
      aria-label={muted ? 'Unmute trailer' : 'Mute trailer'}
      aria-pressed={!muted}
      class="absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-full backdrop-blur-md px-4 py-2.5 text-sm font-semibold transition-all
        {muted
          ? 'border border-white/20 bg-black/40 text-white/80 hover:bg-black/60'
          : 'border border-[#FF5E0E] bg-[#FF5E0E]/30 text-white shadow-[0_0_20px_rgba(255,94,14,0.55)]'}"
    >
      {#if muted}
        <VolumeX class="h-5 w-5" />
        <span class="hidden sm:inline">Muted</span>
      {:else}
        <Volume2 class="h-5 w-5" />
        <span class="hidden sm:inline">Sound on</span>
      {/if}
    </button>
  {/if}

  <!-- Layer 3: text block anchored bottom-left. -->
  <div
    class="relative z-10 flex h-full min-h-[70vh] lg:min-h-[80vh] flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-3xl"
  >
    <div
      class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00] w-fit"
    >
      <span
        class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"
      ></span>
      {label}
    </div>
    <!--
      Title treatment — text-only on the billboard panel.
      The detail page hero uses logoTitleUrl when present (that
      backdrop is static, so a logo composites cleanly), but the
      billboard's background is a PLAYING TRAILER. Stacking a large
      transparent logo on top of moving footage buried the actor +
      composition and read as "broken layout" — the trailer is
      already doing the cinematic title work. The H2 stays so the
      title is announced + indexed; visual emphasis comes from the
      trailer + the orange Watch Now CTA underneath.
    -->
    <h2
      class="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-display drop-shadow"
    >
      {featured.title}
    </h2>
    {#if featured.description}
      <p
        class="mt-3 text-white/80 line-clamp-3 max-w-2xl text-base sm:text-lg drop-shadow"
      >
        {featured.description}
      </p>
    {/if}
    <div class="mt-3 flex flex-wrap gap-3 text-sm text-white/70">
      {#if featured.year}<span>{featured.year}</span>{/if}
      {#if featured.duration}<span>{featured.duration}</span>{/if}
      {#if featured.quality}<span>{featured.quality}</span>{/if}
    </div>
    <div class="mt-5">
      <Button
        size="lg"
        class="bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]"
        href={resolvedWatchHref}
      >
        <PlayCircle class="mr-2 h-5 w-5" />
        Watch Now
      </Button>
    </div>
  </div>
</div>
