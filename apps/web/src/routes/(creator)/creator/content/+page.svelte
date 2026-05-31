<!-- Creator Content Library Management -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { ContentStatus, ContentType } from '$lib/types/creator';
  
  let contentLibrary = $state<any[]>([]);
  let selectedFilter = $state('all');
  let searchTerm = $state('');
  let selectedType = $state('all');
  let isLoading = $state(true);

  // Bulk-action state (Item 5B)
  let selected = $state<Record<string, boolean>>({});
  const selectedIds = $derived(Object.keys(selected).filter((id) => selected[id]));
  let bulkBusy = $state(false);

  function toggleOne(id: string) {
    selected[id] = !selected[id];
    selected = { ...selected };
  }
  function toggleAll() {
    const ids = filteredContent.map((c: any) => c.id);
    const allSelected = ids.every((id: string) => selected[id]);
    selected = allSelected ? {} : Object.fromEntries(ids.map((id: string) => [id, true]));
  }
  async function bulkAction(action: 'publish' | 'unlist' | 'private' | 'archive' | 'delete') {
    if (selectedIds.length === 0) return;
    const destructive = action === 'archive' || action === 'delete';
    if (destructive && !confirm(`${action === 'delete' ? 'Delete' : 'Archive'} ${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''}? This will hide them from viewers.`)) return;
    bulkBusy = true;
    try {
      const res = await fetch('/api/creator/content/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Bulk action failed');
      selected = {};
      // Reload list so visibility / status reflects the bulk change.
      const r = await fetch('/api/creator/content');
      if (r.ok) {
        const items = await r.json();
        contentLibrary = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          contentType: item.mediaType ?? ContentType.MOVIE,
          status: item.status ?? ContentStatus.SUBMITTED,
          submittedAt: item.createdAt ? new Date(item.createdAt) : null,
          lastUpdated: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          thumbnailUrl: item.thumbnail || item.posterUrl || item.backdropUrl || '',
          duration: item.duration ? Number(item.duration) : 0,
          tags: item.genres ?? item.keywords ?? [],
          reviewNotes: item.reviewNotes || undefined,
          rejectionReason: item.rejectionReason || undefined,
          views: item.viewCount || 0
        }));
      }
    } catch (err: any) {
      alert(err.message ?? 'Failed');
    } finally {
      bulkBusy = false;
    }
  }
  
  // Filter content based on status and search
  const filteredContent = $derived(
    contentLibrary.filter(content => {
      const statusMatch = selectedFilter === 'all' || content.status === selectedFilter;
      const typeMatch = selectedType === 'all' || content.contentType === selectedType;
      const searchMatch = searchTerm === '' ||
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.description.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && typeMatch && searchMatch;
    })
  );
  
  onMount(async () => {
    isLoading = true;
    try {
      const res = await fetch('/api/creator/content');
      if (res.ok) {
        const data = await res.json();
        contentLibrary = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          contentType: item.mediaType ?? ContentType.MOVIE,
          status: item.status ?? ContentStatus.SUBMITTED,
          submittedAt: item.createdAt ? new Date(item.createdAt) : null,
          lastUpdated: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          thumbnailUrl: item.thumbnail || item.posterUrl || item.backdropUrl || '',
          duration: item.duration ? Number(item.duration) : 0,
          tags: item.genres ?? item.keywords ?? [],
          reviewNotes: item.reviewNotes || undefined,
          rejectionReason: item.rejectionReason || undefined,
          views: item.viewCount || 0
        }));
      }
    } finally {
      isLoading = false;
    }
  });
  
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
  
  function getStatusIcon(status: ContentStatus) {
    switch (status) {
      case ContentStatus.DRAFT: return '📝';
      case ContentStatus.SUBMITTED: return '📤';
      case ContentStatus.THEOLOGICAL_REVIEW: return '📖';
      case ContentStatus.CONTENT_REVIEW: return '👁️';
      case ContentStatus.TECHNICAL_QA: return '🔧';
      case ContentStatus.APPROVED: return '✅';
      case ContentStatus.PUBLISHED: return '🚀';
      case ContentStatus.REJECTED: return '❌';
      default: return '📄';
    }
  }
  
  function getContentTypeIcon(type: ContentType) {
    switch (type) {
      case ContentType.MOVIE: return '🎬';
      case ContentType.SERIES: return '📺';
      case ContentType.DOCUMENTARY: return '📚';
      case ContentType.SHORT_FILM: return '🎞️';
      case ContentType.SERMON: return '⛪';
      case ContentType.WORSHIP: return '🎵';
      case ContentType.KIDS_CONTENT: return '🧸';
      default: return '📄';
    }
  }
  
  function formatDate(date: Date | null) {
    if (!date) return 'Not submitted';
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(new Date(date));
  }
  
  // Drafts + rejected go through the full upload wizard (they need video re-
  // upload or first-time submit). Everything else opens the new detail page
  // where metadata + assets can be edited in place without re-encoding.
  function editContent(id: string) {
    goto(`/creator/upload?edit=${id}`);
  }
  function manageContent(id: string) {
    goto(`/creator/content/${id}`);
  }

  async function duplicateContent(id: string) {
    try {
      const res = await fetch(`/api/creator/content/${id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to duplicate');
      // Reload so the new draft appears in the library, then navigate to its
      // edit page so the creator can fill the unique fields (video, etc.).
      goto(`/creator/upload?edit=${data.content.id}`);
    } catch (err: any) {
      alert(`Duplicate failed: ${err.message}`);
    }
  }
  
  function deleteContent(id: string) {
    if (confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      contentLibrary = contentLibrary.filter(c => c.id !== id);
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Content Library</h1>
      <p class="text-gray-300">Manage your submitted content and track review progress</p>
    </div>
    <div class="mt-4 sm:mt-0">
      <a 
        href="/creator/upload" 
        class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
      >
        <span class="mr-2">+</span> Upload New Content
      </a>
    </div>
  </div>

  <!-- Filters and Search -->
  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-white mb-2">Search Content</label>
        <input 
          type="text" 
          id="search"
          bind:value={searchTerm}
          placeholder="Search by title or description..."
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
      </div>
      
      <!-- Status Filter -->
      <div>
        <label for="status-filter" class="block text-sm font-medium text-white mb-2">Filter by Status</label>
        <select 
          id="status-filter"
          bind:value={selectedFilter}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="all">All Statuses</option>
          <option value={ContentStatus.DRAFT}>Draft</option>
          <option value={ContentStatus.SUBMITTED}>Submitted</option>
          <option value={ContentStatus.THEOLOGICAL_REVIEW}>Theological Review</option>
          <option value={ContentStatus.CONTENT_REVIEW}>Content Review</option>
          <option value={ContentStatus.TECHNICAL_QA}>Technical QA</option>
          <option value={ContentStatus.APPROVED}>Approved</option>
          <option value={ContentStatus.PUBLISHED}>Published</option>
          <option value={ContentStatus.REJECTED}>Rejected</option>
        </select>
      </div>
      
      <!-- Type Filter -->
      <div>
        <label for="type-filter" class="block text-sm font-medium text-white mb-2">Filter by Type</label>
        <select 
          id="type-filter"
          bind:value={selectedType}
          class="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value={ContentType.MOVIE}>Movies</option>
          <option value={ContentType.SERIES}>Series</option>
          <option value={ContentType.DOCUMENTARY}>Documentaries</option>
          <option value={ContentType.SHORT_FILM}>Short Films</option>
          <option value={ContentType.SERMON}>Sermons</option>
          <option value={ContentType.WORSHIP}>Worship</option>
          <option value={ContentType.KIDS_CONTENT}>Kids Content</option>
        </select>
      </div>
      
      <!-- Quick Stats -->
      <div>
        <div class="text-sm font-medium text-white mb-2">Quick Stats</div>
        <div class="text-2xl font-bold text-purple-400">{contentLibrary.length}</div>
        <div class="text-xs text-gray-400">Total Submissions</div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p class="text-white ml-4">Loading your content...</p>
    </div>
  {:else}
    <!-- Bulk action bar -->
    {#if selectedIds.length > 0}
      <div class="sticky top-4 z-20 bg-purple-900/90 backdrop-blur border border-purple-500/40 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 shadow-lg">
        <span class="text-sm text-white font-medium">{selectedIds.length} selected</span>
        <button type="button" onclick={toggleAll} class="text-xs text-purple-200 hover:text-white underline">
          {filteredContent.every((c: any) => selected[c.id]) ? 'Clear' : 'Select all visible'}
        </button>
        <div class="flex flex-wrap gap-2 ml-auto">
          <button type="button" onclick={() => bulkAction('publish')} disabled={bulkBusy} class="px-3 py-1.5 rounded text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white">Make public</button>
          <button type="button" onclick={() => bulkAction('unlist')} disabled={bulkBusy} class="px-3 py-1.5 rounded text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white">Unlist</button>
          <button type="button" onclick={() => bulkAction('private')} disabled={bulkBusy} class="px-3 py-1.5 rounded text-xs bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white">Make private</button>
          <button type="button" onclick={() => bulkAction('archive')} disabled={bulkBusy} class="px-3 py-1.5 rounded text-xs bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white">Archive</button>
          <button type="button" onclick={() => bulkAction('delete')} disabled={bulkBusy} class="px-3 py-1.5 rounded text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white">Delete</button>
        </div>
      </div>
    {/if}

    <!-- Content Grid -->
    <div class="space-y-4">
      {#each filteredContent as content}
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all {selected[content.id] ? 'ring-2 ring-purple-500' : ''}">
          <div class="flex flex-col lg:flex-row lg:items-start gap-4">
            <!-- Selection checkbox -->
            <div class="flex-shrink-0 pt-2">
              <input
                type="checkbox"
                checked={!!selected[content.id]}
                onchange={() => toggleOne(content.id)}
                class="w-4 h-4 accent-purple-500"
                aria-label={`Select ${content.title}`}
              />
            </div>
            <!-- Thumbnail -->
            <div class="flex-shrink-0">
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                class="w-full lg:w-48 h-32 object-cover rounded-lg"
              />
            </div>
            
            <!-- Content Info -->
            <div class="flex-1 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div class="flex items-center mb-2">
                    <span class="text-2xl mr-2">{getContentTypeIcon(content.contentType)}</span>
                    <h3 class="text-xl font-bold text-white">{content.title}</h3>
                  </div>
                  <p class="text-gray-300 mb-3">{content.description}</p>
                  
                  <!-- Tags -->
                  <div class="flex flex-wrap gap-2 mb-3">
                    {#each content.tags as tag}
                      <span class="bg-blue-600/30 text-blue-200 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    {/each}
                  </div>
                </div>
                
                <!-- Status Badge -->
                <div class="flex items-center space-x-2 mt-2 sm:mt-0">
                  <span class={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(content.status)}`}>
                    <span class="mr-1">{getStatusIcon(content.status)}</span>
                    {content.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                </div>
              </div>
              
              <!-- Metadata -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <div class="text-gray-400">Duration</div>
                  <div class="text-white font-medium">{content.duration} min</div>
                </div>
                <div>
                  <div class="text-gray-400">Submitted</div>
                  <div class="text-white font-medium">{formatDate(content.submittedAt)}</div>
                </div>
                <div>
                  <div class="text-gray-400">Last Updated</div>
                  <div class="text-white font-medium">{formatDate(content.lastUpdated)}</div>
                </div>
                {#if content.views}
                  <div>
                    <div class="text-gray-400">Views</div>
                    <div class="text-white font-medium">{content.views.toLocaleString()}</div>
                  </div>
                {/if}
              </div>
              
              <!-- Review Notes or Rejection Reason -->
              {#if content.reviewNotes}
                <div class="bg-blue-600/20 border border-blue-600 rounded-lg p-3">
                  <div class="text-blue-200 text-sm">
                    <strong>Review Notes:</strong> {content.reviewNotes}
                  </div>
                </div>
              {/if}
              
              {#if content.rejectionReason}
                <div class="bg-red-600/20 border border-red-600 rounded-lg p-3">
                  <div class="text-red-200 text-sm">
                    <strong>Rejection Reason:</strong> {content.rejectionReason}
                  </div>
                </div>
              {/if}
              
              <!-- Actions -->
              <div class="flex flex-wrap gap-3 pt-3">
                {#if content.status === ContentStatus.DRAFT}
                  <button
                    onclick={() => editContent(content.id)}
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Continue Editing
                  </button>
                {:else if content.status === ContentStatus.REJECTED}
                  <button
                    onclick={() => editContent(content.id)}
                    class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Resubmit
                  </button>
                  <button
                    onclick={() => manageContent(content.id)}
                    class="bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit details
                  </button>
                {:else}
                  <button
                    onclick={() => manageContent(content.id)}
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Manage
                  </button>
                {/if}
                
                <button 
                  onclick={() => duplicateContent(content.id)}
                  class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Duplicate
                </button>
                
                {#if content.status === ContentStatus.DRAFT}
                  <button 
                    onclick={() => deleteContent(content.id)}
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                {/if}
                
                {#if content.status === ContentStatus.PUBLISHED}
                  <a 
                    href="/movies/{content.id}" 
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block"
                  >
                    View Live
                  </a>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📚</div>
          <h3 class="text-xl font-bold text-white mb-2">No Content Found</h3>
          <p class="text-gray-400 mb-6">
            {searchTerm || selectedFilter !== 'all' || selectedType !== 'all' 
              ? 'Try adjusting your filters or search terms.' 
              : 'Start by uploading your first piece of content.'}
          </p>
          {#if !searchTerm && selectedFilter === 'all' && selectedType === 'all'}
            <a 
              href="/creator/upload" 
              class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              <span class="mr-2">+</span> Upload Your First Content
            </a>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
