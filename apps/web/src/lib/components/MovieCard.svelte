<script lang="ts">
  import { onMount } from 'svelte';
  import type { MediaItem } from '$lib/types/media';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import { goto } from '$app/navigation';
  import { Play, Bookmark } from '@lucide/svelte';

  const openModal = (media: MediaItem) => {
    mediaModalStore.open(media);
    goto(`/movies/${media.id}`, { replaceState: false });
  };

  export let movie: MediaItem;
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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
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
  class="relative group w-full rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none hover:scale-[1.02]"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={() => openModal(movie)}
  on:keydown={handleKeyDown}
>
  <div class="relative aspect-[2/3] bg-muted rounded-2xl overflow-hidden surface-card">
    {#if isHovered && movie.trailerUrl}
      <video
        bind:this={videoRef}
        src={movie.trailerUrl}
        class="absolute inset-0 w-full h-full object-cover z-0"
        loop
        muted
        playsinline
      ></video>
    {:else}
      <img
        src={movie.thumbnail || '/placeholder-vertical.jpg'}
        alt={movie.title}
        class="w-full h-full object-cover"
        loading="lazy"
      />
    {/if}
    <div class="absolute inset-0 veil-soft opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
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
        on:click|stopPropagation={() => openModal(movie)}
        aria-label={`Play ${movie.title}`}
      >
        <Play class="h-3.5 w-3.5" />
        Play
      </button>
      <button
        class="inline-flex items-center gap-1 rounded-full border border-[#FFBF00]/60 px-3 py-1 text-xs font-semibold text-[#FFBF00] hover:bg-[#FFBF00]/10 transition"
        on:click|stopPropagation
        aria-label={`Add ${movie.title} to My List`}
      >
        <Bookmark class="h-3.5 w-3.5" />
        My List
      </button>
    </div>
  </div>
</div>
