<!-- Creator Dashboard Home — bento landing page -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/state';
  import {
    Home, Video, Clock, CheckCircle2, Eye, DollarSign,
    Upload, BarChart3, ArrowUpRight, Sparkles, MessageSquare, Bell, Film, AlertTriangle, Wand2
  } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import PortalKpi from '$lib/components/portal/PortalKpi.svelte';
  import PortalCard from '$lib/components/portal/PortalCard.svelte';
  import PortalButton from '$lib/components/portal/PortalButton.svelte';

  // Server-loaded in-flight encodes. Local $state mirrors the server
  // load so the SSE handler below can patch each row's progress without
  // a page reload. Seeded inside $effect so a SvelteKit re-load (e.g.
  // after invalidateAll) refreshes the dashboard cleanly.
  const { data } = $props();
  let inFlightEncodes = $state<typeof data.inFlightEncodes>([]);
  $effect(() => {
    inFlightEncodes = data.inFlightEncodes ?? [];
  });

  let creatorStats = $state({
    totalContent: 0,
    pendingReview: 0,
    published: 0,
    totalViews: 0,
    monthlyEarnings: 0
  });

  interface ActivityItem {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    thumbnail?: string | null;
  }

  let recentActivity = $state<ActivityItem[]>([]);
  let loading = $state(true);

  // Encoder SSE — reuses the same /api/admin/encoder-stream topic the
  // admin review page subscribes to. The endpoint authorizes admins;
  // creators get their own scoped feed at /api/creator/encoder-stream
  // (added in this batch).
  let evtSource: EventSource | null = null;

  onMount(async () => {
    try {
      const [statsRes, contentRes] = await Promise.all([
        fetch('/api/creator/stats'),
        fetch('/api/creator/content')
      ]);
      if (statsRes.ok) creatorStats = await statsRes.json();
      if (contentRes.ok) {
        const items = await contentRes.json();
        recentActivity = (Array.isArray(items) ? items : (items.items ?? [])).slice(0, 4);
      }
    } finally {
      loading = false;
    }

    // Subscribe to encoder progress events scoped to this creator.
    // Browser auto-reconnects on transient transport errors; no polling
    // fallback here (dashboard isn't critical to second-by-second).
    if (typeof EventSource !== 'undefined') {
      try {
        evtSource = new EventSource('/api/creator/encoder-stream');
        evtSource.onmessage = (msg) => {
          try {
            const ev = JSON.parse(msg.data) as {
              mediaId?: string;
              status?: string | null;
              progress?: number | null;
              stage?: string | null;
            };
            if (!ev.mediaId) return;
            const idx = inFlightEncodes.findIndex((r) => r.id === ev.mediaId);
            if (idx === -1) return;
            const next = { ...inFlightEncodes[idx] };
            if (typeof ev.status === 'string') next.processingStatus = ev.status;
            if (typeof ev.progress === 'number') next.processingProgress = ev.progress;
            if (typeof ev.stage === 'string') next.processingStage = ev.stage;
            const copy = inFlightEncodes.slice();
            copy[idx] = next;
            inFlightEncodes = copy;
          } catch {
            // ignore malformed frames
          }
        };
      } catch {
        // EventSource unavailable; reload on next visit.
      }
    }
  });

  onDestroy(() => {
    evtSource?.close();
    evtSource = null;
  });

  function statusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'published' || s === 'approved' || s === 'live') return 'bg-green-500/15 text-green-600 dark:text-green-300';
    if (s === 'rejected') return 'bg-red-500/15 text-red-600 dark:text-red-300';
    if (s === 'submitted' || s === 'pending') return 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-300';
    return 'bg-muted text-muted-foreground';
  }

  function prettyStatus(status: string): string {
    return (status || 'submitted').replace(/_/g, ' ');
  }

  // Time-aware greeting — fired on mount so we don't compute Date.now()
  // during SSR (would always read "good evening" to a morning visitor).
  const firstName = $derived.by(() => {
    const fullName = (page.data?.user as { name?: string } | undefined)?.name ?? '';
    return fullName.trim().split(/\s+/)[0] ?? 'there';
  });
  let greeting = $state('Welcome back');
  onMount(() => {
    const hour = new Date().getHours();
    greeting =
      hour < 5 ? 'Burning the midnight oil'
      : hour < 12 ? 'Good morning'
      : hour < 17 ? 'Good afternoon'
      : 'Good evening';
  });
</script>

<div class="mx-auto px-4 py-6 space-y-6 max-w-7xl">
  <!-- Cosmic Maker hero — time-aware greeting + a clear call to make.
       The cinematic fade-up is built into PortalHero. -->
  <PortalHero
    eyebrow="Creator Studio"
    title={`${greeting}, ${firstName}.`}
    subtitle="Your space for crafting faith-inspiring stories. Upload, schedule, and watch the impact unfold."
    icon={Wand2}
  >
    {#snippet actions()}
      <PortalButton href="/creator/upload" variant="primary" size="md">
        <Upload class="w-4 h-4" /> New upload
      </PortalButton>
    {/snippet}
  </PortalHero>

  <!-- KPI strip — animated count-up + hover sparklines, all keyed off
       the portal accent tokens. -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
    <PortalKpi label="Total Content" value={creatorStats.totalContent} icon={Video} href="/creator/content" />
    <PortalKpi label="Pending" value={creatorStats.pendingReview} icon={Clock} href="/creator/content?status=pending" />
    <PortalKpi label="Published" value={creatorStats.published} icon={CheckCircle2} href="/creator/content?status=published" />
    <PortalKpi label="Views" value={creatorStats.totalViews} icon={Eye} href="/creator/analytics" />
    <PortalKpi
      label="This Month"
      value={`$${creatorStats.monthlyEarnings.toFixed(2)}`}
      icon={DollarSign}
      href="/creator/earnings"
    />
  </div>

  <!-- Encoding-in-progress card. Solves the "can I start another upload
       while the previous one is encoding?" confusion by surfacing every
       in-flight job with live progress (SSE). The 'Start a new upload'
       CTA reassures the creator they're not blocked. -->
  {#if inFlightEncodes.length > 0}
    <section class="surface-1 rounded-xl p-5">
      <header class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <Film class="w-4 h-4 text-primary" />
          <h2 class="text-sm font-semibold text-foreground">
            Encoding in progress
            <span class="ml-1 text-xs text-muted-foreground">({inFlightEncodes.length})</span>
          </h2>
        </div>
        <a href="/creator/upload" class="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          Start a new upload <ArrowUpRight class="w-3 h-3" />
        </a>
      </header>

      <ul class="space-y-3">
        {#each inFlightEncodes as enc (enc.id)}
          {@const isFailed = enc.processingStatus === 'failed'}
          {@const pct = Math.max(0, Math.min(100, enc.processingProgress ?? 0))}
          <li class="flex items-center gap-3">
            {#if enc.thumbnail}
              <img src={enc.thumbnail} alt="" class="w-12 h-8 rounded object-cover shrink-0" />
            {:else}
              <div class="w-12 h-8 rounded surface-2 shrink-0"></div>
            {/if}
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2 mb-1">
                <div class="text-sm text-foreground truncate">{enc.title}</div>
                <div class="text-xs font-mono shrink-0 {isFailed ? 'text-red-300' : 'text-muted-foreground'}">
                  {isFailed ? 'failed' : `${pct}%`}
                </div>
              </div>
              {#if !isFailed}
                <div class="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div class="h-full bg-primary transition-all duration-500" style="width: {pct}%"></div>
                </div>
                <div class="mt-1 text-[10px] text-muted-foreground">
                  {enc.processingStage ?? enc.processingStatus ?? 'queued'}
                </div>
              {:else}
                <div class="text-xs text-red-300 inline-flex items-center gap-1">
                  <AlertTriangle class="w-3 h-3" />
                  {enc.processingError ? enc.processingError.slice(0, 80) : 'See admin to retry'}
                </div>
              {/if}
            </div>
            <a
              href={`/creator/content/${enc.id}`}
              class="text-xs text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Open content details"
            >
              Details →
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <!-- Bento body: recent activity (2 cols) + quick actions tile (1 col) -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
    <section class="lg:col-span-2 surface-1 rounded-xl p-5">
      <header class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-primary" />
          <h2 class="text-sm font-semibold text-foreground">Recent activity</h2>
        </div>
        <a href="/creator/content" class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          All content <ArrowUpRight class="w-3 h-3" />
        </a>
      </header>

      {#if loading}
        <div class="space-y-2">
          {#each Array(3) as _, i (i)}
            <div class="surface-2 rounded h-12 animate-pulse"></div>
          {/each}
        </div>
      {:else if recentActivity.length === 0}
        <div class="text-center py-8 text-muted-foreground text-sm">
          <Video class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No content yet.</p>
          <a href="/creator/upload" class="text-xs text-primary hover:underline mt-1 inline-block">
            Upload your first video →
          </a>
        </div>
      {:else}
        <ul class="divide-y divide-border/40">
          {#each recentActivity as item (item.id ?? item.title)}
            <li>
              <a
                href={`/creator/content/${item.id ?? ''}`}
                class="flex items-center gap-3 py-2.5 px-1 -mx-1 rounded hover:surface-2 transition-colors"
              >
                {#if item.thumbnail}
                  <img src={item.thumbnail} alt="" class="w-10 h-6 object-cover rounded shrink-0" />
                {:else}
                  <div class="w-10 h-6 rounded surface-2 shrink-0"></div>
                {/if}
                <div class="min-w-0 flex-1">
                  <div class="text-sm text-foreground truncate">{item.title}</div>
                  <div class="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span class="ml-2 shrink-0 text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 {statusClass(item.status)}">
                  {prettyStatus(item.status)}
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <!-- Quick actions stack -->
    <section class="space-y-3">
      <a href="/creator/upload" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <Upload class="w-4 h-4" />
        </div>
        <div class="min-w-0">
          <div class="text-sm font-medium text-foreground">Upload new content</div>
          <div class="text-xs text-muted-foreground truncate">Share your ministry with the world</div>
        </div>
        <ArrowUpRight class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
      </a>

      <!-- Schedule a Coming Soon release. Routes to the upload wizard
           with ?cs=1 so the Review step lands with the Coming Soon
           toggle pre-checked + the release-date input revealed.
           Different accent color so it reads as a distinct flow. -->
      <a href="/creator/upload?cs=1" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-md bg-[#FF5E0E]/15 text-[#FF5E0E] flex items-center justify-center shrink-0">
          <Bell class="w-4 h-4" />
        </div>
        <div class="min-w-0">
          <div class="text-sm font-medium text-foreground">Schedule a Coming Soon release</div>
          <div class="text-xs text-muted-foreground truncate">Build anticipation — viewers can tap "Notify me"</div>
        </div>
        <ArrowUpRight class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
      </a>

      <a href="/creator/analytics" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <BarChart3 class="w-4 h-4" />
        </div>
        <div class="min-w-0">
          <div class="text-sm font-medium text-foreground">View analytics</div>
          <div class="text-xs text-muted-foreground truncate">Track your impact and growth</div>
        </div>
        <ArrowUpRight class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
      </a>

      <a href="/creator/inbox" class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-md bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <MessageSquare class="w-4 h-4" />
        </div>
        <div class="min-w-0">
          <div class="text-sm font-medium text-foreground">Inbox</div>
          <div class="text-xs text-muted-foreground truncate">Notes from admin team</div>
        </div>
        <ArrowUpRight class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
      </a>
    </section>
  </div>
</div>
