<script lang="ts">
  import { page } from '$app/state';
  import { goto, beforeNavigate } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';
  import { toast } from 'svelte-sonner';
  import ContentThreadPanel from '$lib/components/widgets/ContentThreadPanel.svelte';
  import VideoPlayer from '$lib/components/widgets/VideoPlayer.svelte';
  import { COUNTRIES } from '$lib/data/countries';
  import { announce } from '$lib/stores/live-region';
  import { ArrowLeft, ExternalLink, Archive as ArchiveIcon, Trash2 } from '@lucide/svelte';

  type Tab = 'details' | 'images' | 'video' | 'subtitles' | 'chapters' | 'episodes' | 'analytics' | 'thread';

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
    processingProgress: number | null;
    processingStage: string | null;
    processingError: string | null;
    contentScanStatus: string | null;
    reviewNotes: string | null;
    rejectionReason: string | null;
    viewCount: number | null;
    createdAt: string;
    updatedAt: string;
    chapters: Array<{ start: number; title: string }> | null;
    cast: Array<{ name: string; role: string; photoUrl?: string; characterName?: string }>;
    crew: Array<{ name: string; role: string; photoUrl?: string }>;
    geoMode: 'all' | 'allow' | 'block';
    geoRegions: string[];
    nextUpContentIds: string[];
    previewThumbnailsVtt: string | null;
    previewSpriteUrls: string[];
    posterAutoUrl: string | null;
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

  // Deep-link support: `?tab=thread` opens the Notes-from-admin tab so
  // the notification action URL lands where the user expects.
  const initialTabFromQuery = (page.url.searchParams.get('tab') as Tab | null);
  let activeTab = $state<Tab>(
    initialTabFromQuery && ['details', 'images', 'video', 'subtitles', 'chapters', 'episodes', 'analytics', 'thread'].includes(initialTabFromQuery)
      ? initialTabFromQuery
      : 'details'
  );
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
  // Catalog-completion round state
  let editChapters = $state<Array<{ start: number; title: string }>>([]);
  let newChapterStart = $state('');
  let newChapterTitle = $state('');
  let editCast = $state<Array<{ name: string; role: string; photoUrl?: string; characterName?: string }>>([]);
  let editCrew = $state<Array<{ name: string; role: string; photoUrl?: string }>>([]);
  let editGeoMode = $state<'all' | 'allow' | 'block'>('all');
  let editGeoRegions = $state<string[]>([]);
  // Curated end-screen next-up picks (creator overrides auto-recs).
  let editNextUpIds = $state<string[]>([]);
  let editNextUpTitles = $state<Record<string, string>>({});
  let nextUpQuery = $state('');
  let nextUpSearchResults = $state<Array<{ id: string; title: string; thumbnail: string | null }>>([]);
  let nextUpSearching = $state(false);
  let nextUpSavingFlag = $state(false);
  let thumbnailVariants = $state<Array<{
    id: string;
    url: string;
    label: string | null;
    isActive: boolean;
    isWinner: boolean;
    impressions: number;
    clicks: number;
    ctr: number;
  }>>([]);
  let saving = $state(false);

  // Unsaved-changes guard. We snapshot the form fields every time the
  // content row is loaded or successfully saved, then compare to a derived
  // snapshot of the current edit state. If they differ, warn the creator
  // on navigation / tab close so a half-typed description isn't lost when
  // they bounce between content/[id] tabs or hit a SidebarLink mid-edit.
  let savedSnapshot = $state('');
  const currentSnapshot = $derived(JSON.stringify({
    editTitle, editDescription, editContentType, editAgeRating,
    editGenres, editTopics, editKeywords, editBibleReference,
    editLanguage, editDuration, editVisibility, editScheduledPublishAt,
    editChapters, editCast, editCrew, editGeoMode, editGeoRegions,
    editNextUpIds
  }));
  const isDirty = $derived(savedSnapshot !== '' && currentSnapshot !== savedSnapshot);
  function captureSnapshot() {
    savedSnapshot = JSON.stringify({
      editTitle, editDescription, editContentType, editAgeRating,
      editGenres, editTopics, editKeywords, editBibleReference,
      editLanguage, editDuration, editVisibility, editScheduledPublishAt,
      editChapters, editCast, editCrew, editGeoMode, editGeoRegions,
      editNextUpIds
    });
  }

  // Per-region pricing state.
  interface PricingRow { id: string; regionCode: string; priceCents: number; currency: string }
  let pricingRows = $state<PricingRow[]>([]);
  let newRegion = $state('*');
  let newPriceDollars = $state('');
  let newCurrency = $state('USD');

  async function loadPricing() {
    try {
      const res = await fetch(`/api/creator/content/${contentId}/pricing`);
      if (res.ok) {
        const body = await res.json();
        pricingRows = body.pricing ?? [];
      }
    } catch { /* best-effort */ }
  }
  async function savePricingRow() {
    const priceCents = Math.round(parseFloat(newPriceDollars) * 100);
    if (!Number.isFinite(priceCents) || priceCents < 0) {
      toast.error('Invalid price');
      return;
    }
    try {
      const res = await fetch(`/api/creator/content/${contentId}/pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regionCode: newRegion, priceCents, currency: newCurrency })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Failed');
      toast.success('Price saved');
      newPriceDollars = '';
      await loadPricing();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    }
  }
  async function removePricingRow(regionCode: string) {
    if (!confirm(`Remove ${regionCode} pricing?`)) return;
    const res = await fetch(`/api/creator/content/${contentId}/pricing?regionCode=${regionCode}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Removed');
      await loadPricing();
    } else toast.error('Failed to remove');
  }

  // Live encoder state pushed via SSE. Falls back to content.processingX
  // when the stream isn't connected (first paint, dev with no events).
  let liveStatus = $state<string | null>(null);
  let liveProgress = $state<number | null>(null);
  let liveStage = $state<string | null>(null);
  let liveError = $state<string | null>(null);
  let encoderSse: EventSource | null = null;

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
        editChapters = Array.isArray(content.chapters) ? [...content.chapters] : [];
        editCast = Array.isArray(content.cast) ? [...content.cast] : [];
        editCrew = Array.isArray(content.crew) ? [...content.crew] : [];
        editGeoMode = (content.geoMode as typeof editGeoMode) ?? 'all';
        editGeoRegions = Array.isArray(content.geoRegions) ? [...content.geoRegions] : [];
        editNextUpIds = Array.isArray(content.nextUpContentIds) ? [...content.nextUpContentIds] : [];
        // Hydrate titles for already-picked next-up IDs so the picker can
        // show them as chips immediately (one batched call).
        if (editNextUpIds.length > 0) {
          void hydrateNextUpTitles(editNextUpIds);
        }
        captureSnapshot();
      }

      // Subtitles fetched separately so the tab can refresh independently
      const subRes = await fetch(`/api/content/${contentId}/subtitles`);
      if (subRes.ok) subtitles = (await subRes.json()).tracks ?? [];

      // A/B thumbnail variants — separate endpoint so the panel refreshes
      // independently after add/remove/promote actions.
      await loadVariants();
      await loadPricing();
    } finally {
      loading = false;
    }
  }

  async function loadVariants() {
    try {
      const res = await fetch(`/api/creator/content/${contentId}/thumbnails`);
      if (res.ok) {
        const body = await res.json();
        thumbnailVariants = body.variants ?? [];
      }
    } catch {
      // Best-effort; the panel renders the empty state.
    }
  }

  async function onThumbnailVariantChosen(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    (e.target as HTMLInputElement).value = '';
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const upRes = await fetch('/api/files', { method: 'POST', body: formData });
      if (!upRes.ok) throw new Error('File upload failed');
      const upBody = await upRes.json();
      const url = upBody.directUrl ?? upBody.url;
      if (!url) throw new Error('No URL returned from upload');
      const res = await fetch(`/api/creator/content/${contentId}/thumbnails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Failed to add variant');
      toast.success('Variant added');
      await loadVariants();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  async function removeVariant(vid: string) {
    if (!confirm('Remove this variant?')) return;
    const res = await fetch(`/api/creator/content/${contentId}/thumbnails/${vid}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Variant removed');
      await loadVariants();
    } else {
      toast.error('Failed to remove');
    }
  }

  async function promoteVariant(vid: string) {
    const res = await fetch(`/api/creator/content/${contentId}/thumbnails/${vid}/promote`, { method: 'POST' });
    if (res.ok) {
      toast.success('Winner promoted');
      await load();
    } else {
      toast.error('Failed to promote');
    }
  }

  // Block SvelteKit nav (sidebar link, back button) when there are
  // unsaved cross-section edits. The browser's own beforeunload covers
  // tab close + hard reload; this covers everything inside the SPA.
  beforeNavigate(({ cancel }) => {
    if (isDirty && !confirm('You have unsaved changes. Leave anyway?')) {
      cancel();
    }
  });

  function beforeUnloadHandler(e: BeforeUnloadEvent) {
    if (isDirty) {
      e.preventDefault();
      // Most modern browsers ignore custom strings — setting returnValue
      // is enough to surface the generic "Leave site?" prompt.
      e.returnValue = '';
    }
  }

  onMount(() => {
    void load();
    window.addEventListener('beforeunload', beforeUnloadHandler);
    // Subscribe to the SSE encoder stream so this page reflects live
    // progress without polling. The server filters events to this creator.
    try {
      encoderSse = new EventSource('/api/creator/encoder-stream');
      encoderSse.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data) as {
            mediaId?: string; status?: string; progress?: number;
            stage?: string; error?: string | null;
          };
          if (event.mediaId !== contentId) return;
          const prevStage = liveStage;
          const prevStatus = liveStatus;
          if (event.status !== undefined) liveStatus = event.status ?? null;
          if (event.progress !== undefined) liveProgress = event.progress;
          if (event.stage !== undefined) liveStage = event.stage ?? null;
          liveError = event.error ?? null;
          // Announce only on meaningful transitions — stage change, ready,
          // or failed. Progress ticks are NOT announced (would be deafening).
          if (event.stage && event.stage !== prevStage) {
            announce(`Encoding stage: ${event.stage}.`);
          }
          if (event.status && event.status !== prevStatus) {
            if (event.status === 'ready') announce('Encoding complete. Video is ready.');
            else if (event.status === 'failed') announce('Encoding failed.');
          }
          // When the job goes ready, refresh so videoUrl populates.
          if (event.status === 'ready') void load();
        } catch { /* malformed event */ }
      };
    } catch { /* EventSource not available */ }
  });

  onDestroy(() => {
    if (encoderSse) { encoderSse.close(); encoderSse = null; }
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
  });

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
      captureSnapshot();
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
      captureSnapshot();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      saving = false;
    }
  }

  // Chapters editor — add/remove on the client, save as one PATCH.
  // Accepts plain seconds (e.g. "90", "90.5") OR m:ss / h:mm:ss with any
  // leading-zero variant ("01:05", "0:30", "00:00:45"). We explicitly
  // require each colon-separated piece to be a non-empty digit run so
  // junk like "1::30" or "abc:30" can't slip through as 30s.
  function parseTimeInput(raw: string): number | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    if (/^\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
    if (!/^\d+(:\d+){1,2}$/.test(trimmed)) return null;
    const parts = trimmed.split(':').map((p) => parseInt(p, 10));
    if (parts.some((p) => !Number.isFinite(p) || p < 0)) return null;
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return null;
  }
  function formatTime(sec: number): string {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  function addChapter() {
    const start = parseTimeInput(newChapterStart);
    if (start === null) { toast.error('Invalid time (use seconds or m:ss)'); return; }
    const title = newChapterTitle.trim();
    if (!title) { toast.error('Title required'); return; }
    if (editChapters.some((c) => c.start === start)) { toast.error('A chapter already starts at that time'); return; }
    editChapters = [...editChapters, { start, title }].sort((a, b) => a.start - b.start);
    newChapterStart = '';
    newChapterTitle = '';
  }
  function removeChapter(idx: number) {
    editChapters = editChapters.filter((_, i) => i !== idx);
  }

  // AI-suggested chapters from the orchestrator-generated transcript.
  // The endpoint returns up to 12 candidates; we surface them as a review
  // sheet so the creator can accept-all, replace, or merge with existing.
  let chapterAi = $state<{ loading: boolean; suggestions: Array<{ start: number; title: string }>; error: string | null; mode: 'idle' | 'review' }>({ loading: false, suggestions: [], error: null, mode: 'idle' });
  async function suggestChaptersFromAi() {
    chapterAi = { loading: true, suggestions: [], error: null, mode: 'idle' };
    try {
      const res = await fetch('/api/ai/suggest/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'AI failed');
      const suggestions = Array.isArray(body.suggestions) ? body.suggestions : [];
      if (suggestions.length === 0) throw new Error('No suggestions returned');
      chapterAi = { loading: false, suggestions, error: null, mode: 'review' };
    } catch (err) {
      chapterAi = { loading: false, suggestions: [], error: err instanceof Error ? err.message : 'Failed', mode: 'idle' };
      toast.error(chapterAi.error ?? 'Failed');
    }
  }
  function acceptAiChaptersReplace() {
    editChapters = [...chapterAi.suggestions].sort((a, b) => a.start - b.start);
    chapterAi = { loading: false, suggestions: [], error: null, mode: 'idle' };
    toast.success(`${editChapters.length} chapters applied — review and Save.`);
  }
  function acceptAiChaptersMerge() {
    const merged = [...editChapters];
    for (const s of chapterAi.suggestions) {
      if (!merged.some((c) => Math.abs(c.start - s.start) < 2)) merged.push(s);
    }
    editChapters = merged.sort((a, b) => a.start - b.start);
    chapterAi = { loading: false, suggestions: [], error: null, mode: 'idle' };
    toast.success('Merged — review and Save.');
  }
  function dismissAiChapters() {
    chapterAi = { loading: false, suggestions: [], error: null, mode: 'idle' };
  }

  // ─── Curated next-up picker ────────────────────────────────────────────
  // Searches the creator's own catalog so they can hand-pick the end-screen
  // recommendations. Limited to 3 picks (the overlay only shows three).
  let nextUpSearchTimer: ReturnType<typeof setTimeout> | null = null;
  function onNextUpQueryChange() {
    if (nextUpSearchTimer) clearTimeout(nextUpSearchTimer);
    if (!nextUpQuery.trim()) {
      nextUpSearchResults = [];
      return;
    }
    nextUpSearchTimer = setTimeout(() => void runNextUpSearch(), 250);
  }
  async function runNextUpSearch() {
    const q = nextUpQuery.trim();
    if (!q) return;
    nextUpSearching = true;
    try {
      const res = await fetch(`/api/creator/content/search?q=${encodeURIComponent(q)}&limit=8`);
      if (!res.ok) {
        // Don't toast on every keystroke-driven failure, but at least log
        // so the creator can ask support what they're seeing instead of
        // assuming "no results" is the truth.
        console.warn(`[next-up search] HTTP ${res.status} for query "${q}"`);
        nextUpSearchResults = [];
        return;
      }
      const body = await res.json();
      const items = Array.isArray(body.results) ? body.results : Array.isArray(body) ? body : [];
      nextUpSearchResults = items
        .filter((r: { id: string }) => r.id !== contentId && !editNextUpIds.includes(r.id))
        .slice(0, 8);
    } catch (err) {
      console.warn('[next-up search] failed:', err);
      nextUpSearchResults = [];
      // Surface a one-line toast so the creator knows the search isn't
      // running — empty results otherwise look like "no matches".
      toast.error('Next-up search failed. Try again.');
    } finally {
      nextUpSearching = false;
    }
  }
  async function hydrateNextUpTitles(ids: string[]) {
    try {
      const res = await fetch(`/api/creator/content/lookup?ids=${ids.join(',')}`);
      if (!res.ok) return;
      const body = await res.json();
      const items = Array.isArray(body.results) ? body.results : Array.isArray(body) ? body : [];
      const next = { ...editNextUpTitles };
      for (const r of items) next[r.id] = r.title;
      editNextUpTitles = next;
    } catch { /* silent */ }
  }
  function addNextUp(item: { id: string; title: string }) {
    if (editNextUpIds.length >= 3) {
      toast.error('End screen shows max 3 cards.');
      return;
    }
    if (editNextUpIds.includes(item.id)) return;
    editNextUpIds = [...editNextUpIds, item.id];
    editNextUpTitles = { ...editNextUpTitles, [item.id]: item.title };
    nextUpSearchResults = nextUpSearchResults.filter((r) => r.id !== item.id);
  }
  function removeNextUp(id: string) {
    editNextUpIds = editNextUpIds.filter((x) => x !== id);
  }
  function moveNextUp(id: string, delta: -1 | 1) {
    const idx = editNextUpIds.indexOf(id);
    const target = idx + delta;
    if (idx < 0 || target < 0 || target >= editNextUpIds.length) return;
    const next = [...editNextUpIds];
    [next[idx], next[target]] = [next[target], next[idx]];
    editNextUpIds = next;
  }
  async function saveNextUp() {
    // Saving an empty list is allowed (it clears curated picks and falls
    // back to auto-recommendations), but most creators reach this button
    // expecting to save the picks they just made. Confirm the empty case
    // so an accidental "Save" doesn't quietly wipe a previously-curated
    // end-screen.
    if (editNextUpIds.length === 0) {
      const hadPrior = Array.isArray(content?.nextUpContentIds) && content.nextUpContentIds.length > 0;
      if (hadPrior && !confirm('Save with no end-screen picks? Auto-recommendations will be used instead.')) {
        return;
      }
    }
    nextUpSavingFlag = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextUpContentIds: editNextUpIds })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Save failed');
      toast.success(editNextUpIds.length === 0
        ? 'Curated picks cleared — auto-recommendations active.'
        : 'End-screen picks saved');
      content = body.content;
      captureSnapshot();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      nextUpSavingFlag = false;
    }
  }
  async function saveChapters() {
    saving = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapters: editChapters })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Save failed');
      toast.success('Chapters saved');
      content = body.content;
      captureSnapshot();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      saving = false;
    }
  }

  async function saveRegion() {
    saving = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geoMode: editGeoMode,
          geoRegions: editGeoMode === 'all' ? [] : editGeoRegions
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Save failed');
      toast.success('Region availability saved');
      content = body.content;
      captureSnapshot();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      saving = false;
    }
  }

  async function saveCastCrew() {
    saving = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cast: editCast, crew: editCrew })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Save failed');
      toast.success('Cast & crew saved');
      content = body.content;
      captureSnapshot();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      saving = false;
    }
  }

  function addCastMember() {
    editCast = [...editCast, { name: '', role: 'Actor' }];
  }
  function addCrewMember() {
    editCrew = [...editCrew, { name: '', role: 'Director' }];
  }

  // Asset replacement.
  //
  // Two distinct pipelines, picked by `field`:
  //   - trailerUrl  → /api/creator/trailer-upload/{sign,commit}
  //                   Goes to the encoder MinIO bucket so the browser
  //                   can publicly play it back. Kicks off the trailer
  //                   re-encode workflow (in case the upload wasn't a
  //                   browser-safe MP4). The pipeline IS wired now —
  //                   the prior "via /api/files" path silently wrote
  //                   trailerUrl to the private images bucket where
  //                   neither admin review nor the watch page could
  //                   reach it.
  //   - everything else (posters, backdrop, thumbnail, logoTitle)
  //                  → /api/files (image bucket, presign-less form-data
  //                   POST). Same shape as before — no change.
  async function replaceAsset(field: keyof ContentRow, file: File) {
    if (field === 'trailerUrl') return replaceTrailer(file);
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

  // The sign endpoint enforces a strict filename character set
  // (A-Za-z0-9._-() and space). Anything outside that range — apostrophes,
  // accented characters, parens-pairs, emoji from "My Trailer (final)!.mp4"
  // — returns 400 with a vague "invalid_filename" message before the
  // upload even begins. Sanitize ourselves so the user doesn't have to
  // rename their file before retrying.
  function sanitizeTrailerFilename(name: string): string {
    const cleaned = name
      .replace(/[^A-Za-z0-9._\-() ]+/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 200);
    return cleaned || `trailer-${Date.now()}.mp4`;
  }

  async function replaceTrailer(file: File) {
    // Default browsers report `application/octet-stream` when MIME sniffing
    // fails; the sign endpoint rejects anything not in its native-browser-
    // video list. Fall through to video/mp4 if the type is empty/unknown
    // so the common case (a .mp4 from desktop) doesn't 400 needlessly.
    const inferred = file.type && file.type.startsWith('video/') ? file.type : 'video/mp4';
    try {
      const signRes = await fetch('/api/creator/trailer-upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          filename: sanitizeTrailerFilename(file.name),
          contentType: inferred
        })
      });
      const signBody = await signRes.json().catch(() => ({}));
      if (!signRes.ok) {
        throw new Error(signBody.detail ?? signBody.error ?? `Trailer presign failed (HTTP ${signRes.status}).`);
      }
      const { uploadUrl, objectKey } = signBody as { uploadUrl: string; objectKey: string };

      // PUT the raw bytes to the presigned URL. We can't use /api/files
      // for this — the encoder bucket lives at a different host and the
      // presigned URL is the only way the browser can write to it.
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': inferred },
        body: file
      });
      if (!putRes.ok) {
        throw new Error(`Trailer upload to storage failed (HTTP ${putRes.status}).`);
      }

      const commitRes = await fetch('/api/creator/trailer-upload/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, objectKey })
      });
      const commitBody = await commitRes.json().catch(() => ({}));
      if (!commitRes.ok) {
        throw new Error(commitBody.detail ?? commitBody.error ?? `Trailer commit failed (HTTP ${commitRes.status}).`);
      }
      // The commit endpoint returns `{ trailerUrl }`; reflect it locally so
      // the inline <video> swaps to the new source without a page reload.
      const newUrl = commitBody.trailerUrl as string | undefined;
      if (newUrl && content) content.trailerUrl = newUrl;
      toast.success('Trailer uploaded', {
        description: 'It may take a moment for browsers to pick up the new file.'
      });
    } catch (err) {
      toast.error('Trailer upload failed', {
        description: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  }

  function onAssetFileChosen(field: keyof ContentRow, ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    void replaceAsset(field, input.files[0]);
    input.value = '';
  }

  // AI Layer 1 helpers — open a modal-style picker with candidates.
  let aiSuggesting = $state(false);
  let aiSuggestions = $state<string[]>([]);
  let aiKind = $state<'title' | 'description' | null>(null);

  async function suggestTitle() {
    if (!editDescription.trim()) {
      toast.error('Add a description first so the AI has something to work with.');
      return;
    }
    aiSuggesting = true;
    aiKind = 'title';
    aiSuggestions = [];
    try {
      const res = await fetch('/api/ai/suggest/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: editDescription,
          contentType: editContentType,
          currentTitle: editTitle
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'AI failed');
      aiSuggestions = body.suggestions ?? [];
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI failed');
      aiKind = null;
    } finally {
      aiSuggesting = false;
    }
  }

  async function suggestDescription() {
    if (!editTitle.trim()) {
      toast.error('Add a title first so the AI has context.');
      return;
    }
    aiSuggesting = true;
    aiKind = 'description';
    aiSuggestions = [];
    try {
      const res = await fetch('/api/ai/suggest/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          contentType: editContentType,
          genres: splitTags(editGenres),
          currentDescription: editDescription
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'AI failed');
      aiSuggestions = body.suggestions ?? [];
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI failed');
      aiKind = null;
    } finally {
      aiSuggesting = false;
    }
  }

  function applySuggestion(text: string) {
    if (aiKind === 'title') editTitle = text;
    else if (aiKind === 'description') editDescription = text;
    aiSuggestions = [];
    aiKind = null;
  }

  async function autoTag() {
    if (!editTitle.trim() || !editDescription.trim()) {
      toast.error('Add a title and description first.');
      return;
    }
    aiSuggesting = true;
    try {
      const res = await fetch('/api/ai/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          contentType: editContentType
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'AI failed');
      if (body.metadata) {
        if (Array.isArray(body.metadata.genres)) editGenres = body.metadata.genres.join(', ');
        if (Array.isArray(body.metadata.topics)) editTopics = body.metadata.topics.join(', ');
        if (Array.isArray(body.metadata.keywords)) editKeywords = body.metadata.keywords.join(', ');
        if (typeof body.metadata.bibleReference === 'string') editBibleReference = body.metadata.bibleReference;
        toast.success('Tags filled — review and Save details.');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'AI failed');
    } finally {
      aiSuggesting = false;
    }
  }

  let archiving = $state(false);
  async function archive() {
    if (!confirm('Archive this content? It will no longer be visible to viewers.')) return;
    archiving = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Archived. You can restore from your content list.');
        goto('/creator/content');
        return;
      }
      // Surface the server's reason so the creator can actually fix what
      // they did wrong (e.g. "Cannot archive content with active PPV
      // entitlements" — generic "Archive failed" makes that invisible).
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? `Archive failed (HTTP ${res.status})`);
    } catch (err) {
      toast.error(`Archive failed: ${err instanceof Error ? err.message : 'network error'}`);
    } finally {
      archiving = false;
    }
  }

  // Permanent delete — hits the same endpoint with ?mode=delete. The
  // shared helper blocks on PPV purchases (409 surfaced as a toast),
  // cancels in-flight encoder, and cleans MinIO in the background.
  let deleting = $state(false);
  async function permanentlyDelete() {
    if (!content) return;
    if (!confirm(`Permanently delete "${content.title}"? This wipes the row, all watch history, and the video file. This can't be undone.`)) return;
    deleting = true;
    try {
      const res = await fetch(`/api/creator/content/${contentId}?mode=delete`, { method: 'DELETE' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) {
          toast.error("Can't delete — viewers have paid for this. Archive instead.");
          return;
        }
        toast.error(body.error ?? `Delete failed (HTTP ${res.status})`);
        return;
      }
      toast.success('Deleted. Cleaning up storage in the background.');
      goto('/creator/content');
    } catch (err) {
      toast.error(`Delete failed: ${err instanceof Error ? err.message : 'network error'}`);
    } finally {
      deleting = false;
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
    if (status === 'archived') return 'bg-gray-600/30 text-foreground/90';
    return 'bg-yellow-600/30 text-yellow-200';
  }
</script>

<div class="container mx-auto py-6 px-4 space-y-6 min-h-screen">
  <a href="/creator/content" class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">
    <ArrowLeft class="w-3 h-3" /> Back to content
  </a>

  {#if loading}
    <div class="text-center text-muted-foreground py-12">Loading…</div>
  {:else if !content}
    <div class="bg-red-600/20 border border-red-600 text-red-100 rounded-lg p-6 text-center">
      Content not found or you don't have access.
    </div>
  {:else}
    <!-- Header — content title acts as the page header, with status
         chips inline and quick actions on the right. -->
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex items-start gap-3 min-w-0 flex-1">
        {#if content.thumbnail}
          <img src={content.thumbnail} alt="" class="w-20 h-12 object-cover rounded-md surface-1 shrink-0" />
        {:else}
          <div class="w-20 h-12 surface-1 rounded-md grid place-items-center text-muted-foreground text-[10px] shrink-0">no thumb</div>
        {/if}
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl font-semibold tracking-tight text-foreground truncate">{content.title}</h1>
          <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span class="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 {statusBadgeClass(content.status)}">{content.status}</span>
            <span class="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 surface-1 text-foreground/80">{content.visibility}</span>
            {#if content.processingStatus && content.processingStatus !== 'not_started' && content.processingStatus !== 'ready'}
              <span class="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 bg-orange-500/15 text-orange-600 dark:text-orange-300">{content.processingStatus}</span>
            {/if}
          </div>
        </div>
      </div>
      <!-- Header keeps the title + status clean. Archive / Delete moved
           to a sticky bottom action bar so destructive controls always
           sit at the bottom of the viewport, out of the way of the read
           path. Only the "View live" link stays here. -->
      <div class="flex items-center gap-2 shrink-0">
        {#if content.isActive}
          <a
            href={`/watch/${content.id}`}
            target="_blank"
            rel="noopener"
            class="text-xs rounded-full px-3 py-1.5 inline-flex items-center gap-1 transition-colors"
            style="background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border));"
          >
            View live <ExternalLink class="w-3 h-3" />
          </a>
        {/if}
      </div>
    </header>

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
    <div class="flex flex-wrap gap-2 border-b border-border/40">
      {#each (['details', 'images', 'video', 'subtitles', ...(isShow ? [] : ['chapters' as Tab]), ...(isShow ? ['episodes' as Tab] : []), 'analytics', 'thread'] as Tab[]) as tab (tab)}
        <button
          type="button"
          onclick={() => activeTab = tab}
          class="px-4 py-2 text-sm capitalize transition-colors {activeTab === tab ? 'text-purple-300 border-b-2 border-purple-400 -mb-px' : 'text-muted-foreground hover:text-foreground'}"
        >{tab === 'thread' ? 'Notes from admin' : tab}</button>
      {/each}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main tab content -->
      <div class="lg:col-span-2 surface-1 border border-border/40 rounded-xl p-6">
        {#if activeTab === 'details'}
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="d-title" class="block text-sm text-foreground/80">Title *</label>
                <button type="button" onclick={suggestTitle} disabled={aiSuggesting} class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40 inline-flex items-center gap-1">
                  ✨ {aiSuggesting && aiKind === 'title' ? 'Thinking…' : 'Suggest titles'}
                </button>
              </div>
              <input id="d-title" bind:value={editTitle} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" />
              {#if aiKind === 'title' && aiSuggestions.length > 0}
                <ul class="mt-2 space-y-1">
                  {#each aiSuggestions as s, i (i)}
                    <li>
                      <button type="button" onclick={() => applySuggestion(s)} class="w-full text-left text-sm text-purple-200 hover:surface-1 surface-1 rounded px-3 py-2">
                        {s}
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="d-desc" class="block text-sm text-foreground/80">Description</label>
                <button type="button" onclick={suggestDescription} disabled={aiSuggesting} class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40 inline-flex items-center gap-1">
                  ✨ {aiSuggesting && aiKind === 'description' ? 'Thinking…' : 'Suggest descriptions'}
                </button>
              </div>
              <textarea id="d-desc" bind:value={editDescription} rows="4" class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground"></textarea>
              {#if aiKind === 'description' && aiSuggestions.length > 0}
                <ul class="mt-2 space-y-1">
                  {#each aiSuggestions as s, i (i)}
                    <li>
                      <button type="button" onclick={() => applySuggestion(s)} class="w-full text-left text-sm text-purple-200 hover:surface-1 surface-1 rounded px-3 py-2 whitespace-pre-line">
                        {s}
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="d-type" class="block text-sm text-foreground/80 mb-1">Content type</label>
                <select id="d-type" bind:value={editContentType} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground">
                  <option value="movie">Movie</option>
                  <option value="show">Show</option>
                  <option value="documentary">Documentary</option>
                </select>
                {#if content.mediaType !== editContentType}
                  <p class="text-xs text-yellow-400 mt-1">⚠ Changing content type may require admin re-review.</p>
                {/if}
              </div>
              <div>
                <label for="d-age" class="block text-sm text-foreground/80 mb-1">Age rating</label>
                <input id="d-age" bind:value={editAgeRating} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" />
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="d-genres" class="block text-sm text-foreground/80">Genres (comma-separated)</label>
                <button type="button" onclick={autoTag} disabled={aiSuggesting} class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40 inline-flex items-center gap-1">
                  ✨ Auto-tag from description
                </button>
              </div>
              <input id="d-genres" bind:value={editGenres} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" placeholder="Drama, Faith" />
            </div>
            <div>
              <label for="d-topics" class="block text-sm text-foreground/80 mb-1">Topics / themes</label>
              <input id="d-topics" bind:value={editTopics} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" placeholder="Forgiveness, Hope" />
            </div>
            <div>
              <label for="d-keywords" class="block text-sm text-foreground/80 mb-1">Keywords</label>
              <input id="d-keywords" bind:value={editKeywords} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="d-bible" class="block text-sm text-foreground/80 mb-1">Bible reference</label>
                <input id="d-bible" bind:value={editBibleReference} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" placeholder="John 3:16" />
              </div>
              <div>
                <label for="d-lang" class="block text-sm text-foreground/80 mb-1">Language</label>
                <input id="d-lang" bind:value={editLanguage} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" placeholder="English" />
              </div>
              <div>
                <label for="d-dur" class="block text-sm text-foreground/80 mb-1">Duration</label>
                <input id="d-dur" bind:value={editDuration} class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground" placeholder="1h 30m" />
              </div>
            </div>
            <button type="button" onclick={saveDetails} disabled={saving} class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded">
              {saving ? 'Saving…' : 'Save details'}
            </button>

            <!-- Cast & crew -->
            <div class="border-t border-border/40 pt-4 space-y-4">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-foreground">Cast & crew</div>
                <button type="button" onclick={saveCastCrew} disabled={saving} class="text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-1.5 rounded">
                  {saving ? 'Saving…' : 'Save cast & crew'}
                </button>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs uppercase tracking-wide text-muted-foreground">Cast</span>
                  <button type="button" onclick={addCastMember} class="text-xs text-purple-300 hover:text-purple-200">+ Add</button>
                </div>
                {#if editCast.length === 0}
                  <p class="text-xs text-muted-foreground">No cast members yet.</p>
                {:else}
                  <ul class="space-y-2">
                    {#each editCast as c, idx (idx)}
                      <li class="flex gap-2">
                        <input
                          type="text"
                          bind:value={c.name}
                          placeholder="Name"
                          class="flex-1 px-2 py-1.5 surface-2 border border-border rounded text-foreground text-sm"
                        />
                        <input
                          type="text"
                          bind:value={c.role}
                          placeholder="Role"
                          class="w-32 px-2 py-1.5 surface-2 border border-border rounded text-foreground text-sm"
                        />
                        <input
                          type="text"
                          bind:value={c.characterName}
                          placeholder="Character (optional)"
                          class="w-44 px-2 py-1.5 surface-2 border border-border rounded text-foreground text-sm"
                        />
                        <button type="button" onclick={() => editCast = editCast.filter((_, i) => i !== idx)} class="text-xs text-red-300 hover:text-red-100">Remove</button>
                      </li>
                    {/each}
                  </ul>
                {/if}
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs uppercase tracking-wide text-muted-foreground">Per-region PPV pricing</span>
                </div>
                <p class="text-xs text-muted-foreground mb-2">
                  Override the default PPV price by country. Region <code>*</code> = default fallback.
                  Viewers see the price for their detected country at checkout.
                </p>
                <div class="surface-1 rounded p-3 space-y-2">
                  {#if pricingRows.length > 0}
                    <ul class="space-y-1">
                      {#each pricingRows as p (p.id)}
                        <li class="flex items-center gap-2 text-xs">
                          <code class="surface-2 rounded px-1.5 py-0.5">{p.regionCode}</code>
                          <span class="text-foreground">{(p.priceCents / 100).toFixed(2)}</span>
                          <span class="text-muted-foreground">{p.currency}</span>
                          <button type="button" onclick={() => removePricingRow(p.regionCode)} class="ml-auto text-red-300 hover:text-red-100">Remove</button>
                        </li>
                      {/each}
                    </ul>
                  {/if}
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input type="text" bind:value={newRegion} placeholder="* or US" maxlength="2" class="px-2 py-1.5 text-xs surface-2 rounded text-foreground" />
                    <input type="number" step="0.01" min="0" bind:value={newPriceDollars} placeholder="9.99" class="px-2 py-1.5 text-xs surface-2 rounded text-foreground" />
                    <input type="text" bind:value={newCurrency} placeholder="USD" maxlength="3" class="px-2 py-1.5 text-xs surface-2 rounded text-foreground uppercase" />
                    <button type="button" onclick={savePricingRow} class="px-2 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded">Add / update</button>
                  </div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs uppercase tracking-wide text-muted-foreground">Crew</span>
                  <button type="button" onclick={addCrewMember} class="text-xs text-purple-300 hover:text-purple-200">+ Add</button>
                </div>
                {#if editCrew.length === 0}
                  <p class="text-xs text-muted-foreground">No crew members yet.</p>
                {:else}
                  <ul class="space-y-2">
                    {#each editCrew as c, idx (idx)}
                      <li class="flex gap-2">
                        <input
                          type="text"
                          bind:value={c.name}
                          placeholder="Name"
                          class="flex-1 px-2 py-1.5 surface-2 border border-border rounded text-foreground text-sm"
                        />
                        <input
                          type="text"
                          bind:value={c.role}
                          placeholder="Role (e.g. Director)"
                          class="w-44 px-2 py-1.5 surface-2 border border-border rounded text-foreground text-sm"
                        />
                        <button type="button" onclick={() => editCrew = editCrew.filter((_, i) => i !== idx)} class="text-xs text-red-300 hover:text-red-100">Remove</button>
                      </li>
                    {/each}
                  </ul>
                {/if}
              </div>
            </div>
          </div>
        {:else if activeTab === 'images'}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each ASSET_SLOTS as slot (slot.field)}
              <div class="surface-1 border border-border/40 rounded-lg p-3 space-y-2">
                <div>
                  <div class="text-foreground font-medium text-sm">{slot.title}</div>
                  <div class="text-xs text-muted-foreground">{slot.ratio}</div>
                </div>
                <div class={`${slot.aspect} bg-black/30 rounded overflow-hidden`}>
                  {#if content[slot.field]}
                    <img src={content[slot.field] as string} alt={slot.title} class="w-full h-full object-cover" />
                  {:else}
                    <div class="w-full h-full grid place-items-center text-muted-foreground text-xs">Not uploaded</div>
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

          <!-- A/B thumbnail testing panel -->
          <div class="mt-6 surface-1 rounded-lg p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-foreground">A/B thumbnail testing</div>
                <div class="text-xs text-muted-foreground">Compare up to 5 thumbnails. Viewers see one deterministic variant; CTR shows which performs best.</div>
              </div>
              <label class="block">
                <input
                  type="file"
                  accept="image/*"
                  onchange={(e) => onThumbnailVariantChosen(e)}
                  class="hidden"
                  disabled={thumbnailVariants.length >= 5}
                />
                <span class="inline-block bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded cursor-pointer">
                  {thumbnailVariants.length >= 5 ? 'Max 5' : '+ Add variant'}
                </span>
              </label>
            </div>
            {#if thumbnailVariants.length === 0}
              <div class="text-center text-muted-foreground text-sm py-4">No variants yet.</div>
            {:else}
              <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {#each thumbnailVariants as v (v.id)}
                  <li class="surface-2 rounded-lg p-3 space-y-2">
                    <div class="aspect-video rounded overflow-hidden bg-black/30">
                      <img src={v.url} alt={v.label ?? 'variant'} class="w-full h-full object-cover" />
                    </div>
                    <div class="text-xs text-muted-foreground">{v.label ?? '—'}</div>
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-foreground/80">
                        <span class="text-foreground font-medium">{v.ctr.toFixed(1)}%</span>
                        <span class="text-muted-foreground"> CTR</span>
                      </span>
                      <span class="text-muted-foreground">{v.impressions.toLocaleString()} impr / {v.clicks.toLocaleString()} clicks</span>
                    </div>
                    <div class="flex gap-2">
                      <button
                        type="button"
                        onclick={() => promoteVariant(v.id)}
                        class="text-xs flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded"
                      >{v.isWinner ? 'Winner' : 'Promote winner'}</button>
                      <button
                        type="button"
                        onclick={() => removeVariant(v.id)}
                        class="text-xs text-red-300 hover:text-red-100 px-2"
                      >Remove</button>
                    </div>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        {:else if activeTab === 'video'}
          <div class="space-y-4">
            <!--
              Coming Soon + no main video → prominent "Add main video"
              CTA. Without this banner the missing video reads as a
              broken encoder (the "waiting" progress bar below
              implies an encode is stuck). Coming Soon announcement-
              only submissions intentionally have no video at first;
              this banner is how the creator finishes the job. The
              upload wizard's edit mode runs the encoder pipeline +
              the cron's auto-publish takes over from there.
            -->
            {#if !content.videoUrl && (content.status === 'coming_soon' || content.scheduledPublishAt)}
              <div
                class="rounded-xl border border-violet-500/40 bg-violet-500/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div class="flex items-start gap-3">
                  <span class="text-2xl">🗓️</span>
                  <div class="space-y-1">
                    <div class="text-white font-semibold">Add the main video to finish this Coming Soon</div>
                    <div class="text-sm text-violet-100/80">
                      {#if content.scheduledPublishAt}
                        Releases <span class="text-violet-50 font-medium">{String(content.scheduledPublishAt).slice(0, 10)}</span>.
                      {/if}
                      Uploading the video here runs the encoder + sends the row back to admin review for publication. The cron flips it to live on the release date once everything is approved.
                    </div>
                  </div>
                </div>
                <a
                  href={`/creator/upload?edit=${content.id}`}
                  class="inline-flex items-center justify-center whitespace-nowrap bg-violet-500 hover:bg-violet-400 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-[0_0_18px_rgba(167,139,250,0.45)] transition-colors"
                >
                  Add main video →
                </a>
              </div>
            {/if}

            {#if content.videoUrl}
              <div>
                <div class="text-sm text-muted-foreground mb-2">Current encoded video</div>
                <!-- Full VideoPlayer so the creator's preview matches what
                     viewers see — HLS playback (raw <video> tag wouldn't
                     work in Chrome for HLS sources), subtitle tracks,
                     chapters, end-screen, scrubbing previews. We omit
                     `contentId` so this preview doesn't inflate the
                     creator's own watch-progress. -->
                <VideoPlayer
                  src={content.videoUrl}
                  poster={content.backdropUrl ?? content.thumbnail ?? content.posterAutoUrl ?? undefined}
                  title={content.title}
                  subtitles={subtitles.map((t) => ({ label: t.label, src: t.fileUrl, srclang: t.language }))}
                  chapters={content.chapters ?? []}
                  previewVtt={content.previewThumbnailsVtt ?? undefined}
                  previewSprites={content.previewSpriteUrls ?? []}
                />
              </div>
            {:else if !(content.status === 'coming_soon' || content.scheduledPublishAt)}
              <!-- Live encoder progress (R+1). SSE-driven; falls back to a
                   one-shot status fetch when the stream isn't connected.
                   Hidden for Coming Soon rows without a main video — the
                   "waiting" progress bar there read as a stuck encode
                   even though no encoder job had been created. The
                   violet CTA above takes its place. -->
              <div class="surface-1 rounded-lg p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-medium text-foreground">Encoder progress</div>
                  <span class="text-xs uppercase tracking-wide text-yellow-300">{liveStatus ?? content.processingStatus}</span>
                </div>
                <div class="h-2 surface-2 rounded overflow-hidden">
                  <div
                    class="h-full bg-purple-500 transition-all duration-500"
                    style="width: {Math.max(0, Math.min(100, liveProgress ?? 0))}%"
                  ></div>
                </div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{liveStage ?? content.processingStage ?? 'waiting'}</span>
                  <span>{Math.max(0, Math.min(100, liveProgress ?? 0))}%</span>
                </div>
                {#if liveError ?? content.processingError}
                  <div class="text-xs text-red-300 mt-1">{liveError ?? content.processingError}</div>
                {/if}
              </div>
            {/if}

            <!-- Content scan status (R+5). Independent of the encode bar:
                 encode completes at playback-ready; the AI doctrinal +
                 family-safety scan runs AFTER on the transcript + sampled
                 frames. Status: idle / in_progress / complete / failed. -->
            {#if content.contentScanStatus && content.contentScanStatus !== 'idle'}
              <div class="surface-1 rounded-lg p-3 flex items-center gap-3 text-xs">
                <span class="text-muted-foreground">Content scan:</span>
                {#if content.contentScanStatus === 'in_progress'}
                  <span class="text-blue-300">running…</span>
                  <span class="text-muted-foreground ml-auto">Doctrinal + family-safety AI review.</span>
                {:else if content.contentScanStatus === 'complete'}
                  <span class="text-green-300">complete</span>
                  <span class="text-muted-foreground ml-auto">Admin will see the AI report on review.</span>
                {:else if content.contentScanStatus === 'failed'}
                  <span class="text-red-300">failed</span>
                  <span class="text-muted-foreground ml-auto">Admin can re-trigger from the review page.</span>
                {:else if content.contentScanStatus === 'skipped'}
                  <span class="text-muted-foreground">skipped</span>
                {:else}
                  <span class="text-yellow-300">{content.contentScanStatus}</span>
                {/if}
              </div>
            {/if}
            <div>
              <div class="text-sm text-muted-foreground mb-2">Trailer {content.trailerUrl ? '(current)' : '(none)'}</div>
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
            <div class="border-t border-border/40 pt-4">
              <p class="text-xs text-muted-foreground mb-2">
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
              <p class="text-sm text-muted-foreground">No subtitle tracks yet.</p>
            {:else}
              <ul class="space-y-2">
                {#each subtitles as track (track.id)}
                  <li class="flex items-center justify-between surface-1 border border-border/40 rounded p-3">
                    <div>
                      <span class="text-foreground text-sm">{track.label}</span>
                      <span class="text-xs text-muted-foreground ml-2">({track.language})</span>
                      <span class="text-xs px-2 py-0.5 rounded bg-purple-700/30 text-purple-200 ml-2">{track.kind}</span>
                      {#if track.isDefault}<span class="text-xs text-yellow-300 ml-2">★ default</span>{/if}
                    </div>
                    <div class="flex items-center gap-2">
                      <a href={track.fileUrl} target="_blank" rel="noopener" class="text-xs text-foreground/80 hover:text-foreground">view VTT</a>
                      <button type="button" onclick={() => removeSubtitle(track.id)} class="text-red-300 hover:text-red-100 text-xs">Remove</button>
                    </div>
                  </li>
                {/each}
              </ul>
            {/if}

            <div class="surface-1 border border-border/40 rounded-lg p-3 space-y-2">
              <div class="text-sm font-medium text-foreground">Add a track</div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input bind:value={newSubLang} placeholder="lang (e.g. en)" class="px-3 py-2 surface-2 border border-border rounded text-foreground text-sm" />
                <input bind:value={newSubLabel} placeholder="Label (e.g. English)" class="px-3 py-2 surface-2 border border-border rounded text-foreground text-sm" />
                <select bind:value={newSubKind} class="px-3 py-2 surface-2 border border-border rounded text-foreground text-sm">
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
              <p class="text-xs text-muted-foreground">VTT format only. The track will appear in the player's CC menu.</p>
            </div>
          </div>
        {:else if activeTab === 'episodes' && isShow}
          <div class="space-y-3">
            <p class="text-sm text-muted-foreground">
              Manage seasons + episodes for this show. Each episode has its own video file and metadata.
            </p>
            <a href={`/creator/content/${content.id}/episodes`} class="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">
              Open episodes manager →
            </a>
          </div>
        {:else if activeTab === 'analytics'}
          {#if analytics}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="surface-1 border border-border/40 rounded p-3 text-center">
                <div class="text-2xl font-bold text-purple-400">{analytics.views.toLocaleString()}</div>
                <div class="text-xs text-muted-foreground">Views</div>
              </div>
              <div class="surface-1 border border-border/40 rounded p-3 text-center">
                <div class="text-2xl font-bold text-blue-400">{analytics.watchTimeMinutes}</div>
                <div class="text-xs text-muted-foreground">Watch time (min)</div>
              </div>
              <div class="surface-1 border border-border/40 rounded p-3 text-center">
                <div class="text-2xl font-bold text-green-400">{analytics.completionRate}%</div>
                <div class="text-xs text-muted-foreground">Completion</div>
              </div>
              <div class="surface-1 border border-border/40 rounded p-3 text-center">
                <div class="text-2xl font-bold text-pink-400">{analytics.totalShares}</div>
                <div class="text-xs text-muted-foreground">Shares</div>
              </div>
            </div>
            {#if analytics.viewsByDevice.length > 0}
              <div class="mt-4">
                <div class="text-sm font-medium text-foreground mb-2">By device</div>
                <div class="flex flex-wrap gap-2 text-xs">
                  {#each analytics.viewsByDevice as d}
                    <span class="px-2 py-1 rounded surface-2 text-foreground/90">{d.device}: {d.count}</span>
                  {/each}
                </div>
              </div>
            {/if}
            {#if analytics.topCountries.length > 0}
              <div class="mt-4">
                <div class="text-sm font-medium text-foreground mb-2">Top countries</div>
                <div class="flex flex-wrap gap-2 text-xs">
                  {#each analytics.topCountries as c}
                    <span class="px-2 py-1 rounded surface-2 text-foreground/90">{c.country}: {c.count}</span>
                  {/each}
                </div>
              </div>
            {/if}
          {:else}
            <p class="text-sm text-muted-foreground">No analytics yet.</p>
          {/if}
        {:else if activeTab === 'chapters'}
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3 flex-wrap">
              <p class="text-sm text-muted-foreground flex-1 min-w-60">
                Add time-coded chapter markers. Viewers see tick marks above the seek bar and can jump with the <kbd class="px-1 surface-2 rounded">&gt;</kbd> / <kbd class="px-1 surface-2 rounded">&lt;</kbd> keys.
              </p>
              <button
                type="button"
                onclick={suggestChaptersFromAi}
                disabled={chapterAi.loading}
                class="text-xs text-purple-300 hover:text-purple-200 disabled:opacity-40 inline-flex items-center gap-1 surface-1 rounded-lg px-3 py-1.5"
                title="Generate chapters from the auto-transcript"
              >
                ✨ {chapterAi.loading ? 'Thinking…' : 'Suggest from transcript'}
              </button>
            </div>

            {#if chapterAi.mode === 'review'}
              <div class="surface-1 rounded-lg p-4 border border-purple-500/40">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-semibold text-foreground">AI suggested {chapterAi.suggestions.length} chapters</h4>
                  <button type="button" onclick={dismissAiChapters} class="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
                </div>
                <ul class="space-y-1 max-h-64 overflow-y-auto mb-3">
                  {#each chapterAi.suggestions as s (s.start)}
                    <li class="flex items-center gap-3 text-sm">
                      <span class="text-xs font-mono text-purple-300 w-16">{formatTime(s.start)}</span>
                      <span class="flex-1 text-foreground">{s.title}</span>
                    </li>
                  {/each}
                </ul>
                <div class="flex flex-wrap gap-2 justify-end">
                  <button type="button" onclick={acceptAiChaptersMerge} class="text-xs px-3 py-1.5 rounded surface-2 hover:surface-3 text-foreground">Merge with existing</button>
                  <button type="button" onclick={acceptAiChaptersReplace} class="text-xs px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white">Replace existing</button>
                </div>
              </div>
            {/if}

            <div class="surface-1 rounded-lg p-4">
              <div class="text-sm font-medium text-foreground mb-3">Add chapter</div>
              <div class="flex flex-wrap gap-2">
                <input
                  type="text"
                  bind:value={newChapterStart}
                  placeholder="0:00 or 90"
                  class="w-24 px-3 py-2 surface-2 border border-border rounded text-foreground text-sm placeholder-gray-500"
                />
                <input
                  type="text"
                  bind:value={newChapterTitle}
                  placeholder="Chapter title"
                  class="flex-1 min-w-37.5 px-3 py-2 surface-2 border border-border rounded text-foreground text-sm placeholder-gray-500"
                />
                <button
                  type="button"
                  onclick={addChapter}
                  class="px-3 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm"
                >Add</button>
              </div>
            </div>
            {#if editChapters.length === 0}
              <div class="text-center text-muted-foreground text-sm py-6">No chapters yet.</div>
            {:else}
              <ul class="space-y-2">
                {#each editChapters as c, idx (c.start)}
                  <li class="flex items-center gap-3 surface-1 rounded-lg px-3 py-2">
                    <span class="text-xs font-mono text-purple-300 w-16">{formatTime(c.start)}</span>
                    <span class="flex-1 text-sm text-foreground">{c.title}</span>
                    <button
                      type="button"
                      onclick={() => removeChapter(idx)}
                      class="text-xs text-red-300 hover:text-red-100"
                    >Remove</button>
                  </li>
                {/each}
              </ul>
              <div class="flex justify-end">
                <button
                  type="button"
                  onclick={saveChapters}
                  disabled={saving}
                  class="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm"
                >{saving ? 'Saving…' : 'Save chapters'}</button>
              </div>
            {/if}
          </div>
        {:else if activeTab === 'thread'}
          <ContentThreadPanel contentId={content.id} variant="creator" />
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="surface-1 border border-border/40 rounded-xl p-6 space-y-5 lg:sticky lg:top-4 self-start">
        <div>
          <div class="text-sm font-medium text-foreground mb-2">Visibility</div>
          <div class="space-y-2">
            {#each (['public', 'unlisted', 'private'] as const) as v (v)}
              <label class="flex items-start gap-2 text-sm cursor-pointer">
                <input type="radio" bind:group={editVisibility} value={v} class="mt-0.5 accent-purple-600" />
                <div>
                  <div class="text-foreground capitalize">{v}</div>
                  <div class="text-xs text-muted-foreground">
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
          <label for="schedule" class="block text-sm font-medium text-foreground mb-1">Schedule publish</label>
          <input
            id="schedule"
            type="datetime-local"
            bind:value={editScheduledPublishAt}
            class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground text-sm"
          />
          <p class="text-xs text-muted-foreground mt-1">Only fires once admin has approved.</p>
        </div>

        <button type="button" onclick={saveVisibility} disabled={saving} class="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm">
          {saving ? 'Saving…' : 'Save visibility'}
        </button>

        <!-- Region availability -->
        <div class="border-t border-border/40 pt-4 space-y-3">
          <div class="text-sm font-medium text-foreground">Region availability</div>
          <div class="space-y-2">
            {#each (['all', 'allow', 'block'] as const) as m (m)}
              <label class="flex items-start gap-2 text-sm cursor-pointer">
                <input type="radio" bind:group={editGeoMode} value={m} class="mt-0.5 accent-purple-600" />
                <div>
                  <div class="text-foreground">
                    {m === 'all' ? 'All countries' : m === 'allow' ? 'Only these countries' : 'All except these'}
                  </div>
                </div>
              </label>
            {/each}
          </div>
          {#if editGeoMode !== 'all'}
            <!-- Chip-style multi-select: each picked country becomes a removable
                 chip and the dropdown only shows countries not yet selected.
                 Avoids the Ctrl/Cmd-click discoverability landmine of <select multiple>. -->
            {#if editGeoRegions.length > 0}
              <div class="flex flex-wrap gap-1.5">
                {#each editGeoRegions as code (code)}
                  {@const country = COUNTRIES.find((c) => c.code === code)}
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded surface-2 text-xs text-foreground">
                    {country ? `${country.name} (${code})` : code}
                    <button
                      type="button"
                      onclick={() => (editGeoRegions = editGeoRegions.filter((c) => c !== code))}
                      class="text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${country?.name ?? code}`}
                    >×</button>
                  </span>
                {/each}
              </div>
            {:else}
              <p class="text-xs text-muted-foreground italic">
                {editGeoMode === 'allow' ? 'No countries selected — content will be unavailable everywhere.' : 'No countries blocked — content will be available everywhere.'}
              </p>
            {/if}
            <select
              value=""
              onchange={(e) => {
                const code = (e.currentTarget as HTMLSelectElement).value;
                if (code && !editGeoRegions.includes(code)) {
                  editGeoRegions = [...editGeoRegions, code];
                }
                (e.currentTarget as HTMLSelectElement).value = '';
              }}
              class="w-full px-2 py-2 surface-2 border border-border rounded text-foreground text-sm"
            >
              <option value="" disabled>Add a country…</option>
              {#each COUNTRIES.filter((c) => !editGeoRegions.includes(c.code)) as c (c.code)}
                <option value={c.code}>{c.name} ({c.code})</option>
              {/each}
            </select>
          {/if}
          <button type="button" onclick={saveRegion} disabled={saving} class="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm">
            {saving ? 'Saving…' : 'Save region'}
          </button>
        </div>

        <!-- End-screen next-up picks -->
        <div class="border-t border-border/40 pt-4 space-y-3">
          <div>
            <div class="text-sm font-medium text-foreground">End-screen next-up</div>
            <p class="text-xs text-muted-foreground mt-0.5">Pick up to 3 videos to feature in the end-screen overlay. Leave empty for auto-recommendations.</p>
          </div>

          {#if editNextUpIds.length > 0}
            <ul class="space-y-1.5">
              {#each editNextUpIds as id, idx (id)}
                <li class="flex items-center gap-2 surface-1 rounded px-2 py-1.5">
                  <span class="text-[10px] text-muted-foreground w-4">{idx + 1}</span>
                  <span class="flex-1 text-sm text-foreground truncate" title={editNextUpTitles[id] ?? id}>
                    {editNextUpTitles[id] ?? '(loading…)'}
                  </span>
                  <button type="button" onclick={() => moveNextUp(id, -1)} disabled={idx === 0} class="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move up">↑</button>
                  <button type="button" onclick={() => moveNextUp(id, 1)} disabled={idx === editNextUpIds.length - 1} class="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move down">↓</button>
                  <button type="button" onclick={() => removeNextUp(id)} class="text-xs text-red-300 hover:text-red-100">Remove</button>
                </li>
              {/each}
            </ul>
          {/if}

          {#if editNextUpIds.length < 3}
            <div class="relative">
              <input
                type="text"
                bind:value={nextUpQuery}
                oninput={onNextUpQueryChange}
                placeholder="Search your videos…"
                class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground text-sm placeholder-gray-500"
              />
              {#if nextUpSearchResults.length > 0}
                <ul class="absolute z-10 mt-1 w-full surface-2 border border-border/40 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {#each nextUpSearchResults as r (r.id)}
                    <li>
                      <button
                        type="button"
                        onclick={() => addNextUp(r)}
                        class="w-full text-left px-3 py-2 hover:surface-2 text-sm text-foreground flex items-center gap-2"
                      >
                        {#if r.thumbnail}
                          <img src={r.thumbnail} alt="" class="w-10 h-6 object-cover rounded" />
                        {/if}
                        <span class="truncate flex-1">{r.title}</span>
                      </button>
                    </li>
                  {/each}
                </ul>
              {:else if nextUpQuery && !nextUpSearching}
                <p class="text-xs text-muted-foreground mt-1">No matches in your catalog.</p>
              {/if}
            </div>
          {:else}
            <p class="text-xs text-muted-foreground">Maximum 3 picks. Remove one to add another.</p>
          {/if}

          <button type="button" onclick={saveNextUp} disabled={nextUpSavingFlag} class="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm">
            {nextUpSavingFlag ? 'Saving…' : 'Save end-screen picks'}
          </button>
        </div>

        <div class="border-t border-border/40 pt-4 text-xs text-muted-foreground space-y-1">
          <div>Created {new Date(content.createdAt).toLocaleDateString()}</div>
          <div>Updated {new Date(content.updatedAt).toLocaleString()}</div>
          <div>{content.viewCount?.toLocaleString() ?? 0} total views</div>
        </div>
      </div>
    </div>

    <!-- Sticky bottom action bar — destructive controls live here so the
         scroll-readable area above isn't cluttered. Mirrors the pattern
         on /admin/review/[id]. Anchored to the viewport bottom so it's
         always one tap away regardless of how long the detail page gets. -->
    {#if content}
      <div
        class="fixed bottom-0 inset-x-0 z-30 backdrop-blur-md border-t pointer-events-none"
        style="background: hsl(var(--portal-bg-elevated)/0.92); border-color: hsl(var(--portal-border));"
      >
        <div class="mx-auto px-4 py-3 max-w-5xl flex items-center justify-between gap-3 pointer-events-auto">
          <div class="min-w-0 flex-1 text-xs text-[hsl(var(--portal-text-muted))] truncate">
            <span class="font-semibold text-[hsl(var(--portal-text))]">{content.title}</span>
            <span class="ml-2">· {content.isActive ? 'Live' : (content.status ?? 'submitted')}</span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onclick={archive}
              disabled={archiving || deleting}
              class="text-xs rounded-full px-3 py-2 inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 font-medium"
              style="background: hsl(45 95% 55% / 0.18); color: hsl(45 95% 70%); border: 1px solid hsl(45 95% 55% / 0.3);"
            >
              <ArchiveIcon class="w-3.5 h-3.5" /> {archiving ? 'Archiving…' : 'Archive'}
            </button>
            <button
              type="button"
              onclick={permanentlyDelete}
              disabled={archiving || deleting}
              class="text-xs rounded-full px-3 py-2 inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 font-medium"
              style="background: hsl(var(--portal-danger)/0.18); color: hsl(var(--portal-danger)); border: 1px solid hsl(var(--portal-danger)/0.35);"
            >
              <Trash2 class="w-3.5 h-3.5" /> {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
      <!-- Spacer so the sticky bar doesn't overlap the last row of content -->
      <div aria-hidden="true" class="h-20"></div>
    {/if}
  {/if}
</div>
