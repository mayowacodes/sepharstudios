<!-- Creator Analytics Dashboard -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  // Mock analytics data - replace with real API
  let analyticsData: any = {};
  let isLoading = true;
  let selectedPeriod = '30d';
  let selectedContent = 'all';
  
  onMount(() => {
    // Simulate loading analytics from API
    setTimeout(() => {
      analyticsData = {
        overview: {
          totalViews: 12450,
          totalWatchTime: 8920, // in minutes
          averageWatchTime: 4.2, // in minutes
          completionRate: 68.5, // percentage
          totalLikes: 892,
          totalShares: 156,
          activeViewers: 234,
          growthRate: 12.3 // percentage
        },
        contentPerformance: [
          {
            id: '3',
            title: 'Worship Night Live',
            views: 5420,
            watchTime: 3890,
            likes: 423,
            shares: 89,
            completionRate: 75.2,
            engagement: 8.1
          },
          {
            id: '1',
            title: 'Faith in Action',
            views: 3210,
            watchTime: 2850,
            likes: 287,
            shares: 45,
            completionRate: 62.8,
            engagement: 6.4
          },
          {
            id: '2',
            title: 'Sunday Sermon Series',
            views: 3820,
            watchTime: 2180,
            likes: 182,
            shares: 22,
            completionRate: 58.1,
            engagement: 5.2
          }
        ],
        viewsByDevice: [
          { device: 'Desktop', views: 4523, percentage: 36.3 },
          { device: 'Mobile', views: 5890, percentage: 47.3 },
          { device: 'Tablet', views: 1245, percentage: 10.0 },
          { device: 'Smart TV', views: 792, percentage: 6.4 }
        ],
        demographics: {
          ageGroups: [
            { range: '18-24', percentage: 15.2 },
            { range: '25-34', percentage: 28.7 },
            { range: '35-44', percentage: 23.1 },
            { range: '45-54', percentage: 18.9 },
            { range: '55-64', percentage: 10.8 },
            { range: '65+', percentage: 3.3 }
          ],
          genderDistribution: [
            { gender: 'Female', percentage: 58.2 },
            { gender: 'Male', percentage: 40.1 },
            { gender: 'Other', percentage: 1.7 }
          ],
          topCountries: [
            { country: 'United States', percentage: 67.8 },
            { country: 'Canada', percentage: 12.3 },
            { country: 'United Kingdom', percentage: 8.9 },
            { country: 'Australia', percentage: 5.2 },
            { country: 'Other', percentage: 5.8 }
          ]
        },
        engagementTrends: [
          { date: '2024-01-01', views: 234, likes: 12, shares: 3 },
          { date: '2024-01-02', views: 289, likes: 18, shares: 5 },
          { date: '2024-01-03', views: 345, likes: 23, shares: 7 },
          { date: '2024-01-04', views: 412, likes: 31, shares: 9 },
          { date: '2024-01-05', views: 378, likes: 28, shares: 8 },
          { date: '2024-01-06', views: 456, likes: 35, shares: 12 },
          { date: '2024-01-07', views: 523, likes: 42, shares: 15 }
        ]
      };
      isLoading = false;
    }, 1200);
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
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
      <p class="text-gray-300">Track your content performance and audience engagement</p>
    </div>
    
    <!-- Time Period Selector -->
    <div class="mt-4 sm:mt-0 flex space-x-3">
      <select 
        bind:value={selectedPeriod}
        class="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>
      
      <select 
        bind:value={selectedContent}
        class="px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      >
        <option value="all">All Content</option>
        <option value="3">Worship Night Live</option>
        <option value="1">Faith in Action</option>
        <option value="2">Sunday Sermon Series</option>
      </select>
    </div>
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p class="text-white ml-4">Loading analytics...</p>
    </div>
  {:else}
    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold">{formatNumber(analyticsData.overview.totalViews)}</div>
            <div class="text-blue-100 text-sm">Total Views</div>
          </div>
          <div class="text-3xl opacity-80">👁️</div>
        </div>
        <div class="mt-2 text-blue-100 text-xs">
          +{analyticsData.overview.growthRate}% from last period
        </div>
      </div>
      
      <div class="bg-linear-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold">{formatDuration(analyticsData.overview.totalWatchTime)}</div>
            <div class="text-green-100 text-sm">Total Watch Time</div>
          </div>
          <div class="text-3xl opacity-80">⏱️</div>
        </div>
        <div class="mt-2 text-green-100 text-xs">
          Avg: {analyticsData.overview.averageWatchTime} min per view
        </div>
      </div>
      
      <div class="bg-linear-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold">{analyticsData.overview.completionRate}%</div>
            <div class="text-purple-100 text-sm">Completion Rate</div>
          </div>
          <div class="text-3xl opacity-80">📊</div>
        </div>
        <div class="mt-2 text-purple-100 text-xs">
          Average across all content
        </div>
      </div>
      
      <div class="bg-linear-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold">{formatNumber(analyticsData.overview.totalLikes)}</div>
            <div class="text-orange-100 text-sm">Total Engagement</div>
          </div>
          <div class="text-3xl opacity-80">❤️</div>
        </div>
        <div class="mt-2 text-orange-100 text-xs">
          {formatNumber(analyticsData.overview.totalShares)} shares
        </div>
      </div>
    </div>

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