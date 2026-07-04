<script lang="ts">
  import { Play, Bookmark, BookmarkCheck } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { myList } from '$lib/stores/myList';
  import { isRecentlyAdded } from '$lib/utils/recency';

  let { show, onClick = () => {}, onHover = () => {} }: {
    show: {
      id?: string;
      title: string;
      description: string;
      thumbnail: string;
      /** Portrait (2:3) poster. Catalog cards prefer this; falls back to
       *  `thumbnail` (landscape) only when the row never got a portrait
       *  poster set, since cropping landscape into the portrait slot
       *  produces a tall sliver instead of the full artwork. */
      posterUrl?: string | null;
      link: string;
      trailerUrl?: string;
      rating?: string;
      duration?: string;
      quality?: string;
      backdrop_url?: string;
      year?: string;
      genres?: string[];
      bibleReference?: string;
      ageRating?: string;
      slug?: string;
      language?: string;
      isNew?: boolean;
      category?: 'kids' | 'teens' | string | null;
      progressPercent?: number;
      positionSeconds?: number;
      createdAt?: string | Date | null;
    };
    onClick?: () => void;
    onHover?: () => void;
  } = $props();

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

  const navigate = () => {
    // Card click goes to the show's detail page first (description +
    // episodes + preview); the detail page's Watch CTA hops to /watch.
    // Kids/teens-categorized shows route through the audience portal.
    if (!show.id) { onClick(); return; }
    const slug = show.slug || show.id;
    if (show.category === 'kids') goto(`/kids/kiddies/${slug}`);
    else if (show.category === 'teens') goto(`/kids/teens/${slug}`);
    else goto(`/shows/${slug}`);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate();
    }
  };
</script>

<div
  role="button"
  tabindex="0"
  class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:scale-[1.02]"
  aria-label={`Watch ${show.title}`}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={navigate}
  onkeydown={handleKeyDown}
>
  <div class="relative aspect-2/3 bg-muted rounded-2xl overflow-hidden surface-card">
    {#if isHovered && show.trailerUrl}
      <video
        bind:this={videoRef}
        src={show.trailerUrl}
        class="absolute inset-0 w-full h-full object-cover z-0"
        loop
        muted
        playsinline
        preload="none"
      ></video>
    {:else}
      <img
        src={show.posterUrl || show.thumbnail || '/placeholder-vertical.jpg'}
        alt=""
        width="280"
        height="420"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover"
      />
    {/if}
    <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
    {#if typeof show.progressPercent === 'number' && show.progressPercent > 0 && show.progressPercent < 95}
      <div class="absolute inset-x-0 bottom-0 h-1 bg-black/40 z-20">
        <div
          class="h-full bg-[#FF5E0E]"
          style="width: {Math.max(2, Math.min(100, show.progressPercent))}%"
        ></div>
      </div>
    {/if}
  </div>

  {#if show.isNew}
    <div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">
      New Episode
    </div>
  {:else if isRecentlyAdded(show.createdAt)}
    <div class="absolute top-2 left-2 bg-[#FF5E0E] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full z-30 shadow">
      Just added
    </div>
  {/if}

  <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
    <h3 class="text-sm font-semibold line-clamp-2 text-white">{show.title}</h3>

    <div class="text-xs mt-1 flex flex-wrap gap-2 text-white/70">
      {#if show.rating}<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">{show.rating}</span>{/if}
      {#if show.duration}<span>{show.duration}</span>{/if}
      {#if show.quality}<span>{show.quality}</span>{/if}
    </div>

    <div class="mt-3 flex items-center gap-2">
      <button
        class="inline-flex items-center gap-1 rounded-full bg-[#FF5E0E] px-3 py-1 text-xs font-semibold text-white shadow-[0_0_16px_rgba(255,94,14,0.4)] hover:bg-[#FF5E0E]/90 transition"
        onclick={(e) => { e.stopPropagation(); navigate(); }}
        aria-label={`Play ${show.title}`}
      >
        <Play class="h-3.5 w-3.5" />
        Play
      </button>
      <button
        class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
        onclick={(e) => {
          e.stopPropagation();
          if (!show.id) return;
          void myList.toggle({
            contentId: show.id,
            contentTitle: show.title,
            contentType: 'show'
          });
        }}
        disabled={!show.id || (!!show.id && $myList.pending.has(show.id))}
        aria-label={show.id && $myList.ids.has(show.id) ? `Remove ${show.title} from My List` : `Add ${show.title} to My List`}
      >
        {#if show.id && $myList.ids.has(show.id)}
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
