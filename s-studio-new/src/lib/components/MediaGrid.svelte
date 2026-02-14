<script lang="ts">
  import type { MediaItem, MediaSection } from '../types/media';
  import MovieCard from './MovieCard.svelte';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { resolveAdultDataset } from '$lib/utils/resolveAdultDataset';

  
  // Accept an array of sections instead of just items
  export let sections: MediaSection[] = [];
  export let mediaItems: MediaItem[];
  export let title: string;

  const openModal = (media: MediaItem) => {
    console.log("clicking", media)
    $mediaModalStore = {...$mediaModalStore, isOpen: true, media}
  };

  onMount(() => {
  const id = page.params.id;
  if (id) {
    const media = resolveAdultDataset(id);
    if (media) mediaModalStore.open(media);
  }
});
</script>

<div class="space-y-8">
  {#each sections as section}
    <section>
      <h2 class="text-xl font-semibold text-white mb-2 px-4">{section.title}</h2>

      <div
        class="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth snap-x snap-mandatory"
      >
        {#each section.items as item (item.id)}
          <div
            class="flex-shrink-0 w-[160px] snap-start"
          >
            <MovieCard movie={item} onClick={() => openModal(item)} />
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>