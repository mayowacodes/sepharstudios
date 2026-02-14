<script lang="ts">
  import type { MediaItem } from '$lib/types/media';

  export let documentary: MediaItem;
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
      onClick();
    }
  };

  const genreColor = (genre: string) => {
    switch (genre.toLowerCase()) {
      case 'drama': return 'bg-purple-600 text-white';
      case 'action': return 'bg-red-600 text-white';
      case 'comedy': return 'bg-yellow-400 text-black';
      case 'animation': return 'bg-pink-500 text-white';
      case 'documentary': return 'bg-blue-500 text-white';
      case 'family': return 'bg-green-500 text-white';
      case 'faith':
      case 'christian': return 'bg-indigo-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };
</script>

<div
  role="button"
  tabindex="0"
  class="relative group w-40 sm:w-48 lg:w-52 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none"
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={onClick}
  on:keydown={handleKeyDown}
>
  <div class="relative aspect-[2/3] bg-muted rounded-xl overflow-hidden">
    {#if isHovered && documentary.trailerUrl}
      <video
        bind:this={videoRef}
        src={documentary.trailerUrl}
        class="absolute inset-0 w-full h-full object-cover z-0"
        loop
        muted
        playsinline
      ></video>
    {:else}
      <img
        src={documentary.thumbnail || '/placeholder-vertical.jpg'}
        alt={documentary.title}
        class="w-full h-full object-cover"
        loading="lazy"
      />
    {/if}
  </div>

  {#if documentary.isNew}
    <div class="absolute top-2 left-2 bg-green-600 dark:bg-green-400 text-white dark:text-black text-xs px-2 py-0.5 rounded-full z-30">
      New Episode
    </div>
  {/if}

  <div class="absolute inset-0 p-3 flex flex-col justify-end z-20 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0">
    <h3 class="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white">{documentary.title}</h3>

    <div class="text-xs mt-1 flex flex-wrap gap-1 text-gray-700 dark:text-gray-300">
      {#if documentary.rating}<span class="bg-[#FF5E0E] text-white text-[10px] px-1.5 py-0.5 rounded">{documentary.rating}</span>{/if}
      {#if documentary.duration}<span>{documentary.duration}</span>{/if}
      {#if documentary.quality}<span>{documentary.quality}</span>{/if}
    </div>

    {#if documentary.genres?.length}
      <div class="mt-2 flex flex-wrap gap-1">
        {#each documentary.genres as genre}
          <span class={`text-[10px] px-2 py-0.5 rounded-full ${genreColor(genre)}`}>
            {genre}
          </span>
        {/each}
      </div>
    {/if}

    <p class="text-xs mt-2 text-white-700 dark:text-gray-300 line-clamp-3 transition-opacity duration-300">
      {documentary.description}
    </p>
  </div>

  {#if isHovered}
    <div class="absolute top-2 right-2 z-30 flex gap-1">
      <button class="bg-white/10 hover:bg-white/20 dark:bg-black/30 dark:hover:bg-black/50 p-1.5 rounded-full text-white text-sm">▶</button>
      <button class="bg-white/10 hover:bg-white/20 dark:bg-black/30 dark:hover:bg-black/50 p-1.5 rounded-full text-white text-sm">＋</button>
    </div>

    <div class="absolute bottom-2 left-2 z-30">
      <a
        href={documentary.link}
        class="inline-block text-primary font-medium hover:underline text-xs"
      >
        Watch Now
      </a>
    </div>
  {/if}
</div>
