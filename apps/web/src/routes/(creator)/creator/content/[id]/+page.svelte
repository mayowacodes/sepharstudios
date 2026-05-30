<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';

  type Tab = 'details' | 'images' | 'video' | 'subtitles' | 'episodes' | 'analytics';

  interface ContentRow {
    id: string;
    title: string;
    description: string | null;
    mediaType: string;
    ageRating: string | null;
    genres: string[] | null;
    topics: string[] | null;
    keywords: string[] | null;
    bibleReference: string | null;
    language: string | null;
    duration: string | null;
    thumbnail: string | null;
    posterUrl: string | null;
    posterLandscapeUrl: string | null;
    posterSquareUrl: string | null;
    logoTitleUrl: string | null;
    backdropUrl: string | null;
    trailerUrl: string | null;
    videoUrl: string | null;
    visibility: string;
    scheduledPublishAt: string | null;
    status: string;
    isActive: boolean;
    processingStatus: string;
    reviewNotes: string | null;
    rejectionReason: string | null;
    viewCount: number | null;
    createdAt: string;
    updatedAt: string;
  }

  interface Analytics {
    views: number;
    completedWatches: number;
    watchTimeMinutes: number;
    avgWatchMinutes: number;
    completionRate: number;
    totalShares: number;
    viewsByDevice: { device: string; count: number }[];
    topCountries: { country: string; count: number }[];
  }

  interface SubtitleTrack {
    id: string;
    kind: string;
    language: string;
    label: string;
    fileUrl: string;
    isDefault: boolean;
  }

  const contentId = $derived(page.params.id);

  let activeTab = $state<Tab>('details');
  let loading = $state(true);
  let content = $state<ContentRow | null>(null);
  let analytics = $state<Analytics | null>(null);
  let subtitles = $state<SubtitleTrack[]>([]);

  // Edit state, hydrated from `content` after fetch
  let editTitle = $state('');
  let editDescription = $state('');
  let editContentType = $state('movie');
  let editAgeRating = $state('');
  let editGenres = $state('');
  let editTopics = $state('');
  let editKeywords = $state('');
  let editBibleReference = $state('');
  let editLanguage = $state('');
  let editDuration = $state('');
  let editVisibility = $state<'public' | 'unlisted' | 'private'>('public');
  let editScheduledPublishAt = $state('');
  let saving = $state(false);

  const isShow = $derived(content?.mediaType === 'show');

  async function load() {
    loading = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}`);
      if (!res.ok) {
        toast.error('Could not load content');
        content = null;
        return;
      }
      const body = await res.json();
      content = body.content;
      analytics = body.analytics;
      // hydrate form state
      if (content) {
        editTitle = content.title ?? '';
        editDescription = content.description ?? '';
        editContentType = content.mediaType ?? 'movie';
        editAgeRating = content.ageRating ?? '';
        editGenres = (content.genres ?? []).join(', ');
        editTopics = (content.topics ?? []).join(', ');
        editKeywords = (content.keywords ?? []).join(', ');
        editBibleReference = content.bibleReference ?? '';
        editLanguage = content.language ?? '';
        editDuration = content.duration ?? '';
        editVisibility = (content.visibility as typeof editVisibility) ?? 'public';
        editScheduledPublishAt = content.scheduledPublishAt
          ? new Date(content.scheduledPublishAt).toISOString().slice(0, 16)
          : '';
      }

      // Subtitles fetched separately so the tab can refresh independently
      const subRes = await fetch(`/api/content/${contentId}/subtitles`);
      if (subRes.ok) subtitles = (await subRes.json()).tracks ?? [];
    } finally {
      loading = false;
    }
  }

  onMount(load);

  function splitTags(s: string): string[] {
    return s.split(',').map((p) => p.trim()).filter(Boolean);
  }

  async function saveDetails() {
    saving = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          contentType: editContentType,
          ageRating: editAgeRating,
          genres: splitTags(editGenres),
          topics: splitTags(editTopics),
          keywords: splitTags(editKeywords),
          bibleReference: editBibleReference || null,
          language: editLanguage || null,
          duration: editDuration || null
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Save failed');
      toast.success('Details saved');
      content = body.content;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      saving = false;
    }
  }

  async function saveVisibility() {
    saving = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibility: editVisibility,
          scheduledPublishAt: editScheduledPublishAt || null
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Save failed');
      toast.success('Visibility updated');
      content = body.content;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      saving = false;
    }
  }

  // Asset replacement: upload a single file via /api/files, then PATCH the
  // URL into the named field on the content row.
  async function replaceAsset(field: keyof ContentRow, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const upRes = await fetch('/api/files', { method: 'POST', body: formData });
      if (!upRes.ok) throw new Error('File upload failed');
      const upBody = await upRes.json();
      const url = upBody.directUrl ?? upBody.url;
      if (!url) throw new Error('No URL returned from upload');

      const patchRes = await fetch(`/api/creator/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: url })
      });
      const patchBody = await patchRes.json();
      if (!patchRes.ok) throw new Error(patchBody.error ?? 'Save failed');
      content = patchBody.content;
      toast.success('Asset replaced');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Replace failed');
    }
  }

  function onAssetFileChosen(field: keyof ContentRow, ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    void replaceAsset(field, input.files[0]);
    input.value = '';
  }

  async function archive() {
    if (!confirm('Archive this content? It will no longer be visible to viewers.')) return;
    const res = await fetch(`/api/creator/content/${contentId}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Archived');
      goto('/creator/content');
    } else {
      toast.error('Archive failed');
    }
  }

  // Subtitle upload
  let newSubLang = $state('en');
  let newSubLabel = $state('English');
  let newSubKind = $state<'subtitles' | 'captions' | 'descriptions'>('subtitles');
  let subUploading = $state(false);

  async function addSubtitle(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    subUploading = true;
    try {
      const formData = new FormData();
      formData.append('file', input.files[0]);
      const upRes = await fetch('/api/files', { method: 'POST', body: formData });
      if (!upRes.ok) throw new Error('VTT upload failed');
      const upBody = await upRes.json();
      const fileUrl = upBody.directUrl ?? upBody.url;
      if (!fileUrl) throw new Error('No URL returned from upload');

      const res = await fetch(`/api/creator/content/${contentId}/subtitles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: newSubKind, language: newSubLang, label: newSubLabel, fileUrl })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Add subtitle failed');
      subtitles = [...subtitles, body.track];
      toast.success(`Added ${newSubLabel} ${newSubKind}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      subUploading = false;
      input.value = '';
    }
  }

  async function removeSubtitle(trackId: string) {
    if (!confirm('Remove this subtitle track?')) return;
    const res = await fetch(`/api/creator/content/${contentId}/subtitles/${trackId}`, { method: 'DELETE' });
    if (res.ok) {
      subtitles = subtitles.filter((s) => s.id !== trackId);
      toast.success('Removed');
    } else {
      toast.error('Failed to remove');
    }
  }

  const ASSET_SLOTS: { field: keyof ContentRow; title: string; aspect: string; ratio: string }[] = [
    { field: 'posterUrl', title: 'Portrait poster', aspect: 'aspect-[2/3]', ratio: '2:3 — main movie cards' },
    { field: 'backdropUrl', title: 'Hero backdrop', aspect: 'aspect-video', ratio: '16:9 — hero carousel' },
    { field: 'posterLandscapeUrl', title: 'Landscape poster', aspect: 'aspect-video', ratio: '16:9 — horizontal cards' },
    { field: 'posterSquareUrl', title: 'Square poster', aspect: 'aspect-square', ratio: '1:1 — mobile / compact' },
    { field: 'logoTitleUrl', title: 'Title logo', aspect: 'aspect-video', ratio: 'transparent PNG' },
    { field: 'thumbnail', title: 'Video thumbnail', aspect: 'aspect-video', ratio: '16:9 — video preview' }
  ];

  function statusBadgeClass(status: string): string {
    if (status === 'published') return 'bg-green-600/30 text-green-200';
    if (status === 'approved') return 'bg-blue-600/30 text-blue-200';
    if (status === 'rejected') return 'bg-red-600/30 text-red-200';
    if (status === 'archived') return 'bg-gray-600/30 text-gray-200';
    return 'bg-yellow-600/30 text-yellow-200';
  }
</script>

<div class="container mx-auto py-8 px-4 space-y-6 min-h-screen">
  <a href="/creator/content" class="text-purple-400 hover:text-purple-300 text-sm">← Back to content</a>

  {#if loading}
    <div class="text-center text-gray-400 py-12">Loading…</div>
  {:else if !content}
    <div class="bg-red-600/20 border border-red-600 text-red-100 rounded-lg p-6 text-center">
      Content not found or you don't have access.
    </div>
  {:else}
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-start gap-4">
        {#if content.thumbnail}
          <img src={content.thumbnail} alt="" class="w-24 h-14 object-cover rounded" />
        {:else}
          <div class="w-24 h-14 bg-white/10 rounded grid place-items-center text-gray-500 text-xs">no thumb</div>
        {/if}
        <div>
          <h1 class="text-2xl font-bold text-white">{content.title}</h1>
          <div class="flex items-center gap-2 mt-1 text-xs">
            <span class="px-2 py-0.5 rounded-full {statusBadgeClass(content.status)}">{content.status}</span>
            <span class="px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{content.visibility}</span>
            {#if content.processingStatus && content.processingStatus !== 'not_started' && content.processingStatus !== 'ready'}
              <span class="px-2 py-0.5 rounded-full bg-orange-600/30 text-orange-200">{content.processingStatus}</span>
            {/if}
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        {#if content.isActive}
          <a href={`/watch/${content.id}`} target="_blank" rel="noopener" class="bg-white/10 hover:bg-white/15 text-white px-3 py-2 rounded text-sm">View live ↗</a>
        {/if}
        <button type="button" onclick={archive} class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm">Archive</button>
      </div>
    </div>

    {#if content.rejectionReason}
      <div class="bg-red-600/20 border border-red-600 rounded-lg p-4 text-red-100 text-sm">
        <div class="font-semibold mb-1">Admin feedback (rejected)</div>
        <p>{content.rejectionReason}</p>
      </div>
    {/if}
    {#if content.reviewNotes}
      <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-4 text-blue-100 text-sm">
        <div class="font-semibold mb-1">Admin notes</div>
        <p>{content.reviewNotes}</p>
      </div>
    {/if}

    <!-- Tabs -->
    <div class="flex flex-wrap gap-2 border-b border-white/10">
      {#each (['details', 'images', 'video', 'subtitles', ...(isShow ? ['episodes' as Tab] : []), 'analytics'] as Tab[]) as tab (tab)}
        <button
          type="button"
          onclick={() => activeTab = tab}
          class="px-4 py-2 text-sm capitalize transition-colors {activeTab === tab ? 'text-purple-300 border-b-2 border-purple-400 -mb-px' : 'text-gray-400 hover:text-white'}"
        >{tab}</button>
      {/each}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main tab content -->
      <div class="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
        {#if activeTab === 'details'}
          <div class="space-y-4">
            <div>
              <label for="d-title" class="block text-sm text-gray-300 mb-1">Title *</label>
              <input id="d-title" bind:value={editTitle} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white" />
            </div>
            <div>
              <label for="d-desc" class="block text-sm text-gray-300 mb-1">Description</label>
              <textarea id="d-desc" bind:value={editDescription} rows="4" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="d-type" class="block text-sm text-gray-300 mb-1">Content type</label>
                <select id="d-type" bind:value={editContentType} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white">
                  <option value="movie">Movie</option>
                  <option value="show">Show</option>
                  <option value="documentary">Documentary</option>
                </select>
                {#if content.mediaType !== editContentType}
                  <p class="text-xs text-yellow-400 mt-1">⚠ Changing content type may require admin re-review.</p>
                {/if}
              </div>
              <div>
                <label for="d-age" class="block text-sm text-gray-300 mb-1">Age rating</label>
                <input id="d-age" bind:value={editAgeRating} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white" />
              </div>
            </div>
            <div>
              <label for="d-genres" class="block text-sm text-gray-300 mb-1">Genres (comma-separated)</label>
              <input id="d-genres" bind:value={editGenres} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white" placeholder="Drama, Faith" />
            </div>
            <div>
              <label for="d-topics" class="block text-sm text-gray-300 mb-1">Topics / themes</label>
              <input id="d-topics" bind:value={editTopics} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white" placeholder="Forgiveness, Hope" />
            </div>
            <div>
              <label for="d-keywords" class="block text-sm text-gray-300 mb-1">Keywords</label>
              <input id="d-keywords" bind:value={editKeywords} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="d-bible" class="block text-sm text-gray-300 mb-1">Bible reference</label>
                <input id="d-bible" bind:value={editBibleReference} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white" placeholder="John 3:16" />
              </div>
              <div>
                <label for="d-lang" class="block text-sm text-gray-300 mb-1">Language</label>
                <input id="d-lang" bind:value={editLanguage} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white" placeholder="English" />
              </div>
              <div>
                <label for="d-dur" class="block text-sm text-gray-300 mb-1">Duration</label>
                <input id="d-dur" bind:value={editDuration} class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white" placeholder="1h 30m" />
              </div>
            </div>
            <button type="button" onclick={saveDetails} disabled={saving} class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded">
              {saving ? 'Saving…' : 'Save details'}
            </button>
          </div>
        {:else if activeTab === 'images'}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each ASSET_SLOTS as slot (slot.field)}
              <div class="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                <div>
                  <div class="text-white font-medium text-sm">{slot.title}</div>
                  <div class="text-xs text-gray-400">{slot.ratio}</div>
                </div>
                <div class={`${slot.aspect} bg-black/30 rounded overflow-hidden`}>
                  {#if content[slot.field]}
                    <img src={content[slot.field] as string} alt={slot.title} class="w-full h-full object-cover" />
                  {:else}
                    <div class="w-full h-full grid place-items-center text-gray-500 text-xs">Not uploaded</div>
                  {/if}
                </div>
                <label class="block">
                  <input
                    type="file"
                    accept="image/*"
                    onchange={(e) => onAssetFileChosen(slot.field, e)}
                    class="hidden"
                  />
                  <span class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer">
                    {content[slot.field] ? 'Replace' : 'Upload'}
                  </span>
                </label>
              </div>
            {/each}
          </div>
        {:else if activeTab === 'video'}
          <div class="space-y-4">
            {#if content.videoUrl}
              <div>
                <div class="text-sm text-gray-400 mb-2">Current encoded video</div>
                <!-- svelte-ignore a11y_media_has_caption -->
                <video src={content.videoUrl} controls class="w-full rounded-lg bg-black"></video>
              </div>
            {:else}
              <div class="bg-yellow-600/20 border border-yellow-600 text-yellow-100 rounded p-4 text-sm">
                Video hasn't finished encoding yet (status: {content.processingStatus}).
              </div>
            {/if}
            <div>
              <div class="text-sm text-gray-400 mb-2">Trailer {content.trailerUrl ? '(current)' : '(none)'}</div>
              {#if content.trailerUrl}
                <!-- svelte-ignore a11y_media_has_caption -->
                <video src={content.trailerUrl} controls class="w-full rounded-lg bg-black mb-2"></video>
              {/if}
              <label class="block">
                <input
                  type="file"
                  accept="video/*"
                  onchange={(e) => onAssetFileChosen('trailerUrl', e)}
                  class="hidden"
                />
                <span class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded cursor-pointer">
                  {content.trailerUrl ? 'Replace trailer' : 'Upload trailer'}
                </span>
              </label>
            </div>
            <div class="border-t border-white/10 pt-4">
              <p class="text-xs text-gray-400 mb-2">
                Replacing the main video re-runs the entire encoder pipeline. Use the upload wizard to swap the main file:
              </p>
              <a href={`/creator/upload?edit=${content.id}`} class="text-purple-300 hover:text-purple-200 text-sm underline">
                Open upload wizard →
              </a>
            </div>
          </div>
        {:else if activeTab === 'subtitles'}
          <div class="space-y-4">
            {#if subtitles.length === 0}
              <p class="text-sm text-gray-400">No subtitle tracks yet.</p>
            {:else}
              <ul class="space-y-2">
                {#each subtitles as track (track.id)}
                  <li class="flex items-center justify-between bg-white/5 border border-white/10 rounded p-3">
                    <div>
                      <span class="text-white text-sm">{track.label}</span>
                      <span class="text-xs text-gray-400 ml-2">({track.language})</span>
                      <span class="text-xs px-2 py-0.5 rounded bg-purple-700/30 text-purple-200 ml-2">{track.kind}</span>
                      {#if track.isDefault}<span class="text-xs text-yellow-300 ml-2">★ default</span>{/if}
                    </div>
                    <div class="flex items-center gap-2">
                      <a href={track.fileUrl} target="_blank" rel="noopener" class="text-xs text-gray-300 hover:text-white">view VTT</a>
                      <button type="button" onclick={() => removeSubtitle(track.id)} class="text-red-300 hover:text-red-100 text-xs">Remove</button>
                    </div>
                  </li>
                {/each}
              </ul>
            {/if}

            <div class="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
              <div class="text-sm font-medium text-white">Add a track</div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input bind:value={newSubLang} placeholder="lang (e.g. en)" class="px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm" />
                <input bind:value={newSubLabel} placeholder="Label (e.g. English)" class="px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm" />
                <select bind:value={newSubKind} class="px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm">
                  <option value="subtitles">Subtitles</option>
                  <option value="captions">Captions (with sounds)</option>
                  <option value="descriptions">Audio descriptions</option>
                </select>
              </div>
              <label class="block">
                <input type="file" accept=".vtt,text/vtt" onchange={addSubtitle} class="hidden" />
                <span class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded cursor-pointer">
                  {subUploading ? 'Uploading…' : 'Upload VTT file'}
                </span>
              </label>
              <p class="text-xs text-gray-400">VTT format only. The track will appear in the player's CC menu.</p>
            </div>
          </div>
        {:else if activeTab === 'episodes' && isShow}
          <div class="space-y-3">
            <p class="text-sm text-gray-400">
              Manage seasons + episodes for this show. Each episode has its own video file and metadata.
            </p>
            <a href={`/creator/content/${content.id}/episodes`} class="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
              Open episodes manager →
            </a>
          </div>
        {:else if activeTab === 'analytics'}
          {#if analytics}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="bg-white/5 border border-white/10 rounded p-3 text-center">
                <div class="text-2xl font-bold text-purple-400">{analytics.views.toLocaleString()}</div>
                <div class="text-xs text-gray-400">Views</div>
              </div>
              <div class="bg-white/5 border border-white/10 rounded p-3 text-center">
                <div class="text-2xl font-bold text-blue-400">{analytics.watchTimeMinutes}</div>
                <div class="text-xs text-gray-400">Watch time (min)</div>
              </div>
              <div class="bg-white/5 border border-white/10 rounded p-3 text-center">
                <div class="text-2xl font-bold text-green-400">{analytics.completionRate}%</div>
                <div class="text-xs text-gray-400">Completion</div>
              </div>
              <div class="bg-white/5 border border-white/10 rounded p-3 text-center">
                <div class="text-2xl font-bold text-pink-400">{analytics.totalShares}</div>
                <div class="text-xs text-gray-400">Shares</div>
              </div>
            </div>
            {#if analytics.viewsByDevice.length > 0}
              <div class="mt-4">
                <div class="text-sm font-medium text-white mb-2">By device</div>
                <div class="flex flex-wrap gap-2 text-xs">
                  {#each analytics.viewsByDevice as d}
                    <span class="px-2 py-1 rounded bg-white/10 text-gray-200">{d.device}: {d.count}</span>
                  {/each}
                </div>
              </div>
            {/if}
            {#if analytics.topCountries.length > 0}
              <div class="mt-4">
                <div class="text-sm font-medium text-white mb-2">Top countries</div>
                <div class="flex flex-wrap gap-2 text-xs">
                  {#each analytics.topCountries as c}
                    <span class="px-2 py-1 rounded bg-white/10 text-gray-200">{c.country}: {c.count}</span>
                  {/each}
                </div>
              </div>
            {/if}
          {:else}
            <p class="text-sm text-gray-400">No analytics yet.</p>
          {/if}
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5 lg:sticky lg:top-4 self-start">
        <div>
          <div class="text-sm font-medium text-white mb-2">Visibility</div>
          <div class="space-y-2">
            {#each (['public', 'unlisted', 'private'] as const) as v (v)}
              <label class="flex items-start gap-2 text-sm cursor-pointer">
                <input type="radio" bind:group={editVisibility} value={v} class="mt-0.5 accent-purple-600" />
                <div>
                  <div class="text-white capitalize">{v}</div>
                  <div class="text-xs text-gray-400">
                    {v === 'public' ? 'Listed in browse and search.' :
                     v === 'unlisted' ? 'Only accessible via direct link.' :
                     'Only you can see.'}
                  </div>
                </div>
              </label>
            {/each}
          </div>
        </div>

        <div>
          <label for="schedule" class="block text-sm font-medium text-white mb-1">Schedule publish</label>
          <input
            id="schedule"
            type="datetime-local"
            bind:value={editScheduledPublishAt}
            class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
          />
          <p class="text-xs text-gray-400 mt-1">Only fires once admin has approved.</p>
        </div>

        <button type="button" onclick={saveVisibility} disabled={saving} class="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm">
          {saving ? 'Saving…' : 'Save visibility'}
        </button>

        <div class="border-t border-white/10 pt-4 text-xs text-gray-400 space-y-1">
          <div>Created {new Date(content.createdAt).toLocaleDateString()}</div>
          <div>Updated {new Date(content.updatedAt).toLocaleString()}</div>
          <div>{content.viewCount?.toLocaleString() ?? 0} total views</div>
        </div>
      </div>
    </div>
  {/if}
</div>
