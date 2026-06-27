<script lang="ts">
  import { onMount } from 'svelte';
  import { Radio, Copy, RefreshCw, Trash2, Eye } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
  import { toast } from 'svelte-sonner';

  interface LiveStream {
    id: string;
    title: string;
    description: string | null;
    streamKey: string;
    rtmpIngestUrl: string | null;
    playbackUrl: string | null;
    status: string;
    visibility: string;
    scheduledStartAt: string | null;
    startedAt: string | null;
    endedAt: string | null;
    viewerCount: number;
    viewerCountPeak: number;
    createdAt: string;
  }

  let streams = $state<LiveStream[]>([]);
  let loading = $state(true);
  let creating = $state(false);
  let newTitle = $state('');
  let newDescription = $state('');

  async function load() {
    loading = true;
    try {
      const res = await fetch('/api/creator/live');
      const body = await res.json();
      streams = body.streams ?? [];
    } finally {
      loading = false;
    }
  }
  onMount(load);

  async function createStream() {
    if (!newTitle.trim()) {
      toast.error('Title required');
      return;
    }
    creating = true;
    try {
      const res = await fetch('/api/creator/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription || undefined })
      });
      // Read the body defensively — a 5xx HTML error page would otherwise
      // throw inside .json() and surface a confusing "Unexpected token <"
      // toast instead of the real status.
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? `Create failed (HTTP ${res.status})`);
      toast.success('Stream created');
      newTitle = '';
      newDescription = '';
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Create failed');
    } finally {
      creating = false;
    }
  }

  // Per-stream rotate-in-flight map — keyed by stream id so two rows can
  // be rotated independently without one blocking the other.
  let rotatingKey = $state<Record<string, boolean>>({});

  async function rotateKey(s: LiveStream) {
    if (rotatingKey[s.id]) return;
    if (!confirm('Rotate stream key? Existing OBS sessions using the old key will disconnect.')) return;
    rotatingKey = { ...rotatingKey, [s.id]: true };
    try {
      const res = await fetch(`/api/creator/live/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rotateKey: true })
      });
      if (res.ok) {
        toast.success('Key rotated');
        await load();
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? `Failed (HTTP ${res.status})`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Rotate failed');
    } finally {
      rotatingKey = { ...rotatingKey, [s.id]: false };
    }
  }

  async function removeStream(s: LiveStream) {
    if (!confirm(`Delete "${s.title}"?`)) return;
    const res = await fetch(`/api/creator/live/${s.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      await load();
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? 'Delete failed');
    }
  }

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
    toast.success('Copied');
  }

  function statusBadge(s: string): string {
    if (s === 'live') return 'bg-red-600 text-white animate-pulse';
    if (s === 'ingest') return 'bg-yellow-600/40 text-yellow-100';
    if (s === 'ended') return 'bg-gray-600/40 text-foreground/80';
    if (s === 'errored') return 'bg-red-600/40 text-red-100';
    return 'surface-2 text-foreground/80';
  }
</script>

<div class="mx-auto py-8 px-4 max-w-4xl space-y-6">
  <PortalHero
    compact
    eyebrow="Broadcast"
    title="Go live"
    subtitle="Create a stream, point OBS / Streamlabs at the RTMP URL + key, and go live. Viewers see the LIVE indicator on your watch page."
    icon={Radio}
  />

  <!-- Compose -->
  <section class="surface-1 rounded-xl p-4 space-y-3">
    <h2 class="text-sm font-semibold text-foreground">New stream</h2>
    <input type="text" bind:value={newTitle} placeholder="Stream title" class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground" />
    <textarea bind:value={newDescription} rows="2" placeholder="Description (optional)" class="w-full surface-2 rounded px-3 py-2 text-sm text-foreground resize-none"></textarea>
    <div class="flex justify-end">
      <button type="button" onclick={createStream} disabled={creating} class="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm">
        {creating ? 'Creating…' : 'Create stream'}
      </button>
    </div>
  </section>

  <!-- List -->
  <section>
    <h2 class="text-sm font-semibold text-foreground mb-3">Your streams</h2>
    {#if loading}
      <div class="space-y-2">
        {#each Array(2) as _, i (i)}<Skeleton class="h-32 rounded-xl" />{/each}
      </div>
    {:else if streams.length === 0}
      <div class="surface-1 rounded-xl p-10 text-center text-muted-foreground">No streams yet. Create one above to get started.</div>
    {:else}
      <ul class="space-y-3">
        {#each streams as s (s.id)}
          <li class="surface-1 rounded-xl p-4 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm font-semibold text-foreground">{s.title}</span>
                  <span class="text-xs px-2 py-0.5 rounded uppercase tracking-wide {statusBadge(s.status)}">{s.status}</span>
                  {#if s.status === 'live'}
                    <span class="text-xs text-red-300 inline-flex items-center gap-1">
                      <Eye class="w-3 h-3" /> {s.viewerCount} watching · peak {s.viewerCountPeak}
                    </span>
                  {/if}
                </div>
                {#if s.description}
                  <p class="text-xs text-muted-foreground mt-1">{s.description}</p>
                {/if}
              </div>
              <div class="flex gap-1">
                <button type="button" onclick={() => rotateKey(s)} disabled={rotatingKey[s.id]} title="Rotate stream key" class="text-yellow-300 hover:text-yellow-100 disabled:opacity-40">
                  <RefreshCw class="w-4 h-4 {rotatingKey[s.id] ? 'animate-spin' : ''}" />
                </button>
                <button type="button" onclick={() => removeStream(s)} title="Delete" disabled={s.status === 'live' || s.status === 'ingest'} class="text-red-300 hover:text-red-100 disabled:opacity-30">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Credentials -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="surface-2 rounded p-2 flex items-center gap-2">
                <div class="flex-1 min-w-0">
                  <div class="text-muted-foreground text-[10px] uppercase">RTMP URL</div>
                  <div class="text-foreground font-mono truncate">{s.rtmpIngestUrl ?? '—'}</div>
                </div>
                {#if s.rtmpIngestUrl}
                  <button type="button" onclick={() => copy(s.rtmpIngestUrl!)} class="text-purple-300 hover:text-purple-200"><Copy class="w-3.5 h-3.5" /></button>
                {/if}
              </div>
              <div class="surface-2 rounded p-2 flex items-center gap-2">
                <div class="flex-1 min-w-0">
                  <div class="text-muted-foreground text-[10px] uppercase">Stream key (secret)</div>
                  <div class="text-foreground font-mono truncate">{s.streamKey}</div>
                </div>
                <button type="button" onclick={() => copy(s.streamKey)} class="text-purple-300 hover:text-purple-200"><Copy class="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {#if s.playbackUrl}
              <a href={`/watch/live/${s.id}`} class="text-xs text-purple-300 hover:text-purple-200 inline-flex items-center gap-1">
                <Radio class="w-3 h-3" /> Open watch page
              </a>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
