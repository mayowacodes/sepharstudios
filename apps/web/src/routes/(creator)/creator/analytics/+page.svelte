<!-- Creator Analytics Dashboard -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { BarChart3, Eye, Clock, Target, Heart, LineChart, Radio } from '@lucide/svelte';
  import PortalHero from '$lib/components/portal/PortalHero.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';
  import TrendChart from '$lib/components/dashboard/TrendChart.svelte';
  import EmptyState from '$lib/components/portal/PortalEmptyState.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  // Real analytics — pulled from /api/creator/analytics
  let analyticsData = $state<any>({});
  let isLoading = $state(true);
  let selectedPeriod = $state('30d');
  let selectedContent = $state('all');

  // AI Insights — real data from /api/ai/creator-insights
  type AIInsights = {
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    recommendations?: string[];
    nextContentIdea?: string;
    message?: string;
  };
  let aiInsights = $state<AIInsights | null>(null);
  let aiLoading = $state(false);
  let aiError = $state('');

  async function loadAIInsights() {
    aiLoading = true;
    aiError = '';
    try {
      const res = await fetch('/api/ai/creator-insights');
      if (!res.ok) {
        if (res.status === 404) {
          aiError = 'Complete your creator profile to unlock AI insights.';
        } else if (res.status === 503) {
          aiError = 'AI insights service is unavailable. Try again shortly.';
        } else {
          aiError = 'Could not load insights.';
        }
        return;
      }
      aiInsights = await res.json();
    } catch (err) {
      aiError = err instanceof Error ? err.message : 'Could not load insights.';
    } finally {
      aiLoading = false;
    }
  }

  function emptyAnalytics() {
    return {
      overview: { totalViews: 0, totalWatchTime: 0, averageWatchTime: 0, completionRate: 0, totalLikes: 0, totalShares: 0, activeViewers: 0, growthRate: 0 },
      contentPerformance: [],
      viewsByDevice: [],
      demographics: { ageGroups: [], genderDistribution: [], topCountries: [] },
      engagementTrends: [],
      series: { views: [], watchMinutes: [], completion: [] },
      deltas: { views: 0, watchTime: 0, completion: 0 }
    };
  }

  async function loadAnalytics(period: string) {
    isLoading = true;
    try {
      const res = await fetch(`/api/creator/analytics?period=${period}`);
      if (!res.ok) {
        console.error('[creator/analytics] load HTTP', res.status);
        analyticsData = emptyAnalytics();
        return;
      }
      // Guard json parse so a transient empty response or HTML body
      // doesn't throw and blank the page during the (await res.json())
      // microtask after hydration.
      const data = await res.json().catch(() => null);
      analyticsData = data ?? emptyAnalytics();
    } catch (err) {
      console.error('[creator/analytics] load failed:', err);
      analyticsData = emptyAnalytics();
    } finally {
      isLoading = false;
    }
  }

  // Re-fetch when the period dropdown changes
  $effect(() => {
    void loadAnalytics(selectedPeriod);
  });

  // ── Live "Live now" panel + 60s KPI refresh ─────────────────────────
  // Streams watch_start / watch_complete events for this creator's
  // own content. The KPI tiles re-fetch every 60s when the tab is
  // visible — backgrounded tabs skip the refresh to spare the DB.
  type LiveEvent = {
    kind: 'watch_start' | 'watch_complete';
    contentId: string;
    title: string;
    completionPercent: number;
    at: string;
  };
  let liveEvents = $state<LiveEvent[]>([]);
  let evtSource: EventSource | null = null;
  let refreshTimer: ReturnType<typeof setInterval> | null = null;

  function pushLiveEvent(ev: LiveEvent): void {
    // Keep the rolling 20-event window — bigger than that and the
    // panel scrolls forever.
    const copy = [ev, ...liveEvents];
    liveEvents = copy.slice(0, 20);
  }

  onMount(() => {
    void loadAIInsights();

    if (typeof EventSource !== 'undefined') {
      try {
        evtSource = new EventSource('/api/creator/analytics/stream');
        evtSource.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data) as LiveEvent;
            pushLiveEvent(data);
          } catch { /* ignore malformed frames */ }
        };
      } catch { /* SSE unavailable; the page is still functional */ }
    }

    refreshTimer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        void loadAnalytics(selectedPeriod);
      }
    }, 60_000);
  });

  onDestroy(() => {
    evtSource?.close();
    evtSource = null;
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  });

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 10_000) return 'just now';
    if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    return new Date(iso).toLocaleTimeString();
  }
  
  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
  
  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }
</script>

<div class="space-y-6">
  <PortalHero
    compact
    eyebrow="Insights"
    title="Your audience pulse"
    subtitle="Watch time, completions, and what's resonating right now."
    icon={BarChart3}
  >
    {#snippet actions()}
      <select
        bind:value={selectedPeriod}
        class="px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2"
        style="background: hsl(var(--portal-bg-elevated)/0.7); color: hsl(var(--portal-text)); border: 1px solid hsl(var(--portal-border)); --tw-ring-color: hsl(var(--portal-accent)/0.4);"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>
    {/snippet}
  </PortalHero>

  <!-- Live now — watch events on this creator's content streamed via
       SSE. Empty by default; populates as viewers start or finish
       a video. Quiet design so it complements (doesn't compete with)
       the AI Insights panel below. -->
  {#if liveEvents.length > 0}
    <div
      class="relative rounded-2xl p-5 portal-fade-up backdrop-blur-md overflow-hidden"
      style="background: hsl(var(--portal-bg-card)/0.7); border: 1px solid hsl(var(--portal-accent)/0.35); box-shadow: var(--portal-accent-glow);"
    >
      <!-- Soft accent halo so the panel reads as "this is live, watch it" -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30 blur-3xl"
        style="background: radial-gradient(circle, hsl(var(--portal-accent)/0.7) 0%, transparent 70%);"
      ></div>

      <div class="relative flex items-center gap-2 mb-3">
        <Radio class="w-4 h-4 portal-pulse-dot" style="color: hsl(var(--portal-accent))" />
        <h2 class="text-sm font-semibold" style="color: hsl(var(--portal-text))">Live now</h2>
        <span class="text-xs" style="color: hsl(var(--portal-text-muted))">
          — {liveEvents.length} recent {liveEvents.length === 1 ? 'event' : 'events'}
        </span>
      </div>
      <ul class="relative space-y-1.5 max-h-48 overflow-y-auto">
        {#each liveEvents as ev (ev.contentId + ev.at)}
          <li class="flex items-center gap-2 text-xs">
            <span
              class="inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style:background-color={ev.kind === 'watch_complete'
                ? 'hsl(var(--portal-success))'
                : 'hsl(var(--portal-accent))'}
            ></span>
            <span class="truncate flex-1" style="color: hsl(var(--portal-text))">
              {ev.kind === 'watch_complete' ? 'Completed' : 'Started watching'}: {ev.title}
            </span>
            <span class="shrink-0" style="color: hsl(var(--portal-text-muted))">{relativeTime(ev.at)}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- AI Insights panel — real data from /api/ai/creator-insights -->
  <div class="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
          <span>✨</span> AI Insights
        </div>
        <h2 class="text-xl font-bold text-foreground">What your data is telling us</h2>
      </div>
      <button
        type="button"
        onclick={loadAIInsights}
        disabled={aiLoading}
        class="text-xs text-purple-200 hover:text-foreground border border-purple-500/40 hover:border-purple-400 rounded-md px-3 py-1.5 transition-colors disabled:opacity-40"
      >
        {aiLoading ? 'Analysing…' : 'Refresh'}
      </button>
    </div>

    {#if aiLoading && !aiInsights}
      <div class="grid sm:grid-cols-2 gap-3">
        {#each [1,2,3,4] as _}
          <div class="h-20 surface-1 rounded-lg animate-pulse"></div>
        {/each}
      </div>
    {:else if aiError}
      <p class="text-sm text-purple-200/80">{aiError}</p>
    {:else if aiInsights?.message}
      <p class="text-sm text-purple-100">{aiInsights.message}</p>
    {:else if aiInsights}
      {#if aiInsights.summary}
        <p class="text-sm text-purple-50 mb-4 leading-relaxed">{aiInsights.summary}</p>
      {/if}
      <div class="grid sm:grid-cols-2 gap-4">
        {#if aiInsights.strengths?.length}
          <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <h3 class="text-xs font-bold uppercase tracking-wide text-emerald-300 mb-2">Strengths</h3>
            <ul class="space-y-1 text-sm text-emerald-50">
              {#each aiInsights.strengths as item}
                <li>• {item}</li>
              {/each}
            </ul>
          </div>
        {/if}
        {#if aiInsights.improvements?.length}
          <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <h3 class="text-xs font-bold uppercase tracking-wide text-amber-300 mb-2">Areas to improve</h3>
            <ul class="space-y-1 text-sm text-amber-50">
              {#each aiInsights.improvements as item}
                <li>• {item}</li>
              {/each}
            </ul>
          </div>
        {/if}
        {#if aiInsights.recommendations?.length}
          <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 sm:col-span-2">
            <h3 class="text-xs font-bold uppercase tracking-wide text-blue-300 mb-2">Recommendations</h3>
            <ul class="space-y-1 text-sm text-blue-50">
              {#each aiInsights.recommendations as item}
                <li>• {item}</li>
              {/each}
            </ul>
          </div>
        {/if}
        {#if aiInsights.nextContentIdea}
          <div class="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 sm:col-span-2">
            <h3 class="text-xs font-bold uppercase tracking-wide text-pink-300 mb-2">Idea for your next piece</h3>
            <p class="text-sm text-pink-50">{aiInsights.nextContentIdea}</p>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  {#if isLoading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each Array(4) as _, i (i)}
        <Skeleton class="h-28 rounded-xl" />
      {/each}
    </div>
    <Skeleton class="h-64 rounded-xl" />
  {:else if (analyticsData.contentPerformance?.length ?? 0) === 0}
    <!--
      True empty state — the creator has no uploaded content at all.
      The old check ANDed totalViews === 0 with contentPerformance
      length === 0, but those two are coupled: no content → no views.
      Keeping just the content-count check means a creator who has
      uploaded videos but hasn't accrued any views yet still sees the
      KPI grid (with zero values) + the per-title list, which is far
      more useful than the "upload your first" prompt.
    -->
    <EmptyState
      icon={LineChart}
      title="No analytics yet"
      description="Once your published content starts being watched, view counts, completion rates, and demographic breakdowns will appear here. New creators usually see their first data within 24 hours of publishing."
      tone="default"
    >
      {#snippet action()}
        <a href="/creator/upload" class="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Upload your first video
        </a>
      {/snippet}
    </EmptyState>
  {:else}
    <!-- KPI grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total Views"
        value={formatNumber(analyticsData.overview.totalViews)}
        icon={Eye}
        accent="blue"
        delta={analyticsData.deltas?.views ?? analyticsData.overview.growthRate ?? 0}
        deltaLabel="vs prior period"
        sparkline={analyticsData.series?.views ?? []}
        index={0}
      />
      <KpiCard
        label="Watch Time"
        value={formatDuration(analyticsData.overview.totalWatchTime)}
        icon={Clock}
        accent="green"
        delta={analyticsData.deltas?.watchTime ?? 0}
        deltaLabel="vs prior period"
        sparkline={analyticsData.series?.watchMinutes ?? []}
        index={1}
      />
      <KpiCard
        label="Completion"
        value={`${analyticsData.overview.completionRate}%`}
        icon={Target}
        accent="purple"
        delta={analyticsData.deltas?.completion ?? 0}
        deltaLabel="vs prior period"
        sparkline={analyticsData.series?.completion ?? []}
        index={2}
      />
      <KpiCard
        label="Engagement"
        value={formatNumber(analyticsData.overview.totalLikes)}
        icon={Heart}
        accent="orange"
        deltaLabel={`${formatNumber(analyticsData.overview.totalShares)} shares`}
        index={3}
      />
    </div>

    <!-- Engagement trend chart -->
    {#if analyticsData.engagementTrends?.length > 0}
      <TrendChart
        data={analyticsData.engagementTrends.map((t: { date: string; views: number }) => ({ date: t.date, value: t.views }))}
        label="Daily views"
        accent="purple"
        formatValue={(v) => formatNumber(v)}
      />
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Content Performance -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-foreground mb-4">Content Performance</h3>
        <div class="space-y-4">
          {#each analyticsData.contentPerformance as content}
            <div class="surface-1 rounded-lg p-4">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <div class="font-medium text-foreground">{content.title}</div>
                  <div class="text-sm text-muted-foreground">{formatNumber(content.views)} views</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-green-400">{content.completionRate}%</div>
                  <div class="text-xs text-muted-foreground">completion</div>
                </div>
              </div>
              
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div class="text-muted-foreground">Watch Time</div>
                  <div class="text-foreground font-medium">{formatDuration(content.watchTime)}</div>
                </div>
                <div>
                  <div class="text-muted-foreground">Likes</div>
                  <div class="text-foreground font-medium">{content.likes}</div>
                </div>
                <div>
                  <div class="text-muted-foreground">Shares</div>
                  <div class="text-foreground font-medium">{content.shares}</div>
                </div>
              </div>
              
              <!-- Engagement Bar -->
              <div class="mt-3">
                <div class="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Engagement Score</span>
                  <span>{content.engagement}/10</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-linear-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style="width: {content.engagement * 10}%"
                  ></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Device Breakdown -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-foreground mb-4">Viewing Devices</h3>
        <div class="space-y-4">
          {#each analyticsData.viewsByDevice as device}
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-linear-to-r from-purple-600 to-blue-600 mr-3"></div>
                <div>
                  <div class="text-foreground font-medium">{device.device}</div>
                  <div class="text-sm text-muted-foreground">{formatNumber(device.views)} views</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-foreground font-bold">{device.percentage}%</div>
              </div>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-linear-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style="width: {device.percentage}%"
              ></div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Demographics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Age Groups -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-foreground mb-4">Age Demographics</h3>
        <div class="space-y-3">
          {#each analyticsData.demographics.ageGroups as group}
            <div class="flex items-center justify-between">
              <div class="text-foreground">{group.range}</div>
              <div class="flex items-center">
                <div class="text-foreground font-medium mr-2">{group.percentage}%</div>
                <div class="w-16 bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-linear-to-r from-green-600 to-blue-600 h-2 rounded-full"
                    style="width: {group.percentage * 2}%"
                  ></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Gender Distribution -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-foreground mb-4">Gender Distribution</h3>
        <div class="space-y-4">
          {#each analyticsData.demographics.genderDistribution as gender}
            <div class="flex items-center justify-between">
              <div class="text-foreground">{gender.gender}</div>
              <div class="text-foreground font-bold">{gender.percentage}%</div>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="bg-linear-to-r from-pink-600 to-purple-600 h-2 rounded-full"
                style="width: {gender.percentage}%"
              ></div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Top Countries -->
      <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-foreground mb-4">Top Countries</h3>
        <div class="space-y-3">
          {#each analyticsData.demographics.topCountries as country}
            <div class="flex items-center justify-between">
              <div class="text-foreground">{country.country}</div>
              <div class="flex items-center">
                <div class="text-foreground font-medium mr-2">{country.percentage}%</div>
                <div class="w-16 bg-gray-700 rounded-full h-2">
                  <div 
                    class="bg-linear-to-r from-yellow-600 to-orange-600 h-2 rounded-full"
                    style="width: {country.percentage}%"
                  ></div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!--
      Performance Insights — derived from the real KPI payload, not
      hardcoded boilerplate. The prior version had four static cards
      claiming "Worship content shows highest engagement" / "47%
      mobile" / "7–9 PM peak" / "25-44 most engaged" regardless of the
      creator's actual data, which read as fake. Now: top-performing
      content title, top device share (if any), top country (if any),
      and the size of the content library — all computed locally from
      the same payload the KPIs render from.
    -->
    {@const topContent = analyticsData.contentPerformance?.[0]}
    {@const topDevice = analyticsData.viewsByDevice?.[0]}
    {@const topCountry = analyticsData.demographics?.topCountries?.[0]}
    {@const libSize = analyticsData.contentPerformance?.length ?? 0}
    <div class="surface-2 backdrop-blur-sm rounded-xl p-6">
      <h3 class="text-xl font-bold text-foreground mb-4">Performance Insights</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400 mb-2">📈</div>
          <div class="text-foreground font-medium">Top Performer</div>
          <div class="text-muted-foreground text-sm">
            {topContent?.title
              ? `${topContent.title} (${formatNumber(topContent.views)} views)`
              : 'No view data yet'}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400 mb-2">📱</div>
          <div class="text-foreground font-medium">Top Device</div>
          <div class="text-muted-foreground text-sm">
            {topDevice
              ? `${topDevice.device} · ${topDevice.pct ?? topDevice.percentage ?? 0}%`
              : 'Awaiting device data'}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-400 mb-2">🌍</div>
          <div class="text-foreground font-medium">Top Country</div>
          <div class="text-muted-foreground text-sm">
            {topCountry
              ? `${topCountry.country} · ${formatNumber(topCountry.count ?? 0)} views`
              : 'Awaiting geo data'}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-400 mb-2">🎯</div>
          <div class="text-foreground font-medium">Library Size</div>
          <div class="text-muted-foreground text-sm">
            {libSize} {libSize === 1 ? 'title' : 'titles'} published
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>