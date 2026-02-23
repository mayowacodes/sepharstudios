<script lang="ts">
  import { page } from '$app/state';
  import MovieCard from '$lib/components/MovieCard.svelte';
  import { writable, derived } from 'svelte/store';
  import { PlayCircle } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  const { data } = $props();
  
  // Use movies from server data, fallback to empty array
  let allMovies = $derived(data.movies || []);
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
  const featuredMovie = $derived.by(() => {
    if (!allMovies?.length) return null;
    return [...allMovies].sort((a, b) => getNewestTimestamp(b) - getNewestTimestamp(a))[0];
  });

  // Create writable store for category selection
  let selectedCategory = writable<string | null>(null);

  // Derived store for filtered movies
  let filteredMovies = $derived(
    allMovies.filter(movie => 
      !$selectedCategory || movie.genres?.includes($selectedCategory)
    )
  );

  // Categories derived from all available movies
  let categories = $derived.by(() => {
    const allCategories = new Set<string>();
    allMovies.forEach(movie => movie.genres?.forEach(g => allCategories.add(g)));
    return Array.from(allCategories).sort();
  });

  const user = $derived(page.data.user);
</script>

<div class="relative overflow-hidden min-h-screen bg-[var(--surface-charcoal)] text-white">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,94,14,0.18),transparent_55%),radial-gradient(circle_at_20%_30%,rgba(255,191,0,0.2),transparent_40%)]"></div>
  <main class="container mx-auto px-4 py-10 relative z-10">
    <section class="relative text-center space-y-4 pb-10 max-w-4xl mx-auto">
      <div class="absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#FFBF00]/20 blur-3xl halo-ring opacity-60"></div>
      <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">
        <span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span>
        Featured Collection
      </div>
      <h1 class="text-5xl sm:text-6xl font-extrabold text-display">Christian Movies</h1>
      <p class="text-white/70 text-lg">Stream inspiring stories crafted for families and communities.</p>
    </section>

    {#if featuredMovie}
      <section class="relative mb-10 overflow-hidden rounded-3xl border border-white/10 surface-glass">
        <img
          src={featuredMovie.backdrop_url || featuredMovie.thumbnail}
          alt={featuredMovie.title}
          class="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div class="absolute inset-0 veil-strong"></div>
        <div class="relative z-10 grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FFBF00]">
              <span class="h-2 w-2 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.6)]"></span>
              Just Added
            </div>
            <h2 class="text-4xl sm:text-5xl font-extrabold text-display">{featuredMovie.title}</h2>
            <p class="text-white/70 line-clamp-3 max-w-xl">{featuredMovie.description}</p>
            <div class="flex flex-wrap gap-3 text-sm text-white/60">
              {#if featuredMovie.year}<span>{featuredMovie.year}</span>{/if}
              {#if featuredMovie.duration}<span>{featuredMovie.duration}</span>{/if}
              {#if featuredMovie.quality}<span>{featuredMovie.quality}</span>{/if}
            </div>
            <div class="flex flex-wrap gap-3 pt-2">
              <Button size="lg" class="bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white shadow-[0_0_20px_rgba(255,94,14,0.4)]">
                <PlayCircle class="mr-2 h-5 w-5" />
                Watch Now
              </Button>
              <Button size="lg" variant="outline" class="border-white/20 text-white hover:bg-white/10">
                + My List
              </Button>
            </div>
          </div>
          <div class="hidden lg:block">
            <div class="h-full w-full rounded-2xl overflow-hidden border border-[#FFBF00]/40 halo-ring">
              <img src={featuredMovie.thumbnail} alt={featuredMovie.title} class="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    {/if}

    {#if user}
      <p class="text-center text-white/70 font-semibold mb-6">Welcome, {user.name}!</p>
    {/if}

    <div class="flex justify-center mb-8">
      <div class="w-full md:w-1/3">
        <label for="category" class="block text-lg font-semibold mb-2 text-white/80">Filter by Category</label>
        <select 
          id="category" 
          bind:value={$selectedCategory}
          class="w-full p-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value={null}>All Categories</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>
    </div>

    {#if filteredMovies.length === 0}
      <div class="text-center py-12">
        <p class="text-xl text-white/80">No movies found for this category.</p>
        <button 
          onclick={() => selectedCategory.set(null)}
          class="mt-4 px-6 py-2 bg-[#FF5E0E] text-white rounded-lg hover:bg-[#FFBF00] transition"
        >
          Reset Filter
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {#each filteredMovies as movie}
          <MovieCard {movie} onClick={() => {}} />
        {/each}
      </div>
    {/if}
  </main>
</div>
