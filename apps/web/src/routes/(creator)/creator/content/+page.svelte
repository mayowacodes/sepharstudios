<!-- Creator Content Library Management -->
<script lang="ts">
  import { untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { ContentStatus, ContentType } from '$lib/types/creator';
  import { Video, Upload, ChevronLeft, ChevronRight } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';

  const PAGE_SIZE = 25;

  // Initial values from the URL — selecting a filter writes back to the URL
  // so the page can be refreshed / shared and land on the same view.
  const initial = browser ? page.url.searchParams : new URLSearchParams();
  let contentLibrary = $state<any[]>([]);
  let selectedFilter = $state(initial.get('status') ?? 'all');
  let searchTerm = $state(initial.get('q') ?? '');
  let selectedType = $state(initial.get('type') ?? 'all');
  let currentPage = $state(parseInt(initial.get('page') ?? '1', 10) || 1);
  let totalPages = $state(1);
  let totalItems = $state(0);
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
  async function bulkAction(action: 'publish' | 'unlist' | 'private' | 'archive' | 'delete-permanent') {
    if (selectedIds.length === 0) return;
    const n = selectedIds.length;
    const plural = n > 1 ? 's' : '';

    // Two destructive options with honest, distinct confirmations.
    // The old "Delete" button was a lie — it was identical to Archive
    // (soft delete, hides from viewers, keeps the row). Now there are
    // two separate actions:
    //   - archive          → soft, reversible, the safe default
    //   - delete-permanent → hard, requires typing the count to confirm,
    //                         server-side refuses if any PPV purchases exist
    if (action === 'archive') {
      if (!confirm(
        `Archive ${n} item${plural}? This hides them from viewers but keeps the file in your library so you can restore later. Nothing is deleted from the database.`
      )) return;
    } else if (action === 'delete-permanent') {
      const typed = prompt(
        `PERMANENT DELETE — this removes ${n} item${plural} from the database. ` +
        `This cannot be undone. Past PPV purchases (if any) will block the delete.\n\n` +
        `Type ${n} to confirm:`
      );
      if (typed !== String(n)) return;
    }

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
      await loadContent();
    } catch (err: any) {
      alert(err.message ?? 'Failed');
    } finally {
      bulkBusy = false;
    }
  }

  function mapItem(item: any) {
    return {
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
    };
  }

  async function loadContent() {
    isLoading = true;
    try {
      const params = new URLSearchParams();
      if (selectedFilter !== 'all') params.set('status', selectedFilter);
      if (selectedType !== 'all') params.set('type', selectedType);
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      params.set('page', String(currentPage));
      params.set('pageSize', String(PAGE_SIZE));
      const res = await fetch(`/api/creator/content?${params}`);
      if (!res.ok) return;
      const body = await res.json();
      const items = Array.isArray(body) ? body : (body.items ?? []);
      contentLibrary = items.map(mapItem);
      if (!Array.isArray(body) && body.pagination) {
        totalPages = body.pagination.totalPages ?? 1;
        totalItems = body.pagination.total ?? items.length;
      } else {
        totalPages = 1;
        totalItems = items.length;
      }
    } finally {
      isLoading = false;
    }
  }

  // Filtered view = server-paginated rows; no further client-side filter needed.
  const filteredContent = $derived(contentLibrary);

  function syncUrl() {
    if (!browser) return;
    const params = new URLSearchParams();
    if (selectedFilter !== 'all') params.set('status', selectedFilter);
    if (selectedType !== 'all') params.set('type', selectedType);
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (currentPage > 1) params.set('page', String(currentPage));
    const qs = params.toString();
    const next = qs ? `${page.url.pathname}?${qs}` : page.url.pathname;
    if (next !== page.url.pathname + page.url.search) {
      goto(next, { replaceState: true, keepFocus: true, noScroll: true });
    }
  }

  // Debounce search so we don't fetch on every keystroke.
  let searchTimer: ReturnType<typeof setTimeout> | null = null;
  function onSearchInput() {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentPage = 1;
      void loadContent();
      syncUrl();
    }, 300);
  }

  // Filter changes reset to page 1; page changes just refetch. Both flow
  // through `loadContent` after URL sync. untrack() prevents the
  // filter-change branch from re-running when `currentPage` is set inside it.
  let prevFilter = untrack(() => selectedFilter);
  let prevType = untrack(() => selectedType);
  $effect(() => {
    if (selectedFilter !== prevFilter || selectedType !== prevType) {
      prevFilter = selectedFilter;
      prevType = selectedType;
      untrack(() => { currentPage = 1; });
    }
    selectedFilter; selectedType; currentPage;
    void loadContent();
    syncUrl();
  });
  
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
  
  async function deleteContent(id: string) {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) return;
    // Optimistic removal + server delete; reload to pick up the canonical
    // archived state in case the server applies a status change beyond
    // simple removal (the API soft-archives drafts).
    const snapshot = contentLibrary;
    contentLibrary = contentLibrary.filter((c) => c.id !== id);
    try {
      const res = await fetch(`/api/creator/content/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        contentLibrary = snapshot;
        const body = await res.json().catch(() => ({}));
        alert(`Delete failed: ${body.error ?? `HTTP ${res.status}`}`);
        return;
      }
      await loadContent();
    } catch (err) {
      contentLibrary = snapshot;
      alert(`Delete failed: ${err instanceof Error ? err.message : 'unknown'}`);
    }
  }
</script>

<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">
  <PortalHero
    compact
    eyebrow="Library"
    title="Your content"
    subtitle="Submitted, in review, published, archived — everything you've made."
    icon={Video}
  >
    {#snippet actions()}
      <PortalButton href="/creator/upload" variant="primary" size="sm">
        <Upload class="w-3.5 h-3.5" /> Upload
      </PortalButton>
    {/snippet}
  </PortalHero>

  <!-- Filters and Search -->
  <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label for="search" class="block text-sm font-medium text-foreground mb-2">Search Content</label>
        <input
          type="text"
          id="search"
          bind:value={searchTerm}
          oninput={onSearchInput}
          placeholder="Search by title or description..."
          class="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <!-- Status Filter. Explicit bg-background + dropdown chevron because
           the previous `surface-2` tint rendered as a near-invisible
           translucent overlay that looked like no select was there at
           all on some themes; `option` gets explicit colors so the
           native dropdown panel isn't unreadable. -->
      <div>
        <label for="status-filter" class="block text-sm font-medium text-foreground mb-2">Filter by Status</label>
        <div class="relative">
          <select
            id="status-filter"
            bind:value={selectedFilter}
            class="w-full appearance-none px-4 py-2 pr-10 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          >
            <option value="all" class="bg-background text-foreground">All Statuses</option>
            <option value={ContentStatus.DRAFT} class="bg-background text-foreground">Draft</option>
            <option value={ContentStatus.SUBMITTED} class="bg-background text-foreground">Submitted</option>
            <option value={ContentStatus.THEOLOGICAL_REVIEW} class="bg-background text-foreground">Theological Review</option>
            <option value={ContentStatus.CONTENT_REVIEW} class="bg-background text-foreground">Content Review</option>
            <option value={ContentStatus.TECHNICAL_QA} class="bg-background text-foreground">Technical QA</option>
            <option value={ContentStatus.APPROVED} class="bg-background text-foreground">Approved</option>
            <option value={ContentStatus.PUBLISHED} class="bg-background text-foreground">Published</option>
            <option value={ContentStatus.REJECTED} class="bg-background text-foreground">Rejected</option>
          </select>
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Type Filter -->
      <div>
        <label for="type-filter" class="block text-sm font-medium text-foreground mb-2">Filter by Type</label>
        <div class="relative">
          <select
            id="type-filter"
            bind:value={selectedType}
            class="w-full appearance-none px-4 py-2 pr-10 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          >
            <option value="all" class="bg-background text-foreground">All Types</option>
            <option value={ContentType.MOVIE} class="bg-background text-foreground">Movies</option>
            <option value={ContentType.SERIES} class="bg-background text-foreground">Series</option>
            <option value={ContentType.DOCUMENTARY} class="bg-background text-foreground">Documentaries</option>
            <option value={ContentType.SHORT_FILM} class="bg-background text-foreground">Short Films</option>
            <option value={ContentType.SERMON} class="bg-background text-foreground">Sermons</option>
            <option value={ContentType.WORSHIP} class="bg-background text-foreground">Worship</option>
            <option value={ContentType.KIDS_CONTENT} class="bg-background text-foreground">Kids Content</option>
          </select>
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div>
        <div class="text-sm font-medium text-foreground mb-2">Quick Stats</div>
        <div class="text-2xl font-bold text-purple-400">{totalItems}</div>
        <div class="text-xs text-muted-foreground">Matching submissions</div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p class="text-foreground ml-4">Loading your content...</p>
    </div>
  {:else}
    <!-- Bulk action bar. On mobile, pinning to top-0 keeps the bar flush
         with the viewport edge (top-4 left a transparent strip showing
         the content underneath) and the buttons drop below the count on
         narrow widths instead of wrapping into a tall block that
         overlaps the cards below. -->
    {#if selectedIds.length > 0}
      <div class="sticky top-0 sm:top-4 z-20 bg-purple-900/95 sm:bg-purple-900/90 backdrop-blur border border-purple-500/40 rounded-none sm:rounded-xl -mx-4 sm:mx-0 px-4 py-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 shadow-lg">
        <div class="flex items-center gap-3">
          <span class="text-sm text-foreground font-medium">{selectedIds.length} selected</span>
          <button type="button" onclick={toggleAll} class="text-xs text-purple-200 hover:text-foreground underline">
            {filteredContent.every((c: any) => selected[c.id]) ? 'Clear' : 'Select all visible'}
          </button>
        </div>
        <div class="flex flex-wrap gap-2 sm:ml-auto">
          <button type="button" onclick={() => bulkAction('publish')} disabled={bulkBusy} class="px-3 py-1.5 rounded text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white">Make public</button>
          <button type="button" onclick={() => bulkAction('unlist')} disabled={bulkBusy} class="px-3 py-1.5 rounded text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white">Unlist</button>
          <button type="button" onclick={() => bulkAction('private')} disabled={bulkBusy} class="px-3 py-1.5 rounded text-xs bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-foreground">Make private</button>
          <button
            type="button"
            onclick={() => bulkAction('archive')}
            disabled={bulkBusy}
            title="Hide from viewers but keep in your library. Reversible."
            class="px-3 py-1.5 rounded text-xs bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white"
          >Archive</button>
          <button
            type="button"
            onclick={() => bulkAction('delete-permanent')}
            disabled={bulkBusy}
            title="Permanently remove from the database. Cannot be undone. Blocked if any PPV purchases exist."
            class="px-3 py-1.5 rounded text-xs bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white border border-red-400/40"
          >Delete permanently</button>
        </div>
      </div>
    {/if}

    <!-- Content Grid -->
    <div class="space-y-4">
      {#each filteredContent as content}
        <div class="surface-2 backdrop-blur-sm rounded-xl p-6 hover:surface-3 transition-all {selected[content.id] ? 'ring-2 ring-purple-500' : ''}">
          <div class="flex flex-col lg:flex-row lg:items-start gap-4">
            <!-- Selection checkbox -->
            <div class="shrink-0 pt-2">
              <input
                type="checkbox"
                bind:checked={selected[content.id]}
                class="w-4 h-4 accent-purple-500"
                aria-label={`Select ${content.title}`}
              />
            </div>
            <!-- Thumbnail -->
            <div class="shrink-0">
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
                    <h3 class="text-xl font-bold text-foreground">{content.title}</h3>
                  </div>
                  <p class="text-foreground/80 mb-3">{content.description}</p>
                  
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
                  <div class="text-muted-foreground">Duration</div>
                  <div class="text-foreground font-medium">{content.duration} min</div>
                </div>
                <div>
                  <div class="text-muted-foreground">Submitted</div>
                  <div class="text-foreground font-medium">{formatDate(content.submittedAt)}</div>
                </div>
                <div>
                  <div class="text-muted-foreground">Last Updated</div>
                  <div class="text-foreground font-medium">{formatDate(content.lastUpdated)}</div>
                </div>
                {#if content.views}
                  <div>
                    <div class="text-muted-foreground">Views</div>
                    <div class="text-foreground font-medium">{content.views.toLocaleString()}</div>
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
                    class="surface-2 hover:surface-3 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
          <h3 class="text-xl font-bold text-foreground mb-2">No Content Found</h3>
          <p class="text-muted-foreground mb-6">
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

    {#if totalPages > 1}
      <div class="flex items-center justify-between text-sm text-muted-foreground mt-4">
        <div>
          Page {currentPage} of {totalPages} — {totalItems} total
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onclick={() => (currentPage = Math.max(1, currentPage - 1))}
            class="px-3 py-1.5 rounded-lg surface-2 hover:surface-3 disabled:opacity-40 inline-flex items-center gap-1"
          >
            <ChevronLeft class="w-4 h-4" /> Prev
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages || isLoading}
            onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
            class="px-3 py-1.5 rounded-lg surface-2 hover:surface-3 disabled:opacity-40 inline-flex items-center gap-1"
          >
            Next <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>
