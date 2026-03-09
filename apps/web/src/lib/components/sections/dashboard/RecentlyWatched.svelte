<script lang="ts">
  import { onMount } from 'svelte';

  interface WatchItem {
    id: string;
    title: string;
    thumbnail: string | null;
    posterUrl: string | null;
    mediaType: string;
    positionSeconds: number;
    durationSeconds: number | null;
    completionPercent: number;
    lastWatched: string;
  }

  let items: WatchItem[] = [];
  let loading = true;

  onMount(async () => {
    try {
      const res = await fetch('/api/watch/history?limit=6');
      if (res.ok) items = await res.json();
    } finally {
      loading = false;
    }
  });

  function formatTimeLeft(position: number, duration: number | null) {
    if (!duration) return '';
    const left = duration - position;
    const m = Math.floor(left / 60);
    if (m < 1) return 'Almost done';
    if (m < 60) return `${m}m left`;
    return `${Math.floor(m / 60)}h ${m % 60}m left`;
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Continue Watching</h2>

  {#if loading}
    <div class="flex gap-4">
      {#each [1, 2, 3] as _}
        <div class="w-44 shrink-0 space-y-2">
          <div class="aspect-video bg-white/5 rounded-lg animate-pulse"></div>
          <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div>
        </div>
      {/each}
    </div>
  {:else if items.length === 0}
    <p class="text-muted-foreground text-sm">You haven't watched anything yet. Start exploring!</p>
  {:else}
    <div class="flex gap-4 overflow-x-auto pb-2">
      {#each items as item (item.id)}
        <a href="/watch/{item.id}?t={item.positionSeconds}" class="w-44 shrink-0 group space-y-2">
          <div class="relative aspect-video rounded-lg overflow-hidden bg-white/5">
            {#if item.thumbnail || item.posterUrl}
              <img
                src={item.thumbnail ?? item.posterUrl ?? ''}
                alt={item.title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            {/if}
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
              <div class="h-full bg-[#FF5E0E]" style="width: {item.completionPercent}%"></div>
            </div>
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-base">&#9654;</div>
            </div>
            {#if item.durationSeconds}
              <div class="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                {formatTimeLeft(item.positionSeconds, item.durationSeconds)}
              </div>
            {/if}
          </div>
          <p class="text-white text-xs font-medium truncate">{item.title}</p>
          <p class="text-gray-500 text-xs capitalize">{item.mediaType}</p>
        </a>
      {/each}
    </div>
  {/if}
</section>
