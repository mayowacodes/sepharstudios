<!-- Individual Content Review -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import type { ContentSubmission } from '$lib/types/creator';
  import type { ContentReview } from '$lib/types/admin';
  import { ReviewType, ReviewResult } from '$lib/types/admin';
  
  let contentData: ContentSubmission | null = null;
  let reviewHistory: ContentReview[] = [];
  let currentReview: Partial<ContentReview> = {
    reviewType: ReviewType.THEOLOGICAL,
    result: ReviewResult.APPROVED,
    feedback: '',
    detailedNotes: []
  };
  
  let videoCurrentTime = 0;
  let isPlaying = false;
  let isLoading = true;
  let submitError = '';
  
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
      reviewHistory = [];
    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
    }
  });
  
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
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Content Preview (Left Column) -->
  <div class="lg:col-span-2 space-y-6">
    <!-- Video Player -->
    <div class="bg-black rounded-xl overflow-hidden">
      <video 
        src={contentData.videoUrl}
        controls
        class="w-full aspect-video"
        bind:currentTime={videoCurrentTime}
        bind:paused={isPlaying}
      >
        <track kind="captions" src="" label="English" srclang="en" />
      </video>
    </div>
    
    <!-- Content Information -->
    <div class="bg-white/10 rounded-xl p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">{contentData.title}</h1>
          <div class="flex items-center space-x-4 text-sm text-gray-400">
            <span>{contentData.contentType}</span>
            <span>{contentData.ageRating}</span>
            <span>{contentData.duration} min</span>
            <span>{contentData.language}</span>
          </div>
        </div>
        
        <div class="text-right">
          <div class="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm">
            {contentData.status.replace('_', ' ')}
          </div>
        </div>
      </div>
      
      <p class="text-gray-300 mb-6">{contentData.description}</p>
      
      <!-- Additional Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium text-white mb-2">Bible References</h3>
          <div class="space-y-1">
            {#each contentData.bibleReferences || [] as ref}
              <div class="text-sm text-purple-300">{ref}</div>
            {/each}
          </div>
        </div>
        
        <div>
          <h3 class="font-medium text-white mb-2">Themes</h3>
          <div class="flex flex-wrap gap-2">
            {#each contentData.themes || [] as theme}
              <span class="bg-blue-600 text-white px-2 py-1 rounded text-xs">{theme}</span>
            {/each}
          </div>
        </div>
        
        <div>
          <h3 class="font-medium text-white mb-2">Ministry</h3>
          <div class="text-sm text-gray-300">{contentData.ministryAffiliation || 'Not specified'}</div>
        </div>
        
        <div>
          <h3 class="font-medium text-white mb-2">Accessibility</h3>
          <div class="text-sm text-gray-300">
            {contentData.hasSubtitles ? '✓ Subtitles' : '✗ No subtitles'}
            <br>
            {contentData.hasClosedCaptions ? '✓ Closed captions' : '✗ No closed captions'}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Asset Preview -->
    <div class="bg-white/10 rounded-xl p-6">
      <h3 class="text-xl font-bold text-white mb-4">Image Assets</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#if contentData.assets.posterPortrait}
          <div>
            <div class="text-sm text-gray-400 mb-2">Portrait Poster</div>
            <img src={contentData.assets.posterPortrait} alt="Portrait poster" class="w-full aspect-[2/3] object-cover rounded">
          </div>
        {/if}
        {#if contentData.assets.backdropHero}
          <div>
            <div class="text-sm text-gray-400 mb-2">Hero Backdrop</div>
            <img src={contentData.assets.backdropHero} alt="Hero backdrop" class="w-full aspect-video object-cover rounded">
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Review Panel (Right Column) -->
  <div class="space-y-6">
    <!-- Review Form -->
    <div class="bg-white/10 rounded-xl p-6">
      <h3 class="text-xl font-bold text-white mb-4">Review Assessment</h3>
      
      <!-- Review Type -->
      <div class="mb-4">
        <label for="reviewType" class="block text-sm font-medium text-white mb-2">Review Type</label>
        <select 
          id="reviewType"
          bind:value={currentReview.reviewType}
          class="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded text-white"
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
          <legend class="block text-sm font-medium text-white mb-2">Decision</legend>
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
        <label for="generalFeedback" class="block text-sm font-medium text-white mb-2">General Feedback</label>
        <textarea 
          id="generalFeedback"
          bind:value={currentReview.feedback}
          placeholder="Provide detailed feedback for the creator..."
          rows="4"
          class="w-full px-3 py-2 bg-white/10 border border-gray-600 rounded text-white placeholder-gray-400 resize-none"
        ></textarea>
      </div>
      
      <!-- Timestamp Notes -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-white">Timestamp Notes</span>
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
              <div class="bg-white/5 p-3 rounded">
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
                  class="w-full px-2 py-1 bg-white/10 border border-gray-600 rounded text-white placeholder-gray-400 text-sm resize-none"
                ></textarea>
                <select 
                  bind:value={note.severity}
                  class="mt-2 px-2 py-1 bg-white/10 border border-gray-600 rounded text-white text-xs"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-gray-400 text-sm">No timestamp notes yet</div>
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
          class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
        >
          Back to Queue
        </button>
      </div>
    </div>
    
    <!-- Review Guidelines -->
    {#if currentReview.reviewType === ReviewType.THEOLOGICAL}
      <div class="bg-purple-600/20 border border-purple-600 rounded-xl p-4">
        <h4 class="font-medium text-white mb-2">Theological Review Guidelines</h4>
        <div class="text-sm text-purple-200 space-y-1">
          <div>• Verify biblical accuracy of references</div>
          <div>• Check doctrinal alignment with core Christian beliefs</div>
          <div>• Ensure theological statements are sound</div>
          <div>• Review for potential denominational bias</div>
        </div>
      </div>
    {:else if currentReview.reviewType === ReviewType.FAMILY_SAFETY}
      <div class="bg-pink-600/20 border border-pink-600 rounded-xl p-4">
        <h4 class="font-medium text-white mb-2">Family Safety Guidelines</h4>
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

{:else}
<div class="text-center py-12">
  <div class="text-4xl mb-4">📋</div>
  <div class="text-xl text-white mb-2">Loading content...</div>
</div>
{/if}
