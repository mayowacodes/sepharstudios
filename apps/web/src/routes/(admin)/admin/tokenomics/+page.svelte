<!-- Admin Tokenomics Control Panel -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { stcToken, tokenAMM } from '$lib/web3/contracts';
  import {
    Coins,
    TrendingUp,
    DollarSign,
    Users,
    Activity,
    Settings,
    Crown,
    RefreshCw,
    AlertCircle
  } from '@lucide/svelte';

  let tokenomicsData = $state({
    stcPrice: '0',
    totalSupply: '0',
    circulatingSupply: '0',
    totalStaked: '0',
    monthlyRevenue: '0',
    buybackAmount: '0',
    creatorPool: '0',
    userRewardPool: '0',
    stakingTiers: {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0
    }
  });

  let creatorStats = $state({
    totalCreators: 127,
    averageRevenue: 0,
    topCreatorEarnings: 0,
    totalPayments: 0
  });

  let revenueDistribution = $state({
    platformOperations: 55,
    creatorRevenue: 30,
    stcBuyback: 8,
    userRewards: 4,
    platformReserve: 3
  });

  let adminActions = $state({
    isAdjusting: false,
    actionResult: '',
    newDistribution: {
      platformOperations: 55,
      creatorRevenue: 30,
      stcBuyback: 8,
      userRewards: 4,
      platformReserve: 3
    }
  });

  onMount(async () => {
    await loadTokenomicsData();
    loadCreatorStats();
  });

  async function loadTokenomicsData() {
    try {
      const [price, poolInfo, totalSupply] = await Promise.all([
        tokenAMM.getSTCPrice(),
        tokenAMM.getPoolInfo(),
        stcToken.totalSupply()
      ]);

      const monthlyRev = parseFloat(poolInfo.monthlyRevenue);
      const supply = parseFloat(totalSupply);
      const circulating = supply * 0.75; // 75% circulating supply

      tokenomicsData = {
        stcPrice: price,
        totalSupply: totalSupply,
        circulatingSupply: circulating.toString(),
        totalStaked: poolInfo.stcBalance,
        monthlyRevenue: poolInfo.monthlyRevenue,
        buybackAmount: (monthlyRev * (revenueDistribution.stcBuyback / 100)).toFixed(2),
        creatorPool: (monthlyRev * (revenueDistribution.creatorRevenue / 100)).toFixed(2),
        userRewardPool: (monthlyRev * (revenueDistribution.userRewards / 100)).toFixed(2),
        stakingTiers: await loadStakingTierData()
      };
    } catch (error) {
      console.error('Error loading tokenomics data:', error);
      // Fallback values if contract calls fail
      const monthlyRev = 50000;
      tokenomicsData = {
        stcPrice: '0.25',
        totalSupply: '10000000',
        circulatingSupply: '7500000',
        totalStaked: '2500000',
        monthlyRevenue: monthlyRev.toString(),
        buybackAmount: (monthlyRev * (revenueDistribution.stcBuyback / 100)).toFixed(2),
        creatorPool: (monthlyRev * (revenueDistribution.creatorRevenue / 100)).toFixed(2),
        userRewardPool: (monthlyRev * (revenueDistribution.userRewards / 100)).toFixed(2),
        stakingTiers: {
          bronze: 15000, // Mock fallback data
          silver: 8500,
          gold: 2800,
          platinum: 450
        }
      };
    }
  }

  async function loadStakingTierData() {
    // Mock staking tier distribution - TODO: Replace with actual contract calls
    // This could involve calling stcToken.getStakingInfo for multiple addresses
    // and aggregating the data by tier
    return {
      bronze: Math.floor(Math.random() * 10000) + 15000, // 1K-5K STC holders
      silver: Math.floor(Math.random() * 5000) + 8000,   // 5K-25K STC holders
      gold: Math.floor(Math.random() * 2000) + 2500,     // 25K-100K STC holders
      platinum: Math.floor(Math.random() * 500) + 400    // 100K+ STC holders
    };
  }

  async function refreshAllData() {
    adminActions.isAdjusting = true;
    try {
      await loadTokenomicsData();
      loadCreatorStats();
      adminActions.actionResult = 'All tokenomics data refreshed successfully';
    } catch (error: any) {
      adminActions.actionResult = `Error refreshing data: ${error.message}`;
    } finally {
      adminActions.isAdjusting = false;
    }
  }

  function loadCreatorStats() {
    // Mock data - TODO: Replace with API
    const monthlyRev = parseFloat(tokenomicsData.monthlyRevenue) || 50000;
    creatorStats = {
      totalCreators: 127,
      averageRevenue: Math.round((monthlyRev * 0.30) / 127),
      topCreatorEarnings: Math.round((monthlyRev * 0.30) * 0.15), // Top creator gets ~15% of total pool
      totalPayments: Math.round(monthlyRev * 0.30)
    };
  }

  async function adjustRevenueDistribution() {
    adminActions.isAdjusting = true;

    try {
      // Validate new distribution totals 100%
      const total = Object.values(adminActions.newDistribution).reduce((sum, val) => sum + val, 0);
      if (Math.abs(total - 100) > 0.1) {
        throw new Error('Distribution must total 100%');
      }

      // TODO: Call smart contract to update distribution
      // await adminContract.updateRevenueDistribution(adminActions.newDistribution);

      revenueDistribution = { ...adminActions.newDistribution };
      adminActions.actionResult = 'Revenue distribution updated successfully';

      // Reload data to reflect changes
      await loadTokenomicsData();
      loadCreatorStats();

    } catch (error: any) {
      adminActions.actionResult = `Error: ${error.message}`;
    } finally {
      adminActions.isAdjusting = false;
    }
  }

  function resetDistribution() {
    adminActions.newDistribution = { ...revenueDistribution };
  }
</script>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center">
    <h1 class="text-4xl font-bold text-white mb-2">Tokenomics Control Panel</h1>
    <p class="text-xl text-gray-300">Manage STC token economics and revenue distribution</p>
  </div>

  <!-- Token Supply Information -->
  <Card class="bg-linear-to-r from-primary/20 to-secondary/20">
    <CardHeader>
      <CardTitle class="text-white flex items-center">
        <Coins class="h-5 w-5 mr-2" />
        STC Token Supply Information
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-white/10 rounded-lg">
          <div class="text-2xl font-bold text-white">{parseFloat(tokenomicsData.totalSupply).toLocaleString()}</div>
          <div class="text-sm text-gray-300">Total Supply</div>
          <div class="text-xs text-gray-400">Maximum STC tokens</div>
        </div>
        <div class="text-center p-4 bg-white/10 rounded-lg">
          <div class="text-2xl font-bold text-white">{parseFloat(tokenomicsData.circulatingSupply).toLocaleString()}</div>
          <div class="text-sm text-gray-300">Circulating Supply</div>
          <div class="text-xs text-gray-400">{((parseFloat(tokenomicsData.circulatingSupply) / parseFloat(tokenomicsData.totalSupply)) * 100).toFixed(1)}% of total</div>
        </div>
        <div class="text-center p-4 bg-white/10 rounded-lg">
          <div class="text-2xl font-bold text-white">{parseFloat(tokenomicsData.totalStaked).toLocaleString()}</div>
          <div class="text-sm text-gray-300">Total Staked</div>
          <div class="text-xs text-gray-400">{((parseFloat(tokenomicsData.totalStaked) / parseFloat(tokenomicsData.circulatingSupply)) * 100).toFixed(1)}% of circulating</div>
        </div>
      </div>
      <div class="mt-4 flex justify-center">
        <Button onclick={refreshAllData} disabled={adminActions.isAdjusting} variant="outline">
          {#if adminActions.isAdjusting}
            <RefreshCw class="mr-2 h-4 w-4 animate-spin" />
            Refreshing...
          {:else}
            <RefreshCw class="mr-2 h-4 w-4" />
            Refresh Token Data
          {/if}
        </Button>
      </div>
    </CardContent>
  </Card>

  <!-- Staking Tiers Distribution -->
  <Card class="bg-linear-to-r from-accent/20 to-secondary/20">
    <CardHeader>
      <CardTitle class="text-white flex items-center">
        <Users class="h-5 w-5 mr-2" />
        Staking Tiers Distribution
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-white/10 rounded-lg">
          <div class="text-2xl font-bold text-yellow-500">{tokenomicsData.stakingTiers.bronze.toLocaleString()}</div>
          <div class="text-sm text-gray-300">Bronze Tier</div>
          <div class="text-xs text-gray-400">1K+ STC • 10% discount</div>
        </div>
        <div class="text-center p-4 bg-white/10 rounded-lg">
          <div class="text-2xl font-bold text-gray-400">{tokenomicsData.stakingTiers.silver.toLocaleString()}</div>
          <div class="text-sm text-gray-300">Silver Tier</div>
          <div class="text-xs text-gray-400">5K+ STC • 25% discount</div>
        </div>
        <div class="text-center p-4 bg-white/10 rounded-lg">
          <div class="text-2xl font-bold text-amber-500">{tokenomicsData.stakingTiers.gold.toLocaleString()}</div>
          <div class="text-sm text-gray-300">Gold Tier</div>
          <div class="text-xs text-gray-400">25K+ STC • 40% discount</div>
        </div>
        <div class="text-center p-4 bg-white/10 rounded-lg">
          <div class="text-2xl font-bold text-purple-400">{tokenomicsData.stakingTiers.platinum.toLocaleString()}</div>
          <div class="text-sm text-gray-300">Platinum Tier</div>
          <div class="text-xs text-gray-400">100K+ STC • 50% discount</div>
        </div>
      </div>
      <div class="mt-4 text-center">
        <div class="text-sm text-gray-300">
          Total Stakers: {(tokenomicsData.stakingTiers.bronze + tokenomicsData.stakingTiers.silver + tokenomicsData.stakingTiers.gold + tokenomicsData.stakingTiers.platinum).toLocaleString()}
        </div>
        <div class="text-xs text-gray-400 mt-1">
          Distribution drives subscription discount utilization and platform loyalty
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Current Tokenomics Overview -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <Card class="bg-primary/20">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium text-gray-300 flex items-center">
          <DollarSign class="h-4 w-4 mr-2" />
          STC Price
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="text-2xl font-bold text-white">${tokenomicsData.stcPrice.slice(0,8)}</div>
        <Badge class="text-xs mt-1" variant="secondary">USDC</Badge>
      </CardContent>
    </Card>

    <Card class="bg-secondary/20">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium text-gray-300 flex items-center">
          <Coins class="h-4 w-4 mr-2" />
          Total Staked
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="text-2xl font-bold text-white">{parseFloat(tokenomicsData.totalStaked).toLocaleString()}</div>
        <Badge class="text-xs mt-1" variant="secondary">STC</Badge>
      </CardContent>
    </Card>

    <Card class="bg-accent/20">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium text-gray-300 flex items-center">
          <TrendingUp class="h-4 w-4 mr-2" />
          Monthly Revenue
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="text-2xl font-bold text-white">${parseFloat(tokenomicsData.monthlyRevenue).toLocaleString()}</div>
        <Badge class="text-xs mt-1" variant="secondary">USD</Badge>
      </CardContent>
    </Card>

    <Card class="bg-green-500/20">
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium text-gray-300 flex items-center">
          <Activity class="h-4 w-4 mr-2" />
          Monthly Buyback
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="text-2xl font-bold text-white">${parseFloat(tokenomicsData.buybackAmount).toLocaleString()}</div>
        <Badge class="text-xs mt-1" variant="secondary">USD</Badge>
      </CardContent>
    </Card>
  </div>

  <!-- Revenue Distribution Management -->
  <Card class="bg-white/5">
    <CardHeader>
      <CardTitle class="text-white flex items-center">
        <Settings class="h-5 w-5 mr-2" />
        Revenue Distribution Settings
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Current Distribution -->
      <div>
        <h4 class="text-lg font-medium text-white mb-4">Current Distribution</h4>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="text-center p-4 bg-blue-500/20 rounded-lg">
            <div class="text-2xl font-bold text-white">{revenueDistribution.platformOperations}%</div>
            <div class="text-sm text-gray-300">Platform Operations</div>
            <div class="text-xs text-gray-400">${(parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.platformOperations / 100).toLocaleString()}</div>
          </div>
          <div class="text-center p-4 bg-green-500/20 rounded-lg">
            <div class="text-2xl font-bold text-white">{revenueDistribution.creatorRevenue}%</div>
            <div class="text-sm text-gray-300">Creator Revenue</div>
            <div class="text-xs text-gray-400">${(parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.creatorRevenue / 100).toLocaleString()}</div>
          </div>
          <div class="text-center p-4 bg-orange-500/20 rounded-lg">
            <div class="text-2xl font-bold text-white">{revenueDistribution.stcBuyback}%</div>
            <div class="text-sm text-gray-300">STC Buyback</div>
            <div class="text-xs text-gray-400">${(parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.stcBuyback / 100).toLocaleString()}</div>
          </div>
          <div class="text-center p-4 bg-purple-500/20 rounded-lg">
            <div class="text-2xl font-bold text-white">{revenueDistribution.userRewards}%</div>
            <div class="text-sm text-gray-300">User Rewards</div>
            <div class="text-xs text-gray-400">${(parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.userRewards / 100).toLocaleString()}</div>
          </div>
          <div class="text-center p-4 bg-gray-500/20 rounded-lg">
            <div class="text-2xl font-bold text-white">{revenueDistribution.platformReserve}%</div>
            <div class="text-sm text-gray-300">Platform Reserve</div>
            <div class="text-xs text-gray-400">${(parseFloat(tokenomicsData.monthlyRevenue) * revenueDistribution.platformReserve / 100).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <!-- Adjustment Form -->
      <div class="border-t border-gray-600 pt-6">
        <h4 class="text-lg font-medium text-white mb-4">Adjust Distribution</h4>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label class="text-gray-300">Platform Operations (%)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              bind:value={adminActions.newDistribution.platformOperations}
            />
          </div>
          <div>
            <Label class="text-gray-300">Creator Revenue (%)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              bind:value={adminActions.newDistribution.creatorRevenue}
            />
          </div>
          <div>
            <Label class="text-gray-300">STC Buyback (%)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              bind:value={adminActions.newDistribution.stcBuyback}
            />
          </div>
          <div>
            <Label class="text-gray-300">User Rewards (%)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              bind:value={adminActions.newDistribution.userRewards}
            />
          </div>
          <div>
            <Label class="text-gray-300">Platform Reserve (%)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              bind:value={adminActions.newDistribution.platformReserve}
            />
          </div>
        </div>

        <div class="mt-4 flex items-center space-x-4">
          <div class="text-sm text-gray-300">
            Total: {Object.values(adminActions.newDistribution).reduce((sum, val) => sum + Number(val), 0).toFixed(1)}%
          </div>
          {#if Math.abs(Object.values(adminActions.newDistribution).reduce((sum, val) => sum + Number(val), 0) - 100) > 0.1}
            <Badge variant="destructive" class="text-xs">
              <AlertCircle class="h-3 w-3 mr-1" />
              Must total 100%
            </Badge>
          {/if}
        </div>

        <div class="mt-4 flex space-x-3">
          <Button
            onclick={adjustRevenueDistribution}
            disabled={adminActions.isAdjusting}
            class="bg-primary hover:bg-primary/90"
          >
            {#if adminActions.isAdjusting}
              <RefreshCw class="mr-2 h-4 w-4 animate-spin" />
              Updating...
            {:else}
              <Settings class="mr-2 h-4 w-4" />
              Update Distribution
            {/if}
          </Button>
          <Button variant="outline" onclick={resetDistribution}>
            Reset Changes
          </Button>
        </div>

        {#if adminActions.actionResult}
          <div class="mt-4 p-3 bg-gray-800 border rounded-lg">
            <p class="text-sm text-white">{adminActions.actionResult}</p>
          </div>
        {/if}
      </div>
    </CardContent>
  </Card>

  <!-- Creator Revenue Analytics -->
  <Card class="bg-white/5">
    <CardHeader>
      <CardTitle class="text-white flex items-center">
        <Users class="h-5 w-5 mr-2" />
        Creator Revenue Analytics
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-green-500/20 rounded-lg">
          <div class="text-2xl font-bold text-white">{creatorStats.totalCreators}</div>
          <div class="text-sm text-gray-300">Active Creators</div>
        </div>
        <div class="text-center p-4 bg-blue-500/20 rounded-lg">
          <div class="text-2xl font-bold text-white">${creatorStats.averageRevenue.toLocaleString()}</div>
          <div class="text-sm text-gray-300">Average Monthly Revenue</div>
        </div>
        <div class="text-center p-4 bg-yellow-500/20 rounded-lg">
          <div class="text-2xl font-bold text-white">${creatorStats.topCreatorEarnings.toLocaleString()}</div>
          <div class="text-sm text-gray-300">Top Creator Earnings</div>
        </div>
        <div class="text-center p-4 bg-purple-500/20 rounded-lg">
          <div class="text-2xl font-bold text-white">${creatorStats.totalPayments.toLocaleString()}</div>
          <div class="text-sm text-gray-300">Total Monthly Payouts</div>
        </div>
      </div>

      <div class="mt-6 flex space-x-3">
        <Button href="/admin/creators" class="bg-secondary hover:bg-secondary/90">
          <Users class="mr-2 h-4 w-4" />
          Manage Creator Payments
        </Button>
        <Button href="/admin/analytics" variant="outline">
          <TrendingUp class="mr-2 h-4 w-4" />
          View Full Analytics
        </Button>
      </div>
    </CardContent>
  </Card>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Button href="/admin/creators" class="h-16 bg-green-600 hover:bg-green-700">
      <div class="text-center">
        <Users class="h-6 w-6 mx-auto mb-1" />
        <div class="text-sm font-medium">Manage Creators</div>
      </div>
    </Button>

    <Button href="/admin/analytics" class="h-16 bg-blue-600 hover:bg-blue-700">
      <div class="text-center">
        <TrendingUp class="h-6 w-6 mx-auto mb-1" />
        <div class="text-sm font-medium">Revenue Analytics</div>
      </div>
    </Button>

    <Button href="/admin" variant="outline" class="h-16">
      <div class="text-center">
        <Crown class="h-6 w-6 mx-auto mb-1" />
        <div class="text-sm font-medium">Back to Dashboard</div>
      </div>
    </Button>
  </div>
</div>