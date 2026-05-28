<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { Search, Sparkles, Play, Loader2 } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  interface SearchResult {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    posterUrl: string | null;
    genres: string[];
    topics: string[];
    ageRating: string | null;
    mediaType: string;
    year: string | null;
    link: string;
  }

  // Read ?q= from URL so /search?q=… deep-links work and the back/forward
  // buttons restore the right query.
  let query = $state(page.url.searchParams.get('q') ?? '');
  let results = $state<SearchResult[]>([]);
  let loading = $state(false);
  let error = $state('');
  let hasSearched = $state(false);

  const exampleQueries = [
    'Movies about forgiveness and redemption',
    "Family-safe shows my kids will actually want to watch",
    'Documentaries about the early church',
    "Something uplifting after a hard week",
    'Stories that show prayer changing things'
  ];

  async function runSearch(q: string) {
    const trimmed = q.trim();
    if (trimmed.length < 3) {
      error = 'Type at least 3 characters.';
      return;
    }
    loading = true;
    error = '';
    hasSearched = true;
    try {
      const res = await fetch(`/api/ai/search?q=${encodeURIComponent(trimmed)}&limit=24`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        error = body.message ?? 'Search failed.';
        results = [];
        return;
      }
      const data = (await res.json()) as { results: SearchResult[] };
      results = data.results ?? [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Search failed.';
      results = [];
    } finally {
      loading = false;
    }
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    // Update the URL so the search is shareable and survives a refresh.
    void goto(`/search?q=${encodeURIComponent(query.trim())}`, { keepFocus: true, replaceState: false });
    void runSearch(query);
  }

  onMount(() => {
    if (query) void runSearch(query);
  });
</script>

<svelte:head>
  <title>Search · Sephar Studios</title>
  <meta name="description" content="Describe what you're looking for in plain English — our AI matches it to faith-based movies, shows and documentaries." />
</svelte:head>

<div class="min-h-screen bg-background text-white">
  <div class="max-w-5xl mx-auto px-4 py-10 space-y-8">
    <header class="text-center space-y-3">
      <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
        <Sparkles class="w-4 h-4" /> AI-Powered Search
      </div>
      <h1 class="text-3xl md:text-4xl font-bold">Find something to watch</h1>
      <p class="text-muted-foreground max-w-xl mx-auto">
        Describe a mood, a theme, a Bible story, or even a feeling. Our semantic search
        understands what you mean — not just what you type.
      </p>
    </header>

    <form onsubmit={handleSubmit} class="relative max-w-2xl mx-auto">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <!-- svelte-ignore a11y_autofocus — dedicated search page, autofocus is the expected UX (matches every major search engine). -->
      <input
        type="search"
        bind:value={query}
        placeholder="Describe what you want to watch…"
        class="w-full bg-card border border-border rounded-full pl-12 pr-32 py-4 text-base text-white placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
        aria-label="Search query"
        autofocus
      />
      <Button
        type="submit"
        disabled={loading || query.trim().length < 3}
        class="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {loading ? 'Searching…' : 'Search'}
      </Button>
    </form>

    {#if !hasSearched}
      <section class="space-y-3 max-w-2xl mx-auto">
        <p class="text-xs uppercase tracking-wider text-muted-foreground">Try one of these</p>
        <div class="flex flex-wrap gap-2">
          {#each exampleQueries as eq}
            <button
              type="button"
              class="text-sm bg-card border border-border hover:border-primary/60 rounded-full px-4 py-1.5 text-muted-foreground hover:text-white transition-colors"
              onclick={() => { query = eq; void runSearch(eq); void goto(`/search?q=${encodeURIComponent(eq)}`, { replaceState: false }); }}
            >
              {eq}
            </button>
          {/each}
        </div>
      </section>
    {/if}

    {#if error}
      <div class="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-200">
        {error}
      </div>
    {/if}

    {#if loading && results.length === 0}
      <div class="flex items-center justify-center py-12 gap-3 text-muted-foreground">
        <Loader2 class="w-5 h-5 animate-spin" />
        <span>Matching your query against thousands of titles…</span>
      </div>
    {:else if hasSearched && !loading && results.length === 0 && !error}
      <div class="text-center py-12">
        <p class="text-muted-foreground">No matches yet. Try rephrasing — our AI does best with descriptive language.</p>
      </div>
    {:else if results.length > 0}
      <section class="space-y-4">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {results.length} match{results.length === 1 ? '' : 'es'}
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {#each results as r (r.id)}
            <a href={r.link || `/watch/${r.id}`} class="group space-y-2">
              <div class="aspect-2/3 rounded-lg overflow-hidden bg-card relative">
                {#if r.posterUrl || r.thumbnail}
                  <img
                    src={r.posterUrl ?? r.thumbnail ?? ''}
                    alt={r.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                {/if}
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                    <Play class="w-5 h-5 fill-white" />
                  </div>
                </div>
              </div>
              <p class="text-sm font-semibold text-white truncate" title={r.title}>{r.title}</p>
              <p class="text-xs text-muted-foreground capitalize">
                {r.mediaType ?? 'content'}{r.year ? ` · ${r.year}` : ''}
              </p>
            </a>
          {/each}
        </div>
      </section>
    {/if}
  </div>
</div>
