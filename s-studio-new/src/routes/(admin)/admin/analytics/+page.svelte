<!-- Admin Analytics Dashboard -->
<script lang="ts">
  import { onMount } from 'svelte';
  
  interface PlatformMetrics {
    totalUsers: number;
    activeCreators: number;
    totalContent: number;
    totalViews: number;
    totalRevenue: number;
    newUsersToday: number;
    contentPublishedToday: number;
    viewsToday: number;
  }
  
  interface ContentAnalytics {
    category: string;
    count: number;
    views: number;
    engagement: number;
  }
  
  interface UserGrowthData {
    date: string;
    users: number;
    creators: number;
  }
  
  interface RevenueData {
    month: string;
    revenue: number;
    payouts: number;
  }
  
  interface GeographicData {
    country: string;
    users: number;
    percentage: number;
  }
  
  let platformMetrics: PlatformMetrics = {
    totalUsers: 0,
    activeCreators: 0,
    totalContent: 0,
    totalViews: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    contentPublishedToday: 0,
    viewsToday: 0
  };
  
  let contentAnalytics: ContentAnalytics[] = [];
  let userGrowthData: UserGrowthData[] = [];
  let revenueData: RevenueData[] = [];
  let geographicData: GeographicData[] = [];
  let topCreators: any[] = [];
  let topContent: any[] = [];
  
  let loading = true;
  let selectedTimeRange = '30d';
  let selectedMetric = 'views';
  
  onMount(() => {
    loadAnalytics();
  });
  
  function loadAnalytics() {
    loading = true;
    
    // Mock data - TODO: Replace with actual API calls
    setTimeout(() => {
      platformMetrics = {
        totalUsers: 45789,
        activeCreators: 342,
        totalContent: 2847,
        totalViews: 3847291,
        totalRevenue: 287459.75,
        newUsersToday: 127,
        contentPublishedToday: 23,
        viewsToday: 18472
      };
      
      contentAnalytics = [
        { category: 'Sermons', count: 1247, views: 1847291, engagement: 0.087 },
        { category: 'Bible Studies', count: 689, views: 923847, engagement: 0.124 },
        { category: 'Worship', count: 445, views: 672934, engagement: 0.098 },
        { category: 'Youth Ministry', count: 278, views: 234891, engagement: 0.156 },
        { category: 'Testimonies', count: 188, views: 168328, engagement: 0.203 }
      ];
      
      userGrowthData = [
        { date: '2024-08-01', users: 42345, creators: 298 },
        { date: '2024-08-08', users: 43120, creators: 305 },
        { date: '2024-08-15', users: 43890, creators: 315 },
        { date: '2024-08-22', users: 44567, creators: 324 },
        { date: '2024-08-29', users: 45234, creators: 335 },
        { date: '2024-09-05', users: 45789, creators: 342 }
      ];
      
      revenueData = [
        { month: 'Jan', revenue: 245678, payouts: 184759 },
        { month: 'Feb', revenue: 267834, payouts: 201234 },
        { month: 'Mar', revenue: 289456, payouts: 217092 },
        { month: 'Apr', revenue: 312789, payouts: 234591 },
        { month: 'May', revenue: 334567, payouts: 250925 },
        { month: 'Jun', revenue: 356890, payouts: 267667 },
        { month: 'Jul', revenue: 378234, payouts: 283675 },
        { month: 'Aug', revenue: 398567, payouts: 298925 }
      ];
      
      geographicData = [
        { country: 'United States', users: 18456, percentage: 40.3 },
        { country: 'Nigeria', users: 8934, percentage: 19.5 },
        { country: 'United Kingdom', users: 4567, percentage: 10.0 },
        { country: 'Canada', users: 3890, percentage: 8.5 },
        { country: 'South Africa', users: 2845, percentage: 6.2 },
        { country: 'Kenya', users: 2134, percentage: 4.7 },
        { country: 'Ghana', users: 1845, percentage: 4.0 },
        { country: 'Australia', users: 1567, percentage: 3.4 },
        { country: 'Others', users: 1551, percentage: 3.4 }
      ];
      
      topCreators = [
        { name: 'Pastor John Smith', ministry: 'Faith Community Church', views: 125000, content: 45, revenue: 2450.75 },
        { name: 'Dr. Elizabeth Davis', ministry: 'Biblical Studies Institute', views: 245000, content: 78, revenue: 4200.00 },
        { name: 'Sarah Johnson', ministry: 'Gospel Harmony Ministry', views: 89000, content: 32, revenue: 1650.25 },
        { name: 'Pastor Mark Thompson', ministry: 'Grace Fellowship', views: 167000, content: 56, revenue: 3100.50 },
        { name: 'Rebecca Martinez', ministry: 'Youth for Christ', views: 76500, content: 28, revenue: 1275.80 }
      ];
      
      topContent = [
        { title: 'The Power of Prayer', creator: 'Pastor John Smith', views: 45782, engagement: 0.156, category: 'Sermons' },
        { title: 'Understanding Grace', creator: 'Dr. Elizabeth Davis', views: 38294, engagement: 0.142, category: 'Bible Studies' },
        { title: 'Worship in Spirit & Truth', creator: 'Sarah Johnson', views: 34891, engagement: 0.187, category: 'Worship' },
        { title: 'Faith in Hard Times', creator: 'Pastor Mark Thompson', views: 29847, engagement: 0.134, category: 'Sermons' },
        { title: 'Youth Ministry Essentials', creator: 'Rebecca Martinez', views: 25634, engagement: 0.203, category: 'Youth Ministry' }
      ];
      
      loading = false;
    }, 1000);
  }
  
  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
  
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  function formatPercentage(value: number): string {
    return (value * 100).toFixed(1) + '%';
  }
  
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Sermons': 'bg-blue-500',
      'Bible Studies': 'bg-green-500',
      'Worship': 'bg-purple-500',
      'Youth Ministry': 'bg-yellow-500',
      'Testimonies': 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-white">Platform Analytics</h1>
      <p class="text-gray-300">Monitor platform performance and user engagement</p>
    </div>
    
    <div class="flex items-center space-x-4">
      <select 
        bind:value={selectedTimeRange}
        onchange={loadAnalytics}
        class="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
      >
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
        <option value="1y">Last Year</option>
      </select>
      
      <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
        📊 Export Report
      </button>
    </div>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-300">Loading analytics data...</p>
    </div>
  {:else}
    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-white">{formatNumber(platformMetrics.totalUsers)}</div>
            <div class="text-gray-300 text-sm">Total Users</div>
            <div class="text-green-400 text-xs mt-1">+{platformMetrics.newUsersToday} today</div>
          </div>
          <div class="text-blue-400 text-3xl">👥</div>
        </div>
      </div>
      
      <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-white">{platformMetrics.activeCreators}</div>
            <div class="text-gray-300 text-sm">Active Creators</div>
            <div class="text-purple-400 text-xs mt-1">{formatNumber(platformMetrics.totalContent)} content items</div>
          </div>
          <div class="text-purple-400 text-3xl">🎬</div>
        </div>
      </div>
      
      <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-white">{formatNumber(platformMetrics.totalViews)}</div>
            <div class="text-gray-300 text-sm">Total Views</div>
            <div class="text-green-400 text-xs mt-1">+{formatNumber(platformMetrics.viewsToday)} today</div>
          </div>
          <div class="text-green-400 text-3xl">👁️</div>
        </div>
      </div>
      
      <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-white">{formatCurrency(platformMetrics.totalRevenue)}</div>
            <div class="text-gray-300 text-sm">Total Revenue</div>
            <div class="text-yellow-400 text-xs mt-1">{platformMetrics.contentPublishedToday} published today</div>
          </div>
          <div class="text-yellow-400 text-3xl">💰</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Content Categories -->
      <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-4">Content by Category</h2>
        <div class="space-y-4">
          {#each contentAnalytics as category}
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full {getCategoryColor(category.category)}"></div>
                <span class="text-white">{category.category}</span>
              </div>
              <div class="text-right">
                <div class="text-white font-medium">{category.count} items</div>
                <div class="text-gray-400 text-sm">{formatNumber(category.views)} views</div>
              </div>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div 
                class="h-2 rounded-full {getCategoryColor(category.category)}" 
                style="width: {(category.views / Math.max(...contentAnalytics.map(c => c.views))) * 100}%"
              ></div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-4">Users by Country</h2>
        <div class="space-y-3">
          {#each geographicData.slice(0, 6) as country}
            <div class="flex items-center justify-between">
              <span class="text-white">{country.country}</span>
              <div class="flex items-center space-x-3">
                <div class="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    class="h-2 bg-red-500 rounded-full" 
                    style="width: {country.percentage}%"
                  ></div>
                </div>
                <span class="text-gray-300 text-sm w-12 text-right">{country.percentage}%</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <h2 class="text-xl font-bold text-white mb-4">Revenue & Payouts Trend</h2>
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4 items-end h-64">
        {#each revenueData as data}
          <div class="flex flex-col items-center space-y-2">
            <div class="flex flex-col items-center space-y-1 flex-1 justify-end">
              <div 
                class="bg-green-500 rounded-t w-8"
                style="height: {(data.revenue / Math.max(...revenueData.map(d => d.revenue))) * 180}px"
                title="Revenue: {formatCurrency(data.revenue)}"
              ></div>
              <div 
                class="bg-blue-500 rounded-b w-8"
                style="height: {(data.payouts / Math.max(...revenueData.map(d => d.payouts))) * 120}px"
                title="Payouts: {formatCurrency(data.payouts)}"
              ></div>
            </div>
            <span class="text-gray-300 text-xs">{data.month}</span>
          </div>
        {/each}
      </div>
      <div class="flex items-center justify-center space-x-6 mt-4">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-green-500 rounded"></div>
          <span class="text-gray-300 text-sm">Revenue</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-blue-500 rounded"></div>
          <span class="text-gray-300 text-sm">Payouts</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Creators -->
      <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-4">Top Creators</h2>
        <div class="space-y-4">
          {#each topCreators as creator, index}
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div class="flex-1">
                <div class="text-white font-medium">{creator.name}</div>
                <div class="text-gray-400 text-sm">{creator.ministry}</div>
              </div>
              <div class="text-right">
                <div class="text-white font-medium">{formatNumber(creator.views)} views</div>
                <div class="text-gray-400 text-sm">{creator.content} content • {formatCurrency(creator.revenue)}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Top Content -->
      <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-4">Top Content</h2>
        <div class="space-y-4">
          {#each topContent as content, index}
            <div class="flex items-center space-x-4">
              <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div class="flex-1">
                <div class="text-white font-medium">{content.title}</div>
                <div class="text-gray-400 text-sm">{content.creator} • {content.category}</div>
              </div>
              <div class="text-right">
                <div class="text-white font-medium">{formatNumber(content.views)} views</div>
                <div class="text-gray-400 text-sm">{formatPercentage(content.engagement)} engagement</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- User Growth Chart -->
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
      <h2 class="text-xl font-bold text-white mb-4">User Growth Trend</h2>
      <div class="grid grid-cols-6 gap-4 items-end h-48">
        {#each userGrowthData as data}
          <div class="flex flex-col items-center space-y-2">
            <div class="flex flex-col items-center space-y-1 flex-1 justify-end">
              <div 
                class="bg-blue-500 rounded-t w-12"
                style="height: {(data.users / Math.max(...userGrowthData.map(d => d.users))) * 120}px"
                title="Users: {data.users.toLocaleString()}"
              ></div>
              <div 
                class="bg-purple-500 rounded-b w-12"
                style="height: {(data.creators / Math.max(...userGrowthData.map(d => d.creators))) * 80}px"
                title="Creators: {data.creators}"
              ></div>
            </div>
            <span class="text-gray-300 text-xs">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        {/each}
      </div>
      <div class="flex items-center justify-center space-x-6 mt-4">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-blue-500 rounded"></div>
          <span class="text-gray-300 text-sm">Users</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-purple-500 rounded"></div>
          <span class="text-gray-300 text-sm">Creators</span>
        </div>
      </div>
    </div>
  {/if}
</div>