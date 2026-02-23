<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Lock, Crown, Coins, ArrowUpRight, Wallet } from '@lucide/svelte';
  import { checkContentAccess, getUpgradeAction, type ContentAccess, type AccessLevel } from '$lib/auth/accessControl';
  import { walletAddress, isConnected } from '$lib/web3/wallet';
  import { type Snippet } from 'svelte';

  interface Props {
    contentAccess: ContentAccess;
    children?: Snippet;
    fallbackContent?: Snippet;
    showUpgradePrompt?: boolean;
  }

  let {
    contentAccess,
    children,
    fallbackContent,
    showUpgradePrompt = true
  }: Props = $props();

  let accessLevel: AccessLevel = $state({ level: 'free', hasAccess: false });
  let loading = $state(true);
  let upgradeAction = $state<ReturnType<typeof getUpgradeAction>>(null);

  // Check access when wallet connection changes
  $effect(() => {
    if ($isConnected && $walletAddress) {
      loading = true;
      // Use async IIFE to handle async operations in effect
      (async () => {
        try {
          accessLevel = await checkContentAccess(contentAccess, $walletAddress);
          upgradeAction = getUpgradeAction(contentAccess, accessLevel);
        } catch (error) {
          console.error('Error checking access:', error);
          accessLevel = { level: 'free', hasAccess: false, reason: 'Access check failed' };
        } finally {
          loading = false;
        }
      })();
    } else {
      // Not connected - use async IIFE for consistency
      (async () => {
        try {
          accessLevel = await checkContentAccess(contentAccess);
          upgradeAction = getUpgradeAction(contentAccess, accessLevel);
        } catch (error) {
          console.error('Error checking access:', error);
          accessLevel = { level: 'free', hasAccess: false, reason: 'Access check failed' };
        } finally {
          loading = false;
        }
      })();
    }
  });

  function getTierBadgeClass(tier: string) {
    const classes = {
      free: 'bg-muted text-muted-foreground',
      basic: 'bg-primary/20 text-primary',
      premium: 'bg-secondary/20 text-secondary',
      creator: 'bg-accent/20 text-accent'
    };
    return classes[tier as keyof typeof classes] || classes.free;
  }

  function getTierIcon(tier: string) {
    switch (tier) {
      case 'basic': return Wallet;
      case 'premium': return Crown;
      case 'creator': return Coins;
      default: return Lock;
    }
  }

  function getRequiredTierName(tier: number): string {
    const tiers = ['Free', 'Basic', 'Premium', 'Creator'];
    return tiers[tier] || 'Unknown';
  }
</script>

{#if loading}
  <div class="flex items-center justify-center p-8">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span class="ml-2 text-muted-foreground">Checking access...</span>
  </div>
{:else if accessLevel.hasAccess}
  <!-- User has access - show the protected content -->
  {#if children}
    {@render children()}
  {/if}
{:else}
  <!-- User doesn't have access - show gate/upgrade prompt -->
  <div class="space-y-6">
    {#if fallbackContent}
      <!-- Show fallback content (like preview or trailer) -->
      <div class="relative">
        {@render fallbackContent()}
        <div class="absolute inset-0 bg-linear-to-t from-background/90 to-transparent flex items-end">
          <div class="p-4 w-full">
            <div class="flex items-center space-x-2 mb-2">
              <Lock class="h-4 w-4 text-muted-foreground" />
              <span class="text-sm text-muted-foreground">Premium Content</span>
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if showUpgradePrompt}
      <Card class="border-2 border-dashed border-muted-foreground/20">
        <CardHeader class="text-center">
          <div class="mx-auto w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
            {#if contentAccess.requiresNFT}
              <Crown class="h-8 w-8 text-muted-foreground" />
            {:else if contentAccess.requiresStaking}
              <Coins class="h-8 w-8 text-muted-foreground" />
            {:else}
              <Lock class="h-8 w-8 text-muted-foreground" />
            {/if}
          </div>

          <CardTitle class="flex items-center justify-center space-x-2">
            <span>{getRequiredTierName(contentAccess.requiredTier)} Access Required</span>
            <Badge class={getTierBadgeClass(getRequiredTierName(contentAccess.requiredTier).toLowerCase())}>
              {getRequiredTierName(contentAccess.requiredTier)}
            </Badge>
          </CardTitle>

          {#if accessLevel.reason}
            <p class="text-muted-foreground text-sm mt-2">{accessLevel.reason}</p>
          {/if}
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Current Access Level -->
          {#if $isConnected}
            <div class="p-3 bg-muted/10 rounded-lg">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Your Current Level:</span>
                <Badge class={getTierBadgeClass(accessLevel.level)}>
                  {accessLevel.level.charAt(0).toUpperCase() + accessLevel.level.slice(1)}
                </Badge>
              </div>
            </div>
          {/if}

          <!-- Upgrade Options -->
          <div class="space-y-3">
            {#if !$isConnected}
              <Button href="/tokens" class="w-full">
                <Wallet class="mr-2 h-4 w-4" />
                Connect Wallet to Access
              </Button>
            {:else if upgradeAction}
              <Button href={upgradeAction.href} class="w-full">
                {@const IconComponent = getTierIcon(upgradeAction.tier)}
                <IconComponent class="mr-2 h-4 w-4" />
                {upgradeAction.text}
                <ArrowUpRight class="ml-2 h-4 w-4" />
              </Button>
            {/if}

            <!-- Alternative access methods -->
            {#if contentAccess.requiresNFT && !contentAccess.requiresStaking}
              <div class="text-center">
                <p class="text-xs text-muted-foreground mb-2">or</p>
                <Button variant="outline" href="/tokens" size="sm">
                  <Coins class="mr-2 h-3 w-3" />
                  Stake STC Tokens Instead
                </Button>
              </div>
            {:else if contentAccess.requiresStaking && !contentAccess.requiresNFT}
              <div class="text-center">
                <p class="text-xs text-muted-foreground mb-2">or</p>
                <Button variant="outline" href="/subscription" size="sm">
                  <Crown class="mr-2 h-3 w-3" />
                  Get NFT Subscription Instead
                </Button>
              </div>
            {/if}
          </div>

          <!-- Benefits Preview -->
          <div class="border-t pt-4">
            <h4 class="text-sm font-medium mb-2">With {getRequiredTierName(contentAccess.requiredTier)} access:</h4>
            <ul class="text-xs text-muted-foreground space-y-1">
              {#if contentAccess.requiredTier >= 1}
                <li>✓ HD streaming quality</li>
                <li>✓ Offline downloads</li>
              {/if}
              {#if contentAccess.requiredTier >= 2}
                <li>✓ 4K streaming quality</li>
                <li>✓ Early access to new content</li>
              {/if}
              {#if contentAccess.requiredTier >= 3}
                <li>✓ Creator tools access</li>
                <li>✓ Exclusive creator content</li>
              {/if}
              <li>✓ Support content creators</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    {/if}
  </div>
{/if}