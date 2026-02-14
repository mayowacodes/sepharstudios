<script lang="ts">
  import KidsMovieCard from '$lib/components/kids/KidsMovieCard.svelte';
  import CategoryFilter from '$lib/components/kids/CategoryFilter.svelte';
  import { writable, derived } from 'svelte/store';

  export let title: string;
  export let mediaData: any[];

  const selectedCategory = writable<string | null>(null);
  const filteredMedia = derived(selectedCategory, ($selectedCategory) =>
    mediaData.filter(item => !$selectedCategory || item.genres?.includes($selectedCategory))
  );

  const allCategories = [...new Set(mediaData.flatMap(m => m.genres ?? []))].sort();
</script>

<main class="p-4 max-w-7xl mx-auto">
  <h1 class="text-4xl font-bold text-yellow-600 text-center mb-6">{title}</h1>

  <CategoryFilter bind:selected={$selectedCategory} categories={allCategories} />

  {#if $filteredMedia.length === 0}
    <p class="text-center mt-12 text-pink-600 text-lg">No media found in this category 💨</p>
  {:else}
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
      {#each $filteredMedia as movie}
        <KidsMovieCard movie={movie} />
      {/each}
    </div>
  {/if}
</main>
