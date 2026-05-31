<!-- Admin Dashboard Home — bento landing page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Clock, CheckCircle2, XCircle, Eye, FileCheck, Timer,
    Users, ArrowUpRight, AlertTriangle,
    ShieldCheck, Video, Banknote, MessageSquare, Coins,
    Sparkles
  } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';

  let adminStats = $state({
    pendingReviews: 0,
    totalCreators: 0,
    publishedContent: 0,
    rejectedContent: 0,
    totalViews: 0,
    pendingApplications: 0,
    approvedApplications7d: 0,
    approvedApplications30d: 0,
    avgApprovalHours: 0
  });

  let urgentReviews = $state<{ id: string; title: string; mediaType: string; createdAt: string }[]>([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/content?pending=true&limit=4')
      ]);
      if (statsRes.ok) adminStats = await statsRes.json();
      if (pendingRes.ok) {
        const body = await pendingRes.json();
        urgentReviews = Array.isArray(body) ? body : (body.items ?? body.content ?? []);
      }
    } finally {
      loading = false;
    }
  });

  const quickActions = [
    { href: '/admin/review', label: 'Review Queue', icon: ShieldCheck, accent: 'yellow' },
    { href: '/admin/content', label: 'Content', icon: Video, accent: 'blue' },
    { href: '/admin/creators', label: 'Creators', icon: Users, accent: 'green' },
    { href: '/admin/payouts', label: 'Payouts', icon: Banknote, accent: 'orange' },
    { href: '/admin/tokenomics', label: 'Tokenomics', icon: Coins, accent: 'amber' },
    { href: '/admin/communications', label: 'Messages', icon: MessageSquare, accent: 'cyan' }
  ];
</script>

<div class="container mx-auto px-4 py-6 space-y-6">
  <PageHeader
    icon={ShieldCheck}
    title="Admin"
    subtitle="Platform overview, content review, creator community."
  >
    {#snippet actions()}
      <a
        href="/admin/ai-runs"
        class="hidden md:inline-flex items-center gap-1.5 text-xs surface-1 hover:surface-2 rounded-full px-3 py-1.5 text-foreground transition-colors"
      >
        <Sparkles class="w-3.5 h-3.5" />
        AI Runs
      </a>
    {/snippet}
  </PageHeader>

  <!-- Primary KPIs (5-up on desktop, 2-up on mobile) -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
    <KpiCard label="Pending Reviews" value={adminStats.pendingReviews} icon={Clock} accent="yellow" href="/admin/review" index={0} />
    <KpiCard label="Active Creators" value={adminStats.totalCreators} icon={Users} accent="blue" href="/admin/creators" index={1} />
    <KpiCard label="Published" value={adminStats.publishedContent} icon={CheckCircle2} accent="green" href="/admin/content?status=approved" index={2} />
    <KpiCard label="Rejected" value={adminStats.rejectedContent} icon={XCircle} accent="red" href="/admin/content?status=rejected" index={3} />
    <KpiCard label="Platform Views" value={adminStats.totalViews.toLocaleString()} icon={Eye} accent="purple" href="/admin/analytics" index={4} />
  </div>

  <!-- Bento body: urgent reviews (2 cols) + secondary KPIs (1 col) -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
    <!-- Urgent reviews — bento hero -->
    <section class="lg:col-span-2 surface-1 rounded-xl p-5">
      <header class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 text-yellow-500" />
          <h2 class="text-sm font-semibold text-foreground">Urgent reviews</h2>
        </div>
        <a href="/admin/review" class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          Open queue <ArrowUpRight class="w-3 h-3" />
        </a>
      </header>

      {#if loading}
        <div class="space-y-2">
          {#each Array(3) as _, i (i)}
            <div class="surface-2 rounded h-12 animate-pulse"></div>
          {/each}
        </div>
      {:else if urgentReviews.length === 0}
        <div class="text-center py-8 text-muted-foreground text-sm">
          <CheckCircle2 class="w-8 h-8 mx-auto mb-2 text-green-500/70" />
          <p>Review queue is empty.</p>
          <p class="text-xs mt-1">Nothing to review right now — nice work.</p>
        </div>
      {:else}
        <ul class="divide-y divide-border/40">
          {#each urgentReviews as item (item.id)}
            <li>
              <a
                href={`/admin/review/${item.id}`}
                class="flex items-center justify-between py-2.5 px-1 -mx-1 rounded hover:surface-2 transition-colors"
              >
                <div class="min-w-0 flex-1">
                  <div class="text-sm text-foreground truncate">{item.title}</div>
                  <div class="text-xs text-muted-foreground">
                    {item.mediaType} · submitted {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span class="ml-3 shrink-0 text-[10px] uppercase tracking-wide bg-yellow-500/15 text-yellow-600 dark:text-yellow-300 rounded-full px-2 py-0.5">
                  Pending
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <!-- Creator applications stat tile -->
    <section class="surface-1 rounded-xl p-5 space-y-4">
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <FileCheck class="w-4 h-4 text-blue-500" />
          <h2 class="text-sm font-semibold text-foreground">Creator applications</h2>
        </div>
        <a href="/admin/creator-applications" class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5">
          Review <ArrowUpRight class="w-3 h-3" />
        </a>
      </header>

      <div class="space-y-3">
        <div>
          <div class="text-3xl font-semibold text-foreground tabular-nums">{adminStats.pendingApplications}</div>
          <div class="text-xs text-muted-foreground">pending</div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="surface-2 rounded-md px-2 py-1.5">
            <div class="text-foreground font-medium tabular-nums">{adminStats.approvedApplications7d}</div>
            <div class="text-muted-foreground">approved · 7d</div>
          </div>
          <div class="surface-2 rounded-md px-2 py-1.5">
            <div class="text-foreground font-medium tabular-nums">
              {Number.isFinite(adminStats.avgApprovalHours) ? adminStats.avgApprovalHours.toFixed(1) : '0.0'}h
            </div>
            <div class="text-muted-foreground">avg approval</div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Quick actions strip -->
  <section>
    <h2 class="text-xs uppercase tracking-wide text-muted-foreground mb-2 px-1">Quick actions</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {#each quickActions as a (a.href)}
        {@const Icon = a.icon}
        <a
          href={a.href}
          class="surface-1 hover:surface-2 transition-colors rounded-xl p-4 flex flex-col items-start gap-2 group"
        >
          <Icon class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span class="text-sm font-medium text-foreground">{a.label}</span>
        </a>
      {/each}
    </div>
  </section>
</div>
