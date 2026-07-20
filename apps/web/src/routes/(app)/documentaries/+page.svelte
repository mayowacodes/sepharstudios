<script lang="ts">
  import { page } from '$app/state';
  import { replaceState } from '$app/navigation';
  import DocumentaryCard from '$lib/components/DocumentaryCard.svelte';
  import FeaturedBillboardPanel from '$lib/components/FeaturedBillboardPanel.svelte';
  import ComingSoonRow from '$lib/components/sections/ComingSoonRow.svelte';

  const { data } = $props();

  // Initialize with our documentary collection
  let allDocumentaries = $derived((data.documentaries || []) as any[]);
  const getNewestTimestamp = (item: any) => {
    if (item?.release_date) {
      const parsed = Date.parse(item.release_date);
      if (!Number.isNaN(parsed)) return parsed;
    }
    if (item?.year) {
      const yearNum = Number.parseInt(item.year, 10);
      if (!Number.isNaN(yearNum)) return new Date(yearNum, 0, 1).getTime();
    }
    return 0;
  };
  const featuredDocumentary = $derived.by(() => {
    if (!allDocumentaries?.length) return null;
    return [...allDocumentaries].sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a))[0];
  });

  // Use runes for state instead of writable
  let selectedCategory = $state<string | null>(null);
  let selectedTopic = $state<string | null>(null);
  // Mirror the "Continue watching" toggle to the URL so it survives
  // reload + becomes shareable. See /movies for the same pattern.
  let onlyInProgress = $state(page.url.searchParams.get('inProgress') === '1');

  $effect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (onlyInProgress) url.searchParams.set('inProgress', '1');
    else url.searchParams.delete('inProgress');
    replaceState(url, page.state);
  });

  const hasAnyProgress = $derived(
    allDocumentaries.some((d: any) =>
      typeof d.progressPercent === 'number'
        && d.progressPercent > 0
        && d.progressPercent < 95
    )
  );

  // Derived store for filtered documentaries
  let filteredDocumentaries = $derived(
    allDocumentaries.filter((doc: any) => {
      const categoryMatch = !selectedCategory || doc.genres?.includes(selectedCategory);
      const topicMatch = !selectedTopic || doc.topics?.includes(selectedTopic);
      const progressMatch = !onlyInProgress
        || (typeof doc.progressPercent === 'number' && doc.progressPercent > 0 && doc.progressPercent < 95);
      return categoryMatch && topicMatch && progressMatch;
    })
  );

  // Categories derived from all available documentaries
  let categories = $derived.by(() => {
    const allCategories = new Set<string>();
    allDocumentaries.forEach((doc: any) => doc.genres?.forEach((g: string) => allCategories.add(g)));
    return Array.from(allCategories).sort();
  });

  // Topics derived from all available documentaries
  let topics = $derived.by(() => {
    const allTopics = new Set<string>();
    allDocumentaries.forEach((doc: any) => doc.topics?.forEach((t: string) => allTopics.add(t)));
    return Array.from(allTopics).sort();
  });

  const user = $derived(page.data.user);

  function resetFilters() {
    selectedCategory = null;
    selectedTopic = null;
  }
</script>

<svelte:head>
  <title>Christian Documentaries · Sephar Studios</title>
  <meta name="description" content="Inspiring faith-based documentaries — biographies, ministry stories, theological deep-dives, and more. Streaming on Sephar Studios." />
</svelte:head>

<div class="relative overflow-hidden min-h-screen bg-var(--surface-charcoal) text-white">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div>
  <main class="w-full max-w-7xl mx-auto px-6 md:px-8 py-10 relative z-10">
    <section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto">
      <div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60"></div>
      <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">
        <span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span>
        Deep Dive
      </div>
      <h1 class="text-5xl sm:text-6xl font-extrabold text-display">Documentary Collection</h1>
      <p class="text-white/70 text-lg">Explore faith, history, and inspiring journeys in depth.</p>
    </section>

    {#if featuredDocumentary}
      <FeaturedBillboardPanel featured={featuredDocumentary} label="Just Added" />
    {/if}

    <ComingSoonRow items={(data.comingSoon ?? []) as any[]} />

    {#if user}
      <p class="text-center text-white/70 font-semibold mb-6">Welcome, {user.name}!</p>
    {/if}

    <div class="flex flex-col md:flex-row justify-center gap-6 mb-8">
      <div class="w-full md:w-1/3">
        <label for="category" class="block text-lg font-semibold mb-2 text-white/80">Filter by Genre</label>
        <select 
          id="category" 
          bind:value={selectedCategory}
          class="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Genres</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>

      <div class="w-full md:w-1/3">
        <label for="topic" class="block text-lg font-semibold mb-2 text-white/80">Filter by Topic</label>
        <select
          id="topic"
          bind:value={selectedTopic}
          class="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Topics</option>
          {#each topics as topic}
            <option value={topic}>{topic}</option>
          {/each}
        </select>
      </div>
      {#if hasAnyProgress}
        <div class="w-full md:w-auto flex md:items-end">
          <button
            type="button"
            onclick={() => (onlyInProgress = !onlyInProgress)}
            class="w-full md:w-auto px-4 py-3 rounded-xl border text-sm font-semibold transition-colors {onlyInProgress
              ? 'border-[#FF5E0E] bg-[#FF5E0E]/20 text-white shadow-[0_0_18px_rgba(255,94,14,0.35)]'
              : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'}"
            aria-pressed={onlyInProgress}
          >
            {onlyInProgress ? 'Showing in progress' : 'Continue watching'}
          </button>
        </div>
      {/if}
    </div>

    {#if selectedCategory || selectedTopic}
      <div class="flex justify-center mb-6">
        <button 
          onclick={resetFilters}
          class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
        >
          Clear All Filters
        </button>
      </div>
    {/if}

    {#if filteredDocumentaries.length === 0}
      <div class="text-center py-12">
        <p class="text-xl text-white/80">No documentaries found matching your filters.</p>
        <button 
          onclick={resetFilters}
          class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition"
        >
          Show All Documentaries
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each filteredDocumentaries as doc (doc.id)}
          <DocumentaryCard documentary={doc} />
        {/each}
      </div>
    {/if}
  </main>
</div>
