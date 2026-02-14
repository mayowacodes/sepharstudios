<!-- Admin Dashboard Home -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { stcToken, tokenAMM, subscriptionContract } from '$lib/web3/contracts';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Coins, Crown, TrendingUp, Users, DollarSign, Activity } from '@lucide/svelte';

  // Mock admin data - TODO: Replace with real API
  let adminStats = $state({
    pendingReviews: 0,
    totalCreators: 0,
    publishedContent: 0,
    rejectedContent: 0,
    totalViews: 0
  });

  // Web3 platform metrics
  let tokenomicsStats = $state({
    stcPrice: '0',
    totalStaked: '0',
    activeNFTs: 0,
    monthlyRevenue: '0',
    revenuePool: '0',
    buybackAmount: '0'
  });

  // Admin Web3 status
  let adminWeb3Status = $state({
    stcBalance: '0',
    subscriptionCount: 0,
    isConnected: false,
    hasSubscription: false,
    subscriptionTier: 0,
    subscriptionTokenId: 0
  });
  
  onMount(async () => {
    // TODO: Load admin stats from API
    adminStats = {
      pendingReviews: 15,
      totalCreators: 127,
      publishedContent: 892,
      rejectedContent: 23,
      totalViews: 2456782
    };

    // Load Web3 metrics
    try {
      const [price, poolInfo, totalSupply] = await Promise.all([
        tokenAMM.getSTCPrice(),
        tokenAMM.getPoolInfo(),
        stcToken.totalSupply()
      ]);

      // Get admin wallet info if connected
      const account = { address: '0x1234567890123456789012345678901234567890' }; // Mock admin address
      let adminBalance = '0';
      try {
        adminBalance = await stcToken.balanceOf(account.address);
        adminWeb3Status.isConnected = true;
        adminWeb3Status.stcBalance = adminBalance;
      } catch (err) {
        console.warn('Could not fetch admin balance:', err);
      }

      // Get subscription stats using subscriptionContract
      try {
        // Get admin's subscription status
        const adminSubscription = await subscriptionContract.hasActiveSubscription(account.address);
        const adminSubscriptionDetails = adminSubscription.hasAccess ?
          await subscriptionContract.getSubscriptionStatus(account.address) : null;

        // Mock getting total active subscriptions - in real app would query contract events or have admin getter
        adminWeb3Status.subscriptionCount = 1245;

        // Store admin subscription info
        adminWeb3Status.hasSubscription = adminSubscription.hasAccess;
        adminWeb3Status.subscriptionTier = adminSubscription.tier;
        adminWeb3Status.subscriptionTokenId = adminSubscriptionDetails?.tokenId || 0;
      } catch (err) {
        console.warn('Could not fetch subscription stats:', err);
        adminWeb3Status.subscriptionCount = 0;
      }

      tokenomicsStats = {
        stcPrice: price,
        totalStaked: poolInfo.stcBalance,
        activeNFTs: adminWeb3Status.subscriptionCount,
        monthlyRevenue: poolInfo.monthlyRevenue,
        revenuePool: poolInfo.usdcBalance,
        buybackAmount: (parseFloat(poolInfo.monthlyRevenue) * 0.08).toFixed(2)
      };
    } catch (error) {
      console.error('Error loading Web3 metrics:', error);
    }
  });
</script>

<div class="space-y-8">
  <!-- Welcome Header -->
  <div class="text-center">
    <div class="flex justify-center items-center space-x-4 mb-4">
      <h1 class="text-4xl font-bold text-white">Admin Dashboard</h1>
      <Badge variant="outline" class="bg-green-500/20 text-green-400 border-green-400">
        {adminWeb3Status.isConnected ? 'Web3 Connected' : 'Web3 Disconnected'}
      </Badge>
      {#if parseFloat(adminWeb3Status.stcBalance) > 1000}
        <Badge variant="outline" class="bg-yellow-500/20 text-yellow-400 border-yellow-400">
          Super Admin
        </Badge>
      {/if}
      {#if adminWeb3Status.hasSubscription}
        <Badge variant="outline" class="bg-purple-500/20 text-purple-400 border-purple-400">
          NFT Tier {adminWeb3Status.subscriptionTier} #{adminWeb3Status.subscriptionTokenId}
        </Badge>
      {/if}
    </div>
    <p class="text-xl text-gray-300">Manage platform content and creator community</p>
    {#if adminWeb3Status.isConnected}
      <p class="text-sm text-gray-400 mt-2">
        Admin STC Balance: {parseFloat(adminWeb3Status.stcBalance).toLocaleString()} STC
      </p>
    {/if}
  </div>

  <!-- Platform Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-yellow-400">{adminStats.pendingReviews}</div>
      <div class="text-gray-300 text-sm">Pending Reviews</div>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-blue-400">{adminStats.totalCreators}</div>
      <div class="text-gray-300 text-sm">Active Creators</div>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-green-400">{adminStats.publishedContent}</div>
      <div class="text-gray-300 text-sm">Published Content</div>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-red-400">{adminStats.rejectedContent}</div>
      <div class="text-gray-300 text-sm">Rejected Content</div>
    </div>

    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div class="text-3xl font-bold text-purple-400">{adminStats.totalViews.toLocaleString()}</div>
      <div class="text-gray-300 text-sm">Platform Views</div>
    </div>
  </div>

  <!-- Tokenomics Overview -->
  <Card class="bg-gradient-to-r from-primary/20 to-secondary/20">
    <CardHeader>
      <CardTitle class="flex items-center space-x-2 text-white">
        <Coins class="h-6 w-6" />
        <span>Platform Tokenomics Overview</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div class="text-center p-3 bg-white/10 rounded-lg">
          <DollarSign class="h-6 w-6 mx-auto mb-2 text-green-400" />
          <div class="text-lg font-bold text-white">${tokenomicsStats.stcPrice.slice(0,8)}</div>
          <div class="text-xs text-gray-300">STC Price</div>
        </div>
        <div class="text-center p-3 bg-white/10 rounded-lg">
          <Crown class="h-6 w-6 mx-auto mb-2 text-yellow-400" />
          <div class="text-lg font-bold text-white">{tokenomicsStats.activeNFTs.toLocaleString()}</div>
          <div class="text-xs text-gray-300">Active NFTs</div>
        </div>
        <div class="text-center p-3 bg-white/10 rounded-lg">
          <TrendingUp class="h-6 w-6 mx-auto mb-2 text-blue-400" />
          <div class="text-lg font-bold text-white">${parseFloat(tokenomicsStats.monthlyRevenue).toLocaleString()}</div>
          <div class="text-xs text-gray-300">Monthly Revenue</div>
        </div>
        <div class="text-center p-3 bg-white/10 rounded-lg">
          <Coins class="h-6 w-6 mx-auto mb-2 text-orange-400" />
          <div class="text-lg font-bold text-white">{parseFloat(tokenomicsStats.totalStaked).toLocaleString()}</div>
          <div class="text-xs text-gray-300">STC Staked</div>
        </div>
        <div class="text-center p-3 bg-white/10 rounded-lg">
          <Activity class="h-6 w-6 mx-auto mb-2 text-purple-400" />
          <div class="text-lg font-bold text-white">${parseFloat(tokenomicsStats.buybackAmount).toLocaleString()}</div>
          <div class="text-xs text-gray-300">Monthly Buyback</div>
        </div>
        <div class="text-center p-3 bg-white/10 rounded-lg">
          <Users class="h-6 w-6 mx-auto mb-2 text-cyan-400" />
          <div class="text-lg font-bold text-white">${parseFloat(tokenomicsStats.revenuePool).toLocaleString()}</div>
          <div class="text-xs text-gray-300">Creator Pool</div>
        </div>
      </div>
      <div class="mt-4 flex space-x-3">
        <Button href="/admin/tokenomics" class="bg-primary hover:bg-primary/90">
          <Coins class="mr-2 h-4 w-4" />
          Manage Tokenomics
        </Button>
        <Button href="/admin/creators" variant="outline">
          <Users class="mr-2 h-4 w-4" />
          Creator Payments
        </Button>
      </div>
    </CardContent>
  </Card>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
    <a href="/admin/review" class="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-center hover:from-yellow-700 hover:to-orange-700 transition-all">
      <div class="text-3xl mb-3">👁️</div>
      <h3 class="text-lg font-bold text-white mb-1">Review Queue</h3>
      <p class="text-gray-200 text-sm">Review pending content</p>
    </a>

    <a href="/admin/content" class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center hover:from-blue-700 hover:to-indigo-700 transition-all">
      <div class="text-3xl mb-3">🎬</div>
      <h3 class="text-lg font-bold text-white mb-1">Content Library</h3>
      <p class="text-gray-200 text-sm">Manage all content</p>
    </a>

    <a href="/admin/creators" class="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-center hover:from-green-700 hover:to-teal-700 transition-all">
      <div class="text-3xl mb-3">👥</div>
      <h3 class="text-lg font-bold text-white mb-1">Creators</h3>
      <p class="text-gray-200 text-sm">Manage creator accounts</p>
    </a>

    <a href="/admin/tokenomics" class="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-6 text-center hover:from-orange-700 hover:to-amber-700 transition-all">
      <div class="text-3xl mb-3">💰</div>
      <h3 class="text-lg font-bold text-white mb-1">Tokenomics</h3>
      <p class="text-gray-200 text-sm">STC & Revenue Control</p>
    </a>

    <a href="/admin/policies" class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-center hover:from-purple-700 hover:to-indigo-700 transition-all">
      <div class="text-3xl mb-3">📋</div>
      <h3 class="text-lg font-bold text-white mb-1">Policies</h3>
      <p class="text-gray-200 text-sm">Content guidelines</p>
    </a>

    <a href="/admin/communications" class="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-center hover:from-cyan-700 hover:to-blue-700 transition-all">
      <div class="text-3xl mb-3">💬</div>
      <h3 class="text-lg font-bold text-white mb-1">Messages</h3>
      <p class="text-gray-200 text-sm">Creator communication</p>
    </a>
  </div>

  <!-- Urgent Reviews -->
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">
    <h2 class="text-2xl font-bold text-white mb-4">Urgent Reviews Required</h2>
    <div class="space-y-4">
      <div class="flex items-center justify-between py-3 border-b border-gray-700">
        <div>
          <div class="text-white font-medium">"The Gospel Truth" - Documentary</div>
          <div class="text-gray-400 text-sm">Submitted 3 days ago • Theological Review Required</div>
        </div>
        <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Urgent</span>
      </div>
      
      <div class="flex items-center justify-between py-3 border-b border-gray-700">
        <div>
          <div class="text-white font-medium">"Youth Ministry Series" - Episode 1</div>
          <div class="text-gray-400 text-sm">Submitted 2 days ago • Content Review Required</div>
        </div>
        <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">High</span>
      </div>
      
      <div class="flex items-center justify-between py-3">
        <div>
          <div class="text-white font-medium">"Worship & Praise Collection"</div>
          <div class="text-gray-400 text-sm">Submitted 1 day ago • Technical Review Required</div>
        </div>
        <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Normal</span>
      </div>
    </div>
    
    <div class="mt-6">
      <a href="/admin/review" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg inline-block transition-colors">
        Review All Pending Content
      </a>
    </div>
  </div>
</div>