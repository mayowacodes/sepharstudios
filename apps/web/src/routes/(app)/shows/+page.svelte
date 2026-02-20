<script lang="ts">
  import { page } from '$app/state';
  import TVShowCard from '$lib/components/TVShowCard.svelte';
  import { writable } from 'svelte/store';

  const { data } = $props();

  // Use shows from server data
  let allTVShows = $derived(data.shows || []);

  // Create writable store for category selection
  let selectedCategory = writable<string | null>(null);

  // Derived store for filtered TV shows
  let filteredTVShows = $derived(
      allTVShows.filter(show => 
          !$selectedCategory || show.genres?.includes($selectedCategory)
      )
  );

  // Categories derived from all available TV shows
  let categories = $derived.by(() => {
      const allCategories = new Set<string>();
      allTVShows.forEach(show => show.genres?.forEach(g => allCategories.add(g)));
      return Array.from(allCategories).sort();
  });

  const user = $derived(page.data.user);
</script>

<main class="container mx-auto px-4 py-8">
<h1 class="text-4xl font-bold text-center mb-8">Christian TV Shows</h1>

{#if user}
  <p class="text-center text-green-600 font-semibold mb-6">Welcome, {user.name}!</p>
{/if}

<div class="flex justify-center mb-8">
  <div class="w-full md:w-1/3">
    <label for="category" class="block text-lg font-semibold mb-2">Filter by Category:</label>
    <select 
      id="category" 
      bind:value={$selectedCategory}
      class="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
    >
      <option value="">All Categories</option>
      {#each $categories as category}
        <option value={category}>{category}</option>
      {/each}
    </select>
  </div>
</div>

{#if $filteredTVShows.length === 0}
  <div class="text-center py-12">
    <p class="text-xl text-white/80">No TV shows found for this category.</p>
    <button 
      on:click={() => selectedCategory.set(null)}
      class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition"
    >
      Reset Filter
    </button>
  </div>
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {#each $filteredTVShows as show}
      <TVShowCard {show} onClick={() => {}} />
    {/each}
  </div>
{/if}
</main>
