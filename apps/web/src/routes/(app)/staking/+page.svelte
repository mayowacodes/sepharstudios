<script lang="ts">
  import { onMount } from 'svelte';
  import { Coins, Lock, TrendingUp, Gift, Calendar, ArrowRight, Wallet } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { stcToken } from '$lib/web3/contracts';
  import { isConnected, walletAddress, walletGeneration, connectWallet } from '$lib/web3/wallet';
  import { get } from 'svelte/store';

  const TIERS = [
    { days: 30, discount: 5, label: '1 Month', tone: 'bronze' },
    { days: 90, discount: 12, label: '3 Months', tone: 'silver' },
    { days: 180, discount: 25, label: '6 Months', tone: 'gold' },
    { days: 365, discount: 50, label: '1 Year', tone: 'diamond' }
  ];

  let balance = $state('0');
  let activeStake = $state<{ amount: string; tier: number; unlocksAt: string | null }>({
    amount: '0',
    tier: 0,
    unlocksAt: null
  });
  let selectedTier = $state(2);
  let stakeAmount = $state('');
  let loading = $state(false);
  let message = $state('');

  $effect(() => {
    if ($isConnected && $walletAddress) {
      void loadStakingData();
    }
  });

  async function loadStakingData() {
    // Snapshot the wallet generation at the start of the load. If the user
    // disconnects or switches wallets while these RPC calls are in flight,
    // the generation counter increments and we discard the result so stale
    // data from the old wallet doesn't paint over the new one.
    const startGen = get(walletGeneration);
    const startAddr = $walletAddress;
    try {
      const [bal, discount] = await Promise.all([
        stcToken.balanceOf(startAddr!),
        stcToken.getUserDiscount(startAddr!)
      ]);
      if (get(walletGeneration) !== startGen) return;  // wallet changed mid-flight
      balance = bal;
      const tierIndex = TIERS.findIndex((t) => t.discount === discount);
      activeStake.tier = tierIndex >= 0 ? tierIndex : 0;
    } catch (err) {
      console.error('Failed to load staking data:', err);
    }
  }

  async function handleStake() {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      message = 'Enter a valid amount';
      return;
    }
    if (!$walletAddress) {
      message = 'Connect your wallet to stake.';
      return;
    }
    if (parseFloat(stakeAmount) > parseFloat(balance)) {
      message = `Insufficient balance. You have ${balance} STC available.`;
      return;
    }

    const tier = TIERS[selectedTier];
    loading = true;
    message = '';
    try {
      // Calls the on-chain stakeForDiscount(amount, lockPeriod) — the STC token
      // contract validates allowed periods (90/180/365/730 days). lockPeriod
      // is in seconds. Wallet will prompt for transaction approval.
      const lockSeconds = tier.days * 86_400;
      const txHash = await stcToken.stakeForDiscount(stakeAmount, lockSeconds);
      message = `Stake submitted (tx ${(txHash as string).slice(0, 10)}…). Discount activates after on-chain confirmation.`;
      // Refresh balance + active stake from chain so UI reflects new state.
      await loadStakingData();
      stakeAmount = '';
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Stake failed';
      // viem wraps wallet rejections under different messages depending on
      // provider — surface a friendlier prompt rather than the raw RPC error.
      if (/user rejected|user denied|rejected.*request/i.test(raw)) {
        message = 'Transaction cancelled.';
      } else {
        message = raw.length > 140 ? `${raw.slice(0, 140)}…` : raw;
      }
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>STC Staking · Sephar Studios</title>
  <meta name="description" content="Stake STC tokens to unlock subscription discounts and creator rewards." />
</svelte:head>

<div class="min-h-screen bg-background text-white px-4 py-10">
  <div class="max-w-5xl mx-auto space-y-8">
    <header class="text-center">
      <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
        <Lock class="w-4 h-4" /> STC Token Staking
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-3">Stake STC. Stream for less.</h1>
      <p class="text-muted-foreground max-w-xl mx-auto">
        Lock STC tokens for a fixed period and earn a permanent discount on your Sephar Studios subscription —
        the longer you stake, the deeper the discount.
      </p>
    </header>

    {#if !$isConnected}
      <div class="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
        <Wallet class="w-10 h-10 text-primary mx-auto" />
        <h2 class="text-xl font-semibold">Connect a wallet to start staking</h2>
        <p class="text-sm text-muted-foreground">
          Your STC balance, active stake and discount tier will appear here once you connect.
        </p>
        <Button onclick={() => connectWallet()}>Connect Wallet</Button>
      </div>
    {:else}
      <!-- Balance + current stake summary -->
      <div class="grid sm:grid-cols-3 gap-4">
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">
            <Coins class="w-4 h-4" /> Available STC
          </div>
          <div class="text-2xl font-bold">{parseFloat(balance).toLocaleString()}</div>
        </div>
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">
            <Gift class="w-4 h-4" /> Current Discount
          </div>
          <div class="text-2xl font-bold text-primary">{TIERS[activeStake.tier].discount}%</div>
        </div>
        <div class="bg-card border border-border rounded-xl p-5">
          <div class="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">
            <Calendar class="w-4 h-4" /> Unlocks
          </div>
          <div class="text-sm">
            {activeStake.unlocksAt ?? 'No active stake yet'}
          </div>
        </div>
      </div>

      <!-- Tier selection -->
      <div class="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 class="text-lg font-semibold">Choose a lock period</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          {#each TIERS as tier, i}
            <button
              type="button"
              onclick={() => (selectedTier = i)}
              class="text-left p-4 rounded-xl border transition-all
                {selectedTier === i
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50'}"
            >
              <div class="text-xs text-muted-foreground">{tier.label}</div>
              <div class="text-2xl font-bold mt-1">{tier.discount}%</div>
              <div class="text-xs text-muted-foreground mt-1">subscription discount</div>
            </button>
          {/each}
        </div>

        <div class="pt-4 border-t border-border space-y-3">
          <label class="text-sm font-medium" for="stake-amount">Amount to stake (STC)</label>
          <div class="flex gap-2">
            <input
              id="stake-amount"
              type="number"
              min="0"
              step="0.01"
              bind:value={stakeAmount}
              placeholder="0.00"
              class="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
            <Button variant="outline" size="sm" onclick={() => (stakeAmount = balance)}>Max</Button>
          </div>
          <Button class="w-full" disabled={loading} onclick={handleStake}>
            {loading ? 'Staking...' : `Stake for ${TIERS[selectedTier].label}`}
            <ArrowRight class="w-4 h-4 ml-2" />
          </Button>
          {#if message}
            <p class="text-xs text-muted-foreground">{message}</p>
          {/if}
        </div>
      </div>
    {/if}

    <!-- How it works -->
    <div class="bg-card border border-border rounded-2xl p-6">
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp class="w-5 h-5 text-primary" /> How STC staking works
      </h2>
      <ol class="space-y-3 text-sm text-muted-foreground">
        <li><span class="text-primary font-semibold">1.</span> Lock STC for a fixed period — your tokens stay yours, just unspendable until unlock.</li>
        <li><span class="text-primary font-semibold">2.</span> Your subscription cost drops by the staking discount automatically.</li>
        <li><span class="text-primary font-semibold">3.</span> Stack discounts with NFT subscription tier benefits.</li>
        <li><span class="text-primary font-semibold">4.</span> Withdraw anytime after the lock period ends — no penalties, no fees.</li>
      </ol>

      <div class="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" href="/exchange">
          <Coins class="w-4 h-4 mr-2" /> Buy STC
        </Button>
        <Button variant="outline" href="/liquidity">Provide Liquidity</Button>
        <Button variant="outline" href="/token">Token Overview</Button>
      </div>
    </div>
  </div>
</div>
