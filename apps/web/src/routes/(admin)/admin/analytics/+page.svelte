<!-- Admin Analytics Dashboard -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { isConnected, walletAddress } from '$lib/web3/wallet';
  import { stcToken, tokenAMM } from '$lib/web3/contracts';
  import { Coins, TrendingUp, Users, Crown, DollarSign, Activity, RefreshCw, Wallet } from '@lucide/svelte';
  
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

  interface TokenomicsMetrics {
    totalStcSupply: string;
    circulatingSupply: string;
    stcPrice: string;
    marketCap: number;
    totalStaked: string;
    stakingRewards: string;
    totalEarned: string;
    burnRate: string;
    subscriptionRevenue: number;
    nftHolders: number;
    avgStakeAmount: string;
    stakingAPY: number;
  }

  interface TokenDistribution {
    category: string;
    amount: string;
    percentage: number;
    color: string;
  }

  interface StakingData {
    tier: string;
    minStake: string;
    discount: number;
    holders: number;
    totalStaked: string;
  }
  
  let platformMetrics = $state<PlatformMetrics>({
    totalUsers: 0,
    activeCreators: 0,
    totalContent: 0,
    totalViews: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    contentPublishedToday: 0,
    viewsToday: 0
  });

  let contentAnalytics = $state<ContentAnalytics[]>([]);
  let userGrowthData = $state<UserGrowthData[]>([]);
  let revenueData = $state<RevenueData[]>([]);
  let geographicData = $state<GeographicData[]>([]);
  let topCreators = $state<any[]>([]);
  let topContent = $state<any[]>([]);

  // Tokenomics data
  let tokenomicsMetrics = $state<TokenomicsMetrics>({
    totalStcSupply: '0',
    circulatingSupply: '0',
    stcPrice: '0',
    marketCap: 0,
    totalStaked: '0',
    stakingRewards: '0',
    totalEarned: '0',
    burnRate: '0',
    subscriptionRevenue: 0,
    nftHolders: 0,
    avgStakeAmount: '0',
    stakingAPY: 0
  });

  let tokenDistribution = $state<TokenDistribution[]>([]);
  let stakingTiers = $state<StakingData[]>([]);

  let loading = $state(true);
  let tokenomicsLoading = $state(false);
  let selectedTimeRange = $state('30d');
  let selectedMetric = $state('views');

  // Admin wallet information
  let adminWalletInfo = $state({
    stcBalance: '0',
    adminPrivileges: false,
    lastLogin: '',
    isLoading: false
  });
  
  onMount(() => {
    loadAnalytics();
    if ($isConnected && $walletAddress) {
      loadTokenomicsData();
      loadAdminWalletInfo();
    }
  });

  async function loadAdminWalletInfo() {
    if (!$walletAddress) return;

    adminWalletInfo.isLoading = true;
    try {
      const balance = await stcToken.balanceOf($walletAddress);

      adminWalletInfo = {
        stcBalance: balance,
        adminPrivileges: true, // TODO: Check actual admin privileges from contract
        lastLogin: new Date().toISOString(),
        isLoading: false
      };
    } catch (error) {
      console.error('Error loading admin wallet info:', error);
      adminWalletInfo.isLoading = false;
    }
  }

  async function loadTokenomicsData() {
    tokenomicsLoading = true;
    try {
      const [totalSupply, price] = await Promise.all([
        stcToken.totalSupply(),
        tokenAMM.getSTCPrice()
      ]);

      tokenomicsMetrics = {
        totalStcSupply: totalSupply,
        circulatingSupply: (parseFloat(totalSupply) * 0.75).toString(),
        stcPrice: price,
        marketCap: parseFloat(totalSupply) * parseFloat(price),
        totalStaked: (parseFloat(totalSupply) * 0.35).toString(),
        stakingRewards: '245000',
        totalEarned: '1250000',
        burnRate: '12500',
        subscriptionRevenue: 125000,
        nftHolders: 2847,
        avgStakeAmount: '15000',
        stakingAPY: 12.5
      };

      tokenDistribution = [
        { category: 'Circulating Supply', amount: tokenomicsMetrics.circulatingSupply, percentage: 75, color: 'bg-primary' },
        { category: 'Staked Tokens', amount: tokenomicsMetrics.totalStaked, percentage: 35, color: 'bg-secondary' },
        { category: 'Rewards Pool', amount: tokenomicsMetrics.stakingRewards, percentage: 15, color: 'bg-accent' },
        { category: 'Treasury', amount: '500000', percentage: 10, color: 'bg-green-500' }
      ];

      stakingTiers = [
        { tier: 'Bronze', minStake: '1000', discount: 10, holders: 15000, totalStaked: '25000000' },
        { tier: 'Silver', minStake: '5000', discount: 25, holders: 8500, totalStaked: '75000000' },
        { tier: 'Gold', minStake: '25000', discount: 40, holders: 2800, totalStaked: '125000000' },
        { tier: 'Platinum', minStake: '100000', discount: 50, holders: 450, totalStaked: '85000000' }
      ];

    } catch (error) {
      console.error('Error loading tokenomics data:', error);
    } finally {
      tokenomicsLoading = false;
    }
  }
  
  async function loadAnalytics() {
    loading = true;
    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedTimeRange}`);
      if (res.ok) {
        const data = await res.json();
        platformMetrics = data.platformMetrics;
        contentAnalytics = data.contentAnalytics;
        userGrowthData = data.userGrowthData;
        revenueData = data.revenueData;
        geographicData = data.geographicData;
        topCreators = data.topCreators;
        topContent = data.topContent;
      }
    } finally {
      loading = false;
    }
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

      <select
        bind:value={selectedMetric}
        class="bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
      >
        <option value="views">Views</option>
        <option value="revenue">Revenue</option>
        <option value="engagement">Engagement</option>
        <option value="users">Users</option>
      </select>
      
      <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
        📊 Export Report
      </button>

      {#if $isConnected}
        <Button
          onclick={() => {
            loadTokenomicsData();
            if ($walletAddress) loadAdminWalletInfo();
          }}
          disabled={tokenomicsLoading || adminWalletInfo.isLoading}
          variant="outline"
        >
          {#if tokenomicsLoading || adminWalletInfo.isLoading}
            <RefreshCw class="mr-2 h-4 w-4 animate-spin" />
          {:else}
            <Coins class="mr-2 h-4 w-4" />
          {/if}
          Refresh Data
        </Button>
      {/if}
    </div>
  </div>

  <!-- Web3 Tokenomics Dashboard -->
  {#if $isConnected}
    <Card class="bg-linear-to-r from-primary/20 to-accent/20 border-primary/30">
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Coins class="h-6 w-6 text-accent" />
          <span>StudioChain Tokenomics Dashboard</span>
          <Badge variant="secondary">Admin View</Badge>
          {#if $walletAddress}
            <Badge variant="outline" class="text-xs">
              {$walletAddress.slice(0, 6)}...{$walletAddress.slice(-4)}
            </Badge>
          {/if}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {#if tokenomicsLoading}
          <div class="text-center py-8">
            <RefreshCw class="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p class="text-muted-foreground">Loading tokenomics data...</p>
          </div>
        {:else}
          <!-- Admin Wallet Information -->
          <div class="mb-6 p-4 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <Wallet class="h-6 w-6 text-blue-400" />
                <div>
                  <h4 class="font-medium text-white">Admin Wallet Connected</h4>
                  <p class="text-sm text-muted-foreground">
                    {$walletAddress ? `${$walletAddress.slice(0, 8)}...${$walletAddress.slice(-6)}` : 'Not Connected'}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-white">
                  {parseFloat(adminWalletInfo.stcBalance).toLocaleString()} STC
                </div>
                <div class="text-xs text-muted-foreground">Admin Balance</div>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between text-sm">
              <div class="flex items-center space-x-4">
                <Badge variant={adminWalletInfo.adminPrivileges ? "default" : "secondary"}>
                  {adminWalletInfo.adminPrivileges ? "✓ Admin Privileges" : "Standard Access"}
                </Badge>
                <span class="text-muted-foreground">
                  Last Login: {new Date(adminWalletInfo.lastLogin).toLocaleTimeString()}
                </span>
              </div>
              <div class="text-muted-foreground">
                Network: Polygon
              </div>
            </div>
          </div>

          <!-- Key Tokenomics Metrics -->
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div class="text-center p-4 bg-white/10 rounded-lg">
              <Coins class="h-6 w-6 text-accent mx-auto mb-2" />
              <div class="text-lg font-bold">{parseFloat(tokenomicsMetrics.stcPrice).toFixed(4)}</div>
              <div class="text-xs text-muted-foreground">STC Price (USD)</div>
            </div>
            <div class="text-center p-4 bg-white/10 rounded-lg">
              <TrendingUp class="h-6 w-6 text-primary mx-auto mb-2" />
              <div class="text-lg font-bold">${formatNumber(tokenomicsMetrics.marketCap)}</div>
              <div class="text-xs text-muted-foreground">Market Cap</div>
            </div>
            <div class="text-center p-4 bg-white/10 rounded-lg">
              <Activity class="h-6 w-6 text-secondary mx-auto mb-2" />
              <div class="text-lg font-bold">{formatNumber(parseFloat(tokenomicsMetrics.totalStaked))}</div>
              <div class="text-xs text-muted-foreground">Total Staked</div>
            </div>
            <div class="text-center p-4 bg-white/10 rounded-lg">
              <Crown class="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div class="text-lg font-bold">{tokenomicsMetrics.nftHolders.toLocaleString()}</div>
              <div class="text-xs text-muted-foreground">NFT Holders</div>
            </div>
            <div class="text-center p-4 bg-white/10 rounded-lg">
              <DollarSign class="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div class="text-lg font-bold">{tokenomicsMetrics.stakingAPY}%</div>
              <div class="text-xs text-muted-foreground">Staking APY</div>
            </div>
            <div class="text-center p-4 bg-white/10 rounded-lg">
              <Users class="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div class="text-lg font-bold">${formatNumber(tokenomicsMetrics.subscriptionRevenue)}</div>
              <div class="text-xs text-muted-foreground">Sub Revenue</div>
            </div>
          </div>

          <!-- Token Distribution & Staking Tiers -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Token Distribution -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold flex items-center">
                <Activity class="h-5 w-5 mr-2 text-primary" />
                Token Distribution
              </h3>
              <div class="space-y-3">
                {#each tokenDistribution as dist}
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-3 h-3 rounded-full {dist.color}"></div>
                      <span class="text-sm">{dist.category}</span>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium">{formatNumber(parseFloat(dist.amount))}</div>
                      <div class="text-xs text-muted-foreground">{dist.percentage}%</div>
                    </div>
                  </div>
                  <div class="w-full bg-muted rounded-full h-2">
                    <div class="h-2 rounded-full {dist.color}" style="width: {dist.percentage}%"></div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Staking Tiers -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold flex items-center">
                <Crown class="h-5 w-5 mr-2 text-accent" />
                Staking Tiers
              </h3>
              <div class="space-y-3">
                {#each stakingTiers as tier}
                  <div class="p-3 bg-white/5 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium">{tier.tier}</span>
                      <Badge variant="outline">{tier.discount}% discount</Badge>
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div>Min: {formatNumber(parseFloat(tier.minStake))}</div>
                      <div>Holders: {tier.holders.toLocaleString()}</div>
                      <div>Staked: {formatNumber(parseFloat(tier.totalStaked))}</div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        {/if}
      </CardContent>
    </Card>
  {:else}
    <Card class="bg-linear-to-r from-orange-500/10 to-accent/10 border-orange-500/20">
      <CardContent class="p-6 text-center">
        <Wallet class="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">Web3 Analytics Unavailable</h3>
        <p class="text-muted-foreground mb-4">Connect wallet to access comprehensive tokenomics analytics and STC token insights</p>
        <Button class="bg-primary hover:bg-primary/90">
          <Wallet class="mr-2 h-4 w-4" />
          Connect Wallet for Full Analytics
        </Button>
      </CardContent>
    </Card>
  {/if}

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
        <h2 class="text-xl font-bold text-white mb-4">
          Content by Category ({selectedMetric === 'views' ? 'Views' : selectedMetric === 'revenue' ? 'Revenue' : selectedMetric === 'engagement' ? 'Engagement' : 'Users'})
        </h2>
        <div class="space-y-4">
          {#each contentAnalytics as category}
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full {getCategoryColor(category.category)}"></div>
                <span class="text-white">{category.category}</span>
              </div>
              <div class="text-right">
                <div class="text-white font-medium">{category.count} items</div>
                <div class="text-gray-400 text-sm">
                  {#if selectedMetric === 'views'}
                    {formatNumber(category.views)} views
                  {:else if selectedMetric === 'revenue'}
                    ${formatNumber(category.views * 0.05)} revenue
                  {:else if selectedMetric === 'engagement'}
                    {formatPercentage(category.engagement)} engagement
                  {:else}
                    {formatNumber(category.views * 0.7)} users
                  {/if}
                </div>
              </div>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div
                class="h-2 rounded-full {getCategoryColor(category.category)}"
                style="width: {(() => {
                  let value, maxValue;
                  if (selectedMetric === 'views') {
                    value = category.views;
                    maxValue = Math.max(...contentAnalytics.map(c => c.views));
                  } else if (selectedMetric === 'revenue') {
                    value = category.views * 0.05;
                    maxValue = Math.max(...contentAnalytics.map(c => c.views * 0.05));
                  } else if (selectedMetric === 'engagement') {
                    value = category.engagement;
                    maxValue = Math.max(...contentAnalytics.map(c => c.engagement));
                  } else {
                    value = category.views * 0.7;
                    maxValue = Math.max(...contentAnalytics.map(c => c.views * 0.7));
                  }
                  return maxValue > 0 ? (value / maxValue * 100) : 0;
                })()}%"
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