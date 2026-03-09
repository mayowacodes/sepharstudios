<script lang="ts">
  import { onMount } from 'svelte';

  interface ListItem {
    itemId: string;
    content: {
      id: string;
      title: string;
      thumbnail: string | null;
      posterUrl: string | null;
      mediaType: string;
    };
  }

  let items = $state<ListItem[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch('/api/playlists');
      if (!res.ok) return;
      const lists = await res.json() as { id: string; isDefault: boolean }[];
      const defaultList = lists.find(l => l.isDefault) ?? lists[0];
      if (!defaultList) return;
      const itemsRes = await fetch(`/api/playlists/${defaultList.id}/items`);
      if (itemsRes.ok) items = await itemsRes.json();
    } finally {
      loading = false;
    }
  });

  function getHref(item: ListItem) {
    const type = item.content.mediaType;
    if (type === 'show') return `/shows/${item.content.id}`;
    if (type === 'documentary') return `/documentaries/${item.content.id}`;
    return `/movies/${item.content.id}`;
  }
</script>

<section>
  {#if loading}
    <div class="grid grid-cols-3 gap-3">
      {#each [1,2,3] as _}
        <div class="h-28 rounded bg-muted/30 animate-pulse"></div>
      {/each}
    </div>
  {:else if items.length === 0}
    <p class="text-sm text-muted-foreground">Nothing saved yet. Browse content and hit "+ My List" to save it here.</p>
  {:else}
    <div class="grid grid-cols-3 gap-3">
      {#each items.slice(0, 6) as item}
        <a href={getHref(item)} class="group relative rounded overflow-hidden shadow-sm hover:scale-105 transition border border-primary/10">
          <img
            src={item.content.thumbnail ?? item.content.posterUrl ?? '/placeholder.jpg'}
            alt={item.content.title}
            class="w-full h-28 object-cover rounded"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 text-white">
            <strong class="text-xs line-clamp-1">{item.content.title}</strong>
            <span class="block text-[10px] text-white/70 capitalize">{item.content.mediaType}</span>
          </div>
        </a>
      {/each}
    </div>
    {#if items.length > 6}
      <a href="/watchlist" class="block mt-3 text-xs text-primary hover:underline text-center">
        View all {items.length} items
      </a>
    {/if}
  {/if}
</section>
