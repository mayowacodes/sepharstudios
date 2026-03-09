<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { listDownloads, deleteDownload, getDownloadStorageBytes } from '$lib/utils/download-manager';
  import { Download, Trash2, Play } from '@lucide/svelte';

  interface DownloadMeta {
    contentId: string;
    title: string;
    thumbnail: string | null;
    downloadedAt: number;
  }

  let items = $state<DownloadMeta[]>([]);
  let loading = $state(true);
  let storageBytes = $state(0);
  let removing = $state<string | null>(null);

  onMount(async () => {
    try {
      items = await listDownloads();
      storageBytes = await getDownloadStorageBytes();
    } finally {
      loading = false;
    }
  });

  async function remove(contentId: string) {
    removing = contentId;
    try {
      await deleteDownload(contentId);
      items = items.filter(i => i.contentId !== contentId);
      storageBytes = await getDownloadStorageBytes();
    } finally {
      removing = null;
    }
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString();
  }
</script>

<section>
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-xl font-semibold">Downloads</h2>
    {#if storageBytes > 0}
      <span class="text-xs text-muted-foreground">{formatBytes(storageBytes)} used</span>
    {/if}
  </div>

  {#if loading}
    <div class="space-y-3">
      {#each [1, 2] as _}
        <div class="h-16 bg-white/5 rounded-lg animate-pulse"></div>
      {/each}
    </div>

  {:else if items.length === 0}
    <div class="text-center py-8">
      <Download class="w-8 h-8 text-muted-foreground mx-auto mb-2" />
      <p class="text-muted-foreground text-sm">No downloads yet.</p>
      <p class="text-xs text-muted-foreground mt-1">Premium and Creator plans can download content for offline viewing.</p>
      <Button size="sm" variant="outline" href="/device-support#install" class="mt-3">How to download</Button>
    </div>

  {:else}
    <div class="space-y-3">
      {#each items as item (item.contentId)}
        <div class="flex items-center gap-4 bg-muted/20 border border-border p-3 rounded-lg group">
          <div class="w-12 h-12 rounded bg-muted shrink-0 overflow-hidden">
            {#if item.thumbnail}
              <img src={item.thumbnail} alt={item.title} class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-muted-foreground">
                <Play class="w-4 h-4" />
              </div>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{item.title}</p>
            <p class="text-xs text-muted-foreground">Downloaded {formatDate(item.downloadedAt)}</p>
          </div>
          <a href="/watch/{item.contentId}?offline=true" class="text-xs text-primary hover:underline shrink-0">Play</a>
          <button
            onclick={() => remove(item.contentId)}
            disabled={removing === item.contentId}
            class="text-muted-foreground hover:text-red-400 transition-colors shrink-0 p-1"
            title="Delete download"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</section>
