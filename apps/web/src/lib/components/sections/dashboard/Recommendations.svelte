<script lang="ts">
  import { onMount } from 'svelte';

  interface ContentItem {
    id: string;
    title: string;
    thumbnail: string | null;
    posterUrl: string | null;
    mediaType: string;
    genres: string[] | null;
    category: string | null;
  }

  let items: ContentItem[] = [];
  let loading = true;

  onMount(async () => {
    try {
      const res = await fetch('/api/recommendations?limit=8');
      if (res.ok) items = await res.json();
    } finally {
      loading = false;
    }
  });
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Recommended for You</h2>

  {#if loading}
    <div class="flex gap-4">
      {#each [1, 2, 3, 4] as _}
        <div class="w-36 shrink-0 space-y-2">
          <div class="aspect-2/3 bg-white/5 rounded-lg animate-pulse"></div>
          <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div>
        </div>
      {/each}
    </div>
  {:else if items.length === 0}
    <p class="text-muted-foreground text-sm">Keep watching to get personalised recommendations.</p>
  {:else}
    <div class="flex gap-4 overflow-x-auto pb-2">
      {#each items as item (item.id)}
        <a href="/watch/{item.id}" class="w-36 shrink-0 group space-y-2">
          <div class="aspect-2/3 rounded-lg overflow-hidden bg-white/5 relative">
            {#if item.thumbnail || item.posterUrl}
              <img
                src={item.posterUrl ?? item.thumbnail ?? ''}
                alt={item.title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            {/if}
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">▶</div>
            </div>
          </div>
          <p class="text-white text-xs font-medium truncate">{item.title}</p>
          <p class="text-gray-500 text-xs capitalize">{item.category ?? item.mediaType}</p>
        </a>
      {/each}
    </div>
  {/if}
</section>
