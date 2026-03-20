<!-- Admin Content Management System -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { ContentStatus, ContentType } from '$lib/types/creator';
  
  // Content management data
  let allContent = $state<any[]>([]);
  let selectedContent = $state<any[]>([]);
  let isLoading = $state(true);
  let searchTerm = $state('');
  let selectedStatus = $state('all');
  let selectedType = $state('all');
  let selectedCreator = $state('all');
  let sortBy = $state('newest');
  let viewMode = $state('grid'); // grid or list
  let bulkAction = $state('');
  let showBulkActions = $state(false);
  
  // Pagination
  let currentPage = $state(1);
  let itemsPerPage = $state(12);
  let totalItems = $state(0);
  
  // Filter content
  const filteredContent = $derived.by(() => {
    let filtered = allContent.filter(content => {
      const statusMatch = selectedStatus === 'all' || content.status === selectedStatus;
      const typeMatch = selectedType === 'all' || content.contentType === selectedType;
      const creatorMatch = selectedCreator === 'all' || content.creatorId === selectedCreator;
      const searchMatch = searchTerm === '' || 
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && typeMatch && creatorMatch && searchMatch;
    });
    
    // Sort content
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'creator':
        filtered.sort((a, b) => a.creatorName.localeCompare(b.creatorName));
        break;
      case 'priority':
        // Custom priority logic for review queue
        const priorityOrder: Record<ContentStatus, number> = {
          [ContentStatus.DRAFT]: 5,
          [ContentStatus.SUBMITTED]: 4,
          [ContentStatus.THEOLOGICAL_REVIEW]: 3,
          [ContentStatus.CONTENT_REVIEW]: 2,
          [ContentStatus.TECHNICAL_QA]: 1,
          [ContentStatus.APPROVED]: 0,
          [ContentStatus.PUBLISHED]: -1,
          [ContentStatus.REJECTED]: 0,
          [ContentStatus.ARCHIVED]: -2
        };
        filtered.sort((a, b) => (priorityOrder[b.status as ContentStatus] || 0) - (priorityOrder[a.status as ContentStatus] || 0));
        break;
    }
    
    totalItems = filtered.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  });
  
  onMount(async () => {
    try {
      const res = await fetch('/api/admin/content?limit=100');
      if (res.ok) {
        const data = await res.json();
        allContent = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          creatorId: item.creatorId || '',
          creatorName: item.creatorName || 'Platform',
          creatorEmail: item.creatorEmail || '',
          contentType: item.mediaType ?? ContentType.MOVIE,
          status: (item.status as ContentStatus) || (item.isActive ? ContentStatus.PUBLISHED : ContentStatus.SUBMITTED),
          submittedAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          lastUpdated: item.createdAt ? new Date(item.createdAt) : new Date(),
          thumbnailUrl: item.thumbnail ?? '',
          duration: 0,
          fileSize: '',
          views: item.viewCount ?? 0,
          priority: 'medium',
          tags: item.genres ?? [],
          isActive: item.isActive
        }));
      }
    } finally {
      isLoading = false;
    }
  });

  let publishing = $state<string | null>(null);
  let publishError = $state('');

  // PPV state
  let ppvModalContentId = $state<string | null>(null);
  let ppvPrice = $state('');
  let ppvActive = $state(true);
  let ppvSaving = $state(false);
  let ppvError = $state('');

  function openPpvModal(id: string) {
    ppvModalContentId = id;
    ppvPrice = '';
    ppvActive = true;
    ppvError = '';
  }

  async function savePpv() {
    if (!ppvModalContentId) return;
    const cents = Math.round(parseFloat(ppvPrice) * 100);
    if (!cents || cents < 99) { ppvError = 'Minimum price is $0.99'; return; }
    ppvSaving = true;
    ppvError = '';
    try {
      const res = await fetch(`/api/admin/content/${ppvModalContentId}/ppv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalPriceCents: cents, isActive: ppvActive })
      });
      if (res.ok) {
        allContent = allContent.map(c =>
          c.id === ppvModalContentId ? { ...c, ppvPriceCents: cents, isPpv: ppvActive } : c
        );
        ppvModalContentId = null;
      } else {
        const d = await res.json();
        ppvError = d.error ?? 'Failed to save PPV';
      }
    } finally {
      ppvSaving = false;
    }
  }

  async function removePpv(id: string) {
    await fetch(`/api/admin/content/${id}/ppv`, { method: 'DELETE' });
    allContent = allContent.map(c => c.id === id ? { ...c, isPpv: false, ppvPriceCents: null } : c);
  }

  async function publishContent(id: string) {
    publishing = id;
    publishError = '';
    try {
      const res = await fetch(`/api/admin/content/${id}/publish`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        allContent = allContent.map(c =>
          c.id === id ? { ...c, isActive: true, status: ContentStatus.PUBLISHED } : c
        );
      } else {
        publishError = data.error ?? 'Failed to publish';
      }
    } finally {
      publishing = null;
    }
  }
  
  function getStatusColor(status: ContentStatus) {
    switch (status) {
      case ContentStatus.DRAFT: return 'bg-gray-600 text-white';
      case ContentStatus.SUBMITTED: return 'bg-blue-600 text-white';
      case ContentStatus.THEOLOGICAL_REVIEW: return 'bg-purple-600 text-white';
      case ContentStatus.CONTENT_REVIEW: return 'bg-yellow-600 text-black';
      case ContentStatus.TECHNICAL_QA: return 'bg-orange-600 text-white';
      case ContentStatus.APPROVED: return 'bg-green-600 text-white';
      case ContentStatus.PUBLISHED: return 'bg-emerald-600 text-white';
      case ContentStatus.REJECTED: return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
  
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  }
  
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
  
  function selectContent(contentId: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      selectedContent = [...selectedContent, contentId];
    } else {
      selectedContent = selectedContent.filter(id => id !== contentId);
    }
    showBulkActions = selectedContent.length > 0;
  }
  
  function selectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      selectedContent = filteredContent.map(c => c.id);
    } else {
      selectedContent = [];
    }
    showBulkActions = selectedContent.length > 0;
  }
  
  function executeBulkAction() {
    if (!bulkAction || selectedContent.length === 0) return;
    
    const actionText: Record<string, string> = {
      'approve': 'approve',
      'reject': 'reject',
      'delete': 'delete',
      'archive': 'archive',
      'priority-high': 'set as high priority',
      'priority-medium': 'set as medium priority',
      'priority-low': 'set as low priority'
    };
    
    if (confirm(`Are you sure you want to ${actionText[bulkAction]} ${selectedContent.length} selected item(s)?`)) {
      console.log(`Bulk ${bulkAction} for:`, selectedContent);
      // Execute bulk action via API
      selectedContent = [];
      showBulkActions = false;
      bulkAction = '';
    }
  }
  
  function editContent(id: string) {
    // Navigate to content editor
    window.location.href = `/admin/content/edit/${id}`;
  }
  
  function reviewContent(id: string) {
    // Navigate to review interface
    window.location.href = `/admin/review/${id}`;
  }
  
  function deleteContent(id: string) {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      allContent = allContent.filter(c => c.id !== id);
    }
  }
  
  // Pagination
  const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));
  
  function goToPage(page: number) {
    currentPage = Math.max(1, Math.min(page, totalPages));
  }
</script>

<div class="space-y-6">
  <!-- Header with Stats -->
  <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Content Management</h1>
      <p class="text-gray-300">Manage all submitted content across the platform</p>
    </div>
    
    <!-- Quick Stats -->
    <div class="mt-4 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-blue-600/20 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-blue-400">{allContent.filter(c => c.status === ContentStatus.SUBMITTED).length}</div>
        <div class="text-blue-200 text-xs">Pending Review</div>
      </div>
      <div class="bg-green-600/20 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-green-400">{allContent.filter(c => c.status === ContentStatus.PUBLISHED).length}</div>
        <div class="text-green-200 text-xs">Published</div>
      </div>
      <div class="bg-red-600/20 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-red-400">{allContent.filter(c => c.status === ContentStatus.REJECTED).length}</div>
        <div class="text-red-200 text-xs">Rejected</div>
      </div>
      <div class="bg-purple-600/20 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-purple-400">{allContent.length}</div>
        <div class="text-purple-200 text-xs">Total Content</div>
      </div>
    </div>
  </div>

  <!-- Filters and Controls -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <div class="flex flex-col lg:flex-row gap-4 mb-4">
      <!-- Search -->
      <div class="flex-1">
        <input 
          type="text" 
          bind:value={searchTerm}
          placeholder="Search content, creators, or descriptions..."
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"
        />
      </div>
      
      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <select 
          bind:value={selectedStatus}
          class="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
        >
          <option value="all">All Statuses</option>
          <option value={ContentStatus.SUBMITTED}>Submitted</option>
          <option value={ContentStatus.THEOLOGICAL_REVIEW}>Theological Review</option>
          <option value={ContentStatus.CONTENT_REVIEW}>Content Review</option>
          <option value={ContentStatus.TECHNICAL_QA}>Technical QA</option>
          <option value={ContentStatus.APPROVED}>Approved</option>
          <option value={ContentStatus.PUBLISHED}>Published</option>
          <option value={ContentStatus.REJECTED}>Rejected</option>
        </select>
        
        <select 
          bind:value={selectedType}
          class="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
        >
          <option value="all">All Types</option>
          <option value={ContentType.MOVIE}>Movies</option>
          <option value={ContentType.SERIES}>Series</option>
          <option value={ContentType.DOCUMENTARY}>Documentaries</option>
          <option value={ContentType.SERMON}>Sermons</option>
          <option value={ContentType.WORSHIP}>Worship</option>
          <option value={ContentType.KIDS_CONTENT}>Kids Content</option>
        </select>
        
        <select 
          bind:value={sortBy}
          class="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="creator">Creator A-Z</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      
      <!-- View Toggle -->
      <div class="flex rounded-lg overflow-hidden">
        <button 
          onclick={() => viewMode = 'grid'}
          class="px-4 py-2 {viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'}"
        >
          📊
        </button>
        <button 
          onclick={() => viewMode = 'list'}
          class="px-4 py-2 {viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'}"
        >
          📄
        </button>
      </div>
    </div>

    <!-- Bulk Actions -->
    {#if showBulkActions}
      <div class="flex items-center gap-4 bg-red-600/20 border border-red-600 rounded-lg p-4">
        <div class="text-red-200">
          <strong>{selectedContent.length}</strong> item{selectedContent.length > 1 ? 's' : ''} selected
        </div>
        <select 
          bind:value={bulkAction}
          class="px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-600"
        >
          <option value="">Choose Action...</option>
          <option value="approve">Approve All</option>
          <option value="reject">Reject All</option>
          <option value="archive">Archive All</option>
          <option value="delete">Delete All</option>
          <option value="priority-high">Set High Priority</option>
          <option value="priority-medium">Set Medium Priority</option>
          <option value="priority-low">Set Low Priority</option>
        </select>
        <button 
          onclick={executeBulkAction}
          disabled={!bulkAction}
          class="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Execute
        </button>
        <button 
          onclick={() => { selectedContent = []; showBulkActions = false; }}
          class="text-gray-300 hover:text-white"
        >
          Cancel
        </button>
      </div>
    {/if}
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p class="text-white ml-4">Loading content...</p>
    </div>
  {:else if filteredContent.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12">
      <div class="text-6xl mb-4">📚</div>
      <h3 class="text-xl font-bold text-white mb-2">No Content Found</h3>
      <p class="text-gray-400">Try adjusting your filters or search terms.</p>
    </div>
  {:else}
    <!-- Content Grid/List -->
    {#if viewMode === 'grid'}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each filteredContent as content}
          <div class="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/15 transition-all">
            <!-- Selection Checkbox -->
            <div class="p-4 pb-0">
              <input 
                type="checkbox" 
                checked={selectedContent.includes(content.id)}
                onchange={(e) => selectContent(content.id, e)}
                class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
            </div>
            
            <!-- Thumbnail -->
            <div class="px-4">
              <img 
                src={content.thumbnailUrl} 
                alt={content.title}
                class="w-full h-32 object-cover rounded-lg"
              />
            </div>
            
            <!-- Content Info -->
            <div class="p-4">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-bold text-white text-sm line-clamp-2">{content.title}</h3>
                <span class={`text-xs font-medium ${getPriorityColor(content.priority)}`}>
                  {content.priority?.toUpperCase()}
                </span>
              </div>
              
              <p class="text-gray-300 text-xs mb-3 line-clamp-2">{content.description}</p>
              
              <!-- Status & Metadata -->
              <div class="space-y-2 mb-3">
                <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                  {content.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
                
                <div class="text-xs text-gray-400 space-y-1">
                  <div>By: {content.creatorName}</div>
                  <div>{content.duration}min • {content.fileSize}</div>
                  <div>Submitted: {formatDate(content.submittedAt)}</div>
                  {#if content.views > 0}
                    <div>{content.views.toLocaleString()} views</div>
                  {/if}
                </div>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  onclick={() => reviewContent(content.id)}
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  Review
                </button>
                {#if !content.isActive}
                  <button
                    onclick={() => publishContent(content.id)}
                    disabled={publishing === content.id}
                    class="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    {publishing === content.id ? '...' : 'Publish'}
                  </button>
                {:else}
                  <button
                    onclick={() => editContent(content.id)}
                    class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    Edit
                  </button>
                {/if}
              </div>
              <!-- PPV button row -->
              <div class="flex gap-1 mt-1">
                {#if content.isPpv}
                  <span class="text-xs bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-1 rounded">
                    PPV ${(content.ppvPriceCents / 100).toFixed(2)}
                  </span>
                  <button onclick={() => removePpv(content.id)} class="text-xs text-red-400 hover:text-red-300 px-2 py-1">Remove PPV</button>
                {:else}
                  <button onclick={() => openPpvModal(content.id)} class="text-xs bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/30 px-2 py-1 rounded transition-colors">
                    + Set PPV Price
                  </button>
                {/if}
              </div>
              {#if publishError && publishing === null}
                <p class="text-xs text-red-400 mt-1">{publishError}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- List View -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
        <!-- Table Header -->
        <div class="bg-white/5 p-4">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              onchange={selectAll}
              class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 mr-4"
            />
            <div class="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
              <div class="col-span-3">Content</div>
              <div class="col-span-2">Creator</div>
              <div class="col-span-2">Status</div>
              <div class="col-span-1">Type</div>
              <div class="col-span-2">Submitted</div>
              <div class="col-span-1">Priority</div>
              <div class="col-span-1">Actions</div>
            </div>
          </div>
        </div>
        
        <!-- Table Rows -->
        <div class="divide-y divide-gray-700">
          {#each filteredContent as content}
            <div class="p-4 hover:bg-white/5 transition-colors">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  checked={selectedContent.includes(content.id)}
                  onchange={(e) => selectContent(content.id, e)}
                  class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 mr-4"
                />
                <div class="flex-1 grid grid-cols-12 gap-4 items-center">
                  <!-- Content -->
                  <div class="col-span-3 flex items-center space-x-3">
                    <img 
                      src={content.thumbnailUrl} 
                      alt={content.title}
                      class="w-12 h-8 object-cover rounded"
                    />
                    <div>
                      <div class="font-medium text-white text-sm">{content.title}</div>
                      <div class="text-xs text-gray-400">{content.duration}min</div>
                    </div>
                  </div>
                  
                  <!-- Creator -->
                  <div class="col-span-2">
                    <div class="text-white text-sm">{content.creatorName}</div>
                    <div class="text-xs text-gray-400">{content.creatorEmail}</div>
                  </div>
                  
                  <!-- Status -->
                  <div class="col-span-2">
                    <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                      {content.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                  </div>
                  
                  <!-- Type -->
                  <div class="col-span-1">
                    <span class="text-gray-300 text-sm">{content.contentType}</span>
                  </div>
                  
                  <!-- Submitted -->
                  <div class="col-span-2">
                    <span class="text-gray-300 text-sm">{formatDate(content.submittedAt)}</span>
                  </div>
                  
                  <!-- Priority -->
                  <div class="col-span-1">
                    <span class={`text-sm font-medium ${getPriorityColor(content.priority)}`}>
                      {content.priority?.toUpperCase()}
                    </span>
                  </div>
                  
                  <!-- Actions -->
                  <div class="col-span-1">
                    <div class="flex space-x-2">
                      <button 
                        onclick={() => reviewContent(content.id)}
                        class="text-red-400 hover:text-red-300 text-sm"
                        title="Review"
                      >
                        👁️
                      </button>
                      <button 
                        onclick={() => editContent(content.id)}
                        class="text-blue-400 hover:text-blue-300 text-sm"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onclick={() => deleteContent(content.id)}
                        class="text-red-400 hover:text-red-300 text-sm"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Pagination -->
    {#if totalPages > 1}
      <div class="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div class="text-gray-300 text-sm">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            onclick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            class="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            Previous
          </button>
          
          {#each Array.from({length: Math.min(5, totalPages)}, (_, i) => {
            const start = Math.max(1, currentPage - 2);
            return start + i;
          }) as page}
            {#if page <= totalPages}
              <button 
                onclick={() => goToPage(page)}
                class="px-3 py-2 rounded-lg transition-colors {currentPage === page ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}"
              >
                {page}
              </button>
            {/if}
          {/each}
          
          <button 
            onclick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            class="px-3 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<!-- PPV Price Modal -->
{#if ppvModalContentId}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="text-lg font-bold text-white mb-1">Set PPV Price</h3>
      <p class="text-gray-400 text-sm mb-4">This price overrides any creator suggestion. Viewers without a subscription will pay this amount to watch.</p>

      <label class="block text-sm text-gray-300 mb-1">Final Price (USD)</label>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-gray-400">$</span>
        <input
          type="number"
          bind:value={ppvPrice}
          min="0.99" max="49.99" step="0.01"
          placeholder="4.99"
          class="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      <label class="flex items-center gap-2 mb-4 cursor-pointer">
        <input type="checkbox" bind:checked={ppvActive} class="w-4 h-4 accent-amber-500" />
        <span class="text-sm text-gray-300">Activate immediately</span>
      </label>

      {#if ppvError}
        <p class="text-red-400 text-sm mb-3">{ppvError}</p>
      {/if}

      <div class="flex gap-3">
        <button onclick={() => ppvModalContentId = null} class="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">
          Cancel
        </button>
        <button onclick={savePpv} disabled={ppvSaving} class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
          {ppvSaving ? 'Saving...' : 'Save PPV Price'}
        </button>
      </div>
    </div>
  </div>
{/if}
