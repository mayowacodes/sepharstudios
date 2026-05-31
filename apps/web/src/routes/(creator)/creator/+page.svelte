<!-- Creator Dashboard Home — bento landing page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Home, Video, Clock, CheckCircle2, Eye, DollarSign,
    Upload, BarChart3, ArrowUpRight, Sparkles, MessageSquare
  } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';

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
</script>

<div class="container mx-auto px-4 py-6 space-y-6">
  <PageHeader
    icon={Home}
    title="Creator Studio"
    subtitle="Manage your faith-based content and reach believers worldwide."
  >
    {#snippet actions()}
      <a
        href="/creator/upload"
        class="inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <Upload class="w-3.5 h-3.5" />
        Upload
      </a>
    {/snippet}
  </PageHeader>

  <!-- KPI strip (5-up) -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
    <KpiCard label="Total Content" value={creatorStats.totalContent} icon={Video} accent="blue" href="/creator/content" loading={loading} index={0} />
    <KpiCard label="Pending" value={creatorStats.pendingReview} icon={Clock} accent="yellow" href="/creator/content?status=pending" loading={loading} index={1} />
    <KpiCard label="Published" value={creatorStats.published} icon={CheckCircle2} accent="green" href="/creator/content?status=published" loading={loading} index={2} />
    <KpiCard label="Views" value={creatorStats.totalViews.toLocaleString()} icon={Eye} accent="purple" href="/creator/analytics" loading={loading} index={3} />
    <KpiCard label="This Month" value={`$${creatorStats.monthlyEarnings.toFixed(2)}`} icon={DollarSign} accent="orange" href="/creator/earnings" loading={loading} index={4} />
  </div>

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
