<!-- Creator Analytics Dashboard -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { BarChart3, Eye, Clock, Target, Heart } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';
  import TrendChart from '$lib/components/dashboard/TrendChart.svelte';
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
        analyticsData = emptyAnalytics();
        return;
      }
      analyticsData = await res.json();
    } catch (err) {
      console.error('Error loading analytics:', err);
      analyticsData = emptyAnalytics();
    } finally {
      isLoading = false;
    }
  }

  // Re-fetch when the period dropdown changes
  $effect(() => {
    void loadAnalytics(selectedPeriod);
  });

  onMount(() => {
    void loadAIInsights();
  });
  
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
  <PageHeader
    icon={BarChart3}
    title="Analytics"
    subtitle="Track your content performance and audience engagement."
  >
    {#snippet actions()}
      <select
        bind:value={selectedPeriod}
        class="px-3 py-1.5 surface-2 rounded-lg text-sm text-white focus:ring-2 focus:ring-purple-600"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>
    {/snippet}
  </PageHeader>

  <!-- AI Insights panel — real data from /api/ai/creator-insights -->
  <div class="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
          <span>✨</span> AI Insights
        </div>
        <h2 class="text-xl font-bold text-white">What your data is telling us</h2>
      </div>
      <button
        type="button"
        onclick={loadAIInsights}
        disabled={aiLoading}
        class="text-xs text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-400 rounded-md px-3 py-1.5 transition-colors disabled:opacity-40"
      >
        {aiLoading ? 'Analysing…' : 'Refresh'}
      </button>
    </div>

    {#if aiLoading && !aiInsights}
      <div class="grid sm:grid-cols-2 gap-3">
        {#each [1,2,3,4] as _}
          <div class="h-20 bg-white/5 rounded-lg animate-pulse"></div>
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
      {#each Array(4) as _ (_)}
        <Skeleton class="h-28 rounded-xl" />
      {/each}
    </div>
    <Skeleton class="h-64 rounded-xl" />
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
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-white mb-4">Content Performance</h3>
        <div class="space-y-4">
          {#each analyticsData.contentPerformance as content}
            <div class="bg-white/5 rounded-lg p-4">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <div class="font-medium text-white">{content.title}</div>
                  <div class="text-sm text-gray-400">{formatNumber(content.views)} views</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-green-400">{content.completionRate}%</div>
                  <div class="text-xs text-gray-400">completion</div>
                </div>
              </div>
              
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div class="text-gray-400">Watch Time</div>
                  <div class="text-white font-medium">{formatDuration(content.watchTime)}</div>
                </div>
                <div>
                  <div class="text-gray-400">Likes</div>
                  <div class="text-white font-medium">{content.likes}</div>
                </div>
                <div>
                  <div class="text-gray-400">Shares</div>
                  <div class="text-white font-medium">{content.shares}</div>
                </div>
              </div>
              
              <!-- Engagement Bar -->
              <div class="mt-3">
                <div class="flex justify-between text-xs text-gray-400 mb-1">
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
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-white mb-4">Viewing Devices</h3>
        <div class="space-y-4">
          {#each analyticsData.viewsByDevice as device}
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-linear-to-r from-purple-600 to-blue-600 mr-3"></div>
                <div>
                  <div class="text-white font-medium">{device.device}</div>
                  <div class="text-sm text-gray-400">{formatNumber(device.views)} views</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-white font-bold">{device.percentage}%</div>
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
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-white mb-4">Age Demographics</h3>
        <div class="space-y-3">
          {#each analyticsData.demographics.ageGroups as group}
            <div class="flex items-center justify-between">
              <div class="text-white">{group.range}</div>
              <div class="flex items-center">
                <div class="text-white font-medium mr-2">{group.percentage}%</div>
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
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-white mb-4">Gender Distribution</h3>
        <div class="space-y-4">
          {#each analyticsData.demographics.genderDistribution as gender}
            <div class="flex items-center justify-between">
              <div class="text-white">{gender.gender}</div>
              <div class="text-white font-bold">{gender.percentage}%</div>
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
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h3 class="text-xl font-bold text-white mb-4">Top Countries</h3>
        <div class="space-y-3">
          {#each analyticsData.demographics.topCountries as country}
            <div class="flex items-center justify-between">
              <div class="text-white">{country.country}</div>
              <div class="flex items-center">
                <div class="text-white font-medium mr-2">{country.percentage}%</div>
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

    <!-- Growth Insights -->
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      <h3 class="text-xl font-bold text-white mb-4">Performance Insights</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400 mb-2">📈</div>
          <div class="text-white font-medium">Best Performing</div>
          <div class="text-gray-400 text-sm">Worship content shows highest engagement</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400 mb-2">📱</div>
          <div class="text-white font-medium">Mobile First</div>
          <div class="text-gray-400 text-sm">47% of views come from mobile devices</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-400 mb-2">⏰</div>
          <div class="text-white font-medium">Peak Hours</div>
          <div class="text-gray-400 text-sm">Most active 7-9 PM local time</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-400 mb-2">🎯</div>
          <div class="text-white font-medium">Target Audience</div>
          <div class="text-gray-400 text-sm">25-44 age group most engaged</div>
        </div>
      </div>
    </div>
  {/if}
</div>