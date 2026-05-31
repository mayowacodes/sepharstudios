<!-- Individual Content Review -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { ContentSubmission } from '$lib/types/creator';
  import type { ContentReview } from '$lib/types/admin';
  import { ReviewType, ReviewResult } from '$lib/types/admin';
  import ContentThreadPanel from '$lib/components/widgets/ContentThreadPanel.svelte';
  import ContentScanReport from '$lib/components/admin/ContentScanReport.svelte';
  import VideoPlayer from '$lib/components/widgets/VideoPlayer.svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import { ArrowLeft, ShieldCheck } from '@lucide/svelte';

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
    result: ReviewResult.APPROVED,
    feedback: '',
    detailedNotes: []
  });

  let videoCurrentTime = $state(0);
  let isLoading = $state(true);
  let submitError = $state('');

  // Playback artifacts pulled from the admin content GET. Threaded into the
  // VideoPlayer so reviewers get the same HLS / chapters / subtitles /
  // scrubbing-preview experience viewers do.
  let videoSubtitles = $state<Array<{ label: string; src: string; srclang: string }>>([]);
  let videoDescriptions = $state<Array<{ label: string; src: string; srclang: string }>>([]);
  let videoChapters = $state<Array<{ start: number; title: string }>>([]);
  let videoPreviewVtt = $state<string | undefined>(undefined);
  let videoPreviewSprites = $state<string[]>([]);
  let videoPosterUrl = $state<string | undefined>(undefined);
  
  onMount(async () => {
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
      reviewHistory = [];
    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
    }
  });
  
  // True when the job is still running (not terminal). Used to decide
  // whether the cancel button is shown / armed.
  const encoderInFlight = $derived(
    !!encoderJobId
    && encoderStatus !== null
    && !['ready', 'failed', 'cancelled'].includes(encoderStatus)
  );

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
    if (s === 'ready') return 'text-green-300';
    if (s === 'failed') return 'text-red-300';
    if (s === 'cancelled' || s === 'cancelling') return 'text-muted-foreground';
    return 'text-yellow-300';
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
  
  async function submitReview() {
    if (!contentData) return;
    submitError = '';
    try {
      const res = await fetch(`/api/admin/content/${contentData.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: currentReview.result,
          feedback: currentReview.feedback,
          rejectionReason: currentReview.result === ReviewResult.REJECTED ? currentReview.feedback : undefined,
          publishNow: currentReview.result === ReviewResult.APPROVED
        })
      });
      if (!res.ok) {
        const data = await res.json();
        submitError = data.error || 'Failed to submit review';
        return;
      }
      alert('Review submitted successfully!');
      window.location.href = '/admin/review';
    } catch (error) {
      console.error('Review submission error:', error);
      submitError = 'Failed to submit review';
    }
  }
  
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

{#if contentData}
<div class="container mx-auto px-4 py-6 space-y-6">
  <a href="/admin/review" class="text-xs text-primary hover:opacity-80 inline-flex items-center gap-1">
    <ArrowLeft class="w-3 h-3" /> Back to review queue
  </a>
  <PageHeader icon={ShieldCheck} title={contentData.title} subtitle="{contentData.contentType} · {contentData.ageRating} · {contentData.duration} min · {contentData.language}" />

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Content Preview (Left Column) -->
  <div class="lg:col-span-2 space-y-6">
    <!-- Video Player — full VideoPlayer so reviewers see the same HLS
         playback, chapters, subtitles, and scrubbing previews that
         viewers do. NOTE: we deliberately omit `contentId` so the player
         doesn't post fake watch-progress for the admin. -->
    <div class="bg-black rounded-xl overflow-hidden">
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
        <div class="aspect-video flex items-center justify-center text-zinc-400 text-sm">No playable source yet.</div>
      {/if}
    </div>
    
    <!-- Content Information -->
    <div class="surface-1 rounded-xl p-5">
      <div class="flex justify-between items-start mb-4">
        <span class="text-xs uppercase tracking-wide text-muted-foreground">Submission details</span>
        <span class="text-[10px] uppercase tracking-wide bg-yellow-500/15 text-yellow-600 dark:text-yellow-300 rounded-full px-2 py-0.5">
          {contentData.status.replace('_', ' ')}
        </span>
      </div>

      <p class="text-foreground/80 mb-6 text-sm leading-relaxed">{contentData.description}</p>
      
      <!-- Additional Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium text-foreground mb-2">Bible References</h3>
          <div class="space-y-1">
            {#each contentData.bibleReferences || [] as ref}
              <div class="text-sm text-purple-300">{ref}</div>
            {/each}
          </div>
        </div>
        
        <div>
          <h3 class="font-medium text-foreground mb-2">Themes</h3>
          <div class="flex flex-wrap gap-2">
            {#each contentData.themes || [] as theme}
              <span class="bg-blue-600 text-white px-2 py-1 rounded text-xs">{theme}</span>
            {/each}
          </div>
        </div>
        
        <div>
          <h3 class="font-medium text-foreground mb-2">Ministry</h3>
          <div class="text-sm text-foreground/80">{contentData.ministryAffiliation || 'Not specified'}</div>
        </div>
        
        <div>
          <h3 class="font-medium text-foreground mb-2">Accessibility</h3>
          <div class="text-sm text-foreground/80">
            {contentData.hasSubtitles ? '✓ Subtitles' : '✗ No subtitles'}
            <br>
            {contentData.hasClosedCaptions ? '✓ Closed captions' : '✗ No closed captions'}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Asset Preview -->
    <div class="surface-2 rounded-xl p-6">
      <h3 class="text-xl font-bold text-foreground mb-4">Image Assets</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#if contentData.assets.posterPortrait}
          <div>
            <div class="text-sm text-muted-foreground mb-2">Portrait Poster</div>
            <img src={contentData.assets.posterPortrait} alt="Portrait poster" class="w-full aspect-[2/3] object-cover rounded">
          </div>
        {/if}
        {#if contentData.assets.backdropHero}
          <div>
            <div class="text-sm text-muted-foreground mb-2">Hero Backdrop</div>
            <img src={contentData.assets.backdropHero} alt="Hero backdrop" class="w-full aspect-video object-cover rounded">
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Review Panel (Right Column) -->
  <div class="space-y-6">
    <!-- Encoder status (R+1). Separate from the content scan below —
         encode hits 100% at playback-ready; the AI scan runs after and
         lands via its own webhook. -->
    {#if encoderStatus}
      <div class="surface-1 rounded-xl p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="text-sm font-semibold text-foreground">Encoder pipeline</div>
          <span class="text-xs uppercase tracking-wide {encoderStatusClass(encoderStatus)}">{encoderStatus}</span>
        </div>
        {#if encoderInFlight}
          <div class="h-2 surface-2 rounded overflow-hidden">
            <div class="h-full bg-purple-500 transition-all duration-500" style="width: {Math.max(0, Math.min(100, encoderProgress ?? 0))}%"></div>
          </div>
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <span>{encoderStage ?? 'waiting'}</span>
            <span>{Math.max(0, Math.min(100, encoderProgress ?? 0))}%</span>
          </div>
        {/if}
        {#if encoderError}
          <div class="text-xs text-red-300">{encoderError}</div>
        {/if}
        {#if encoderJobId}
          <div class="text-[10px] text-muted-foreground font-mono break-all">job: {encoderJobId}</div>
        {/if}
        {#if encoderInFlight}
          <button
            type="button"
            onclick={cancelEncode}
            disabled={cancelling}
            class="w-full text-xs text-red-300 hover:text-red-100 surface-2 rounded px-3 py-2 disabled:opacity-50"
          >
            {cancelling ? 'Cancelling…' : 'Cancel encode'}
          </button>
        {/if}
      </div>
    {/if}

    <!-- AI content scan report — surfaces above the review form so it
         informs the admin's Approve/Reject decision. -->
    <ContentScanReport
      status={scanStatus}
      report={scanReport}
      contentId={contentData.id}
      onRescanned={() => { scanStatus = 'in_progress'; }}
    />

    <!-- Discussion with creator -->
    {#if contentData.id}
      <ContentThreadPanel contentId={contentData.id} variant="admin" />
    {/if}

    <!-- Review Form -->
    <div class="surface-2 rounded-xl p-6">
      <h3 class="text-xl font-bold text-foreground mb-4">Review Assessment</h3>
      
      <!-- Review Type -->
      <div class="mb-4">
        <label for="reviewType" class="block text-sm font-medium text-foreground mb-2">Review Type</label>
        <select 
          id="reviewType"
          bind:value={currentReview.reviewType}
          class="w-full px-3 py-2 surface-2 border border-gray-600 rounded text-foreground"
        >
          <option value={ReviewType.THEOLOGICAL}>Theological Review</option>
          <option value={ReviewType.CONTENT_MODERATION}>Content Moderation</option>
          <option value={ReviewType.FAMILY_SAFETY}>Family Safety</option>
          <option value={ReviewType.TECHNICAL_QA}>Technical QA</option>
        </select>
      </div>
      
      <!-- Review Result -->
      <div class="mb-4">
        <fieldset>
          <legend class="block text-sm font-medium text-foreground mb-2">Decision</legend>
          <div class="space-y-2">
          <label class="flex items-center">
            <input 
              type="radio" 
              bind:group={currentReview.result} 
              value={ReviewResult.APPROVED}
              class="mr-2"
            />
            <span class="text-green-400">✓ Approve</span>
          </label>
          <label class="flex items-center">
            <input 
              type="radio" 
              bind:group={currentReview.result} 
              value={ReviewResult.NEEDS_REVISION}
              class="mr-2"
            />
            <span class="text-yellow-400">⚠ Needs Revision</span>
          </label>
          <label class="flex items-center">
            <input 
              type="radio" 
              bind:group={currentReview.result} 
              value={ReviewResult.REJECTED}
              class="mr-2"
            />
            <span class="text-red-400">✗ Reject</span>
          </label>
          </div>
        </fieldset>
      </div>
      
      <!-- General Feedback -->
      <div class="mb-4">
        <label for="generalFeedback" class="block text-sm font-medium text-foreground mb-2">General Feedback</label>
        <textarea 
          id="generalFeedback"
          bind:value={currentReview.feedback}
          placeholder="Provide detailed feedback for the creator..."
          rows="4"
          class="w-full px-3 py-2 surface-2 border border-gray-600 rounded text-foreground placeholder-gray-400 resize-none"
        ></textarea>
      </div>
      
      <!-- Timestamp Notes -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-foreground">Timestamp Notes</span>
          <button 
            onclick={addTimestampNote}
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Add Note at {formatTime(videoCurrentTime)}
          </button>
        </div>
        
        {#if currentReview.detailedNotes && currentReview.detailedNotes.length > 0}
          <div class="space-y-2">
            {#each currentReview.detailedNotes as note, index}
              <div class="surface-1 p-3 rounded">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-blue-400">{formatTime(note.timestamp)}</span>
                  <button 
                    onclick={() => removeNote(index)}
                    class="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <textarea 
                  bind:value={note.note}
                  placeholder="Add your note here..."
                  rows="2"
                  class="w-full px-2 py-1 surface-2 border border-gray-600 rounded text-foreground placeholder-gray-400 text-sm resize-none"
                ></textarea>
                <select 
                  bind:value={note.severity}
                  class="mt-2 px-2 py-1 surface-2 border border-gray-600 rounded text-foreground text-xs"
                >
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
      
      <!-- Submit Review -->
      <div class="space-y-3">
        {#if submitError}
          <div class="text-sm text-red-400">{submitError}</div>
        {/if}
        <button 
          onclick={submitReview}
          class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-medium"
        >
          Submit Review
        </button>
        
        <button 
          onclick={() => window.location.href = '/admin/review'}
          class="w-full bg-gray-600 hover:bg-gray-700 text-foreground py-2 rounded"
        >
          Back to Queue
        </button>
      </div>
    </div>
    
    <!-- Review Guidelines -->
    {#if currentReview.reviewType === ReviewType.THEOLOGICAL}
      <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-4">
        <h4 class="font-medium text-foreground mb-2">Theological Review Guidelines</h4>
        <div class="text-sm text-purple-200 space-y-1">
          <div>• Verify biblical accuracy of references</div>
          <div>• Check doctrinal alignment with core Christian beliefs</div>
          <div>• Ensure theological statements are sound</div>
          <div>• Review for potential denominational bias</div>
        </div>
      </div>
    {:else if currentReview.reviewType === ReviewType.FAMILY_SAFETY}
      <div class="bg-pink-600/20 border border-pink-600 rounded-xl p-4">
        <h4 class="font-medium text-foreground mb-2">Family Safety Guidelines</h4>
        <div class="text-sm text-pink-200 space-y-1">
          <div>• Verify age-appropriate content</div>
          <div>• Check for inappropriate language</div>
          <div>• Ensure visual content is family-friendly</div>
          <div>• Review themes for age suitability</div>
        </div>
      </div>
    {/if}
  </div>
</div>
</div>

{:else}
<div class="container mx-auto px-4 py-12 text-center text-muted-foreground">
  <div class="text-sm">Loading content…</div>
</div>
{/if}
