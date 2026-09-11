<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Download, Check, Loader2, Trash2, X } from '@lucide/svelte';
  import {
    downloadContent,
    deleteDownload,
    isDownloaded,
    type DownloadQuality
  } from '$lib/utils/download-manager';

  /**
   * Offline download control.
   *
   * This is the ENTRY POINT the offline feature was missing: the download
   * manager and the Downloads dashboard both already existed, but nothing in
   * the UI ever called `downloadContent`, so the dashboard could only ever list
   * and delete downloads that could not be created.
   *
   * Entitlement is not checked here. /api/downloads/manifest/:id gates on plan
   * AND on PPV purchase, and its refusal message is what the user sees — a
   * client-side plan check would duplicate that logic and drift from it.
   */
  interface Props {
    contentId: string;
    title: string;
    thumbnail?: string | null;
    /** Set when the title has an audio-only rung, enabling that choice. */
    allowAudioOnly?: boolean;
  }

  let { contentId, title, thumbnail = null, allowAudioOnly = true }: Props = $props();

  let status = $state<'idle' | 'checking' | 'downloading' | 'done' | 'error'>('checking');
  let progress = $state(0);
  let errorMessage = $state<string | null>(null);
  let showQuality = $state(false);

  const QUALITIES: Array<{ value: DownloadQuality; label: string; hint: string }> = [
    { value: 'hd', label: 'Standard', hint: 'Up to 720p — best balance' },
    { value: 'sd', label: 'Data saver', hint: 'Up to 480p — smaller' },
    { value: 'audio', label: 'Audio only', hint: 'Smallest — no picture' }
  ];

  async function refresh() {
    try {
      status = (await isDownloaded(contentId)) ? 'done' : 'idle';
    } catch {
      status = 'idle';
    }
  }

  async function start(quality: DownloadQuality) {
    showQuality = false;
    status = 'downloading';
    progress = 0;
    errorMessage = null;
    try {
      await downloadContent(contentId, title, thumbnail, (pct) => { progress = pct; }, quality);
      status = 'done';
    } catch (e) {
      // Surface the server's message verbatim — it carries the actual reason
      // ("Downloads require Premium or Creator", "must be purchased before it
      // can be downloaded"), which a generic failure string would hide.
      errorMessage = e instanceof Error ? e.message : 'Download failed';
      status = 'error';
    }
  }

  async function remove() {
    await deleteDownload(contentId);
    await refresh();
  }

  onMount(refresh);
</script>

<div class="relative inline-block">
  {#if status === 'checking'}
    <Button variant="outline" size="sm" disabled>
      <Loader2 class="size-4 mr-2 animate-spin" />
      Download
    </Button>
  {:else if status === 'downloading'}
    <Button variant="outline" size="sm" disabled>
      <Loader2 class="size-4 mr-2 animate-spin" />
      {progress}%
    </Button>
  {:else if status === 'done'}
    <Button variant="outline" size="sm" onclick={remove} title="Remove download">
      <Check class="size-4 mr-2 text-emerald-500" />
      Downloaded
      <Trash2 class="size-4 ml-2 opacity-60" />
    </Button>
  {:else}
    <Button variant="outline" size="sm" onclick={() => (showQuality = !showQuality)}>
      <Download class="size-4 mr-2" />
      Download
    </Button>
  {/if}

  {#if showQuality}
    <div
      class="absolute right-0 z-50 mt-2 w-60 rounded-md border bg-popover p-1 shadow-md"
      role="menu"
      tabindex="-1"
    >
      {#each QUALITIES as q (q.value)}
        {#if q.value !== 'audio' || allowAudioOnly}
          <button
            type="button"
            role="menuitem"
            class="w-full rounded px-3 py-2 text-left text-sm hover:bg-accent"
            onclick={() => start(q.value)}
          >
            <span class="block font-medium">{q.label}</span>
            <span class="block text-xs text-muted-foreground">{q.hint}</span>
          </button>
        {/if}
      {/each}
      <button
        type="button"
        class="w-full rounded px-3 py-2 text-left text-xs text-muted-foreground hover:bg-accent"
        onclick={() => (showQuality = false)}
      >
        <X class="size-3 mr-1 inline" />
        Cancel
      </button>
    </div>
  {/if}

  {#if status === 'error' && errorMessage}
    <p class="mt-2 max-w-xs text-xs text-destructive">{errorMessage}</p>
  {/if}
</div>
