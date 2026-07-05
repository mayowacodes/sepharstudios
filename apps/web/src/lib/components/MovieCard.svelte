<script lang="ts">
  import { onMount } from 'svelte';
  import type { MediaItem } from '$lib/types/media';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import { myList } from '$lib/stores/myList';
  import { goto } from '$app/navigation';
  import { Play, Bookmark, BookmarkCheck } from '@lucide/svelte';
  import { isRecentlyAdded } from '$lib/utils/recency';

  // Click on a card opens the QUICK-VIEW MODAL (Netflix-style overlay
  // with trailer/backdrop + Play + My List + More info) — restored as
  // the primary card interaction. The modal is mounted globally in the
  // (app) layout; opening it is just a store write, no navigation.
  // The inner Play pill goes straight to the audience-specific detail
  // page instead: kids/teens rows route through their portals, general
  // rows to /movies/<slug>.
  const detailPath = (media: MediaItem) => {
    const slug = media.slug || media.id;
    if (media.category === 'kids') return `/kids/kiddies/${slug}`;
    if (media.category === 'teens') return `/kids/teens/${slug}`;
    return `/movies/${slug}`;
  };

  const openModal = (media: MediaItem) => {
    mediaModalStore.open(media);
  };

  let { movie, onClick = () => {}, onHover = () => {} }: { movie: MediaItem; onClick?: () => void; onHover?: () => void } = $props();

  // Badge label is keyed off mediaType so a "New" movie reads "New
  // Movie", a new documentary "New Documentary", etc. Series default to
  // "New Episode" since that's what the isNew flag conventionally means
  // on episodic content. Falls back to a generic "New" for unknown types.
  function newBadgeLabel(mt: string | null | undefined): string {
    switch (mt) {
      case 'movie': return 'New Movie';
      case 'short': return 'New Short';
      case 'series': return 'New Episode';
      case 'episode': return 'New Episode';
      case 'documentary': return 'New Documentary';
      case 'sermon': return 'New Sermon';
      case 'worship': return 'New Worship';
      default: return 'New';
    }
  }

  let videoRef: HTMLVideoElement | undefined = $state();
  let isHovered = $state(false);
  let previewTimeout: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    isHovered = true;
    onHover?.();
    // .play() returns a Promise that rejects with AbortError if a pause()
    // (from a fast hover-out) lands before the play actually starts. Catch
    // silently — there's nothing to do about a paused-before-played video,
    // and the unhandled rejection was spamming the console with red noise.
    previewTimeout = setTimeout(() => {
      videoRef?.play().catch(() => {});
    }, 500);
  };

  const handleMouseLeave = () => {
    isHovered = false;
    clearTimeout(previewTimeout);
    if (videoRef) {
      videoRef.pause();
      videoRef.currentTime = 0;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick?.();
      openModal(movie);
    }
  };

  onMount(() => {
    if (videoRef) videoRef.muted = true;
  });
</script>

<div
  role="button"
  tabindex="0"
  class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-[1.02]"
  aria-label={`Watch ${movie.title}`}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={() => {
    onClick?.();
    openModal(movie);
  }}
  onkeydown={handleKeyDown}
>
  <div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">
    {#if isHovered && movie.trailerUrl}
      <video
        bind:this={videoRef}
        src={movie.trailerUrl}
        class="absolute inset-0 w-full h-full object-cover z-0"
        loop
        muted
        playsinline
        preload="none"
      ></video>
    {:else}
      <!--
        Card slot is portrait (aspect-2/3). Prefer the actual portrait
        posterUrl when the creator/admin set one — otherwise we end up
        cropping a 16:9 landscape thumbnail into a tall sliver (e.g.
        "TRUST" centered with the rest of the artwork chopped off).
        Falls back to thumbnail → poster_url (legacy snake_case) →
        a vertical placeholder so missing-image rows still render
        something recognizable instead of the giant film-reel SVG.
      -->
      <img
        src={movie.posterUrl || movie.poster_url || movie.thumbnail || '/placeholder-vertical.jpg'}
        alt=""
        width="280"
        height="420"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover"
      />
    {/if}
    <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
    <!-- "You started this" strip — only renders when the catalog
         server-load attached a progress overlay for the current
         viewer. Burned into the artwork's bottom edge so it reads
         as an indicator, not a UI control. -->
    {#if typeof movie.progressPercent === 'number' && movie.progressPercent > 0 && movie.progressPercent < 95}
      <div class="absolute inset-x-0 bottom-0 h-1 bg-black/40 z-20">
        <div
          class="h-full bg-[#FF5E0E]"
          style="width: {Math.max(2, Math.min(100, movie.progressPercent))}%"
        ></div>
      </div>
    {/if}
  </div>

  {#if movie.isNew}
    <div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">
      {newBadgeLabel(movie.mediaType)}
    </div>
  {:else if isRecentlyAdded(movie.createdAt)}
    <!-- "Just added" — 14-day window from `created_at`. Surfaces
         fresh catalog additions so returning viewers spot the new
         stuff at a glance. `isNew` (a creator-curated flag for new
         TV episodes) wins when present. -->
    <div class="absolute top-2 left-2 bg-[#FF5E0E] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full z-30 shadow">
      Just added
    </div>
  {/if}

  <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
    <h3 class="text-sm font-semibold line-clamp-2 text-white">{movie.title}</h3>

    <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">
      {#if movie.rating}<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">{movie.rating}</span>{/if}
      {#if movie.duration}<span>{movie.duration}</span>{/if}
      {#if movie.quality}<span>{movie.quality}</span>{/if}
    </div>

    <div class="mt-3 flex items-center gap-2">
      <button
        class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"
        onclick={(e) => { e.stopPropagation(); goto(detailPath(movie)); }}
        aria-label={`Play ${movie.title}`}
      >
        <Play class="h-3.5 w-3.5" />
        Play
      </button>
      <button
        class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
        onclick={(e) => {
          e.stopPropagation();
          void myList.toggle({
            contentId: movie.id,
            contentTitle: movie.title,
            contentType: 'movie'
          });
        }}
        disabled={$myList.pending.has(movie.id)}
        aria-label={$myList.ids.has(movie.id) ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`}
      >
        {#if $myList.ids.has(movie.id)}
          <BookmarkCheck class="h-3.5 w-3.5" />
        {:else}
          <Bookmark class="h-3.5 w-3.5" />
        {/if}
        My List
      </button>
    </div>
  </div>
</div>
