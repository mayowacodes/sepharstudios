<script lang="ts">
  import { page } from '$app/state';
  import { replaceState } from '$app/navigation';
  import MovieCard from '$lib/components/MovieCard.svelte';
  import FeaturedBillboardPanel from '$lib/components/FeaturedBillboardPanel.svelte';
  import ComingSoonRow from '$lib/components/sections/ComingSoonRow.svelte';
  import { writable } from 'svelte/store';
  import type { MediaItem } from '$lib/types/media';

  const { data } = $props();

  // Use movies from server data, fallback to empty array
  let allMovies = $derived((data.movies || []) as MediaItem[]);

  // "Just Added" billboard picker. We sort by *upload recency*
  // (createdAt), not release_date / year — "just added" reflects when
  // the row landed in the catalog, not when the film originally came
  // out. With the old release_date path, rows without a release_date
  // (e.g. fresh short uploads like the intro video) tied at 0 with
  // every other no-date row and the sort got unstable, sometimes
  // surfacing the intro instead of an actual new movie.
  const getNewestTimestamp = (item: any) => {
    if (item?.createdAt) {
      const t = item.createdAt instanceof Date
        ? item.createdAt.getTime()
        : Date.parse(item.createdAt);
      if (!Number.isNaN(t)) return t;
    }
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
  // Prefer rows that are clearly "movies" (mediaType==='movie' OR have
  // a portrait posterUrl). Shorts and AI intros without a poster lose
  // the tiebreak so the billboard surfaces a real, posterable title.
  const featuredMovie = $derived.by(() => {
    if (!allMovies?.length) return null;
    const ranked = [...allMovies].sort((a: any, b: any) => {
      const aPoster = !!(a.posterUrl || a.poster_url);
      const bPoster = !!(b.posterUrl || b.poster_url);
      if (aPoster !== bPoster) return aPoster ? -1 : 1;
      return getNewestTimestamp(b) - getNewestTimestamp(a);
    });
    return ranked[0];
  });

  // Create writable store for category selection
  let selectedCategory = writable<string | null>(null);

  // "Continue watching" filter — when true, only show titles the
  // current viewer has unfinished progress on (signal driven by the
  // `progressPercent` overlay attached by the server load). Lives
  // alongside the category filter so the two stack: a viewer can
  // ask for "all Drama I've started" via the combination.
  //
  // Filter state is mirrored to the URL (`?inProgress=1`) so it
  // survives reload, shows up in browser history, and becomes
  // shareable — "here's the list of stuff I haven't finished" is a
  // legit Slack / iMessage link to send to yourself.
  let onlyInProgress = $state(page.url.searchParams.get('inProgress') === '1');

  $effect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (onlyInProgress) url.searchParams.set('inProgress', '1');
    else url.searchParams.delete('inProgress');
    // replaceState avoids dirtying the back stack with every toggle.
    // The {} second arg is required by SvelteKit's typed signature.
    replaceState(url, page.state);
  });

  // True when ANY card has an in-progress overlay — drives whether
  // the filter chip appears at all. No reason to surface an empty
  // toggle to anonymous viewers / brand-new accounts.
  const hasAnyProgress = $derived(allMovies.some((m) => typeof m.progressPercent === 'number' && m.progressPercent > 0 && m.progressPercent < 95));

  // Derived store for filtered movies
  let filteredMovies = $derived(
    allMovies.filter(movie => {
      if ($selectedCategory && !movie.genres?.includes($selectedCategory)) return false;
      if (onlyInProgress && !(typeof movie.progressPercent === 'number' && movie.progressPercent > 0 && movie.progressPercent < 95)) return false;
      return true;
    })
  );

  // Categories derived from all available movies
  let categories = $derived.by(() => {
    const allCategories = new Set<string>();
    allMovies.forEach(movie => movie.genres?.forEach(g => allCategories.add(g)));
    return Array.from(allCategories).sort();
  });

  const user = $derived(page.data.user);
</script>

<svelte:head>
  <title>Christian Movies · Sephar Studios</title>
  <meta name="description" content="Faith-based and family-friendly movies streaming on Sephar Studios. New releases, classics, documentaries, and more." />
</svelte:head>

<div class="relative overflow-hidden min-h-screen bg-var(--surface-charcoal) text-white">
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
      <FeaturedBillboardPanel featured={featuredMovie} label="Just Added" />
    {/if}

    <ComingSoonRow items={(data.comingSoon ?? []) as any[]} />

    {#if user}
      <p class="text-center text-white/70 font-semibold mb-6">Welcome, {user.name}!</p>
    {/if}

    <div class="flex flex-col md:flex-row md:items-end justify-center gap-4 mb-8">
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
      <!-- "Continue watching" chip — only appears when the viewer
           actually has progress on at least one title, so brand-new
           accounts don't see an empty toggle. Tap toggles between the
           full catalog and "show only what I've started." -->
      {#if hasAnyProgress}
        <button
          type="button"
          onclick={() => (onlyInProgress = !onlyInProgress)}
          class="self-start md:self-end px-4 py-3 rounded-xl border text-sm font-semibold transition-colors {onlyInProgress
            ? 'border-[#FF5E0E] bg-[#FF5E0E]/20 text-white shadow-[0_0_18px_rgba(255,94,14,0.35)]'
            : 'border-white/15 bg-white/5 text-white/80 hover:bg-white/10'}"
          aria-pressed={onlyInProgress}
        >
          {onlyInProgress ? 'Showing in progress' : 'Continue watching'}
        </button>
      {/if}
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
          <MovieCard {movie} />
        {/each}
      </div>
    {/if}
  </main>
</div>
