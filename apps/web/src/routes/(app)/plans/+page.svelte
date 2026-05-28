<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { Check, Crown, Coins, Wallet, Gift, Star, Zap } from '@lucide/svelte';
  import { isConnected, walletAddress } from '$lib/web3/wallet';
  import { stcToken, checkUserAccess } from '$lib/web3/contracts';
  import WalletConnect from '$lib/components/web3/WalletConnect.svelte';
  import { onMount } from 'svelte';

  interface Plan {
    id: string;
    name: string;
    /** Displayed price (after any discount) */
    price: number;
    /** Pre-discount price; only set when a staking discount is applied */
    originalPrice?: number;
    /** Billing cadence label, e.g. "/month" or "every 2 months" */
    cadence: string;
    /** Number of profile accounts allowed on this tier */
    maxProfiles: number;
    /** Whether this tier exposes kids-mode profiles */
    kidsAllowed: boolean;
    /** Whether ads are shown on this tier */
    hasAds: boolean;
    features: string[];
    isPopular?: boolean;
    nftBenefits: string[];
  }

  // Mirrors PLAN_FEATURES + PLAN_PRICES_CENTS in $lib/payment/paystack.ts.
  // Kept in lockstep manually — when prices change, update both places.
  let plans = $state<Plan[]>([
    {
      id: 'freemium',
      name: 'Freemium',
      price: 1,
      cadence: 'every 2 months',
      maxProfiles: 1,
      kidsAllowed: false,
      hasAds: true,
      features: [
        'HD streaming with ads',
        '1 profile',
        'Access to standard library',
        'Cancel anytime'
      ],
      nftBenefits: [
        'Earn STC by watching',
        'No staking discount on this tier'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 4,
      cadence: '/month',
      maxProfiles: 2,
      kidsAllowed: false,
      hasAds: false,
      features: [
        'HD streaming — ad-free',
        '2 profiles',
        'Download on 1 device',
        'Cancel anytime'
      ],
      nftBenefits: [
        'Subscription NFT on Polygon',
        'Earn 5 STC/day watching',
        'Stake STC for up to 10% off'
      ]
    },
    {
      id: 'premium',
      name: 'Premium (Family)',
      price: 10,
      cadence: '/month',
      maxProfiles: 8,
      kidsAllowed: true,
      hasAds: false,
      features: [
        '4K Ultra HD streaming',
        '8 profiles (kids profile included)',
        'Full content library',
        'Downloads on 2 devices',
        'Offline viewing',
        'Cancel anytime'
      ],
      nftBenefits: [
        'Enhanced NFT benefits',
        'Earn 5 STC/day watching',
        'Stake STC for up to 50% off',
        'Early access to new content'
      ],
      isPopular: true
    },
    {
      id: 'creator',
      name: 'Creator',
      price: 10,
      cadence: '/month',
      maxProfiles: 2,
      kidsAllowed: false,
      hasAds: false,
      features: [
        'Everything in Basic',
        'Upload & publish content',
        'Revenue share dashboard',
        'Creator analytics',
        'Priority support'
      ],
      nftBenefits: [
        'Creator NFT badge',
        '30% revenue share on your content',
        'Governance voting rights',
        'Exclusive creator community'
      ]
    }
  ]);

  let selectedPlan = $state<string>('premium');
  let isLoading = $state(false);
  let userDiscount = $state(0);
  let stakingAmount = $state('0');
  let showWalletModal = $state(false);

  // Load user's staking discount
  $effect(() => {
    if ($isConnected && $walletAddress) {
      (async () => {
        try {
          const [discount, access] = await Promise.all([
            stcToken.getUserDiscount($walletAddress),
            checkUserAccess($walletAddress)
          ]);
          userDiscount = discount;
          stakingAmount = access.stakingAmount;

          // Apply staking discount to paid plans only. Freemium ($1 / 2 months)
          // is already the floor; discounts here would just add complexity
          // without meaningful savings.
          plans = plans.map(plan => plan.id === 'freemium'
            ? plan
            : {
                ...plan,
                originalPrice: plan.price,
                price: discount > 0 ? plan.price * (1 - discount / 100) : plan.price
              });
        } catch (error) {
          console.error('Error loading user discount:', error);
        }
      })();
    }
  });

  async function handleSubscribe(planId: string) {
    selectedPlan = planId;
    // Route through the dedicated checkout page — it handles OTP, Paystack init,
    // wallet linkage and trial setup. Pre-fill the plan via query string.
    const params = new URLSearchParams({ plan: planId });
    if ($walletAddress) params.set('wallet', $walletAddress);
    if (userDiscount > 0) params.set('discount', String(userDiscount));
    window.location.href = `/checkout?${params.toString()}`;
  }

  function getPlanIcon(planId: string) {
    switch (planId) {
      case 'creator': return Crown;
      case 'premium': return Star;
      case 'freemium': return Zap;
      default: return Coins;
    }
  }
</script>

<svelte:head>
  <title>Plans &amp; Pricing · Sephar Studios</title>
  <meta name="description" content="Choose your Sephar Studios plan: freemium with ads, basic ad-free, premium family (8 profiles + kids mode), or creator. STC stakers get up to 50% off." />
</svelte:head>

<div class="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl pt-32 pb-16">
  <div class="text-center space-y-4 mb-8">
    <h1 class="text-3xl font-bold gradient-text">Choose Your Plan</h1>
    <p class="text-muted-foreground max-w-2xl mx-auto">
      Start with 3 months free on Basic, Premium or Creator. Freemium starts billing immediately at $1 every 2 months.
      {#if userDiscount > 0}
        <Badge class="ml-2 bg-primary text-primary-foreground">
          {userDiscount}% Staking Discount Applied!
        </Badge>
      {/if}
    </p>
    <div class="inline-flex items-center gap-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-full px-4 py-1.5 text-sm">
      <Gift class="h-4 w-4" />
      3 months free on Basic, Premium & Creator
    </div>
  </div>

  <!-- Wallet Integration Section -->
  {#if !$isConnected}
    <div class="mb-8 p-6 bg-accent/5 border border-accent/20 rounded-lg">
      <div class="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 class="text-lg font-semibold mb-2 flex items-center">
            <Wallet class="h-5 w-5 mr-2 text-primary" />
            Connect Wallet for NFT Benefits
          </h2>
          <p class="text-sm text-muted-foreground mb-4">
            Connect your wallet to get your subscription as an NFT and unlock exclusive Web3 features.
            You can still subscribe without a wallet using traditional payments.
          </p>
          <Button
            variant="outline"
            size="sm"
            onclick={() => showWalletModal = true}
          >
            <Wallet class="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex items-center space-x-2">
            <Crown class="h-4 w-4 text-primary" />
            <span>Subscription NFT ownership</span>
          </div>
          <div class="flex items-center space-x-2">
            <Gift class="h-4 w-4 text-secondary" />
            <span>Stake STC tokens for up to 50% off</span>
          </div>
          <div class="flex items-center space-x-2">
            <Zap class="h-4 w-4 text-accent" />
            <span>Cross-platform verification</span>
          </div>
        </div>
      </div>
    </div>
  {:else if parseFloat(stakingAmount) > 0}
    <div class="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Coins class="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h4 class="font-medium">Staking Discount Active</h4>
            <p class="text-sm text-muted-foreground">
              {parseFloat(stakingAmount).toLocaleString()} STC staked • {userDiscount}% discount applied
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" href="/tokens">
          Manage Staking
        </Button>
      </div>
    </div>
  {/if}

  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each plans as plan (plan.id)}
      {@const PlanIcon = getPlanIcon(plan.id)}
      <Card class="relative {plan.isPopular ? 'border-primary/50 bg-primary/5' : ''}">
        {#if plan.isPopular}
          <div class="absolute -top-2 left-1/2 -translate-x-1/2">
            <Badge class="bg-primary text-primary-foreground">
              Most Popular
            </Badge>
          </div>
        {/if}
        {#if plan.hasAds}
          <div class="absolute -top-2 right-3">
            <Badge variant="secondary" class="text-[10px]">With ads</Badge>
          </div>
        {/if}

        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <PlanIcon class="h-5 w-5 text-{plan.isPopular ? 'primary' : 'muted-foreground'}" />
            <span>{plan.name}</span>
          </CardTitle>
        </CardHeader>

        <CardContent class="space-y-6">
          <div class="space-y-2">
            <div class="flex items-baseline flex-wrap">
              {#if plan.originalPrice && plan.originalPrice !== plan.price}
                <span class="text-lg line-through text-muted-foreground mr-2">
                  ${plan.originalPrice.toFixed(2)}
                </span>
              {/if}
              <span class="text-3xl font-bold">${plan.price.toFixed(2)}</span>
              <span class="text-muted-foreground ml-1">{plan.cadence}</span>
            </div>
            {#if userDiscount > 0 && plan.id !== 'freemium'}
              <Badge variant="secondary" class="text-xs">
                {userDiscount}% discount from staking
              </Badge>
            {/if}
          </div>

          <!-- Platform Features -->
          <div class="space-y-3">
            <h4 class="font-medium text-sm">Platform Features</h4>
            <ul class="space-y-2">
              {#each plan.features as feature}
                <li class="flex items-center">
                  <Check class="h-4 w-4 text-primary mr-2 shrink-0" />
                  <span class="text-sm">{feature}</span>
                </li>
              {/each}
            </ul>
          </div>

          <!-- NFT Benefits -->
          <div class="space-y-3 pt-3 border-t border-border">
            <h4 class="font-medium text-sm flex items-center">
              <Crown class="h-4 w-4 mr-1 text-secondary" />
              NFT Ownership Benefits
            </h4>
            <ul class="space-y-2">
              {#each plan.nftBenefits as benefit}
                <li class="flex items-center">
                  <Star class="h-3 w-3 text-secondary mr-2 shrink-0" />
                  <span class="text-xs text-muted-foreground">{benefit}</span>
                </li>
              {/each}
            </ul>
          </div>

          <Button
            class="w-full"
            variant={plan.isPopular ? 'default' : 'outline'}
            href="/checkout?plan={plan.id}"
          >
            Start Free Trial
          </Button>
        </CardContent>
      </Card>
    {/each}
  </div>

  <!-- Information Sections -->
  <div class="mt-12 space-y-8">
    <!-- How It Works -->
    <div class="text-center space-y-4">
      <h2 class="text-2xl font-bold">How NFT Subscriptions Work</h2>
      <div class="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div class="text-center space-y-2">
          <div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-sm font-bold">1</div>
          <h4 class="font-medium">Subscribe</h4>
          <p class="text-xs text-muted-foreground">Pay with fiat (credit card)</p>
        </div>
        <div class="text-center space-y-2">
          <div class="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto text-sm font-bold">2</div>
          <h4 class="font-medium">NFT Minted</h4>
          <p class="text-xs text-muted-foreground">Subscription NFT sent to wallet</p>
        </div>
        <div class="text-center space-y-2">
          <div class="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto text-sm font-bold">3</div>
          <h4 class="font-medium">Own & Transfer</h4>
          <p class="text-xs text-muted-foreground">Share with family or friends</p>
        </div>
        <div class="text-center space-y-2">
          <div class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto text-sm font-bold">4</div>
          <h4 class="font-medium">Enjoy Benefits</h4>
          <p class="text-xs text-muted-foreground">Exclusive perks & rewards</p>
        </div>
      </div>
    </div>

    <!-- Staking discount table -->
    <div>
      <h2 class="text-xl font-bold mb-4 text-center">Staking Discounts</h2>
      <p class="text-sm text-muted-foreground text-center mb-6">Lock STC tokens to reduce your monthly price. Earn STC free by watching — no purchase needed.</p>
      <div class="overflow-hidden rounded-xl border border-border">
        <table class="w-full text-sm">
          <thead class="bg-muted/30">
            <tr>
              <th class="text-left px-4 py-3 text-muted-foreground font-medium">Tier</th>
              <th class="text-left px-4 py-3 text-muted-foreground font-medium">Discount</th>
              <th class="text-left px-4 py-3 text-muted-foreground font-medium">How to reach</th>
              <th class="text-left px-4 py-3 text-muted-foreground font-medium">Price on $10/mo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr><td class="px-4 py-3">Tier 1</td><td class="px-4 py-3 text-green-400">10% off</td><td class="px-4 py-3 text-muted-foreground">1,000+ STC locked 90d+</td><td class="px-4 py-3">$9</td></tr>
            <tr><td class="px-4 py-3">Tier 2</td><td class="px-4 py-3 text-green-400">20% off</td><td class="px-4 py-3 text-muted-foreground">3,500+ STC or 1,000+ for 2yr</td><td class="px-4 py-3">$8</td></tr>
            <tr><td class="px-4 py-3">Tier 3</td><td class="px-4 py-3 text-green-400">35% off</td><td class="px-4 py-3 text-muted-foreground">10,000+ STC or 3,500+ for 2yr</td><td class="px-4 py-3">$6.50</td></tr>
            <tr><td class="px-4 py-3">Tier 4</td><td class="px-4 py-3 text-green-400">50% off</td><td class="px-4 py-3 text-muted-foreground">35,000+ STC or 10,000+ for 2yr</td><td class="px-4 py-3">$5</td></tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-muted-foreground mt-3 text-center">Tier 1 is reachable in ~200 days of watching at 5 STC/day — no purchase needed.</p>
    </div>

    <!-- FAQ / Additional Benefits -->
    <div class="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <Gift class="h-5 w-5 text-primary" />
            <span>Why Choose NFT Subscriptions?</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3 text-sm">
          <div>✓ <strong>True Ownership:</strong> Your subscription is stored on the blockchain</div>
          <div>✓ <strong>Family Sharing:</strong> Transfer your NFT to family members</div>
          <div>✓ <strong>Cross-Platform:</strong> Use on partner streaming services</div>
          <div>✓ <strong>Exclusive Rewards:</strong> NFT holder-only benefits and airdrops</div>
          <div>✓ <strong>Transparent:</strong> View your payment history on-chain</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <Coins class="h-5 w-5 text-secondary" />
            <span>STC Token Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3 text-sm">
          <div>💰 <strong>Earn Tokens:</strong> Watch content and earn STC rewards</div>
          <div>🔒 <strong>Stake for Discounts:</strong> Up to 50% off subscription fees</div>
          <div>🗳️ <strong>Governance Rights:</strong> Vote on platform decisions</div>
          <div>🎁 <strong>Exclusive Access:</strong> Early content and feature access</div>
          <div>📈 <strong>Token Growth:</strong> Benefit from platform revenue growth</div>
          <div class="pt-2">
            <Button variant="outline" size="sm" href="/tokens" class="w-full">
              Learn About STC Tokens
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</div>

<!-- Wallet Connect Modal -->
{#if showWalletModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-background p-6 rounded-lg max-w-md w-full mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Connect Wallet</h3>
        <Button variant="ghost" size="sm" onclick={() => showWalletModal = false}>×</Button>
      </div>
      <WalletConnect />
      <div class="mt-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onclick={() => showWalletModal = false}
          class="text-muted-foreground"
        >
          Continue without wallet
        </Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .gradient-text {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>