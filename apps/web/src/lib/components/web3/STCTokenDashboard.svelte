<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import {
    Coins,
    TrendingUp,
    Clock,
    Gift,
    ArrowUpDown,
    Lock,
    Unlock,
    Calendar,
    Percent,
    DollarSign
  } from '@lucide/svelte';
  import { walletAddress, isConnected } from '$lib/web3/wallet';
  import { stcToken, tokenAMM } from '$lib/web3/contracts';
  import { onMount } from 'svelte';

  // State management
  let tokenBalance = $state('0');
  let tokenPrice = $state('0');
  let poolInfo = $state({
    stcBalance: '0',
    usdcBalance: '0',
    totalLiquidity: 0,
    currentPrice: '0',
    monthlyRevenue: '0'
  });
  let stakingInfo = $state({
    amount: '0',
    stakingTime: 0,
    lockPeriod: 0,
    discountTier: 0,
    isUnlocked: true
  });

  // Staking form
  let stakeAmount = $state('');
  let selectedLockPeriod = $state(90); // days
  let isStaking = $state(false);
  let isUnstaking = $state(false);
  let error = $state('');
  let success = $state('');

  // Lock period options
  const lockPeriods = [
    { days: 90, label: '3 Months', discount: '10%' },
    { days: 180, label: '6 Months', discount: '20%' },
    { days: 365, label: '12 Months', discount: '35%' },
    { days: 730, label: '24 Months', discount: '50%' }
  ];

  // Reactive data loading
  $effect(() => {
    if ($isConnected && $walletAddress) {
      (async () => {
        await loadTokenData();
      })();
    }
  });

  async function loadTokenData() {
    if (!$walletAddress) return;

    try {
      const [balance, price, poolData, stakingData] = await Promise.all([
        stcToken.balanceOf($walletAddress),
        tokenAMM.getSTCPrice(),
        tokenAMM.getPoolInfo(),
        stcToken.getStakingInfo($walletAddress)
      ]);

      tokenBalance = balance;
      tokenPrice = price;
      poolInfo = poolData;
      stakingInfo = stakingData;
    } catch (err) {
      console.error('Error loading token data:', err);
      error = 'Failed to load token data';
    }
  }

  async function handleStake() {
    if (!stakeAmount || !$walletAddress) return;

    isStaking = true;
    error = '';
    success = '';

    try {
      const lockPeriodSeconds = selectedLockPeriod * 24 * 60 * 60;
      await stcToken.stakeForDiscount(stakeAmount, lockPeriodSeconds);

      success = `Successfully staked ${stakeAmount} STC tokens!`;
      stakeAmount = '';

      // Reload data
      setTimeout(loadTokenData, 2000);
    } catch (err: any) {
      error = err.message || 'Failed to stake tokens';
    } finally {
      isStaking = false;
    }
  }

  async function handleUnstake() {
    if (!$walletAddress) return;

    isUnstaking = true;
    error = '';
    success = '';

    try {
      await stcToken.unstake();
      success = `Successfully unstaked ${stakingInfo.amount} STC tokens!`;

      // Reload data
      setTimeout(loadTokenData, 2000);
    } catch (err: any) {
      error = err.message || 'Failed to unstake tokens';
    } finally {
      isUnstaking = false;
    }
  }

  function formatTimeRemaining(stakingTime: number, lockPeriod: number): string {
    const unlockTime = stakingTime + lockPeriod;
    const now = Math.floor(Date.now() / 1000);
    const remaining = unlockTime - now;

    if (remaining <= 0) return 'Unlocked';

    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining % (24 * 60 * 60)) / (60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  }

  function getDiscountPercentage(tier: number): string {
    const discounts = ['0%', '10%', '20%', '35%', '50%'];
    return discounts[tier] || '0%';
  }

  onMount(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if ($isConnected && $walletAddress) {
        loadTokenData();
      }
    }, 30000);

    return () => clearInterval(interval);
  });
</script>

{#if !$isConnected}
  <Card>
    <CardContent class="p-6 text-center">
      <Coins class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">Connect Wallet</h3>
      <p class="text-muted-foreground">Connect your wallet to manage STC tokens</p>
    </CardContent>
  </Card>
{:else}
  <div class="space-y-6">
    <!-- Token Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Token Balance</CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="flex items-center space-x-2">
            <Coins class="h-5 w-5 text-primary" />
            <span class="text-2xl font-bold">{parseFloat(tokenBalance).toLocaleString()}</span>
            <span class="text-sm text-muted-foreground">STC</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Token Price</CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="flex items-center space-x-2">
            <DollarSign class="h-5 w-5 text-secondary" />
            <span class="text-2xl font-bold">${parseFloat(tokenPrice).toFixed(6)}</span>
            <span class="text-sm text-muted-foreground">USDC</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent class="pt-0">
          <div class="flex items-center space-x-2">
            <TrendingUp class="h-5 w-5 text-accent" />
            <span class="text-2xl font-bold">
              ${(parseFloat(tokenBalance) * parseFloat(tokenPrice)).toFixed(2)}
            </span>
            <span class="text-sm text-muted-foreground">USD</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Staking Section -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <Lock class="h-5 w-5" />
          <span>Stake STC for Subscription Discounts</span>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        {#if parseFloat(stakingInfo.amount) > 0}
          <!-- Current Staking Info -->
          <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Currently Staked</h4>
              <Badge class="bg-primary text-primary-foreground">
                {getDiscountPercentage(stakingInfo.discountTier)} Discount
              </Badge>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p class="text-muted-foreground">Amount</p>
                <p class="font-semibold">{parseFloat(stakingInfo.amount).toLocaleString()} STC</p>
              </div>
              <div>
                <p class="text-muted-foreground">Lock Period</p>
                <p class="font-semibold">{Math.floor(stakingInfo.lockPeriod / (24 * 60 * 60))} days</p>
              </div>
              <div>
                <p class="text-muted-foreground">Status</p>
                <p class="font-semibold flex items-center">
                  {#if stakingInfo.isUnlocked}
                    <Unlock class="h-3 w-3 mr-1 text-primary" />
                    Unlocked
                  {:else}
                    <Clock class="h-3 w-3 mr-1 text-secondary" />
                    {formatTimeRemaining(stakingInfo.stakingTime, stakingInfo.lockPeriod)}
                  {/if}
                </p>
              </div>
              <div>
                <p class="text-muted-foreground">Discount Tier</p>
                <p class="font-semibold">Tier {stakingInfo.discountTier}</p>
              </div>
            </div>

            {#if stakingInfo.isUnlocked}
              <Button
                class="w-full bg-accent hover:bg-accent/90"
                onclick={handleUnstake}
                disabled={isUnstaking}
              >
                {#if isUnstaking}
                  <Clock class="mr-2 h-4 w-4 animate-spin" />
                  Unstaking...
                {:else}
                  <Unlock class="mr-2 h-4 w-4" />
                  Unstake Tokens
                {/if}
              </Button>
            {/if}
          </div>
        {/if}

        <!-- Staking Form -->
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <Label for="stakeAmount">Amount to Stake</Label>
              <div class="relative">
                <Input
                  id="stakeAmount"
                  type="number"
                  placeholder="0.0"
                  bind:value={stakeAmount}
                  class="pr-12"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  STC
                </span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">
                Balance: {parseFloat(tokenBalance).toLocaleString()} STC
              </p>
            </div>

            <div>
              <Label>Lock Period</Label>
              <div class="grid grid-cols-2 gap-2">
                {#each lockPeriods as period}
                  <Button
                    variant={selectedLockPeriod === period.days ? 'default' : 'outline'}
                    size="sm"
                    onclick={() => selectedLockPeriod = period.days}
                    class="justify-between"
                  >
                    <span>{period.label}</span>
                    <Badge variant="secondary" class="text-xs">{period.discount}</Badge>
                  </Button>
                {/each}
              </div>
            </div>

            <Button
              class="w-full bg-primary hover:bg-primary/90"
              onclick={handleStake}
              disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0}
            >
              {#if isStaking}
                <Clock class="mr-2 h-4 w-4 animate-spin" />
                Staking...
              {:else}
                <Lock class="mr-2 h-4 w-4" />
                Stake Tokens
              {/if}
            </Button>
          </div>

          <!-- Staking Benefits -->
          <div class="space-y-4">
            <h4 class="font-medium">Staking Benefits</h4>
            <div class="space-y-3">
              <div class="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
                <Percent class="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <h5 class="font-medium text-sm">Subscription Discounts</h5>
                  <p class="text-xs text-muted-foreground">Get up to 50% off monthly subscriptions</p>
                </div>
              </div>

              <div class="flex items-start space-x-3 p-3 bg-secondary/5 rounded-lg">
                <Gift class="h-4 w-4 text-secondary mt-0.5" />
                <div>
                  <h5 class="font-medium text-sm">Exclusive Access</h5>
                  <p class="text-xs text-muted-foreground">Early access to new content and features</p>
                </div>
              </div>

              <div class="flex items-start space-x-3 p-3 bg-accent/5 rounded-lg">
                <TrendingUp class="h-4 w-4 text-accent mt-0.5" />
                <div>
                  <h5 class="font-medium text-sm">Platform Governance</h5>
                  <p class="text-xs text-muted-foreground">Vote on platform decisions and improvements</p>
                </div>
              </div>

              <div class="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <Calendar class="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <h5 class="font-medium text-sm">Reward Multipliers</h5>
                  <p class="text-xs text-muted-foreground">Earn more STC from watching content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Token Exchange -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center space-x-2">
          <ArrowUpDown class="h-5 w-5" />
          <span>Token Exchange</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="md:col-span-2 space-y-4">
            <div class="p-4 bg-muted/20 rounded-lg">
              <h4 class="font-medium mb-2">Current Pool Status</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-muted-foreground">STC Reserve</p>
                  <p class="font-semibold">{parseFloat(poolInfo.stcBalance).toLocaleString()}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">USDC Reserve</p>
                  <p class="font-semibold">${parseFloat(poolInfo.usdcBalance).toLocaleString()}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Current Price</p>
                  <p class="font-semibold">${parseFloat(poolInfo.currentPrice).toFixed(6)}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Platform Revenue</p>
                  <p class="font-semibold">${parseFloat(poolInfo.monthlyRevenue).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <Button variant="outline" size="sm" href="/exchange" class="w-full">
              <ArrowUpDown class="mr-2 h-4 w-4" />
              Trade Tokens
            </Button>
            <Button variant="outline" size="sm" href="/liquidity" class="w-full">
              <TrendingUp class="mr-2 h-4 w-4" />
              Add Liquidity
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Status Messages -->
    {#if error}
      <div class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p class="text-destructive font-medium">{error}</p>
      </div>
    {/if}

    {#if success}
      <div class="p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <p class="text-primary font-medium">{success}</p>
      </div>
    {/if}
  </div>
{/if}