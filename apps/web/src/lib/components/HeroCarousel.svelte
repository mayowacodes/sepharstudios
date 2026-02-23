<script lang="ts">
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { MediaItem } from '../types/media';
  import SkeletonLoader from '$lib/components/widgets/SkeletonLoader.svelte';
  import { goto } from '$app/navigation';

  export let mediaItems: MediaItem[] = [];
  export let sectionTitle: string = 'Trending';

  let hoveredItem: MediaItem | null = null;
  let loading = false;

  const openModal = (media: MediaItem) => {
    mediaModalStore.open(media);
    goto(`/movies/${media.id}`); // update URL for deep link
  };

  const handleMouseEnter = (item: MediaItem) => {
    hoveredItem = item;
  };

  const handleMouseLeave = () => {
    hoveredItem = null;
  };

  const fetchMediaData = async () => {
    loading = true;
    setTimeout(() => {
      loading = false;
    }, 2000);
  };

  onMount(() => {
    fetchMediaData();
  });
</script>


<div class="section">
  <h2 class="text-3xl font-bold mb-6">{sectionTitle}</h2>

  {#if loading}
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" transition:fade>
      {#each Array(6) as _}
        <div class="h-48 bg-gray-300 rounded-lg animate-pulse"></div>
      {/each}
    </div>
  {:else}

    <SkeletonLoader width="100%" height="200px" className="mb-4" />

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {#each mediaItems as item}
        <div
          class="relative rounded-lg overflow-hidden group cursor-pointer"
          role="button"
          tabindex="0"
          aria-label={`Open modal for ${item.title}`}
          on:mouseenter={() => handleMouseEnter(item)}
          on:mouseleave={handleMouseLeave}
        >
          {#if hoveredItem && hoveredItem.id === item.id}
            <video
              src={item.trailerUrl}
              class="absolute inset-0 w-full h-full object-cover"
              autoplay
              muted
              loop
              transition:fade
              aria-label={`Trailer preview of ${item.title}`}
            ></video>
          {:else}
            <img
              src={item.thumbnail}
              alt={item.title}
              class="w-full h-full object-cover"
              transition:fade
            />
          {/if}

          <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4" transition:fade>
            <h3 class="text-white text-lg font-bold">{item.title}</h3>
            <p class="text-white text-sm">{item.description}</p>
          </div>

          {#if hoveredItem && hoveredItem.id === item.id}
            <div class="absolute top-4 right-4 flex gap-2" transition:fade>
              <button class="p-2 rounded-full bg-[#FF5E0E] text-white hover:bg-[#FFBF00] transition-colors" aria-label="Play trailer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </button>
              <button class="p-2 rounded-full bg-[#AF6E4D] text-white hover:bg-[#FFBF00] transition-colors" aria-label="Add to watchlist">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          {/if}

          <div class="absolute bottom-4 left-4" transition:fade>
            <button
              on:click={() => openModal(item)}
              class="bg-[#FF5E0E] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#FFBF00] transition"
              aria-label={`Watch Now: ${item.title}`}
            >
              Watch Now
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
