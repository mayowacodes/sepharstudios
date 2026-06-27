<script lang="ts">
  import { onMount } from 'svelte';
  import { Trash2, Play, List } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { myList } from '$lib/stores/myList';

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
    slug: string | null;
    category: string | null;
    progressPercent?: number;
    positionSeconds?: number;
  }

  // Build the audience-appropriate detail-page URL for a watchlist
  // item — same routing rules MovieCard / TVShowCard use so the
  // /watchlist surface lands on the same detail pages as everything
  // else (instead of bypassing them with a direct /watch URL).
  function detailHref(item: PlaylistItem): string {
    const slug = item.slug || item.contentId;
    if (item.category === 'kids') return `/kids/kiddies/${slug}`;
    if (item.category === 'teens') return `/kids/teens/${slug}`;
    if (item.mediaType === 'tv' || item.mediaType === 'series') return `/shows/${slug}`;
    if (item.mediaType === 'documentary') return `/documentaries/${slug}`;
    return `/movies/${slug}`;
  }

  // Direct-to-player URL for the in-progress "Resume now" hover
  // shortcut — same shape as the Continue Watching row on the home
  // page. Only used when the item has a saved position.
  function resumeHref(item: PlaylistItem): string {
    const slug = item.slug || item.contentId;
    const params = new URLSearchParams();
    params.set('t', String(Math.max(0, Math.floor(item.positionSeconds ?? 0))));
    return `/watch/${slug}?${params.toString()}`;
  }

  // Treat an item as "in progress" when the server attached the same
  // overlay the catalog cards use. Drives the Resume hover affordance.
  function isInProgress(item: PlaylistItem): boolean {
    return typeof item.progressPercent === 'number'
      && item.progressPercent > 0
      && item.progressPercent < 95;
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
                  slug: string | null;
                  category: string | null;
                  title: string;
                  thumbnail: string | null;
                  posterUrl: string | null;
                  mediaType: string;
                  progressPercent?: number;
                  positionSeconds?: number;
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
            mediaType: r.content.mediaType,
            slug: r.content.slug ?? null,
            category: r.content.category ?? null,
            progressPercent: r.content.progressPercent,
            positionSeconds: r.content.positionSeconds
          }));

          return { ...pl, items };
        })
      );

      playlists = withItems;
      // Seed the shared store so cards / detail pages elsewhere
      // reflect this user's bookmark state without a fresh fetch.
      const ids = withItems.flatMap((pl) => pl.items.map((i) => i.contentId));
      if (ids.length > 0) myList.seedIds(ids);
    } finally {
      loading = false;
    }
  });

  // Removing from the watchlist now goes through the shared myList
  // store so every other surface (catalog cards, detail pages, search)
  // sees the change live + the user gets a "Removed from My List" toast.
  // We still prune the local `playlists` array so the row disappears
  // from THIS view immediately (the store doesn't carry the full
  // PlaylistItem with thumbnail etc, only contentIds).
  async function removeItem(playlistId: string, contentId: string) {
    const item = playlists.flatMap((pl) => pl.items).find((i) => i.contentId === contentId);
    removing = contentId;
    try {
      const becameOut = await myList.toggle({
        contentId,
        contentTitle: item?.title ?? 'this title',
        contentType: item?.mediaType ?? 'movie'
      });
      // Toggle returns the new membership. If it flipped to false the
      // remove succeeded; prune the card. If it stayed true (API
      // failure), leave the row visible so the user can retry — the
      // store has already shown an error toast.
      if (becameOut === false) {
        playlists = playlists.map((pl) =>
          pl.id === playlistId
            ? { ...pl, items: pl.items.filter((i) => i.contentId !== contentId) }
            : pl
        );
      }
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
      <!-- Friendly empty state: oversized bookmark glyph, copy that
           explains the mechanic (look for the bookmark icon, save for
           later), and three jumping-off points so a fresh user finds
           something quickly instead of having to figure out where to
           start. The whole panel sits inside a soft glass card so the
           emptiness has a visual frame. -->
      <div class="text-center py-12 px-6 max-w-xl mx-auto rounded-2xl border border-white/10 bg-white/2 backdrop-blur-sm">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
          <List class="w-7 h-7 text-primary" />
        </div>
        <h2 class="text-xl font-bold mb-2">Your list is empty</h2>
        <p class="text-muted-foreground text-sm mb-6 leading-relaxed">
          Tap the <span class="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded border border-white/15 bg-white/5 align-middle text-xs">🔖</span>
          bookmark on any title's detail page or card to save it here.
          Pick something to start with:
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <Button href="/movies" variant="outline" class="border-[#FF5E0E]/40 text-white hover:bg-[#FF5E0E]/10">
            Browse Movies
          </Button>
          <Button href="/shows" variant="outline" class="border-[#FF5E0E]/40 text-white hover:bg-[#FF5E0E]/10">
            Browse Shows
          </Button>
          <Button href="/documentaries" variant="outline" class="border-[#FF5E0E]/40 text-white hover:bg-[#FF5E0E]/10">
            Documentaries
          </Button>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {#each allItems as item (item.contentId)}
          <div class="group relative space-y-2">
            <a href={detailHref(item)} class="block">
              <div class="aspect-2/3 rounded-lg overflow-hidden bg-white/5 relative">
                {#if item.thumbnail || item.posterUrl}
                  <img
                    src={item.posterUrl ?? item.thumbnail ?? ''}
                    alt={item.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                {/if}
                <!-- Hover veil — only renders the bare play icon
                     for un-started items. In-progress items get the
                     orange Resume pill below (rendered outside the
                     <a> so the inner click doesn't double-trigger).
                     Pointer-events disabled here; the pill re-enables
                     them where needed. -->
                {#if !isInProgress(item)}
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                      <Play class="w-5 h-5 fill-white" />
                    </div>
                  </div>
                {/if}
                <!-- In-progress strip — same orange affordance the
                     catalog cards render, so the watchlist surface
                     stays in the same visual family. -->
                {#if typeof item.progressPercent === 'number' && item.progressPercent > 0 && item.progressPercent < 95}
                  <div class="absolute inset-x-0 bottom-0 h-1 bg-black/40">
                    <div
                      class="h-full bg-[#FF5E0E]"
                      style="width: {Math.max(2, Math.min(100, item.progressPercent))}%"
                    ></div>
                  </div>
                {/if}
              </div>
            </a>
            {#if isInProgress(item)}
              <!-- Orange "Resume now" pill — direct shortcut to
                   /watch with the saved position. Sits over the
                   artwork on hover, mirrors the Continue Watching
                   row's hover pattern for consistency. -->
              <a
                href={resumeHref(item)}
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#FF5E0E] text-white text-sm font-semibold shadow-lg hover:scale-105"
                aria-label={`Resume ${item.title} now`}
              >
                <Play class="w-4 h-4 fill-white" />
                Resume
              </a>
            {/if}
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
