<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { ArrowLeft, Plus, Tv } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';

  interface Episode {
    id: string;
    showId: string;
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    description: string | null;
    thumbnail: string | null;
    videoUrl: string | null;
    duration: string | null;
    airDate: string | null;
    createdAt: string;
  }

  const showId = $derived(page.params.id);

  let episodes = $state<Episode[]>([]);
  let loading = $state(true);
  let dialogOpen = $state(false);
  let editingId = $state<string | null>(null);

  let form = $state({
    seasonNumber: 1,
    episodeNumber: 1,
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    duration: '',
    airDate: ''
  });

  async function load() {
    loading = true;
    try {
      const res = await fetch(`/api/creator/content/${showId}/episodes`);
      if (res.ok) {
        const body = await res.json();
        episodes = body.episodes ?? [];
      } else {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error ?? 'Failed to load episodes');
      }
    } finally {
      loading = false;
    }
  }

  onMount(load);

  function openCreate() {
    editingId = null;
    const lastInSeason1 = episodes.filter((e) => e.seasonNumber === 1);
    form = {
      seasonNumber: 1,
      episodeNumber: lastInSeason1.length + 1,
      title: '',
      description: '',
      thumbnail: '',
      videoUrl: '',
      duration: '',
      airDate: ''
    };
    dialogOpen = true;
  }

  function openEdit(e: Episode) {
    editingId = e.id;
    form = {
      seasonNumber: e.seasonNumber,
      episodeNumber: e.episodeNumber,
      title: e.title,
      description: e.description ?? '',
      thumbnail: e.thumbnail ?? '',
      videoUrl: e.videoUrl ?? '',
      duration: e.duration ?? '',
      airDate: e.airDate ?? ''
    };
    dialogOpen = true;
  }

  async function save() {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    try {
      const path = editingId
        ? `/api/creator/content/${showId}/episodes/${editingId}`
        : `/api/creator/content/${showId}/episodes`;
      const res = await fetch(path, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Save failed');
      dialogOpen = false;
      await load();
      toast.success(editingId ? 'Episode updated' : 'Episode added');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function removeEpisode(e: Episode) {
    if (!confirm(`Delete S${e.seasonNumber}E${e.episodeNumber} "${e.title}"?`)) return;
    const res = await fetch(`/api/creator/content/${showId}/episodes/${e.id}`, { method: 'DELETE' });
    if (res.ok) {
      episodes = episodes.filter((x) => x.id !== e.id);
      toast.success('Episode deleted');
    } else {
      toast.error('Delete failed');
    }
  }

  // Group episodes by season for display.
  const grouped = $derived.by(() => {
    const map = new Map<number, Episode[]>();
    for (const e of episodes) {
      if (!map.has(e.seasonNumber)) map.set(e.seasonNumber, []);
      map.get(e.seasonNumber)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  });

  // Reuse the /api/files + PATCH pattern for video / thumbnail uploads inline.
  async function uploadAndSet(field: 'videoUrl' | 'thumbnail', file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/files', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const url = data.directUrl ?? data.url;
      if (!url) throw new Error('No URL returned');
      form[field] = url;
      toast.success(`${field} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  function onFileChosen(field: 'videoUrl' | 'thumbnail', ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    void uploadAndSet(field, input.files[0]);
    input.value = '';
  }
</script>

<div class="container mx-auto py-8 px-4 space-y-6">
  <a href={`/creator/content/${showId}`} class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">
    <ArrowLeft class="w-3 h-3" /> Back to show
  </a>

  <PageHeader icon={Tv} title="Episodes" subtitle="{episodes.length} {episodes.length === 1 ? 'episode' : 'episodes'} across {grouped.length} {grouped.length === 1 ? 'season' : 'seasons'}.">
    {#snippet actions()}
      <button type="button" onclick={openCreate} class="text-xs bg-primary hover:opacity-90 rounded-full px-3 py-1.5 text-primary-foreground font-medium inline-flex items-center gap-1 transition-opacity">
        <Plus class="w-3 h-3" /> Add episode
      </button>
    {/snippet}
  </PageHeader>

  {#if loading}
    <div class="text-center text-muted-foreground py-12">Loading…</div>
  {:else if episodes.length === 0}
    <div class="surface-1 border border-border/40 rounded-xl p-12 text-center text-muted-foreground">
      No episodes yet. Add Season 1 Episode 1 to get started.
    </div>
  {:else}
    {#each grouped as [season, eps] (season)}
      <div class="space-y-2">
        <h2 class="text-lg font-semibold text-foreground">Season {season}</h2>
        <ul class="space-y-2">
          {#each eps as e (e.id)}
            <li class="surface-1 border border-border/40 rounded-lg p-4 flex items-start gap-4">
              {#if e.thumbnail}
                <img src={e.thumbnail} alt="" class="w-24 h-14 object-cover rounded shrink-0" />
              {:else}
                <div class="w-24 h-14 surface-2 rounded grid place-items-center text-xs text-muted-foreground shrink-0">no thumb</div>
              {/if}
              <div class="flex-1 min-w-0">
                <div class="text-foreground">
                  <span class="text-purple-300 text-sm">S{e.seasonNumber}E{e.episodeNumber}</span>
                  <span class="font-medium ml-2">{e.title}</span>
                </div>
                {#if e.description}
                  <p class="text-xs text-muted-foreground mt-1 line-clamp-2">{e.description}</p>
                {/if}
                <div class="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                  {#if e.duration}<span>{e.duration}</span>{/if}
                  {#if e.airDate}<span>Aired {e.airDate}</span>{/if}
                  {#if !e.videoUrl}<span class="text-yellow-400">⚠ No video uploaded</span>{/if}
                </div>
              </div>
              <div class="flex flex-col gap-1 shrink-0">
                <button type="button" onclick={() => openEdit(e)} class="text-xs surface-2 hover:surface-3 text-foreground px-3 py-1.5 rounded">Edit</button>
                <button type="button" onclick={() => removeEpisode(e)} class="text-xs bg-red-600/30 hover:bg-red-600/50 text-red-100 px-3 py-1.5 rounded">Delete</button>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  {/if}
</div>

<!-- Modal -->
{#if dialogOpen}
  <div
    class="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
    role="presentation"
    onclick={() => dialogOpen = false}
    onkeydown={(e) => { if (e.key === 'Escape') dialogOpen = false; }}
  >
    <div
      class="bg-zinc-900 border border-border/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <h2 class="text-xl font-bold text-foreground">{editingId ? 'Edit episode' : 'Add episode'}</h2>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="ep-season" class="block text-xs text-foreground/80 mb-1">Season #</label>
          <input id="ep-season" type="number" min="1" bind:value={form.seasonNumber} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" />
        </div>
        <div>
          <label for="ep-num" class="block text-xs text-foreground/80 mb-1">Episode #</label>
          <input id="ep-num" type="number" min="1" bind:value={form.episodeNumber} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" />
        </div>
      </div>
      <div>
        <label for="ep-title" class="block text-xs text-foreground/80 mb-1">Title *</label>
        <input id="ep-title" bind:value={form.title} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" />
      </div>
      <div>
        <label for="ep-desc" class="block text-xs text-foreground/80 mb-1">Description</label>
        <textarea id="ep-desc" bind:value={form.description} rows="3" class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="ep-dur" class="block text-xs text-foreground/80 mb-1">Duration</label>
          <input id="ep-dur" bind:value={form.duration} placeholder="e.g. 42m" class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" />
        </div>
        <div>
          <label for="ep-air" class="block text-xs text-foreground/80 mb-1">Air date</label>
          <input id="ep-air" type="date" bind:value={form.airDate} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" />
        </div>
      </div>

      <div>
        <div class="text-xs text-foreground/80 mb-1">Thumbnail</div>
        {#if form.thumbnail}
          <img src={form.thumbnail} alt="" class="w-32 h-20 object-cover rounded mb-2" />
        {/if}
        <label class="inline-block">
          <input type="file" accept="image/*" class="hidden" onchange={(e) => onFileChosen('thumbnail', e)} />
          <span class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded">
            {form.thumbnail ? 'Replace thumbnail' : 'Upload thumbnail'}
          </span>
        </label>
      </div>

      <div>
        <div class="text-xs text-foreground/80 mb-1">Video file</div>
        {#if form.videoUrl}
          <p class="text-xs text-green-400 mb-2">✓ Video uploaded</p>
        {/if}
        <label class="inline-block">
          <input type="file" accept="video/*" class="hidden" onchange={(e) => onFileChosen('videoUrl', e)} />
          <span class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded">
            {form.videoUrl ? 'Replace video' : 'Upload video'}
          </span>
        </label>
        <p class="text-xs text-muted-foreground mt-1">Episode videos skip the full encoder pipeline — uploads directly to storage.</p>
      </div>

      <div class="flex justify-end gap-2 border-t border-border/40 pt-4">
        <button type="button" onclick={() => dialogOpen = false} class="px-4 py-2 text-foreground/80 hover:text-foreground text-sm">Cancel</button>
        <button type="button" onclick={save} class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
          {editingId ? 'Save changes' : 'Add episode'}
        </button>
      </div>
    </div>
  </div>
{/if}
