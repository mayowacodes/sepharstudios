<!-- Creator Earnings Dashboard -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { isConnected, walletAddress } from '$lib/web3/wallet';
  import { stcToken, tokenAMM, getUserBalances } from '$lib/web3/contracts';
  import WalletConnect from '$lib/components/web3/WalletConnect.svelte';
  import {
    Coins,
    DollarSign,
    TrendingUp,
    Wallet,
    Crown,
    Calendar,
    Activity,
    CreditCard,
    Settings,
    RefreshCw
  } from '@lucide/svelte';

  // Creator earnings data
  let earningsData = $state({
    monthlyRevenue: 1247.50,
    yearlyRevenue: 12450.00,
    totalEarnings: 38500.00,
    revenueShare: 35,
    tier: 'exclusive' as 'standard' | 'exclusive' | 'top_performer'
  });

  // Payment history
  let paymentHistory = $state([
    {
      date: '2024-09-01',
      amount: 1247.50,
      type: 'mixed' as 'fiat' | 'usdc' | 'stc' | 'mixed',
      breakdown: { fiat: 623.75, usdc: 374.25, stc: 249.50 },
      status: 'completed'
    },
    {
      date: '2024-08-01',
      amount: 1156.25,
      type: 'mixed',
      breakdown: { fiat: 578.13, usdc: 347.88, stc: 230.24 },
      status: 'completed'
    },
    {
      date: '2024-07-01',
      amount: 987.35,
      type: 'fiat',
      breakdown: { fiat: 987.35, usdc: 0, stc: 0 },
      status: 'completed'
    }
  ]);

  // Web3 tokenomics data
  let tokenomicsData = $state({
    stcBalance: '0',
    usdcBalance: '0',
    stcPrice: '0',
    stakingDiscount: 0,
    totalStcEarned: '0',
    stcValue: 0
  });

  // Payment preferences
  let paymentSettings = $state({
    preference: 'mixed' as 'fiat' | 'usdc' | 'stc' | 'mixed',
    fiatPercentage: 50,
    usdcPercentage: 30,
    stcPercentage: 20,
    isUpdating: false,
    updateResult: ''
  });

  onMount(async () => {
    if ($isConnected && $walletAddress) {
      await loadTokenomicsData();
    }
  });

  async function loadTokenomicsData() {
    if (!$walletAddress) return;

    try {
      const [balances, price, discount] = await Promise.all([
        getUserBalances($walletAddress),
        tokenAMM.getSTCPrice(),
        stcToken.getUserDiscount($walletAddress)
      ]);

      const stcEarned = '15000'; // TODO: Get from backend
      const stcCurrentValue = parseFloat(stcEarned) * parseFloat(price);

      tokenomicsData = {
        stcBalance: balances.stc,
        usdcBalance: balances.usdc,
        stcPrice: price,
        stakingDiscount: discount,
        totalStcEarned: stcEarned,
        stcValue: stcCurrentValue
      };
    } catch (error) {
      console.error('Error loading tokenomics data:', error);
    }
  }

  async function updatePaymentPreferences() {
    paymentSettings.isUpdating = true;
    paymentSettings.updateResult = '';

    try {
      // Validate percentages
      const total = paymentSettings.fiatPercentage + paymentSettings.usdcPercentage + paymentSettings.stcPercentage;
      if (Math.abs(total - 100) > 0.1) {
        throw new Error('Percentages must total 100%');
      }

      // TODO: Save to backend API
      // await updateCreatorPaymentPreference({
      //   preference: paymentSettings.preference,
      //   breakdown: {
      //     fiat: paymentSettings.fiatPercentage,
      //     usdc: paymentSettings.usdcPercentage,
      //     stc: paymentSettings.stcPercentage
      //   }
      // });

      paymentSettings.updateResult = 'Payment preferences updated successfully';
    } catch (error: any) {
      paymentSettings.updateResult = `Error: ${error.message}`;
    } finally {
      paymentSettings.isUpdating = false;
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getTierColor(tier: string): string {
    switch (tier) {
      case 'top_performer': return 'bg-primary text-primary-foreground';
      case 'exclusive': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  }

  function getPaymentTypeIcon(type: string) {
    switch (type) {
      case 'fiat': return CreditCard;
      case 'usdc': return DollarSign;
      case 'stc': return Coins;
      default: return Wallet;
    }
  }
</script>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center">
    <h1 class="text-4xl font-bold text-white mb-2">Creator Earnings Dashboard</h1>
    <p class="text-xl text-gray-300">Track your revenue, STC tokens, and payment preferences</p>
  </div>

  <!-- Earnings Overview -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground flex items-center">
          <DollarSign class="h-4 w-4 mr-2" />
          This Month
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="text-2xl font-bold text-white">${earningsData.monthlyRevenue.toFixed(2)}</div>
        <Badge class="text-xs mt-1" variant="secondary">{earningsData.revenueShare}% share</Badge>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground flex items-center">
          <Calendar class="h-4 w-4 mr-2" />
          This Year
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="text-2xl font-bold text-white">${earningsData.yearlyRevenue.toLocaleString()}</div>
        <Badge class="text-xs mt-1" variant="outline">12 months</Badge>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground flex items-center">
          <TrendingUp class="h-4 w-4 mr-2" />
          Total Earned
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="text-2xl font-bold text-white">${earningsData.totalEarnings.toLocaleString()}</div>
        <Badge class="text-xs mt-1 {getTierColor(earningsData.tier)}">
          {earningsData.tier === 'top_performer' ? 'Top Performer' :
           earningsData.tier === 'exclusive' ? 'Exclusive Partner' : 'Standard Creator'}
        </Badge>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-sm font-medium text-muted-foreground flex items-center">
          <Coins class="h-4 w-4 mr-2" />
          STC Value
        </CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="text-2xl font-bold text-white">${tokenomicsData.stcValue.toFixed(2)}</div>
        <Badge class="text-xs mt-1" variant="secondary">{parseFloat(tokenomicsData.totalStcEarned).toLocaleString()} STC</Badge>
      </CardContent>
    </Card>
  </div>

  <!-- Web3 Integration -->
  <Card class="bg-linear-to-r from-primary/10 to-secondary/10">
    <CardHeader>
      <CardTitle class="flex items-center space-x-2">
        <Coins class="h-6 w-6" />
        <span>Web3 Tokenomics</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {#if !$isConnected}
        <div class="text-center py-8">
          <Wallet class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-medium mb-2">Connect Your Wallet</h3>
          <p class="text-muted-foreground mb-4">Connect your wallet to access STC tokens and Web3 earning features.</p>
          <WalletConnect />
        </div>
      {:else}
        <div class="space-y-6">
          <!-- Token Balances -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-primary/10 rounded-lg">
              <Coins class="h-6 w-6 text-primary mx-auto mb-2" />
              <div class="text-lg font-bold">{parseFloat(tokenomicsData.stcBalance).toLocaleString()}</div>
              <div class="text-xs text-muted-foreground">STC Balance</div>
            </div>
            <div class="text-center p-4 bg-secondary/10 rounded-lg">
              <DollarSign class="h-6 w-6 text-secondary mx-auto mb-2" />
              <div class="text-lg font-bold">${parseFloat(tokenomicsData.usdcBalance).toLocaleString()}</div>
              <div class="text-xs text-muted-foreground">USDC Balance</div>
            </div>
            <div class="text-center p-4 bg-accent/10 rounded-lg">
              <Activity class="h-6 w-6 text-accent mx-auto mb-2" />
              <div class="text-lg font-bold">{parseFloat(tokenomicsData.totalStcEarned).toLocaleString()}</div>
              <div class="text-xs text-muted-foreground">STC Earned</div>
            </div>
            <div class="text-center p-4 bg-green-500/10 rounded-lg">
              <TrendingUp class="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div class="text-lg font-bold">${tokenomicsData.stcPrice.slice(0,8)}</div>
              <div class="text-xs text-muted-foreground">STC Price</div>
            </div>
          </div>

          {#if tokenomicsData.stakingDiscount > 0}
            <div class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div class="flex items-center space-x-2">
                <Crown class="h-5 w-5 text-green-500" />
                <span class="font-medium">Staking Benefits Active</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">
                You're earning {tokenomicsData.stakingDiscount}% bonus on subscription discounts from your STC staking.
              </p>
            </div>
          {/if}
        </div>
      {/if}
    </CardContent>
  </Card>

  <!-- Payment Preferences -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center space-x-2">
        <Settings class="h-6 w-6" />
        <span>Payment Preferences</span>
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <div>
        <Label class="text-sm font-medium mb-3 block">Payment Distribution</Label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label class="text-xs text-muted-foreground">Fiat (Bank Transfer)</Label>
            <div class="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                bind:value={paymentSettings.fiatPercentage}
                class="w-20"
              />
              <span class="text-sm">%</span>
            </div>
          </div>
          <div>
            <Label class="text-xs text-muted-foreground">USDC (Crypto)</Label>
            <div class="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                bind:value={paymentSettings.usdcPercentage}
                class="w-20"
              />
              <span class="text-sm">%</span>
            </div>
          </div>
          <div>
            <Label class="text-xs text-muted-foreground">STC Tokens</Label>
            <div class="flex items-center space-x-2">
              <Input
                type="number"
                min="0"
                max="100"
                bind:value={paymentSettings.stcPercentage}
                class="w-20"
              />
              <span class="text-sm">%</span>
            </div>
          </div>
        </div>

        <div class="mt-3 text-sm text-muted-foreground">
          Total: {paymentSettings.fiatPercentage + paymentSettings.usdcPercentage + paymentSettings.stcPercentage}%
        </div>

        <div class="mt-4 flex space-x-3">
          <Button
            onclick={updatePaymentPreferences}
            disabled={paymentSettings.isUpdating}
            size="sm"
          >
            {#if paymentSettings.isUpdating}
              <RefreshCw class="mr-2 h-4 w-4 animate-spin" />
              Updating...
            {:else}
              <Settings class="mr-2 h-4 w-4" />
              Update Preferences
            {/if}
          </Button>
        </div>

        {#if paymentSettings.updateResult}
          <div class="mt-3 p-3 bg-muted rounded-lg">
            <p class="text-sm">{paymentSettings.updateResult}</p>
          </div>
        {/if}
      </div>
    </CardContent>
  </Card>

  <!-- Payment History -->
  <Card>
    <CardHeader>
      <CardTitle>Recent Payments</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        {#each paymentHistory as payment}
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {#if getPaymentTypeIcon(payment.type)}
                  {@const PaymentIcon = getPaymentTypeIcon(payment.type)}
                  <PaymentIcon class="h-5 w-5 text-primary" />
                {/if}
              </div>
              <div>
                <div class="font-medium">${payment.amount.toFixed(2)}</div>
                <div class="text-sm text-muted-foreground">{formatDate(payment.date)}</div>
              </div>
            </div>
            <div class="text-right">
              <Badge variant="outline" class="mb-2">
                {payment.status === 'completed' ? 'Completed' : 'Pending'}
              </Badge>
              {#if payment.type === 'mixed'}
                <div class="text-xs text-muted-foreground">
                  ${payment.breakdown.fiat.toFixed(2)} + ${payment.breakdown.usdc.toFixed(2)} + {payment.breakdown.stc.toFixed(0)} STC
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </CardContent>
  </Card>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Button href="/creator/analytics" class="h-16" variant="outline">
      <div class="text-center">
        <TrendingUp class="h-6 w-6 mx-auto mb-1" />
        <div class="text-sm font-medium">Revenue Analytics</div>
      </div>
    </Button>

    <Button href="/tokens" class="h-16 bg-secondary hover:bg-secondary/90">
      <div class="text-center">
        <Coins class="h-6 w-6 mx-auto mb-1" />
        <div class="text-sm font-medium">Manage STC Tokens</div>
      </div>
    </Button>

    <Button href="/creator" class="h-16" variant="outline">
      <div class="text-center">
        <Crown class="h-6 w-6 mx-auto mb-1" />
        <div class="text-sm font-medium">Creator Dashboard</div>
      </div>
    </Button>
  </div>
</div>