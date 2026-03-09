<!-- Admin Review Queue -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { ReviewQueueItem } from '$lib/types/admin';
  import { ReviewType } from '$lib/types/admin';
  
  let reviewQueue = $state<ReviewQueueItem[]>([]);
  let selectedType = $state<ReviewType | 'all'>('all');
  let selectedPriority = $state<'urgent' | 'high' | 'normal' | 'low' | 'all'>('all');
  let activeTab = $state<'content' | 'user-reviews'>('content');

  // User reviews state
  interface UserReview {
    id: string;
    userId: string;
    contentId: string;
    contentType: string;
    rating: number;
    reviewText: string | null;
    isApproved: boolean;
    helpfulCount: number;
    createdAt: string;
  }
  let userReviews = $state<UserReview[]>([]);
  let userReviewsLoading = $state(false);

  async function loadUserReviews() {
    userReviewsLoading = true;
    try {
      const res = await fetch('/api/admin/reviews?approved=false');
      if (res.ok) userReviews = await res.json();
    } finally {
      userReviewsLoading = false;
    }
  }

  async function moderateReview(id: string, approve: boolean) {
    const res = await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, isApproved: approve })
    });
    if (res.ok) {
      userReviews = userReviews.filter(r => r.id !== id);
      if (approve) await loadUserReviews();
    }
  }

  async function deleteReview(id: string) {
    if (!confirm('Delete this review permanently?')) return;
    const res = await fetch('/api/admin/reviews', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) userReviews = userReviews.filter(r => r.id !== id);
  }

  // Mock data for content upload review queue
  onMount(() => {
    reviewQueue = [
      {
        id: '1',
        contentId: 'content-1',
        title: 'The Gospel Truth: Modern Discipleship',
        creatorName: 'Pastor John Smith',
        contentType: 'Documentary',
        submittedAt: new Date('2024-09-01'),
        priority: 'urgent',
        reviewType: ReviewType.THEOLOGICAL,
        dueDate: new Date('2024-09-05'),
        estimatedReviewTime: 45
      },
      {
        id: '2',
        contentId: 'content-2',
        title: 'Youth Ministry: Reaching Generation Z',
        creatorName: 'Grace Community Church',
        contentType: 'Series',
        submittedAt: new Date('2024-09-02'),
        priority: 'high',
        reviewType: ReviewType.CONTENT_MODERATION,
        assignedTo: 'Sarah Johnson',
        dueDate: new Date('2024-09-06'),
        estimatedReviewTime: 30
      },
      {
        id: '3',
        contentId: 'content-3',
        title: 'Worship & Praise Collection',
        creatorName: 'Victory Ministries',
        contentType: 'Worship',
        submittedAt: new Date('2024-09-03'),
        priority: 'normal',
        reviewType: ReviewType.TECHNICAL_QA,
        dueDate: new Date('2024-09-07'),
        estimatedReviewTime: 20
      },
      {
        id: '4',
        contentId: 'content-4',
        title: 'Bible Stories for Kids',
        creatorName: 'Children\'s Ministry Team',
        contentType: 'Kids Content',
        submittedAt: new Date('2024-09-04'),
        priority: 'high',
        reviewType: ReviewType.FAMILY_SAFETY,
        dueDate: new Date('2024-09-08'),
        estimatedReviewTime: 25
      }
    ];
    loadUserReviews();
  });

  // Filter functions
  const filteredQueue = $derived(
    reviewQueue.filter(item => {
      const typeMatch = selectedType === 'all' || item.reviewType === selectedType;
      const priorityMatch = selectedPriority === 'all' || item.priority === selectedPriority;
      return typeMatch && priorityMatch;
    })
  );
  
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-yellow-600 text-black';
      case 'normal': return 'bg-blue-600 text-white';
      case 'low': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }
  
  function getReviewTypeColor(reviewType: ReviewType) {
    switch (reviewType) {
      case ReviewType.THEOLOGICAL: return 'bg-purple-600 text-white';
      case ReviewType.CONTENT_MODERATION: return 'bg-green-600 text-white';
      case ReviewType.FAMILY_SAFETY: return 'bg-pink-600 text-white';
      case ReviewType.TECHNICAL_QA: return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }
  
  function formatDate(date: Date | undefined) {
    return date ? date.toLocaleDateString() : 'No due date';
  }
  
  function getDaysUntilDue(dueDate: Date | undefined) {
    if (!dueDate) return null;
    const today = new Date();
    const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }
  
  function startReview(itemId: string) {
    // TODO: Navigate to review interface
    window.location.href = `/admin/review/${itemId}`;
  }
  
  function assignReview(itemId: string) {
    // TODO: Implement assignment modal
    alert('Assignment feature coming soon!');
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-4xl font-bold text-white mb-2">Review Queue</h1>
      <p class="text-xl text-gray-300">Content and user reviews awaiting moderation</p>
    </div>
    
    <!-- Queue Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-red-600/20 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-red-400">{reviewQueue.filter(i => i.priority === 'urgent').length}</div>
        <div class="text-xs text-red-200">Urgent</div>
      </div>
      <div class="bg-yellow-600/20 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-yellow-400">{reviewQueue.filter(i => i.priority === 'high').length}</div>
        <div class="text-xs text-yellow-200">High</div>
      </div>
      <div class="bg-blue-600/20 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-blue-400">{reviewQueue.filter(i => i.priority === 'normal').length}</div>
        <div class="text-xs text-blue-200">Normal</div>
      </div>
      <div class="bg-gray-600/20 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-gray-400">{reviewQueue.length}</div>
        <div class="text-xs text-gray-200">Total</div>
      </div>
    </div>
  </div>
  
  <!-- Tabs -->
  <div class="flex gap-2 border-b border-white/10 pb-0">
    <button
      onclick={() => activeTab = 'content'}
      class="px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors {activeTab === 'content' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}"
    >
      Content Queue ({reviewQueue.length})
    </button>
    <button
      onclick={() => activeTab = 'user-reviews'}
      class="px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors {activeTab === 'user-reviews' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}"
    >
      User Reviews ({userReviews.filter(r => !r.isApproved).length} pending)
    </button>
  </div>

  {#if activeTab === 'user-reviews'}
    <!-- User Reviews Moderation -->
    {#if userReviewsLoading}
      <div class="text-center py-12 text-gray-400">Loading reviews...</div>
    {:else if userReviews.length === 0}
      <div class="text-center py-12">
        <div class="text-4xl mb-4">✅</div>
        <div class="text-xl text-white mb-2">All caught up</div>
        <div class="text-gray-400">No pending user reviews to moderate</div>
      </div>
    {:else}
      <div class="space-y-4">
        {#each userReviews as review (review.id)}
          <div class="bg-white/5 rounded-xl p-5 space-y-3">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  <span class="text-xs text-gray-400 uppercase">{review.contentType}</span>
                  <span class="text-xs text-gray-500">Content: {review.contentId.slice(0, 8)}…</span>
                </div>
                {#if review.reviewText}
                  <p class="text-white text-sm leading-relaxed">{review.reviewText}</p>
                {:else}
                  <p class="text-gray-500 text-sm italic">No text — rating only</p>
                {/if}
                <p class="text-xs text-gray-500">Submitted {new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <div class="flex gap-2 shrink-0">
                <button
                  onclick={() => moderateReview(review.id, true)}
                  class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                >
                  Approve
                </button>
                <button
                  onclick={() => deleteReview(review.id)}
                  class="bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}

  <!-- Filters -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="reviewType" class="block text-sm font-medium text-white mb-2">Review Type</label>
        <select 
          id="reviewType"
          bind:value={selectedType}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value={ReviewType.THEOLOGICAL}>Theological Review</option>
          <option value={ReviewType.CONTENT_MODERATION}>Content Moderation</option>
          <option value={ReviewType.FAMILY_SAFETY}>Family Safety</option>
          <option value={ReviewType.TECHNICAL_QA}>Technical QA</option>
        </select>
      </div>
      
      <div>
        <label for="priority" class="block text-sm font-medium text-white mb-2">Priority</label>
        <select 
          id="priority"
          bind:value={selectedPriority}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600 focus:border-transparent"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  </div>
  
  <!-- Review Queue Table -->
  <div class="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-white/10">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-medium text-white">Content</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-white">Creator</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-white">Review Type</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-white">Priority</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-white">Due Date</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-white">Status</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          {#each filteredQueue as item}
            {@const daysUntilDue = getDaysUntilDue(item.dueDate)}
            <tr class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4">
                <div>
                  <div class="font-medium text-white">{item.title}</div>
                  <div class="text-sm text-gray-400">{item.contentType}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-white">{item.creatorName}</div>
                <div class="text-xs text-gray-400">Submitted {formatDate(item.submittedAt)}</div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 text-xs rounded-full {getReviewTypeColor(item.reviewType)}">
                  {item.reviewType.replace('_', ' ')}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 text-xs rounded-full {getPriorityColor(item.priority)}">
                  {item.priority.toUpperCase()}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-white">{formatDate(item.dueDate)}</div>
                {#if daysUntilDue !== null}
                  <div class="text-xs {daysUntilDue <= 1 ? 'text-red-400' : daysUntilDue <= 3 ? 'text-yellow-400' : 'text-gray-400'}">
                    {daysUntilDue <= 0 ? 'Overdue' : `${daysUntilDue} days left`}
                  </div>
                {:else}
                  <div class="text-xs text-gray-400">No deadline</div>
                {/if}
              </td>
              <td class="px-6 py-4">
                {#if item.assignedTo}
                  <div class="text-sm text-green-400">Assigned</div>
                  <div class="text-xs text-gray-400">{item.assignedTo}</div>
                {:else}
                  <div class="text-sm text-yellow-400">Unassigned</div>
                {/if}
              </td>
              <td class="px-6 py-4">
                <div class="flex space-x-2">
                  <button 
                    onclick={() => startReview(item.id)}
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Review
                  </button>
                  {#if !item.assignedTo}
                    <button 
                      onclick={() => assignReview(item.id)}
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Assign
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      
      {#if filteredQueue.length === 0}
        <div class="text-center py-12">
          <div class="text-4xl mb-4">📋</div>
          <div class="text-xl text-white mb-2">No items in queue</div>
          <div class="text-gray-400">No content matches your current filters</div>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <button class="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">
      <div class="text-2xl mb-2">⛪</div>
      <div class="font-medium">Theological Reviews</div>
      <div class="text-sm opacity-80">{reviewQueue.filter(i => i.reviewType === ReviewType.THEOLOGICAL).length} pending</div>
    </button>
    
    <button class="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors">
      <div class="text-2xl mb-2">🛡️</div>
      <div class="font-medium">Content Moderation</div>
      <div class="text-sm opacity-80">{reviewQueue.filter(i => i.reviewType === ReviewType.CONTENT_MODERATION).length} pending</div>
    </button>
    
    <button class="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-lg text-center transition-colors">
      <div class="text-2xl mb-2">👨‍👩‍👧‍👦</div>
      <div class="font-medium">Family Safety</div>
      <div class="text-sm opacity-80">{reviewQueue.filter(i => i.reviewType === ReviewType.FAMILY_SAFETY).length} pending</div>
    </button>
    
    <button class="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors">
      <div class="text-2xl mb-2">🔧</div>
      <div class="font-medium">Technical QA</div>
      <div class="text-sm opacity-80">{reviewQueue.filter(i => i.reviewType === ReviewType.TECHNICAL_QA).length} pending</div>
    </button>
  </div>

  {/if}
</div>