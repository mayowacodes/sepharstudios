<!-- Creator Dashboard Home -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Home, Video, Clock, CheckCircle2, Eye, DollarSign } from '@lucide/svelte';
  import PageHeader from '$lib/components/dashboard/PageHeader.svelte';
  import KpiCard from '$lib/components/dashboard/KpiCard.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  let creatorStats = $state({
    totalContent: 0,
    pendingReview: 0,
    published: 0,
    totalViews: 0,
    monthlyEarnings: 0
  });

  let recentActivity = $state<{ title: string; status: string; createdAt: string }[]>([]);
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
        recentActivity = items.slice(0, 3).map((item: { title: string; status: string; createdAt: string }) => ({
          title: item.title,
          status: item.status,
          createdAt: item.createdAt
        }));
      }
    } finally {
      loading = false;
    }
  });
</script>

<div class="space-y-8">
  <PageHeader
    icon={Home}
    title="Creator Studio"
    subtitle="Manage your faith-based content and reach believers worldwide."
  />

  <!-- Quick Stats Grid — each card links into its detail page -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    <KpiCard
      label="Total Content"
      value={creatorStats.totalContent}
      icon={Video}
      accent="blue"
      href="/creator/content"
      loading={loading}
      index={0}
    />
    <KpiCard
      label="Pending Review"
      value={creatorStats.pendingReview}
      icon={Clock}
      accent="yellow"
      href="/creator/content?status=pending"
      loading={loading}
      index={1}
    />
    <KpiCard
      label="Published"
      value={creatorStats.published}
      icon={CheckCircle2}
      accent="green"
      href="/creator/content?status=published"
      loading={loading}
      index={2}
    />
    <KpiCard
      label="Total Views"
      value={creatorStats.totalViews.toLocaleString()}
      icon={Eye}
      accent="purple"
      href="/creator/analytics"
      loading={loading}
      index={3}
    />
    <KpiCard
      label="This Month"
      value={`$${creatorStats.monthlyEarnings.toFixed(2)}`}
      icon={DollarSign}
      accent="orange"
      href="/creator/earnings"
      loading={loading}
      index={4}
    />
  </div>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <a href="/creator/upload" class="bg-linear-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center hover:from-purple-700 hover:to-blue-700 transition-all">
      <div class="text-4xl mb-4">🎬</div>
      <h3 class="text-xl font-bold text-white mb-2">Upload New Content</h3>
      <p class="text-gray-200">Share your ministry with the world</p>
    </a>
    
    <a href="/creator/content" class="bg-linear-to-r from-green-600 to-teal-600 rounded-xl p-8 text-center hover:from-green-700 hover:to-teal-700 transition-all">
      <div class="text-4xl mb-4">📚</div>
      <h3 class="text-xl font-bold text-white mb-2">Manage Content</h3>
      <p class="text-gray-200">Edit and organize your library</p>
    </a>
    
    <a href="/creator/analytics" class="bg-linear-to-r from-orange-600 to-red-600 rounded-xl p-8 text-center hover:from-orange-700 hover:to-red-700 transition-all">
      <div class="text-4xl mb-4">📊</div>
      <h3 class="text-xl font-bold text-white mb-2">View Analytics</h3>
      <p class="text-gray-200">Track your impact and growth</p>
    </a>
  </div>

  <!-- Recent Activity -->
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
    <h2 class="text-2xl font-bold text-white mb-4">Recent Activity</h2>
    <div class="space-y-4">
      {#if recentActivity.length === 0}
        <div class="text-gray-400 text-sm">No recent activity yet.</div>
      {:else}
        {#each recentActivity as activity, index (activity.title)}
          <div class={`flex items-center justify-between py-3 ${index < recentActivity.length - 1 ? 'border-b border-gray-700' : ''}`}>
            <div>
              <div class="text-white font-medium">"{activity.title}"</div>
              <div class="text-gray-400 text-sm">{new Date(activity.createdAt).toLocaleString()}</div>
            </div>
            <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              {(activity.status || 'submitted').replace(/_/g, ' ')}
            </span>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
