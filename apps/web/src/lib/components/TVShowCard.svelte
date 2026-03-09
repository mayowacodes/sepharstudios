<script lang="ts">
  import { Play, Bookmark } from '@lucide/svelte';
  import { goto } from '$app/navigation';

  export let show: {
    id?: string;
    title: string;
    description: string;
    thumbnail: string;
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
  };

  export let onClick: () => void = () => {};
  export let onHover: () => void = () => {};

  let videoRef: HTMLVideoElement;
  let isHovered = false;
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

  const navigate = () => {
    if (show.id) goto(`/watch/${show.id}`);
    else onClick();
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
  class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none hover:scale-[1.02]"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={navigate}
  on:keydown={handleKeyDown}
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
      ></video>
    {:else}
      <img
        src={show.thumbnail || '/placeholder-vertical.jpg'}
        alt={show.title}
        class="w-full h-full object-cover"
        loading="lazy"
      />
    {/if}
    <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
  </div>

  {#if show.isNew}
    <div class="absolute top-2 left-2 bg-[#FFBF00] text-black text-xs px-2 py-0.5 rounded-full z-30">
      New Episode
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
        on:click|stopPropagation={navigate}
        aria-label={`Play ${show.title}`}
      >
        <Play class="h-3.5 w-3.5" />
        Play
      </button>
      <button
        class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition"
        on:click|stopPropagation
        aria-label={`Add ${show.title} to My List`}
      >
        <Bookmark class="h-3.5 w-3.5" />
        My List
      </button>
    </div>
  </div>
</div>
