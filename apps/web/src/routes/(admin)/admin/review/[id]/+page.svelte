<!--
  Individual Content Review — Layout B (Netflix production console).

  Three vertical bands:
    1. Sticky header: title + encoder status + mini live progress bar
    2. Cinematic centered video player (the focal point)
    3. Sticky tab bar: Overview / Review / Encoder / Scan / History
       — review actions also live in a sticky footer so the reviewer can
         submit from any tab without scrolling back.

  Live updates: subscribes to `/api/admin/encoder-stream` SSE so the
  progress bar ticks in real-time as the orchestrator pushes webhook
  events. Falls back to a 5s poll on connection drop.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/state';
  import type { ContentSubmission } from '$lib/types/creator';
  import type { ContentReview } from '$lib/types/admin';
  import { ReviewType, ReviewResult } from '$lib/types/admin';
  import ContentThreadPanel from '$lib/components/widgets/ContentThreadPanel.svelte';
  import ContentScanReport from '$lib/components/admin/ContentScanReport.svelte';
  import VideoPlayer from '$lib/components/widgets/VideoPlayer.svelte';
  import * as Tabs from '$lib/components/ui/tabs';
  import { toast } from 'svelte-sonner';
  import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Loader2, Film, Rocket } from '@lucide/svelte';

  // Scan state pulled from the admin content GET.
  let scanStatus = $state<string>('idle');
  let scanReport = $state<any | null>(null);

  // Encoder state (R+1). Distinct from `scanStatus` — encode reaches 100%
  // when playback is ready; the content scan runs AFTER and arrives via
  // its own webhook.
  let encoderStatus = $state<string | null>(null);
  let encoderProgress = $state<number | null>(null);
  let encoderStage = $state<string | null>(null);
  let encoderError = $state<string | null>(null);
  let encoderJobId = $state<string | null>(null);
  let cancelling = $state(false);

  let contentData = $state<ContentSubmission | null>(null);
  let reviewHistory = $state<ContentReview[]>([]);
  let currentReview = $state<Partial<ContentReview>>({
    reviewType: ReviewType.THEOLOGICAL,
    result: undefined,
    feedback: '',
    detailedNotes: []
  });

  let videoCurrentTime = $state(0);
  let isLoading = $state(true);
  let submitError = $state('');
  let submitting = $state(false);

  // Playback artifacts pulled from the admin content GET. Threaded into the
  // VideoPlayer so reviewers get the same HLS / chapters / subtitles /
  // scrubbing-preview experience viewers do.
  let videoSubtitles = $state<Array<{ label: string; src: string; srclang: string }>>([]);
  let videoDescriptions = $state<Array<{ label: string; src: string; srclang: string }>>([]);
  let videoChapters = $state<Array<{ start: number; title: string }>>([]);
  let videoPreviewVtt = $state<string | undefined>(undefined);
  let videoPreviewSprites = $state<string[]>([]);
  let videoPosterUrl = $state<string | undefined>(undefined);
  let trailerUrl = $state<string | undefined>(undefined);

  // Tab state — synced with URL hash so reload lands on the same tab and
  // back-button navigation works. Default is 'review' because that's where
  // most of the reviewer's time is spent.
  type TabId = 'overview' | 'review' | 'encoder' | 'scan' | 'history';
  const VALID_TABS: TabId[] = ['overview', 'review', 'encoder', 'scan', 'history'];
  let activeTab = $state<TabId>('review');

  function readTabFromHash(): TabId {
    const h = (typeof location !== 'undefined' ? location.hash.replace(/^#/, '') : '') as TabId;
    return VALID_TABS.includes(h) ? h : 'review';
  }

  onMount(async () => {
    activeTab = readTabFromHash();
    const contentId = page.params.id;
    isLoading = true;
    try {
      const res = await fetch(`/api/admin/content/${contentId}`);
      if (!res.ok) throw new Error('Failed to load content');
      const item = await res.json();
      contentData = {
        id: item.id,
        creatorId: item.creatorId || '',
        title: item.title,
        description: item.description || '',
        contentType: item.mediaType as any,
        ageRating: item.ageRating as any,
        videoUrl: item.videoUrl || item.trailerUrl || '',
        assets: {
          posterPortrait: item.posterUrl || '',
          backdropHero: item.backdropUrl || '',
          thumbnail: item.thumbnail || ''
        },
        bibleReferences: item.bibleReference ? [item.bibleReference] : [],
        themes: item.topics || [],
        ministryAffiliation: item.creatorName || '',
        duration: item.duration ? Number(item.duration) : undefined,
        language: item.language || 'English',
        hasSubtitles: false,
        hasClosedCaptions: false,
        status: item.status as any,
        tags: item.keywords || [],
        keywords: item.keywords || [],
        genre: item.genres || [],
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.createdAt),
        submittedAt: new Date(item.createdAt),
        reviewNotes: item.reviewNotes || undefined,
        rejectionReason: item.rejectionReason || undefined
      };
      scanStatus = item.contentScanStatus ?? 'idle';
      scanReport = item.contentScanReport ?? null;
      encoderStatus = item.processingStatus ?? null;
      encoderProgress = item.processingProgress ?? null;
      encoderStage = item.processingStage ?? null;
      encoderError = item.processingError ?? null;
      encoderJobId = item.encoderJobId ?? null;
      videoSubtitles = Array.isArray(item.subtitles) ? item.subtitles : [];
      videoDescriptions = Array.isArray(item.descriptions) ? item.descriptions : [];
      videoChapters = Array.isArray(item.chapters) ? item.chapters : [];
      videoPreviewVtt = item.previewThumbnailsVtt ?? undefined;
      videoPreviewSprites = Array.isArray(item.previewSpriteUrls) ? item.previewSpriteUrls : [];
      videoPosterUrl = item.backdropUrl || item.thumbnail || item.posterAutoUrl || undefined;
      // Trailer URL — separate from the main videoUrl. Today's upload
      // wizard stages a trailer but the server-side trailer encoder
      // pipeline isn't wired yet, so this can hold either a real URL
      // (legacy / future) or the literal "staged-for-encoding" sentinel
      // (current — Option B robust trailer fix is the TECHDEBT item).
      // We only show a usable trailer URL — sentinel strings get filtered.
      trailerUrl = typeof item.trailerUrl === 'string'
        && item.trailerUrl
        && item.trailerUrl !== 'staged-for-encoding'
        && /^https?:|^blob:|^\//.test(item.trailerUrl)
        ? item.trailerUrl
        : undefined;
      reviewHistory = [];
    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
    }
  });

  // True when the job is still running (not terminal). Used to decide
  // whether the cancel button is shown / armed and whether to keep the SSE
  // connection open.
  const encoderInFlight = $derived(
    !!encoderJobId
    && encoderStatus !== null
    && !['ready', 'failed', 'cancelled'].includes(encoderStatus)
  );

  // ------ Live encoder progress via SSE ------
  // Opens an EventSource against the existing /api/admin/encoder-stream
  // endpoint when the loaded media row is still encoding. On each event,
  // if it matches our contentData.id, the encoder state vars update — the
  // existing progress UI binds to those, so it re-renders automatically.
  // Closes when the status hits a terminal value or the page unmounts.
  // A 5s poll fallback covers SSE drops / proxy disconnects.
  let evtSource: EventSource | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  function teardownLive() {
    if (evtSource) { evtSource.close(); evtSource = null; }
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  function applyLiveUpdate(ev: {
    mediaId?: string;
    status?: string | null;
    progress?: number | null;
    stage?: string | null;
    error?: string | null;
  }) {
    if (!contentData) return;
    if (ev.mediaId && ev.mediaId !== contentData.id) return;
    if (typeof ev.status === 'string') encoderStatus = ev.status;
    if (typeof ev.progress === 'number') encoderProgress = ev.progress;
    if (typeof ev.stage === 'string' || ev.stage === null) encoderStage = ev.stage ?? null;
    if (typeof ev.error === 'string' || ev.error === null) encoderError = ev.error ?? null;
  }

  async function pollOnce() {
    if (!contentData) return;
    try {
      const res = await fetch(`/api/admin/content/${contentData.id}`);
      if (!res.ok) return;
      const item = await res.json();
      applyLiveUpdate({
        mediaId: contentData.id,
        status: item.processingStatus ?? null,
        progress: item.processingProgress ?? null,
        stage: item.processingStage ?? null,
        error: item.processingError ?? null
      });
    } catch {
      // poll best-effort; next tick retries
    }
  }

  $effect(() => {
    // Re-run whenever we transition into/out of encoderInFlight or
    // contentData becomes available. Closes + reopens cleanly each time.
    teardownLive();
    if (!contentData || !encoderInFlight) return;

    try {
      evtSource = new EventSource('/api/admin/encoder-stream');
      evtSource.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          applyLiveUpdate(data);
        } catch {
          // ignore malformed payloads
        }
      };
      evtSource.onerror = () => {
        // Fall back to polling on transport error. We don't close evtSource
        // here — the browser will retry it automatically — but a polling
        // safety net guarantees forward progress even if SSE is wedged.
        if (!pollTimer) pollTimer = setInterval(pollOnce, 5000);
      };
    } catch {
      // EventSource unsupported (very rare) — poll-only.
      pollTimer = setInterval(pollOnce, 5000);
    }
  });

  onDestroy(teardownLive);

  // ------ Tab + URL-hash sync ------
  $effect(() => {
    if (typeof location === 'undefined') return;
    const target = `#${activeTab}`;
    if (location.hash !== target) {
      history.replaceState(null, '', `${location.pathname}${location.search}${target}`);
    }
  });

  async function cancelEncode() {
    if (!contentData) return;
    if (!confirm('Cancel the in-flight encode for this content? The orchestrator will stop the worker mid-stream; uploaded artifacts so far will be discarded.')) return;
    cancelling = true;
    try {
      const res = await fetch(`/api/admin/content/${contentData.id}/cancel-encode`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Cancel failed');
      // Optimistic — the real terminal state arrives via the `cancelled`
      // progress webhook. Set a UI hint until then.
      encoderStatus = 'cancelling';
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      cancelling = false;
    }
  }

  function encoderStatusClass(s: string | null): string {
    if (s === 'ready') return 'text-emerald-300';
    if (s === 'failed') return 'text-red-300';
    if (s === 'cancelled' || s === 'cancelling') return 'text-muted-foreground';
    return 'text-yellow-300';
  }

  function encoderStatusLabel(s: string | null): string {
    if (!s) return 'Not started';
    if (s === 'ready') return 'Ready to publish';
    if (s === 'failed') return 'Encoding failed';
    if (s === 'cancelled') return 'Cancelled';
    if (s === 'cancelling') return 'Cancelling…';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function addTimestampNote() {
    if (!currentReview.detailedNotes) {
      currentReview.detailedNotes = [];
    }
    currentReview.detailedNotes = [
      ...currentReview.detailedNotes,
      {
        timestamp: Math.floor(videoCurrentTime),
        note: '',
        severity: 'info'
      }
    ];
  }

  function removeNote(index: number) {
    if (currentReview.detailedNotes) {
      currentReview.detailedNotes = currentReview.detailedNotes.filter((_, i) => i !== index);
    }
  }

  // Submit the review decision. This DOES NOT publish to the platform —
  // it only records the reviewer's verdict and updates the content status:
  //   approved        → status='approved' (ready for publish, NOT live)
  //   needs_revision  → status='submitted' (creator's queue)
  //   rejected        → status='rejected' (isActive=false)
  // The platform-publish step is a separate explicit action (see
  // `publishToPlatform` below) so admins can sequence reviewing and
  // going-live separately — e.g. approve now, release on a schedule.
  async function submitReview() {
    if (!contentData) return;
    if (!currentReview.result) {
      submitError = 'Pick a decision (Approve / Needs revision / Reject) before submitting.';
      return;
    }
    submitError = '';
    submitting = true;
    try {
      const res = await fetch(`/api/admin/content/${contentData.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: currentReview.result,
          feedback: currentReview.feedback,
          rejectionReason: currentReview.result === ReviewResult.REJECTED ? currentReview.feedback : undefined,
          // ALWAYS false here — Publish is its own button. Lets the admin
          // approve now and publish later (or never), without the API
          // implicitly flipping isActive every time someone approves.
          publishNow: false
        })
      });
      if (!res.ok) {
        const data = await res.json();
        submitError = data.error || 'Failed to submit review';
        toast.error('Review submission failed', { description: submitError });
        return;
      }
      const data = await res.json();
      // Update local status so the footer flips to "ready to publish"
      // mode without a page reload.
      if (contentData) contentData = { ...contentData, status: data.status ?? contentData.status };

      if (currentReview.result === ReviewResult.APPROVED) {
        toast.success('Review approved', {
          description: encoderInFlight
            ? 'Waiting for encoder to finish before you can publish.'
            : 'Click "Publish to platform" to make it live for viewers.'
        });
      } else if (currentReview.result === ReviewResult.REJECTED) {
        toast.success('Submission rejected', { description: 'The creator has been notified.' });
        // Rejecting → no follow-up here. Send the reviewer back to the queue.
        window.location.href = '/admin/review';
        return;
      } else {
        toast.success('Revision requested', { description: 'Sent back to the creator with your feedback.' });
        window.location.href = '/admin/review';
        return;
      }
    } catch (error) {
      console.error('Review submission error:', error);
      submitError = 'Failed to submit review';
      toast.error('Review submission failed', { description: submitError });
    } finally {
      submitting = false;
    }
  }

  // Publish the (already-approved) content to the platform. This sets
  // isActive=true and triggers the new-release notification fan-out (see
  // /api/admin/content/[id]/publish). The button calling this is only
  // enabled when contentData.status === 'approved' AND the encoder is
  // ready, so the server-side guards rarely fire — but they're there.
  let publishing = $state(false);
  async function publishToPlatform() {
    if (!contentData) return;
    if (!confirm('Publish this content to the platform? This will make it live for viewers and send new-release notifications to opted-in users.')) return;
    publishing = true;
    try {
      const res = await fetch(`/api/admin/content/${contentData.id}/publish`, { method: 'POST' });
      const body = await res.json();
      if (!res.ok) {
        const msg = body.error || 'Publish failed';
        toast.error('Publish failed', { description: msg });
        return;
      }
      if (contentData) {
        contentData = { ...contentData, status: 'published' as typeof contentData.status };
      }
      toast.success('Published to platform', {
        description: typeof body.notified === 'number'
          ? `${body.notified} subscribers notified.`
          : 'Content is now live for viewers.'
      });
    } catch (err) {
      console.error('Publish error:', err);
      toast.error('Publish failed', { description: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      publishing = false;
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ------ Derived UI helpers ------
  const progressPct = $derived(Math.max(0, Math.min(100, encoderProgress ?? 0)));
  const canSubmit = $derived(!!currentReview.result && !submitting);

  // Publish button is enabled only when there's a real reason to use it:
  // the reviewer's verdict is "approved" (status=='approved') AND the
  // encoder has finished. Server-side `/publish` enforces the same gate,
  // but disabling on the client gives clearer feedback.
  const isPublished = $derived(contentData?.status === 'published');
  const isApproved = $derived(contentData?.status === 'approved');
  const canPublish = $derived(
    isApproved
    && !publishing
    && (encoderStatus === 'ready' || !encoderJobId) // ready, OR no encoder needed (legacy / static)
  );

  // The "Submit review" button label changes by decision so the reviewer
  // sees what they're actually about to do — recording approval is very
  // different from rejecting or requesting revision.
  const submitLabel = $derived(
    currentReview.result === ReviewResult.APPROVED ? 'Approve review' :
    currentReview.result === ReviewResult.REJECTED ? 'Reject submission' :
    currentReview.result === ReviewResult.NEEDS_REVISION ? 'Request revision' :
    'Submit review'
  );

  // Encoder timeline state — drives the three-step pipeline strip on the
  // Encoder tab. Pulled out of the markup as derived state because Svelte 5
  // restricts `{@const}` to direct children of control-flow blocks.
  const isEncQueued = $derived(
    encoderStatus === 'queued' || encoderStatus === 'running' || encoderStatus === 'ready'
  );
  const isEncRunning = $derived(encoderStatus === 'running' || encoderStatus === 'ready');
  const isEncReady = $derived(encoderStatus === 'ready');
</script>

{#if contentData}
  <!-- ===== Band 1: sticky header ===== -->
  <div class="sticky top-0 z-20 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70">
    <div class="container mx-auto px-4 py-3">
      <a href="/admin/review" class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">
        <ArrowLeft class="w-3 h-3" /> Back to review queue
      </a>
      <div class="mt-2 flex flex-wrap items-center gap-3">
        <h1 class="text-xl font-semibold text-foreground truncate">{contentData.title}</h1>
        <span class="text-xs text-muted-foreground">
          {contentData.contentType} · {contentData.ministryAffiliation || 'Platform'} · {contentData.duration ?? '—'} min
        </span>

        <!-- Encoder pill / live mini progress -->
        {#if encoderStatus === 'ready'}
          <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300">
            <CheckCircle2 class="w-3 h-3" /> Ready to publish
          </span>
        {:else if encoderStatus === 'failed'}
          <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-300">
            <XCircle class="w-3 h-3" /> Encoding failed
          </span>
        {:else if encoderStatus === 'cancelled' || encoderStatus === 'cancelling'}
          <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
            {encoderStatusLabel(encoderStatus)}
          </span>
        {:else if encoderInFlight}
          <div class="inline-flex items-center gap-2 text-xs">
            <Loader2 class="w-3 h-3 animate-spin text-yellow-300" />
            <div class="w-32 h-1.5 rounded bg-muted overflow-hidden">
              <div class="h-full bg-yellow-300 transition-all duration-500" style="width: {progressPct}%"></div>
            </div>
            <span class="text-yellow-300 font-medium">{progressPct}%</span>
            <span class="text-muted-foreground">{encoderStage ?? 'queued'}</span>
            <span class="text-[10px] uppercase tracking-wide text-emerald-400 inline-flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>live
            </span>
          </div>
        {:else if encoderStatus}
          <span class="text-xs uppercase tracking-wide {encoderStatusClass(encoderStatus)}">{encoderStatusLabel(encoderStatus)}</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- ===== Band 2: cinematic player ===== -->
  <div class="container mx-auto px-4 pt-6">
    <div class="mx-auto max-w-5xl bg-black rounded-xl overflow-hidden shadow-xl">
      {#if contentData.videoUrl}
        <VideoPlayer
          src={contentData.videoUrl}
          poster={videoPosterUrl}
          title={contentData.title}
          subtitles={videoSubtitles}
          descriptions={videoDescriptions}
          chapters={videoChapters}
          previewVtt={videoPreviewVtt}
          previewSprites={videoPreviewSprites}
          onTimeUpdate={(t) => { videoCurrentTime = t; }}
        />
      {:else}
        <!-- No playable source yet. Use an aspect-video placeholder so the
             layout doesn't jump when the URL arrives via webhook. -->
        <div class="aspect-video flex flex-col items-center justify-center text-zinc-400 text-sm gap-3 px-4 text-center">
          <Film class="w-10 h-10 opacity-40" />
          {#if encoderInFlight}
            <div>Preview generating — {progressPct}% · {encoderStage ?? 'queued'}</div>
            <div class="text-xs opacity-70">The player will load automatically when the encoder finishes.</div>
          {:else if encoderStatus === 'failed'}
            <div class="text-red-300">Encoding failed — see the Encoder tab below for details.</div>
          {:else}
            <div>No playable source yet.</div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Trailer (when provided). Smaller than the main player and not
         interfering with the main video review. Useful preview-of-preview
         for the admin to confirm the trailer is what the creator intended.
         When the trailer pipeline isn't wired (Option B robust trailer fix
         is the TECHDEBT item), `trailerUrl` is filtered out as a
         "staged-for-encoding" sentinel and this section won't render. -->
    {#if trailerUrl}
      <div class="mx-auto max-w-3xl mt-4 surface-1 rounded-xl overflow-hidden border border-border/40">
        <div class="px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground border-b border-border/40 bg-background/50">
          Trailer
        </div>
        <!-- A bare HTML5 video so MP4 trailers play natively without HLS.
             Once the trailer pipeline produces HLS we can swap to VideoPlayer. -->
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
          src={trailerUrl}
          poster={videoPosterUrl}
          controls
          playsinline
          preload="metadata"
          class="w-full aspect-video bg-black"
        ></video>
      </div>
    {:else if contentData.id}
      <div class="mx-auto max-w-3xl mt-4 surface-1 rounded-xl border border-border/40 px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
        <Film class="w-3.5 h-3.5 opacity-60" />
        No playable trailer attached.
        <span class="opacity-60">(Trailer upload is staged but the encoder pipeline for trailers isn't wired yet — tracked in TECHDEBT.md.)</span>
      </div>
    {/if}
  </div>

  <!-- ===== Band 3: tabbed sections ===== -->
  <div class="container mx-auto px-4 mt-6 pb-28">
    <Tabs.Root value={activeTab} onValueChange={(v) => (activeTab = v as TabId)}>
      <Tabs.List class="sticky top-15 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70 w-full justify-start overflow-x-auto">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="review">Review</Tabs.Trigger>
        <Tabs.Trigger value="encoder">Encoder{#if encoderStatus === 'failed'} ⚠{/if}</Tabs.Trigger>
        <Tabs.Trigger value="scan">Scan</Tabs.Trigger>
        <Tabs.Trigger value="history">History</Tabs.Trigger>
      </Tabs.List>

      <!-- ---- Overview ---- -->
      <Tabs.Content value="overview" class="mt-6 space-y-6">
        <div class="surface-1 rounded-xl p-5">
          <p class="text-foreground/80 text-sm leading-relaxed mb-6">{contentData.description}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-foreground mb-2 text-sm">Bible references</h3>
              <div class="space-y-1">
                {#each contentData.bibleReferences || [] as ref}
                  <div class="text-sm text-purple-300">{ref}</div>
                {:else}
                  <div class="text-xs text-muted-foreground">None</div>
                {/each}
              </div>
            </div>
            <div>
              <h3 class="font-medium text-foreground mb-2 text-sm">Themes</h3>
              <div class="flex flex-wrap gap-2">
                {#each contentData.themes || [] as theme}
                  <span class="bg-blue-600/20 text-blue-200 px-2 py-1 rounded text-xs">{theme}</span>
                {:else}
                  <span class="text-xs text-muted-foreground">None</span>
                {/each}
              </div>
            </div>
            <div>
              <h3 class="font-medium text-foreground mb-2 text-sm">Ministry</h3>
              <div class="text-sm text-foreground/80">{contentData.ministryAffiliation || 'Not specified'}</div>
            </div>
            <div>
              <h3 class="font-medium text-foreground mb-2 text-sm">Accessibility</h3>
              <div class="text-sm text-foreground/80">
                {contentData.hasSubtitles ? '✓ Subtitles' : '✗ No subtitles'}<br />
                {contentData.hasClosedCaptions ? '✓ Closed captions' : '✗ No closed captions'}
              </div>
            </div>
          </div>
        </div>

        <div class="surface-2 rounded-xl p-5">
          <h3 class="text-base font-semibold text-foreground mb-4">Image assets</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {#if contentData.assets.posterPortrait}
              <div>
                <div class="text-xs text-muted-foreground mb-2">Portrait poster</div>
                <img src={contentData.assets.posterPortrait} alt="Portrait poster" class="w-full aspect-2/3 object-cover rounded" />
              </div>
            {/if}
            {#if contentData.assets.backdropHero}
              <div>
                <div class="text-xs text-muted-foreground mb-2">Hero backdrop</div>
                <img src={contentData.assets.backdropHero} alt="Hero backdrop" class="w-full aspect-video object-cover rounded" />
              </div>
            {/if}
          </div>
        </div>
      </Tabs.Content>

      <!-- ---- Review ---- -->
      <Tabs.Content value="review" class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="surface-2 rounded-xl p-6">
            <h3 class="text-base font-semibold text-foreground mb-4">Review assessment</h3>

            <div class="mb-4">
              <label for="reviewType" class="block text-sm font-medium text-foreground mb-2">Review type</label>
              <select
                id="reviewType"
                bind:value={currentReview.reviewType}
                class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground"
              >
                <option value={ReviewType.THEOLOGICAL}>Theological review</option>
                <option value={ReviewType.CONTENT_MODERATION}>Content moderation</option>
                <option value={ReviewType.FAMILY_SAFETY}>Family safety</option>
                <option value={ReviewType.TECHNICAL_QA}>Technical QA</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="generalFeedback" class="block text-sm font-medium text-foreground mb-2">General feedback</label>
              <textarea
                id="generalFeedback"
                bind:value={currentReview.feedback}
                placeholder="Provide detailed feedback for the creator…"
                rows="6"
                class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground placeholder:text-muted-foreground resize-y"
              ></textarea>
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-foreground">Timestamp notes</span>
                <button
                  type="button"
                  onclick={addTimestampNote}
                  class="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded text-xs font-medium"
                >
                  Add note at {formatTime(videoCurrentTime)}
                </button>
              </div>
              {#if currentReview.detailedNotes && currentReview.detailedNotes.length > 0}
                <div class="space-y-2">
                  {#each currentReview.detailedNotes as note, index}
                    <div class="surface-1 p-3 rounded">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-xs text-primary font-medium">{formatTime(note.timestamp)}</span>
                        <button type="button" onclick={() => removeNote(index)} class="text-red-400 hover:text-red-300 text-xs">Remove</button>
                      </div>
                      <textarea
                        bind:value={note.note}
                        placeholder="Add your note here…"
                        rows="2"
                        class="w-full px-2 py-1 surface-2 border border-border rounded text-foreground placeholder:text-muted-foreground text-sm resize-none"
                      ></textarea>
                      <select bind:value={note.severity} class="mt-2 px-2 py-1 surface-2 border border-border rounded text-foreground text-xs">
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="text-muted-foreground text-sm">No timestamp notes yet</div>
              {/if}
            </div>
          </div>

          <!-- Review guidelines (review-type-specific) -->
          {#if currentReview.reviewType === ReviewType.THEOLOGICAL}
            <div class="bg-purple-600/15 border border-purple-600/40 rounded-xl p-4">
              <h4 class="font-medium text-foreground mb-2 text-sm">Theological review guidelines</h4>
              <ul class="text-xs text-purple-200 space-y-1">
                <li>• Verify biblical accuracy of references</li>
                <li>• Check doctrinal alignment with core Christian beliefs</li>
                <li>• Ensure theological statements are sound</li>
                <li>• Review for potential denominational bias</li>
              </ul>
            </div>
          {:else if currentReview.reviewType === ReviewType.FAMILY_SAFETY}
            <div class="bg-pink-600/15 border border-pink-600/40 rounded-xl p-4">
              <h4 class="font-medium text-foreground mb-2 text-sm">Family safety guidelines</h4>
              <ul class="text-xs text-pink-200 space-y-1">
                <li>• Verify age-appropriate content</li>
                <li>• Check for inappropriate language</li>
                <li>• Ensure visual content is family-friendly</li>
                <li>• Review themes for age suitability</li>
              </ul>
            </div>
          {/if}
        </div>

        <div class="space-y-6">
          <ContentScanReport
            status={scanStatus}
            report={scanReport}
            contentId={contentData.id}
            onRescanned={() => { scanStatus = 'in_progress'; }}
          />
          {#if contentData.id}
            <ContentThreadPanel contentId={contentData.id} variant="admin" />
          {/if}
        </div>
      </Tabs.Content>

      <!-- ---- Encoder ---- -->
      <Tabs.Content value="encoder" class="mt-6 space-y-6">
        <div class="surface-1 rounded-xl p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-base font-semibold text-foreground">Encoder pipeline</div>
            <span class="text-xs uppercase tracking-wide {encoderStatusClass(encoderStatus)}">{encoderStatusLabel(encoderStatus)}</span>
          </div>

          <!-- Timeline -->
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="text-center {isEncQueued ? 'text-foreground' : 'text-muted-foreground'}">
              <div class="font-medium">Queued</div>
              <div class="h-1 mt-1 rounded bg-muted overflow-hidden">
                <div class="h-full bg-yellow-300" style="width: {isEncQueued ? 100 : 0}%"></div>
              </div>
            </div>
            <div class="text-center {isEncRunning ? 'text-foreground' : 'text-muted-foreground'}">
              <div class="font-medium">Encoding</div>
              <div class="h-1 mt-1 rounded bg-muted overflow-hidden">
                <div class="h-full bg-yellow-300 transition-all duration-500" style="width: {isEncRunning ? progressPct : 0}%"></div>
              </div>
            </div>
            <div class="text-center {isEncReady ? 'text-emerald-300' : 'text-muted-foreground'}">
              <div class="font-medium">Ready</div>
              <div class="h-1 mt-1 rounded bg-muted overflow-hidden">
                <div class="h-full bg-emerald-400" style="width: {isEncReady ? 100 : 0}%"></div>
              </div>
            </div>
          </div>

          {#if encoderInFlight}
            <div class="surface-2 rounded p-3 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-foreground/80">Stage</span>
                <span class="font-medium text-foreground">{encoderStage ?? 'waiting'}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-foreground/80">Progress</span>
                <span class="font-medium text-foreground">{progressPct}%</span>
              </div>
              <div class="h-2 rounded bg-muted overflow-hidden">
                <div class="h-full bg-yellow-300 transition-all duration-500" style="width: {progressPct}%"></div>
              </div>
            </div>
          {/if}

          {#if encoderError}
            <div class="bg-red-500/10 border border-red-500/30 rounded p-3 text-sm text-red-200">
              <div class="font-medium mb-1">Encoder error</div>
              <div class="text-xs whitespace-pre-wrap wrap-break-word">{encoderError}</div>
            </div>
          {/if}

          {#if encoderJobId}
            <div class="text-[10px] text-muted-foreground font-mono break-all">job: {encoderJobId}</div>
          {/if}

          {#if encoderInFlight}
            <button
              type="button"
              onclick={cancelEncode}
              disabled={cancelling}
              class="w-full text-sm text-red-300 hover:text-red-100 surface-2 rounded px-3 py-2 disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : 'Cancel encode'}
            </button>
          {/if}
        </div>
      </Tabs.Content>

      <!-- ---- Scan ---- -->
      <Tabs.Content value="scan" class="mt-6">
        <ContentScanReport
          status={scanStatus}
          report={scanReport}
          contentId={contentData.id}
          onRescanned={() => { scanStatus = 'in_progress'; }}
        />
      </Tabs.Content>

      <!-- ---- History ---- -->
      <Tabs.Content value="history" class="mt-6">
        <div class="surface-1 rounded-xl p-8 text-center text-sm text-muted-foreground">
          {#if reviewHistory.length === 0}
            No prior reviews for this content yet.
          {:else}
            <!-- Future: render reviewHistory rows -->
            History feed coming soon.
          {/if}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  </div>

  <!-- ===== Sticky action footer =====
       Two distinct stages, visually separated:
       1. REVIEW DECISION — records the reviewer's verdict. Approving here
          sets status='approved' but does NOT make content live.
       2. PUBLISH — separate explicit action that makes the content live
          on /movies and fans out new-release notifications. Disabled
          until status='approved' AND the encoder is ready. -->
  <div class="fixed bottom-0 left-0 right-0 z-20 border-t border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
    <div class="container mx-auto px-4 py-3">
      {#if submitError}
        <div class="mb-2 text-xs text-red-400">{submitError}</div>
      {/if}

      <div class="flex flex-wrap items-center gap-4">
        <!-- ---- Stage 1: Review decision ---- -->
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-[10px] uppercase tracking-wide text-muted-foreground hidden sm:block">
            Review:
          </span>
          <fieldset class="flex flex-wrap items-center gap-3" disabled={isPublished}>
            <legend class="sr-only">Decision</legend>
            <label class="inline-flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="radio" bind:group={currentReview.result} value={ReviewResult.APPROVED} class="accent-emerald-500" />
              <CheckCircle2 class="w-4 h-4 text-emerald-400" />
              <span class="text-emerald-300">Approve</span>
            </label>
            <label class="inline-flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="radio" bind:group={currentReview.result} value={ReviewResult.NEEDS_REVISION} class="accent-yellow-500" />
              <AlertTriangle class="w-4 h-4 text-yellow-400" />
              <span class="text-yellow-300">Needs revision</span>
            </label>
            <label class="inline-flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="radio" bind:group={currentReview.result} value={ReviewResult.REJECTED} class="accent-red-500" />
              <XCircle class="w-4 h-4 text-red-400" />
              <span class="text-red-300">Reject</span>
            </label>
          </fieldset>
          <button
            type="button"
            onclick={submitReview}
            disabled={!canSubmit || isPublished}
            title={isPublished ? 'Already published — re-open the review to change the verdict.' : undefined}
            class="text-sm px-4 py-2 rounded font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {#if submitting}<Loader2 class="w-4 h-4 animate-spin" />{/if}
            {submitting ? 'Submitting…' : submitLabel}
          </button>
        </div>

        <!-- Visual divider -->
        <div class="hidden md:block h-8 w-px bg-border/60"></div>

        <!-- ---- Stage 2: Publish to platform ---- -->
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-[10px] uppercase tracking-wide text-muted-foreground hidden sm:block">
            Platform:
          </span>
          {#if isPublished}
            <span class="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium">
              <CheckCircle2 class="w-3.5 h-3.5" /> Published & live
            </span>
          {:else}
            <button
              type="button"
              onclick={publishToPlatform}
              disabled={!canPublish}
              title={
                isApproved
                  ? (encoderInFlight ? 'Wait for the encoder to finish before publishing.' : 'Make this content live for viewers and notify subscribers.')
                  : 'Approve the review first, then publish.'
              }
              class="text-sm px-4 py-2 rounded font-medium bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {#if publishing}
                <Loader2 class="w-4 h-4 animate-spin" />
              {:else}
                <Rocket class="w-4 h-4" />
              {/if}
              {publishing ? 'Publishing…' : 'Publish to platform'}
            </button>
            {#if !isApproved}
              <span class="text-[11px] text-muted-foreground">Approve first</span>
            {:else if encoderInFlight}
              <span class="text-[11px] text-yellow-300 inline-flex items-center gap-1">
                <Loader2 class="w-3 h-3 animate-spin" /> waiting for encoder ({progressPct}%)
              </span>
            {/if}
          {/if}
        </div>

        <div class="flex-1"></div>

        <button
          type="button"
          onclick={() => (window.location.href = '/admin/review')}
          class="text-sm px-3 py-2 text-muted-foreground hover:text-foreground rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
{:else if isLoading}
  <div class="container mx-auto px-4 py-12 text-center text-muted-foreground text-sm">Loading content…</div>
{:else}
  <div class="container mx-auto px-4 py-12 text-center text-muted-foreground text-sm">Content not found.</div>
{/if}
