<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Wallet, Coins, Zap, ExternalLink, Copy, CheckCheck } from '@lucide/svelte';
  import { connectWallet, disconnectWallet, account, walletAddress, isConnected, formatAddress } from '$lib/web3/wallet';
  import { getUserBalances, checkUserAccess } from '$lib/web3/contracts';
  import { onMount } from 'svelte';

  let isConnecting = $state(false);
  let error = $state('');
  let balances = $state({ stc: '0', usdc: '0' });
  let userAccess = $state({
    hasSubscription: false,
    subscriptionTier: 0,
    stakingDiscount: 0,
    stakingAmount: '0',
    hasAccess: false
  });
  let copied = $state(false);

  // Reactive updates
  $effect(() => {
    if ($isConnected && $walletAddress) {
      (async () => {
        try {
          const [userBalances, accessInfo] = await Promise.all([
            getUserBalances($walletAddress),
            checkUserAccess($walletAddress)
          ]);
        balances = userBalances;
        userAccess = accessInfo;
        } catch (err) {
          console.error('Error loading user data:', err);
        }
      })();
    }
  });

  async function handleConnect(connectorType: 'injected' | 'walletConnect' | 'coinbase' = 'injected') {
    isConnecting = true;
    error = '';

    try {
      await connectWallet(connectorType);
    } catch (err: any) {
      error = err.message || 'Failed to connect wallet';
      console.error('Connection error:', err);
    } finally {
      isConnecting = false;
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectWallet();
      balances = { stc: '0', usdc: '0' };
      userAccess = {
        hasSubscription: false,
        subscriptionTier: 0,
        stakingDiscount: 0,
        stakingAmount: '0',
        hasAccess: false
      };
    } catch (err: any) {
      error = err.message || 'Failed to disconnect wallet';
    }
  }

  async function copyAddress() {
    if ($walletAddress) {
      await navigator.clipboard.writeText($walletAddress);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }

  function getTierName(tier: number): string {
    const tiers = ['Basic', 'Premium', 'Creator'];
    return tiers[tier] || 'Unknown';
  }

  onMount(() => {
    // Auto-refresh balances every 30 seconds
    const interval = setInterval(async () => {
      if ($isConnected && $walletAddress) {
        try {
          balances = await getUserBalances($walletAddress);
        } catch (err) {
          console.error('Error refreshing balances:', err);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  });
</script>

{#if !$isConnected}
  <!-- Wallet Connection UI -->
  <Card class="w-full max-w-md mx-auto">
    <CardContent class="p-6 space-y-4">
      <div class="text-center space-y-2">
        <Wallet class="mx-auto h-12 w-12 text-primary" />
        <h3 class="text-xl font-semibold">Connect Your Wallet</h3>
        <p class="text-muted-foreground text-sm">
          Connect your wallet to access StudioChain tokens, NFT subscriptions, and premium features.
        </p>
      </div>

      {#if error}
        <div class="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p class="text-destructive text-sm">{error}</p>
        </div>
      {/if}

      <div class="space-y-2">
        <Button
          class="w-full justify-start bg-primary hover:bg-primary/90"
          disabled={isConnecting}
          onclick={() => handleConnect('injected')}
        >
          {#if isConnecting}
            <Zap class="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          {:else}
            <Wallet class="mr-2 h-4 w-4" />
            MetaMask / Browser Wallet
          {/if}
        </Button>

        <Button
          variant="outline"
          class="w-full justify-start"
          disabled={isConnecting}
          onclick={() => handleConnect('walletConnect')}
        >
          <ExternalLink class="mr-2 h-4 w-4" />
          WalletConnect
        </Button>

        <Button
          variant="outline"
          class="w-full justify-start"
          disabled={isConnecting}
          onclick={() => handleConnect('coinbase')}
        >
          <Coins class="mr-2 h-4 w-4" />
          Coinbase Wallet
        </Button>
      </div>

      <div class="text-center">
        <p class="text-xs text-muted-foreground">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </CardContent>
  </Card>

{:else}
  <!-- Connected Wallet UI -->
  <Card class="w-full">
    <CardContent class="p-6 space-y-6">
      <!-- Wallet Address -->
      <div class="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center relative">
            <Wallet class="h-4 w-4 text-primary-foreground" />
            {#if $account?.status === 'connected'}
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
            {/if}
          </div>
          <div>
            <p class="font-medium">{formatAddress($walletAddress || '', 6)}</p>
            <p class="text-xs text-muted-foreground">
              {#if $account?.connector?.name}
                Connected via {$account.connector.name}
              {:else}
                Connected Wallet
              {/if}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onclick={copyAddress}
            class="h-8 w-8 p-0"
          >
            {#if copied}
              <CheckCheck class="h-3 w-3 text-primary" />
            {:else}
              <Copy class="h-3 w-3" />
            {/if}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onclick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      </div>

      <!-- Token Balances -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">STC Balance</p>
              <p class="text-lg font-semibold text-primary">{parseFloat(balances.stc).toFixed(2)}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Coins class="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        <div class="p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">USDC Balance</p>
              <p class="text-lg font-semibold text-secondary">${parseFloat(balances.usdc).toFixed(2)}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <span class="text-xs font-bold text-secondary">$</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Access Status -->
      <div class="space-y-3">
        <h4 class="font-medium">Account Status</h4>

        <div class="flex flex-wrap gap-2">
          {#if userAccess.hasSubscription}
            <Badge class="bg-primary text-primary-foreground">
              {getTierName(userAccess.subscriptionTier)} Subscriber
            </Badge>
          {:else}
            <Badge variant="outline">No Active Subscription</Badge>
          {/if}

          {#if userAccess.stakingDiscount > 0}
            <Badge class="bg-accent text-accent-foreground">
              {userAccess.stakingDiscount}% Staking Discount
            </Badge>
          {/if}

          {#if parseFloat(userAccess.stakingAmount) > 0}
            <Badge variant="secondary">
              {parseFloat(userAccess.stakingAmount).toFixed(0)} STC Staked
            </Badge>
          {/if}
        </div>

        {#if userAccess.hasAccess}
          <div class="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p class="text-sm text-primary font-medium">✓ Premium Access Granted</p>
            <p class="text-xs text-muted-foreground mt-1">
              You have access to premium content and features.
            </p>
          </div>
        {:else}
          <div class="p-3 bg-muted/50 border rounded-lg">
            <p class="text-sm font-medium">Get Premium Access</p>
            <p class="text-xs text-muted-foreground mt-1">
              Subscribe or stake STC tokens to unlock premium features.
            </p>
          </div>
        {/if}
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" href="/tokens">
          Manage STC
        </Button>
        <Button variant="outline" size="sm" href="/subscription">
          Subscription
        </Button>
      </div>
    </CardContent>
  </Card>
{/if}

<style>
  /* Custom badge styles for better brand consistency */
  :global(.bg-primary) {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  :global(.bg-secondary) {
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
  }

  :global(.bg-accent) {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
</style>