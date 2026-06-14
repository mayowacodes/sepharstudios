<!--
  Admin Review Queue — Layout C (card grid with thumbnails, Netflix-admin).

  Each pending item is a tall card with a backdrop thumbnail, a live
  encoder progress bar (only when still encoding), title, creator,
  badges, due date, and a clear status pill. The whole card is a single
  link to the detail page; click anywhere to open the review.

  Live updates: subscribes to /api/admin/encoder-stream so cards tick
  their progress bars in real-time as the orchestrator pushes webhook
  events. Falls back to a 10s background poll if SSE drops.

  Filters (Type + Priority) persist to URL search params so refresh +
  back-button navigation work.
-->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ReviewType } from '$lib/types/admin';
  import {
    ShieldCheck, Inbox, Cross, Shield, Users, Wrench,
    CheckCircle2, Film, Clock, Loader2, AlertTriangle
  } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import StatChip from '$lib/components/dashboard/StatChip.svelte';
  import EmptyState from '$lib/components/dashboard/EmptyState.svelte';
  import * as Tabs from '$lib/components/ui/tabs';

  // Extended queue item — adds the playback/encoder fields the card needs.
  // We intentionally don't push these onto the public ReviewQueueItem type
  // in $lib/types/admin because they're list-display only.
  interface QueueCard {
    id: string;
    contentId: string;
    title: string;
    creatorName: string;
    contentType: string;
    submittedAt: Date;
    priority: 'urgent' | 'high' | 'normal' | 'low';
    reviewType: ReviewType;
    assignedTo?: string;
    dueDate?: Date;
    // Card-only fields below — best-effort from the list endpoint.
    posterUrl?: string;
    backdropUrl?: string;
    thumbnailUrl?: string;
    processingStatus?: string | null;
    processingProgress?: number | null;
    processingStage?: string | null;
  }

  let reviewQueue = $state<QueueCard[]>([]);
  let selectedType = $state<ReviewType | 'all'>('all');
  let selectedPriority = $state<'urgent' | 'high' | 'normal' | 'low' | 'all'>('all');
  let activeTab = $state<'content' | 'user-reviews'>('content');
  let queueLoading = $state(true);

  // User reviews state — kept from the previous implementation.
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

  async function loadReviewQueue() {
    queueLoading = true;
    try {
      const res = await fetch('/api/admin/content?pending=true&limit=200');
      if (!res.ok) return;
      const data = await res.json();
      reviewQueue = data.map((item: any): QueueCard => ({
        id: item.id,
        contentId: item.id,
        title: item.title,
        creatorName: item.creatorName || 'Platform',
        contentType: item.mediaType || 'movie',
        submittedAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        priority: 'normal',
        reviewType: ReviewType.CONTENT_MODERATION,
        assignedTo: item.assignedTo ?? undefined,
        // Best-effort display fields. The list endpoint already returns
        // these for the detail page's GET, so they should be present.
        posterUrl: item.posterUrl || item.posterLandscapeUrl || undefined,
        backdropUrl: item.backdropUrl || undefined,
        thumbnailUrl: item.thumbnail || item.posterAutoUrl || undefined,
        processingStatus: item.processingStatus ?? null,
        processingProgress: item.processingProgress ?? null,
        processingStage: item.processingStage ?? null
      }));
    } finally {
      queueLoading = false;
    }
  }

  // ------ URL search-param ↔ filter sync ------
  // Filters survive refresh + back-button so a reviewer can drill into a
  // submission and return to the same view.
  function readFiltersFromUrl() {
    if (typeof location === 'undefined') return;
    const params = new URLSearchParams(location.search);
    const t = params.get('type');
    const p = params.get('priority');
    const tab = params.get('tab');
    if (t === 'all' || Object.values(ReviewType).includes(t as ReviewType)) {
      selectedType = (t as ReviewType | 'all') ?? 'all';
    }
    if (p === 'all' || p === 'urgent' || p === 'high' || p === 'normal' || p === 'low') {
      selectedPriority = p;
    }
    if (tab === 'user-reviews' || tab === 'content') activeTab = tab;
  }

  $effect(() => {
    if (typeof location === 'undefined') return;
    const params = new URLSearchParams(location.search);
    if (selectedType === 'all') params.delete('type'); else params.set('type', selectedType);
    if (selectedPriority === 'all') params.delete('priority'); else params.set('priority', selectedPriority);
    if (activeTab === 'content') params.delete('tab'); else params.set('tab', activeTab);
    const qs = params.toString();
    const target = `${location.pathname}${qs ? '?' + qs : ''}${location.hash}`;
    if (target !== location.pathname + location.search + location.hash) {
      history.replaceState(null, '', target);
    }
  });

  onMount(() => {
    readFiltersFromUrl();
    loadReviewQueue();
    loadUserReviews();
  });

  // ------ Live encoder updates via SSE on the queue ------
  // Opens an EventSource against the existing /api/admin/encoder-stream
  // endpoint. On each event, find the matching card in reviewQueue and
  // update its processing fields locally so the mini progress bar ticks
  // without a full refetch. Fall back to a 10s poll if SSE errors.
  let evtSource: EventSource | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  function teardownLive() {
    if (evtSource) { evtSource.close(); evtSource = null; }
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  function applyEvent(ev: { mediaId?: string; status?: string | null; progress?: number | null; stage?: string | null; }) {
    if (!ev.mediaId) return;
    const idx = reviewQueue.findIndex(c => c.id === ev.mediaId);
    if (idx === -1) return;
    const card = reviewQueue[idx];
    reviewQueue[idx] = {
      ...card,
      processingStatus: typeof ev.status === 'string' ? ev.status : card.processingStatus,
      processingProgress: typeof ev.progress === 'number' ? ev.progress : card.processingProgress,
      processingStage: typeof ev.stage === 'string' || ev.stage === null ? (ev.stage ?? null) : card.processingStage
    };
  }

  onMount(() => {
    try {
      evtSource = new EventSource('/api/admin/encoder-stream');
      evtSource.onmessage = (msg) => {
        try { applyEvent(JSON.parse(msg.data)); } catch { /* ignore */ }
      };
      evtSource.onerror = () => {
        if (!pollTimer) pollTimer = setInterval(loadReviewQueue, 10000);
      };
    } catch {
      // EventSource unsupported — degrade to polling.
      pollTimer = setInterval(loadReviewQueue, 10000);
    }
  });

  onDestroy(teardownLive);

  // ------ Derived filters + small helpers ------
  const filteredQueue = $derived(
    reviewQueue.filter(item => {
      const typeMatch = selectedType === 'all' || item.reviewType === selectedType;
      const priorityMatch = selectedPriority === 'all' || item.priority === selectedPriority;
      return typeMatch && priorityMatch;
    })
  );

  // Stat chips for the page header.
  const stats = $derived({
    encoding: reviewQueue.filter(i => i.processingStatus && !['ready', 'failed', 'cancelled', null].includes(i.processingStatus)).length,
    awaiting: reviewQueue.filter(i => i.processingStatus === 'ready' || i.processingStatus === null || i.processingStatus === undefined).length,
    failed: reviewQueue.filter(i => i.processingStatus === 'failed').length,
    total: reviewQueue.length
  });

  function priorityChip(priority: string) {
    switch (priority) {
      case 'urgent': return 'bg-red-500/15 text-red-300 border-red-500/30';
      case 'high': return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'normal': return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'low': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  }

  function reviewTypeChip(reviewType: ReviewType) {
    switch (reviewType) {
      case ReviewType.THEOLOGICAL: return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case ReviewType.CONTENT_MODERATION: return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case ReviewType.FAMILY_SAFETY: return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      case ReviewType.TECHNICAL_QA: return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  }

  function reviewTypeLabel(t: ReviewType) {
    return t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function formatDate(date: Date | undefined) {
    return date ? date.toLocaleDateString() : 'No due date';
  }

  function getDaysUntilDue(dueDate: Date | undefined) {
    if (!dueDate) return null;
    const today = new Date();
    return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  function isEncoding(status: string | null | undefined): boolean {
    if (!status) return false;
    return !['ready', 'failed', 'cancelled'].includes(status);
  }

  // ------ Assignment modal (unchanged from the previous queue) ------
  interface AdminUser { id: string; name: string | null; email: string; image?: string | null }
  let assignmentTargetId = $state<string | null>(null);
  let admins = $state<AdminUser[]>([]);
  let adminsLoading = $state(false);
  let assigning = $state(false);

  async function openAssignmentModal(itemId: string, e?: MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    assignmentTargetId = itemId;
    if (admins.length === 0) {
      adminsLoading = true;
      try {
        const res = await fetch('/api/admin/admins');
        if (res.ok) {
          const data = await res.json();
          admins = data.admins ?? [];
        }
      } finally {
        adminsLoading = false;
      }
    }
  }

  function closeAssignmentModal() {
    assignmentTargetId = null;
  }

  async function assignToAdmin(adminId: string) {
    if (!assignmentTargetId) return;
    assigning = true;
    try {
      const res = await fetch(`/api/admin/content/${assignmentTargetId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Assign failed');
      closeAssignmentModal();
      await loadReviewQueue();
    } catch (err: any) {
      alert(`Assignment failed: ${err.message}`);
    } finally {
      assigning = false;
    }
  }
</script>

{#if assignmentTargetId}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onclick={closeAssignmentModal}>
    <div
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-labelledby="assign-modal-title"
      class="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 id="assign-modal-title" class="text-lg font-semibold mb-1">Assign review</h2>
      <p class="text-sm text-muted-foreground mb-4">Pick an admin to handle this item.</p>

      {#if adminsLoading}
        <p class="py-6 text-center text-sm text-muted-foreground">Loading admins…</p>
      {:else if admins.length === 0}
        <p class="py-6 text-center text-sm text-muted-foreground">No admins available.</p>
      {:else}
        <ul class="space-y-2 max-h-72 overflow-y-auto">
          {#each admins as admin}
            <li>
              <button
                onclick={() => assignToAdmin(admin.id)}
                disabled={assigning}
                class="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-border hover:bg-muted/50 transition disabled:opacity-50 text-left"
              >
                {#if admin.image}
                  <img src={admin.image} alt="" class="w-8 h-8 rounded-full object-cover" />
                {:else}
                  <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                    {(admin.name ?? admin.email).slice(0, 1).toUpperCase()}
                  </div>
                {/if}
                <div class="min-w-0">
                  <div class="text-sm font-medium truncate">{admin.name ?? admin.email}</div>
                  <div class="text-xs text-muted-foreground truncate">{admin.email}</div>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      {/if}

      <div class="mt-4 flex justify-end">
        <button onclick={closeAssignmentModal} class="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
      </div>
    </div>
  </div>
{/if}

<div class="container mx-auto px-4 py-6 space-y-6">
  <PageHeader
    icon={ShieldCheck}
    title="Content review"
    subtitle="Submissions and viewer reviews awaiting moderation."
  >
    {#snippet actions()}
      <StatChip label="encoding" value={stats.encoding} tone="yellow" />
      <StatChip label="awaiting" value={stats.awaiting} tone="default" />
      {#if stats.failed > 0}
        <StatChip label="failed" value={stats.failed} tone="red" />
      {/if}
    {/snippet}
  </PageHeader>

  <Tabs.Root value={activeTab} onValueChange={(v) => (activeTab = v as 'content' | 'user-reviews')}>
    <Tabs.List>
      <Tabs.Trigger value="content">Content queue ({reviewQueue.length})</Tabs.Trigger>
      <Tabs.Trigger value="user-reviews">User reviews ({userReviews.filter(r => !r.isApproved).length} pending)</Tabs.Trigger>
    </Tabs.List>

    <!-- ===== Content queue ===== -->
    <Tabs.Content value="content" class="mt-6 space-y-6">
      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 surface-2 rounded-xl p-4">
        <div>
          <label for="reviewType" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Review type</label>
          <select
            id="reviewType"
            bind:value={selectedType}
            class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground text-sm"
          >
            <option value="all">All types</option>
            <option value={ReviewType.THEOLOGICAL}>Theological</option>
            <option value={ReviewType.CONTENT_MODERATION}>Content moderation</option>
            <option value={ReviewType.FAMILY_SAFETY}>Family safety</option>
            <option value={ReviewType.TECHNICAL_QA}>Technical QA</option>
          </select>
        </div>
        <div>
          <label for="priority" class="block text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Priority</label>
          <select
            id="priority"
            bind:value={selectedPriority}
            class="w-full px-3 py-2 surface-2 border border-border rounded text-foreground text-sm"
          >
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="flex items-end gap-2 text-xs text-muted-foreground">
          <span class="inline-flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            live encoder feed
          </span>
        </div>
      </div>

      <!-- Card grid -->
      {#if queueLoading}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {#each Array(4) as _}
            <div class="surface-1 rounded-xl overflow-hidden animate-pulse">
              <div class="aspect-video bg-muted"></div>
              <div class="p-4 space-y-2">
                <div class="h-4 bg-muted rounded w-3/4"></div>
                <div class="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          {/each}
        </div>
      {:else if filteredQueue.length === 0}
        <EmptyState
          icon={Inbox}
          title="No items in queue"
          description={reviewQueue.length === 0 ? 'No content currently awaiting review.' : 'No content matches the current filters.'}
        />
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {#each filteredQueue as item (item.id)}
            {@const encoding = isEncoding(item.processingStatus)}
            {@const pct = Math.max(0, Math.min(100, item.processingProgress ?? 0))}
            {@const daysUntilDue = getDaysUntilDue(item.dueDate)}
            {@const thumb = item.backdropUrl || item.posterUrl || item.thumbnailUrl}
            <a
              href={`/admin/review/${item.id}`}
              class="group surface-1 rounded-xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
            >
              <!-- Poster -->
              <div class="aspect-video relative bg-muted overflow-hidden">
                {#if thumb}
                  <img
                    src={thumb}
                    alt=""
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Film class="w-10 h-10 opacity-30" />
                  </div>
                {/if}

                <!-- Live encoder progress bar (only while encoding) -->
                {#if encoding}
                  <div class="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm">
                    <div class="h-1 bg-black/50">
                      <div class="h-full bg-yellow-300 transition-all duration-500" style="width: {pct}%"></div>
                    </div>
                    <div class="px-3 py-1.5 flex items-center justify-between text-[10px] text-yellow-100">
                      <span class="inline-flex items-center gap-1">
                        <Loader2 class="w-3 h-3 animate-spin" />
                        encoding {item.processingStage ? `· ${item.processingStage}` : ''}
                      </span>
                      <span class="font-medium">{pct}%</span>
                    </div>
                  </div>
                {:else if item.processingStatus === 'ready'}
                  <div class="absolute top-2 right-2">
                    <span class="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-emerald-500/90 text-emerald-50 font-medium">
                      <CheckCircle2 class="w-3 h-3" /> ready
                    </span>
                  </div>
                {:else if item.processingStatus === 'failed'}
                  <div class="absolute top-2 right-2">
                    <span class="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-red-500/90 text-red-50 font-medium">
                      <AlertTriangle class="w-3 h-3" /> failed
                    </span>
                  </div>
                {/if}
              </div>

              <!-- Body -->
              <div class="p-4 flex-1 flex flex-col gap-2">
                <div>
                  <h3 class="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div class="text-xs text-muted-foreground mt-1 truncate">
                    by {item.creatorName} · {item.contentType}
                  </div>
                </div>

                <!-- Badge row -->
                <div class="flex flex-wrap gap-1.5 mt-1">
                  <span class="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border {reviewTypeChip(item.reviewType)}">
                    {reviewTypeLabel(item.reviewType)}
                  </span>
                  <span class="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border {priorityChip(item.priority)}">
                    {item.priority}
                  </span>
                </div>

                <!-- Meta -->
                <div class="mt-auto pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span class="inline-flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    Submitted {formatDate(item.submittedAt)}
                  </span>
                  {#if daysUntilDue !== null}
                    <span class={daysUntilDue <= 0 ? 'text-red-400' : daysUntilDue <= 1 ? 'text-yellow-300' : ''}>
                      {daysUntilDue <= 0 ? 'overdue' : `${daysUntilDue}d left`}
                    </span>
                  {:else}
                    <span>no deadline</span>
                  {/if}
                </div>

                <!-- Assigned / unassigned -->
                <div class="flex items-center justify-between text-[11px] mt-1">
                  {#if item.assignedTo}
                    <span class="text-emerald-300">Assigned</span>
                  {:else}
                    <span class="text-yellow-300">Unassigned</span>
                    <button
                      type="button"
                      onclick={(e) => openAssignmentModal(item.id, e)}
                      class="text-[11px] text-primary hover:opacity-80"
                    >
                      Assign →
                    </button>
                  {/if}
                </div>
              </div>
            </a>
          {/each}
        </div>
      {/if}

      <!-- Filter quick-jumps (preserved from the prior queue) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
        <button onclick={() => (selectedType = ReviewType.THEOLOGICAL)} class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">
          <Cross class="w-4 h-4 text-purple-400" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-foreground">Theological</div>
            <div class="text-xs text-muted-foreground">{reviewQueue.filter(i => i.reviewType === ReviewType.THEOLOGICAL).length} pending</div>
          </div>
        </button>
        <button onclick={() => (selectedType = ReviewType.CONTENT_MODERATION)} class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">
          <Shield class="w-4 h-4 text-emerald-400" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-foreground">Moderation</div>
            <div class="text-xs text-muted-foreground">{reviewQueue.filter(i => i.reviewType === ReviewType.CONTENT_MODERATION).length} pending</div>
          </div>
        </button>
        <button onclick={() => (selectedType = ReviewType.FAMILY_SAFETY)} class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">
          <Users class="w-4 h-4 text-pink-400" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-foreground">Family safety</div>
            <div class="text-xs text-muted-foreground">{reviewQueue.filter(i => i.reviewType === ReviewType.FAMILY_SAFETY).length} pending</div>
          </div>
        </button>
        <button onclick={() => (selectedType = ReviewType.TECHNICAL_QA)} class="surface-1 hover:surface-2 transition-colors rounded-xl p-3 text-left flex items-center gap-3">
          <Wrench class="w-4 h-4 text-blue-400" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-foreground">Technical QA</div>
            <div class="text-xs text-muted-foreground">{reviewQueue.filter(i => i.reviewType === ReviewType.TECHNICAL_QA).length} pending</div>
          </div>
        </button>
      </div>
    </Tabs.Content>

    <!-- ===== User reviews ===== -->
    <Tabs.Content value="user-reviews" class="mt-6">
      {#if userReviewsLoading}
        <div class="text-center py-12 text-muted-foreground text-sm">Loading reviews…</div>
      {:else if userReviews.length === 0}
        <EmptyState icon={CheckCircle2} title="All caught up" description="No pending user reviews to moderate." tone="success" />
      {:else}
        <div class="space-y-4">
          {#each userReviews as review (review.id)}
            <div class="surface-1 rounded-xl p-5 space-y-3">
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span class="text-xs text-muted-foreground uppercase">{review.contentType}</span>
                    <span class="text-xs text-muted-foreground">Content: {review.contentId.slice(0, 8)}…</span>
                  </div>
                  {#if review.reviewText}
                    <p class="text-foreground text-sm leading-relaxed">{review.reviewText}</p>
                  {:else}
                    <p class="text-muted-foreground text-sm italic">No text — rating only</p>
                  {/if}
                  <p class="text-xs text-muted-foreground">Submitted {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="flex gap-2 shrink-0">
                  <button
                    onclick={() => moderateReview(review.id, true)}
                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
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
    </Tabs.Content>
  </Tabs.Root>
</div>
