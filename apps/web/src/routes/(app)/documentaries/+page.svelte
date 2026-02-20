<script lang="ts">
  import { page } from '$app/state';
  import DocumentaryCard from '$lib/components/DocumentaryCard.svelte';
  import { writable } from 'svelte/store';

  const { data } = $props();

  // Initialize with our documentary collection
  let allDocumentaries = $derived(data.documentaries || []);

  // Create writable store for category selection
  let selectedCategory = writable<string | null>(null);

  // Create writable store for topic selection
  let selectedTopic = writable<string | null>(null);

  // Derived store for filtered documentaries
  let filteredDocumentaries = $derived(
    allDocumentaries.filter(doc => {
      const categoryMatch = !$selectedCategory || doc.genres?.includes($selectedCategory);
      const topicMatch = !$selectedTopic || doc.topics?.includes($selectedTopic);
      return categoryMatch && topicMatch;
    })
  );

  // Categories derived from all available documentaries
  let categories = $derived.by(() => {
    const allCategories = new Set<string>();
    allDocumentaries.forEach(doc => doc.genres?.forEach(g => allCategories.add(g)));
    return Array.from(allCategories).sort();
  });

  // Topics derived from all available documentaries
  let topics = $derived.by(() => {
    const allTopics = new Set<string>();
    allDocumentaries.forEach(doc => doc.topics?.forEach(t => allTopics.add(t)));
    return Array.from(allTopics).sort();
  });

  const user = $derived(page.data.user);

  function resetFilters() {
    selectedCategory.set(null);
    selectedTopic.set(null);
  }
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold text-center mb-8">Documentary Collection</h1>

  {#if user}
    <p class="text-center text-green-600 font-semibold mb-6">Welcome, {user.name}!</p>
  {/if}

  <div class="flex flex-col md:flex-row justify-center gap-6 mb-8">
    <div class="w-full md:w-1/3">
      <label for="category" class="block text-lg font-semibold mb-2">Filter by Genre:</label>
      <select 
        id="category" 
        bind:value={$selectedCategory}
        class="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
      >
        <option value="">All Genres</option>
        {#each $categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>

    <div class="w-full md:w-1/3">
      <label for="topic" class="block text-lg font-semibold mb-2">Filter by Topic:</label>
      <select 
        id="topic" 
        bind:value={$selectedTopic}
        class="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
      >
        <option value="">All Topics</option>
        {#each $topics as topic}
          <option value={topic}>{topic}</option>
        {/each}
      </select>
    </div>
  </div>

  {#if $selectedCategory || $selectedTopic}
    <div class="flex justify-center mb-6">
      <button 
        on:click={resetFilters}
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        Clear All Filters
      </button>
    </div>
  {/if}

  {#if $filteredDocumentaries.length === 0}
    <div class="text-center py-12">
      <p class="text-xl text-white/80">No documentaries found matching your filters.</p>
      <button 
        on:click={resetFilters}
        class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition"
      >
        Show All Documentaries
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {#each $filteredDocumentaries as doc}
        <DocumentaryCard documentary={doc} />
      {/each}
    </div>
  {/if}
</main>