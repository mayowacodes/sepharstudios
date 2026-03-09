<script lang="ts">
  import { onMount } from 'svelte';
  import { Trash2, Play, List } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';

  interface PlaylistItem {
    itemId: string;
    contentId: string;
    contentType: string;
    addedAt: string;
    sortOrder: number;
    title: string;
    thumbnail: string | null;
    posterUrl: string | null;
    mediaType: string;
  }

  interface Playlist {
    id: string;
    name: string;
    isDefault: boolean;
    items: PlaylistItem[];
  }

  let playlists = $state<Playlist[]>([]);
  let loading = $state(true);
  let removing = $state<string | null>(null);

  onMount(async () => {
    try {
      const res = await fetch('/api/playlists');
      if (!res.ok) return;
      const basePlaylists = await res.json() as Array<{ id: string; name: string; isDefault: boolean }>;

      const withItems = await Promise.all(
        basePlaylists.map(async (pl) => {
          const itemsRes = await fetch(`/api/playlists/${pl.id}/items`);
          const rawItems = itemsRes.ok
            ? await itemsRes.json() as Array<{
                itemId: string;
                addedAt: string;
                sortOrder: number;
                content: {
                  id: string;
                  title: string;
                  thumbnail: string | null;
                  posterUrl: string | null;
                  mediaType: string;
                };
              }>
            : [];

          const items: PlaylistItem[] = rawItems.map((r) => ({
            itemId: r.itemId,
            contentId: r.content.id,
            contentType: r.content.mediaType ?? 'movie',
            addedAt: r.addedAt,
            sortOrder: r.sortOrder,
            title: r.content.title,
            thumbnail: r.content.thumbnail,
            posterUrl: r.content.posterUrl,
            mediaType: r.content.mediaType
          }));

          return { ...pl, items };
        })
      );

      playlists = withItems;
    } finally {
      loading = false;
    }
  });

  async function removeItem(playlistId: string, contentId: string) {
    removing = contentId;
    try {
      await fetch(`/api/playlists/${playlistId}/items?contentId=${contentId}`, { method: 'DELETE' });
      playlists = playlists.map(pl =>
        pl.id === playlistId
          ? { ...pl, items: pl.items.filter(i => i.contentId !== contentId) }
          : pl
      );
    } finally {
      removing = null;
    }
  }

  const defaultList = $derived(playlists.find(p => p.isDefault));
  const allItems = $derived(defaultList?.items ?? []);
</script>

<svelte:head>
  <title>My List - Sephar Studios</title>
</svelte:head>

<div class="min-h-screen bg-background px-4 py-10">
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center gap-3 mb-8">
      <List class="w-6 h-6 text-primary" />
      <h1 class="text-2xl font-bold">My List</h1>
      {#if !loading}
        <span class="text-muted-foreground text-sm ml-auto">{allItems.length} titles</span>
      {/if}
    </div>

    {#if loading}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {#each [1,2,3,4,5,6,7,8] as _}
          <div class="space-y-2">
            <div class="aspect-2/3 bg-white/5 rounded-lg animate-pulse"></div>
            <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div>
          </div>
        {/each}
      </div>
    {:else if allItems.length === 0}
      <div class="text-center py-24">
        <List class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 class="text-lg font-semibold mb-2">Your list is empty</h2>
        <p class="text-muted-foreground text-sm mb-6">Browse content and tap + to save titles here.</p>
        <Button href="/browse">Browse Content</Button>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {#each allItems as item (item.contentId)}
          <div class="group relative space-y-2">
            <a href="/watch/{item.contentId}" class="block">
              <div class="aspect-2/3 rounded-lg overflow-hidden bg-white/5 relative">
                {#if item.thumbnail || item.posterUrl}
                  <img
                    src={item.posterUrl ?? item.thumbnail ?? ''}
                    alt={item.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                {/if}
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                    <Play class="w-5 h-5 fill-white" />
                  </div>
                </div>
              </div>
            </a>
            <button
              onclick={() => removeItem(defaultList!.id, item.contentId)}
              disabled={removing === item.contentId}
              class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 hover:bg-red-600/80 p-1.5 rounded-full text-white"
              title="Remove from list"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
            <p class="text-white text-xs font-medium truncate">{item.title}</p>
            <p class="text-gray-500 text-xs capitalize">{item.mediaType ?? item.contentType}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
