<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Progress } from '$lib/components/ui/progress';
  import {
    Crown,
    Calendar,
    DollarSign,
    Users,
    TrendingUp,
    ExternalLink,
    Gift,
    Star,
    Clock,
    RefreshCw
  } from '@lucide/svelte';
  import { walletAddress, isConnected } from '$lib/web3/wallet';
  import { subscriptionContract, stcToken } from '$lib/web3/contracts';
  import { onMount } from 'svelte';

  // State management
  let subscriptionStatus = $state({
    isActive: false,
    tokenId: 0,
    expiryDate: 0
  });
  let subscriptionDetails = $state({
    subscriber: '',
    tier: 0,
    amountPaid: 0,
    startDate: 0,
    expiryDate: 0,
    isActive: false,
    renewalCount: 0,
    totalRevenue: 0
  });
  let nftBalance = $state(0);
  let userDiscount = $state(0);
  let loading = $state(false);
  let error = $state('');

  // Subscription tier information
  const tierInfo = {
    0: {
      name: 'Basic',
      color: 'bg-blue-500',
      features: ['Access to basic content', 'HD streaming', '1 device'],
      monthlyPrice: 9.99
    },
    1: {
      name: 'Premium',
      color: 'bg-primary',
      features: ['Access to premium content', '4K streaming', '2 devices', 'Downloads'],
      monthlyPrice: 15.99
    },
    2: {
      name: 'Creator',
      color: 'bg-secondary',
      features: ['Access to all content', '4K + HDR', '4 devices', 'Early access', 'Creator tools'],
      monthlyPrice: 25.99
    }
  };

  // Reactive data loading
  $effect(() => {
    if ($isConnected && $walletAddress) {
      (async () => {
        await loadSubscriptionData();
      })();
    }
  });

  async function loadSubscriptionData() {
    if (!$walletAddress) return;

    loading = true;
    error = '';

    try {
      const [status, balance, discount] = await Promise.all([
        subscriptionContract.getSubscriptionStatus($walletAddress),
        subscriptionContract.balanceOf($walletAddress),
        stcToken.getUserDiscount($walletAddress)
      ]);

      subscriptionStatus = status;
      nftBalance = balance;
      userDiscount = discount;

      // Load detailed subscription info if user has an active subscription
      if (status.isActive && status.tokenId > 0) {
        const details = await subscriptionContract.getSubscriptionDetails(status.tokenId);
        subscriptionDetails = details;
      }
    } catch (err: any) {
      console.error('Error loading subscription data:', err);
      error = 'Failed to load subscription data';
    } finally {
      loading = false;
    }
  }

  function formatDate(timestamp: number): string {
    if (timestamp === 0) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getDaysRemaining(expiryDate: number): number {
    if (expiryDate === 0) return 0;
    const now = Math.floor(Date.now() / 1000);
    const remaining = expiryDate - now;
    return Math.max(0, Math.floor(remaining / (24 * 60 * 60)));
  }

  function getProgressPercentage(startDate: number, expiryDate: number): number {
    if (startDate === 0 || expiryDate === 0) return 0;
    const now = Math.floor(Date.now() / 1000);
    const total = expiryDate - startDate;
    const elapsed = now - startDate;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  function getCurrentTierInfo() {
    return tierInfo[subscriptionDetails.tier as keyof typeof tierInfo] || tierInfo[0];
  }

  function getEffectivePrice(): number {
    const tierData = getCurrentTierInfo();
    const basePrice = tierData.monthlyPrice;
    if (userDiscount > 0) {
      return basePrice * (1 - userDiscount / 100);
    }
    return basePrice;
  }

  onMount(() => {
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      if ($isConnected && $walletAddress) {
        loadSubscriptionData();
      }
    }, 60000);

    return () => clearInterval(interval);
  });
</script>

{#if !$isConnected}
  <Card>
    <CardContent class="p-6 text-center">
      <Crown class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 class="text-lg font-semibold mb-2">Connect Wallet</h3>
      <p class="text-muted-foreground">Connect your wallet to view subscription NFTs</p>
    </CardContent>
  </Card>
{:else}
  <div class="space-y-6">
    <!-- Loading State -->
    {#if loading}
      <Card>
        <CardContent class="p-6 text-center">
          <RefreshCw class="mx-auto h-8 w-8 text-primary animate-spin mb-4" />
          <p class="text-muted-foreground">Loading subscription data...</p>
        </CardContent>
      </Card>
    {:else}

      <!-- Active Subscription -->
      {#if subscriptionStatus.isActive}
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Crown class="h-5 w-5 text-primary" />
                <span>Active Subscription</span>
              </div>
              <Badge class="{getCurrentTierInfo().color} text-white">
                {getCurrentTierInfo().name}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-6">

            <!-- Subscription Progress -->
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Subscription Period</span>
                <span class="font-medium">{getDaysRemaining(subscriptionDetails.expiryDate)} days remaining</span>
              </div>
              <Progress value={getProgressPercentage(subscriptionDetails.startDate, subscriptionDetails.expiryDate)} class="h-2" />
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <span>Started {formatDate(subscriptionDetails.startDate)}</span>
                <span>Expires {formatDate(subscriptionDetails.expiryDate)}</span>
              </div>
            </div>

            <!-- NFT Details -->
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="font-medium">NFT Details</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-muted-foreground">Token ID</span>
                    <span class="font-medium">#{subscriptionStatus.tokenId}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-muted-foreground">Renewals</span>
                    <span class="font-medium">{subscriptionDetails.renewalCount}x</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-muted-foreground">Total Spent</span>
                    <span class="font-medium">${(subscriptionDetails.totalRevenue / 100).toFixed(2)}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-muted-foreground">Current Price</span>
                    <div class="text-right">
                      {#if userDiscount > 0}
                        <span class="line-through text-muted-foreground text-sm">${getCurrentTierInfo().monthlyPrice}</span>
                        <span class="font-medium text-primary ml-2">${getEffectivePrice().toFixed(2)}</span>
                        <Badge variant="secondary" class="ml-1 text-xs">{userDiscount}% off</Badge>
                      {:else}
                        <span class="font-medium">${getCurrentTierInfo().monthlyPrice}</span>
                      {/if}
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" href="/plans" class="w-full">
                  <ExternalLink class="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>
              </div>

              <div class="space-y-4">
                <h4 class="font-medium">Plan Features</h4>
                <div class="space-y-2">
                  {#each getCurrentTierInfo().features as feature}
                    <div class="flex items-center space-x-2">
                      <Star class="h-3 w-3 text-primary" />
                      <span class="text-sm">{feature}</span>
                    </div>
                  {/each}
                </div>

                {#if userDiscount > 0}
                  <div class="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div class="flex items-center space-x-2">
                      <Gift class="h-4 w-4 text-primary" />
                      <span class="text-sm font-medium text-primary">
                        Staking Discount Active: {userDiscount}% OFF
                      </span>
                    </div>
                  </div>
                {/if}
              </div>
            </div>

            <!-- NFT Ownership Benefits -->
            <div class="p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <h4 class="font-medium mb-3 flex items-center">
                <Crown class="h-4 w-4 mr-2 text-accent" />
                NFT Ownership Benefits
              </h4>
              <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 class="font-medium">Exclusive Access</h5>
                  <p class="text-muted-foreground">Early access to new releases</p>
                </div>
                <div>
                  <h5 class="font-medium">Transferable</h5>
                  <p class="text-muted-foreground">Share with family members</p>
                </div>
                <div>
                  <h5 class="font-medium">Cross-Platform</h5>
                  <p class="text-muted-foreground">Use on partner platforms</p>
                </div>
                <div>
                  <h5 class="font-medium">Collectible</h5>
                  <p class="text-muted-foreground">Unique subscription history</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      {:else}
        <!-- No Active Subscription -->
        <Card>
          <CardContent class="p-6 text-center space-y-4">
            <div class="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
              <Crown class="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-2">No Active Subscription</h3>
              <p class="text-muted-foreground">
                Subscribe to get your exclusive NFT membership and unlock premium content.
              </p>
            </div>

            {#if nftBalance > 0}
              <div class="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                <p class="text-sm font-medium text-secondary">
                  You own {nftBalance} subscription NFT{nftBalance > 1 ? 's' : ''} (expired)
                </p>
                <p class="text-xs text-muted-foreground mt-1">
                  Renew to reactivate your membership benefits
                </p>
              </div>
            {/if}

            <div class="flex gap-2 justify-center">
              <Button href="/plans" class="bg-primary hover:bg-primary/90">
                <Crown class="mr-2 h-4 w-4" />
                Subscribe Now
              </Button>

              {#if nftBalance > 0}
                <Button variant="outline" href="/plans">
                  Renew Subscription
                </Button>
              {/if}
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Subscription Statistics -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <TrendingUp class="h-5 w-5" />
            <span>Subscription Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-primary/5 rounded-lg">
              <Crown class="h-6 w-6 text-primary mx-auto mb-2" />
              <p class="text-sm text-muted-foreground">NFTs Owned</p>
              <p class="text-lg font-semibold">{nftBalance}</p>
            </div>

            <div class="text-center p-4 bg-secondary/5 rounded-lg">
              <DollarSign class="h-6 w-6 text-secondary mx-auto mb-2" />
              <p class="text-sm text-muted-foreground">Total Spent</p>
              <p class="text-lg font-semibold">
                ${subscriptionDetails.totalRevenue > 0 ? (subscriptionDetails.totalRevenue / 100).toFixed(2) : '0.00'}
              </p>
            </div>

            <div class="text-center p-4 bg-accent/5 rounded-lg">
              <RefreshCw class="h-6 w-6 text-accent mx-auto mb-2" />
              <p class="text-sm text-muted-foreground">Renewals</p>
              <p class="text-lg font-semibold">{subscriptionDetails.renewalCount}</p>
            </div>

            <div class="text-center p-4 bg-muted/20 rounded-lg">
              <Calendar class="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p class="text-sm text-muted-foreground">Member Since</p>
              <p class="text-lg font-semibold">
                {subscriptionDetails.startDate > 0 ? formatDate(subscriptionDetails.startDate) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Upgrade Options -->
      {#if subscriptionStatus.isActive}
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">Stake STC Tokens</h4>
                <p class="text-sm text-muted-foreground mb-3">
                  Stake STC tokens to get discounts on your subscription renewals
                </p>
                <Button variant="outline" size="sm" href="/tokens">
                  Learn About Staking
                </Button>
              </div>

              <div class="p-4 border rounded-lg">
                <h4 class="font-medium mb-2">Refer Friends</h4>
                <p class="text-sm text-muted-foreground mb-3">
                  Invite friends and earn STC tokens for each successful referral
                </p>
                <Button variant="outline" size="sm" href="/referrals">
                  Start Referring
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      {/if}
    {/if}

    <!-- Error Message -->
    {#if error}
      <div class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p class="text-destructive font-medium">{error}</p>
        <Button variant="ghost" size="sm" onclick={loadSubscriptionData} class="mt-2">
          <RefreshCw class="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    {/if}
  </div>
{/if}