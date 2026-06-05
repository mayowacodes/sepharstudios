<!-- Admin Content Management System -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { ContentStatus, ContentType } from '$lib/types/creator';
  import { Video, Clock, CheckCircle2, XCircle, FileText } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';
  
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
  
  async function loadContent() {
    isLoading = true;
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
  }

  onMount(loadContent);

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

  // ─── Per-region pricing modal ──────────────────────────────────────
  interface RegionPrice { id: string; regionCode: string; priceCents: number; currency: string; }
  let regionModalContentId = $state<string | null>(null);
  let regionRows = $state<RegionPrice[]>([]);
  let regionLoading = $state(false);
  let regionSaving = $state(false);
  let regionError = $state('');
  let newRegionCode = $state('');
  let newRegionPrice = $state('');
  let newRegionCurrency = $state('USD');

  async function openRegionModal(id: string) {
    regionModalContentId = id;
    regionError = '';
    newRegionCode = '';
    newRegionPrice = '';
    newRegionCurrency = 'USD';
    regionLoading = true;
    try {
      const res = await fetch(`/api/admin/content/${id}/pricing`);
      if (res.ok) {
        const body = await res.json();
        regionRows = body.rows ?? [];
      }
    } finally {
      regionLoading = false;
    }
  }

  async function addRegionPrice() {
    if (!regionModalContentId) return;
    const code = newRegionCode.trim().toUpperCase();
    const cents = Math.round(parseFloat(newRegionPrice) * 100);
    if (code !== '*' && !/^[A-Z]{2}$/.test(code)) { regionError = 'Code must be * or 2-letter ISO country (e.g. US, NG).'; return; }
    if (!Number.isFinite(cents) || cents < 99) { regionError = 'Price must be ≥ $0.99'; return; }
    regionError = '';
    regionSaving = true;
    try {
      const res = await fetch(`/api/admin/content/${regionModalContentId}/pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regionCode: code, priceCents: cents, currency: newRegionCurrency.trim().toUpperCase() })
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { regionError = body.error ?? 'Failed'; return; }
      // Refresh list
      await openRegionModal(regionModalContentId);
      newRegionCode = '';
      newRegionPrice = '';
    } finally {
      regionSaving = false;
    }
  }

  async function removeRegionPrice(regionCode: string) {
    if (!regionModalContentId) return;
    // Optimistic removal + revert on failure so the admin doesn't see a
    // "deleted" row that's still live on the server. Surfaces the server
    // error so the next attempt can be informed.
    const snapshot = regionRows;
    regionRows = regionRows.filter((r) => r.regionCode !== regionCode);
    try {
      const res = await fetch(`/api/admin/content/${regionModalContentId}/pricing?regionCode=${encodeURIComponent(regionCode)}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        regionRows = snapshot;
        regionError = body.error ?? `Failed to remove ${regionCode} (HTTP ${res.status})`;
      }
    } catch (err) {
      regionRows = snapshot;
      regionError = `Network error removing ${regionCode}: ${err instanceof Error ? err.message : 'unknown'}`;
    }
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
      case ContentStatus.DRAFT: return 'bg-gray-600 text-foreground';
      case ContentStatus.SUBMITTED: return 'bg-blue-600 text-white';
      case ContentStatus.THEOLOGICAL_REVIEW: return 'bg-purple-600 text-white';
      case ContentStatus.CONTENT_REVIEW: return 'bg-yellow-600 text-black';
      case ContentStatus.TECHNICAL_QA: return 'bg-orange-600 text-white';
      case ContentStatus.APPROVED: return 'bg-green-600 text-white';
      case ContentStatus.PUBLISHED: return 'bg-emerald-600 text-white';
      case ContentStatus.REJECTED: return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-foreground';
    }
  }
  
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-muted-foreground';
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
  
  async function executeBulkAction() {
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

    if (!confirm(`Are you sure you want to ${actionText[bulkAction]} ${selectedContent.length} selected item(s)?`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/content/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedContent, action: bulkAction })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Bulk action failed');

      selectedContent = [];
      showBulkActions = false;
      bulkAction = '';
      await loadContent();
      alert(`${data.affected} item(s) updated.`);
    } catch (err: any) {
      alert(`Bulk action failed: ${err.message}`);
    }
  }
  
  function editContent(id: string) {
    // No dedicated edit page exists — the review detail page lets the
    // admin inspect/edit a content row end-to-end. Route there via
    // SvelteKit so the SPA navigation runs (preserves auth, layout, no
    // full reload).
    void goto(`/admin/review/${id}`);
  }

  function reviewContent(id: string) {
    void goto(`/admin/review/${id}`);
  }

  async function deleteContent(id: string) {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) return;
    // Optimistic UI — pull from local state immediately, then call the
    // server DELETE. If the server rejects, restore the row and toast.
    const previous = allContent;
    allContent = allContent.filter((c) => c.id !== id);
    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Delete failed (HTTP ${res.status})`);
      }
    } catch (err) {
      allContent = previous;
      alert(`Delete failed: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }
  
  // Pagination
  const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));
  
  function goToPage(page: number) {
    currentPage = Math.max(1, Math.min(page, totalPages));
  }
</script>

<div class="container mx-auto px-4 py-4 space-y-6">
  <PageHeader
    icon={Video}
    title="Content Management"
    subtitle="Manage all submitted content across the platform."
  />

  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <KpiCard label="Pending Review" value={allContent.filter(c => c.status === ContentStatus.SUBMITTED).length} icon={Clock} accent="blue" variant="compact" index={0} />
    <KpiCard label="Published" value={allContent.filter(c => c.status === ContentStatus.PUBLISHED).length} icon={CheckCircle2} accent="green" variant="compact" index={1} />
    <KpiCard label="Rejected" value={allContent.filter(c => c.status === ContentStatus.REJECTED).length} icon={XCircle} accent="red" variant="compact" index={2} />
    <KpiCard label="Total Content" value={allContent.length} icon={FileText} accent="purple" variant="compact" index={3} />
  </div>

  <!-- Filters and Controls -->
  <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
    <div class="flex flex-col lg:flex-row gap-4 mb-4">
      <!-- Search -->
      <div class="flex-1">
        <input 
          type="text" 
          bind:value={searchTerm}
          placeholder="Search content, creators, or descriptions..."
          class="w-full px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:border-transparent"
        />
      </div>
      
      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <select 
          bind:value={selectedStatus}
          class="px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600"
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
          class="px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600"
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
          class="px-4 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600"
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
          class="px-4 py-2 {viewMode === 'grid' ? 'bg-red-600 text-foreground' : 'surface-2 text-white/80'}"
        >
          📊
        </button>
        <button 
          onclick={() => viewMode = 'list'}
          class="px-4 py-2 {viewMode === 'list' ? 'bg-red-600 text-foreground' : 'surface-2 text-white/80'}"
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
          class="px-3 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-red-600"
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
          class="text-foreground/80 hover:text-foreground"
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
      <p class="text-foreground ml-4">Loading content...</p>
    </div>
  {:else if filteredContent.length === 0}
    <!-- Empty State -->
    <div class="text-center py-12">
      <div class="text-6xl mb-4">📚</div>
      <h3 class="text-xl font-bold text-foreground mb-2">No Content Found</h3>
      <p class="text-muted-foreground">Try adjusting your filters or search terms.</p>
    </div>
  {:else}
    <!-- Content Grid/List -->
    {#if viewMode === 'grid'}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each filteredContent as content}
          <div class="surface-2 backdrop-blur-sm rounded-xl overflow-hidden hover:surface-3 transition-all">
            <!-- Selection Checkbox -->
            <div class="p-4 pb-0">
              <input 
                type="checkbox" 
                checked={selectedContent.includes(content.id)}
                onchange={(e) => { selectContent(content.id, e); return (e.target as HTMLInputElement).checked; }}
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
                <h3 class="font-bold text-foreground text-sm line-clamp-2">{content.title}</h3>
                <span class={`text-xs font-medium ${getPriorityColor(content.priority)}`}>
                  {content.priority?.toUpperCase()}
                </span>
              </div>
              
              <p class="text-foreground/80 text-xs mb-3 line-clamp-2">{content.description}</p>
              
              <!-- Status & Metadata -->
              <div class="space-y-2 mb-3">
                <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                  {content.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
                
                <div class="text-xs text-muted-foreground space-y-1">
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
              <div class="flex gap-1 mt-1 flex-wrap">
                {#if content.isPpv}
                  <span class="text-xs bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-1 rounded">
                    PPV ${(content.ppvPriceCents / 100).toFixed(2)}
                  </span>
                  <button onclick={() => openRegionModal(content.id)} class="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 px-2 py-1 rounded transition-colors">
                    Region prices
                  </button>
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
      <div class="surface-2 backdrop-blur-sm rounded-xl overflow-hidden">
        <!-- Table Header -->
        <div class="surface-1 p-4">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              onchange={selectAll}
              class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 mr-4"
            />
            <div class="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-foreground/80">
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
            <div class="p-4 hover:surface-1 transition-colors">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
checked={selectedContent.includes(content.id)}
                onchange={(e) => { selectContent(content.id, e); return (e.target as HTMLInputElement).checked; }}
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
                      <div class="font-medium text-foreground text-sm">{content.title}</div>
                      <div class="text-xs text-muted-foreground">{content.duration}min</div>
                    </div>
                  </div>
                  
                  <!-- Creator -->
                  <div class="col-span-2">
                    <div class="text-foreground text-sm">{content.creatorName}</div>
                    <div class="text-xs text-muted-foreground">{content.creatorEmail}</div>
                  </div>
                  
                  <!-- Status -->
                  <div class="col-span-2">
                    <span class={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                      {content.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                  </div>
                  
                  <!-- Type -->
                  <div class="col-span-1">
                    <span class="text-foreground/80 text-sm">{content.contentType}</span>
                  </div>
                  
                  <!-- Submitted -->
                  <div class="col-span-2">
                    <span class="text-foreground/80 text-sm">{formatDate(content.submittedAt)}</span>
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
      <div class="flex items-center justify-between surface-2 backdrop-blur-sm rounded-xl p-4">
        <div class="text-foreground/80 text-sm">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            onclick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            class="px-3 py-2 surface-2 text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:surface-3 transition-colors"
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
                class="px-3 py-2 rounded-lg transition-colors {currentPage === page ? 'bg-red-600 text-foreground' : 'surface-2 text-white/80 hover:surface-3'}"
              >
                {page}
              </button>
            {/if}
          {/each}
          
          <button 
            onclick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            class="px-3 py-2 surface-2 text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:surface-3 transition-colors"
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
    <div class="bg-gray-900 border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <h3 class="text-lg font-bold text-foreground mb-1">Set PPV Price</h3>
      <p class="text-muted-foreground text-sm mb-4">This price overrides any creator suggestion. Viewers without a subscription will pay this amount to watch.</p>

      <label for="ppv-price-input" class="block text-sm text-foreground/80 mb-1">Final Price (USD)</label>
      <div class="flex items-center gap-2 mb-3">
        <span class="text-muted-foreground">$</span>
        <input
          id="ppv-price-input"
          type="number"
          bind:value={ppvPrice}
          min="0.99" max="49.99" step="0.01"
          placeholder="4.99"
          class="flex-1 px-3 py-2 surface-2 border border-gray-600 rounded-lg text-foreground focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      <label class="flex items-center gap-2 mb-4 cursor-pointer">
        <input type="checkbox" bind:checked={ppvActive} class="w-4 h-4 accent-amber-500" />
        <span class="text-sm text-foreground/80">Activate immediately</span>
      </label>

      {#if ppvError}
        <p class="text-red-400 text-sm mb-3">{ppvError}</p>
      {/if}

      <div class="flex gap-3">
        <button onclick={() => ppvModalContentId = null} class="flex-1 px-4 py-2 surface-2 hover:surface-3 text-foreground rounded-lg text-sm transition-colors">
          Cancel
        </button>
        <button onclick={savePpv} disabled={ppvSaving} class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
          {ppvSaving ? 'Saving...' : 'Save PPV Price'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Region pricing modal -->
{#if regionModalContentId}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div class="surface-glass border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl">
      <h3 class="text-lg font-bold text-foreground mb-1">Per-region pricing</h3>
      <p class="text-muted-foreground text-sm mb-4">
        Override the global PPV price for specific countries. Use <code class="text-foreground bg-muted px-1 rounded">*</code> as the regionCode for a default-region fallback. resolvePrice() reads exact-region first, then <code class="text-foreground bg-muted px-1 rounded">*</code>, then the global PPV price.
      </p>

      <div class="mb-4 space-y-2 max-h-64 overflow-y-auto">
        {#if regionLoading}
          <div class="text-sm text-muted-foreground">Loading…</div>
        {:else if regionRows.length === 0}
          <div class="text-sm text-muted-foreground">No region overrides yet. The global PPV price applies everywhere.</div>
        {:else}
          {#each regionRows as r (r.id)}
            <div class="flex items-center gap-3 surface-1 rounded-lg px-3 py-2">
              <span class="font-mono text-sm text-foreground w-10 shrink-0">{r.regionCode}</span>
              <span class="text-sm text-foreground tabular-nums flex-1">
                {(r.priceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {r.currency}
              </span>
              <button type="button" onclick={() => removeRegionPrice(r.regionCode)} class="text-xs text-red-400 hover:text-red-300">
                Remove
              </button>
            </div>
          {/each}
        {/if}
      </div>

      <div class="border-t border-border pt-4 space-y-2">
        <div class="text-xs uppercase tracking-wide text-muted-foreground">Add override</div>
        <div class="grid grid-cols-[5rem_1fr_5rem] gap-2">
          <input
            type="text"
            bind:value={newRegionCode}
            placeholder="US or *"
            maxlength="2"
            class="surface-1 rounded-md px-2 py-1.5 text-sm text-foreground uppercase font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="number"
            bind:value={newRegionPrice}
            placeholder="Price"
            min="0.99"
            step="0.01"
            class="surface-1 rounded-md px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="text"
            bind:value={newRegionCurrency}
            placeholder="USD"
            maxlength="3"
            class="surface-1 rounded-md px-2 py-1.5 text-sm text-foreground uppercase font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {#if regionError}
          <p class="text-xs text-red-400">{regionError}</p>
        {/if}
        <button
          type="button"
          onclick={addRegionPrice}
          disabled={regionSaving || !newRegionCode || !newRegionPrice}
          class="w-full px-3 py-2 rounded bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {regionSaving ? 'Adding…' : 'Add override'}
        </button>
      </div>

      <div class="flex justify-end mt-4">
        <button onclick={() => (regionModalContentId = null)} class="px-4 py-2 surface-2 hover:surface-3 text-foreground rounded-lg text-sm transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
