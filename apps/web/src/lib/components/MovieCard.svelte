<script lang="ts">
  import { onMount } from 'svelte';
  import type { MediaItem } from '$lib/types/media';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import { myList } from '$lib/stores/myList';
  import { goto } from '$app/navigation';
  import { Play, Bookmark, BookmarkCheck } from '@lucide/svelte';

  // Click on a card opens the audience-specific detail page (description
  // + preview + Watch CTA). The kids/teens portals reuse this same
  // catalog component, so the card detects the row's `category` and
  // routes through `/kids/kiddies/<slug>` or `/kids/teens/<slug>` for
  // those audiences instead of the general `/movies/<slug>`. General-
  // audience rows (no category or anything outside the kids/teens
  // taxonomy) keep going to /movies.
  const detailPath = (media: MediaItem) => {
    const slug = media.slug || media.id;
    if (media.category === 'kids') return `/kids/kiddies/${slug}`;
    if (media.category === 'teens') return `/kids/teens/${slug}`;
    return `/movies/${slug}`;
  };

  const openModal = (media: MediaItem) => {
    mediaModalStore.open(media);
    goto(detailPath(media), { replaceState: false });
  };

  let { movie, onClick = () => {}, onHover = () => {} }: { movie: MediaItem; onClick?: () => void; onHover?: () => void } = $props();

  let videoRef: HTMLVideoElement | undefined = $state();
  let isHovered = $state(false);
  let previewTimeout: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    isHovered = true;
    onHover?.();
    previewTimeout = setTimeout(() => videoRef?.play(), 500);
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
      <img
        src={movie.thumbnail || '/placeholder-vertical.jpg'}
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
      New Episode
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
        onclick={(e) => { e.stopPropagation(); openModal(movie); }}
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
