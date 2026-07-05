<script lang="ts">
  import type { MediaItem } from '$lib/types/media';
  import { Play, Bookmark, BookmarkCheck } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { myList } from '$lib/stores/myList';
  import { isRecentlyAdded } from '$lib/utils/recency';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';

  let { documentary, onClick = () => {}, onHover = () => {} }: { documentary: MediaItem; onClick?: () => void; onHover?: () => void } = $props();

  let videoRef: HTMLVideoElement | undefined = $state();
  let isHovered = $state(false);
  let previewTimeout: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    isHovered = true;
    onHover?.();
    // Silently swallow AbortError when a fast hover-out pauses before play resolves.
    previewTimeout = setTimeout(() => { videoRef?.play().catch(() => {}); }, 500);
  };

  const handleMouseLeave = () => {
    isHovered = false;
    clearTimeout(previewTimeout);
    if (videoRef) {
      videoRef.pause();
      videoRef.currentTime = 0;
    }
  };

  // Card click opens the global quick-view modal; the inner Play pill
  // navigates straight to the detail page. Kids/teens-categorized rows
  // route through the audience portal so they stay inside the
  // age-appropriate detail variant.
  const detailPath = () => {
    const slug = documentary.slug || documentary.id;
    if (documentary.category === 'kids') return `/kids/kiddies/${slug}`;
    if (documentary.category === 'teens') return `/kids/teens/${slug}`;
    return `/documentaries/${slug}`;
  };

  const openQuickView = () => {
    if (!documentary.id) { onClick(); return; }
    // Tag the mediaType so the modal's More-info routing lands on
    // /documentaries even when the row didn't ship the field.
    mediaModalStore.open({ ...documentary, mediaType: documentary.mediaType ?? 'documentary' });
  };

  const navigate = () => {
    if (!documentary.id) { onClick(); return; }
    goto(detailPath());
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      openQuickView();
    }
  };
</script>

<div
  role="button"
  tabindex="0"
  class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-[1.02]"
  aria-label={`Watch ${documentary.title}`}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={openQuickView}
  onkeydown={handleKeyDown}
>
  <div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">
    {#if isHovered && documentary.trailerUrl}
      <video
        bind:this={videoRef}
        src={documentary.trailerUrl}
        class="absolute inset-0 w-full h-full object-cover z-0"
        loop
        muted
        playsinline
        preload="none"
      ></video>
    {:else}
      <img
        src={documentary.posterUrl || documentary.poster_url || documentary.thumbnail || '/placeholder-vertical.jpg'}
        alt=""
        width="280"
        height="420"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover"
      />
    {/if}
    <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
    {#if typeof documentary.progressPercent === 'number' && documentary.progressPercent > 0 && documentary.progressPercent < 95}
      <div class="absolute inset-x-0 bottom-0 h-1 bg-black/40 z-20">
        <div
          class="h-full bg-[#FF5E0E]"
          style="width: {Math.max(2, Math.min(100, documentary.progressPercent))}%"
        ></div>
      </div>
    {/if}
  </div>

  {#if documentary.isNew}
    <div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">
      New Documentary
    </div>
  {:else if isRecentlyAdded(documentary.createdAt)}
    <div class="absolute top-2 left-2 bg-[#FF5E0E] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full z-30 shadow">
      Just added
    </div>
  {/if}

  <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
    <h3 class="text-sm font-semibold line-clamp-2 text-white">{documentary.title}</h3>

    <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">
      {#if documentary.rating}<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">{documentary.rating}</span>{/if}
      {#if documentary.duration}<span>{documentary.duration}</span>{/if}
      {#if documentary.quality}<span>{documentary.quality}</span>{/if}
    </div>

    <div class="mt-3 flex items-center gap-2">
      <button
        class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"
        onclick={(e) => { e.stopPropagation(); navigate(); }}
        aria-label={`Play ${documentary.title}`}
      >
        <Play class="h-3.5 w-3.5" />
        Play
      </button>
      <button
        class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
        onclick={(e) => {
          e.stopPropagation();
          if (!documentary.id) return;
          void myList.toggle({
            contentId: documentary.id,
            contentTitle: documentary.title,
            contentType: 'documentary'
          });
        }}
        disabled={!documentary.id || (!!documentary.id && $myList.pending.has(documentary.id))}
        aria-label={documentary.id && $myList.ids.has(documentary.id) ? `Remove ${documentary.title} from My List` : `Add ${documentary.title} to My List`}
      >
        {#if documentary.id && $myList.ids.has(documentary.id)}
          <BookmarkCheck class="h-3.5 w-3.5" />
          In My List
        {:else}
          <Bookmark class="h-3.5 w-3.5" />
          My List
        {/if}
      </button>
    </div>
  </div>
</div>
