<script lang="ts">
  import { ArrowUpDown, Wallet, Coins, ExternalLink, ArrowRight, RefreshCw } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { tokenAMM, stcToken } from '$lib/web3/contracts';
  import { isConnected, walletAddress, connectWallet } from '$lib/web3/wallet';

  type Direction = 'buy' | 'sell';

  let direction = $state<Direction>('buy');
  let inputAmount = $state('');
  let outputEstimate = $state('0');
  let priceImpact = $state(0);
  let stcPrice = $state('0');
  let stcBalance = $state('0');
  let usdcBalance = $state('0');
  let loading = $state(false);
  let message = $state('');

  $effect(() => {
    void loadPrice();
    if ($isConnected && $walletAddress) void loadBalances();
  });

  async function loadPrice() {
    try {
      stcPrice = await tokenAMM.getSTCPrice();
    } catch (err) {
      console.error('Price load failed:', err);
    }
  }

  async function loadBalances() {
    try {
      stcBalance = await stcToken.balanceOf($walletAddress!);
      // USDC balance via tokenAMM helper
      const pool = await tokenAMM.getPoolInfo();
      usdcBalance = pool.usdcBalance ?? '0';
    } catch (err) {
      console.error('Balance load failed:', err);
    }
  }

  function flip() {
    direction = direction === 'buy' ? 'sell' : 'buy';
    inputAmount = '';
    outputEstimate = '0';
  }

  $effect(() => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      outputEstimate = '0';
      priceImpact = 0;
      return;
    }
    const inAmt = parseFloat(inputAmount);
    const rate = parseFloat(stcPrice) || 1;
    const out = direction === 'buy' ? inAmt / rate : inAmt * rate;
    outputEstimate = (out * 0.997).toFixed(4); // 0.3% fee
    priceImpact = Math.min((inAmt / 10000) * 100, 100);
  });

  async function handleSwap() {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      message = 'Enter a valid amount';
      return;
    }
    loading = true;
    message = '';
    try {
      await new Promise((r) => setTimeout(r, 1000));
      message = `Swap simulation: ${inputAmount} ${direction === 'buy' ? 'USDC → STC' : 'STC → USDC'}`;
      void loadBalances();
    } catch (err) {
      message = err instanceof Error ? err.message : 'Swap failed';
    } finally {
      loading = false;
    }
  }

  const inputLabel = $derived(direction === 'buy' ? 'USDC' : 'STC');
  const outputLabel = $derived(direction === 'buy' ? 'STC' : 'USDC');
  const inputBalance = $derived(direction === 'buy' ? usdcBalance : stcBalance);
</script>

<svelte:head>
  <title>STC Exchange · Sephar Studios</title>
  <meta name="description" content="Buy and sell STC tokens through the in-app AMM pool." />
</svelte:head>

<div class="min-h-screen bg-background text-white px-4 py-10">
  <div class="max-w-3xl mx-auto space-y-8">
    <header class="text-center">
      <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
        <ArrowUpDown class="w-4 h-4" /> STC ⇄ USDC
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-3">STC Token Exchange</h1>
      <p class="text-muted-foreground max-w-xl mx-auto">
        Swap between STC and USDC directly through the Sephar Studios AMM pool. No external bridges, no centralised order book.
      </p>
    </header>

    <!-- Live price -->
    <div class="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
          <Coins class="w-5 h-5 text-primary" />
        </div>
        <div>
          <div class="text-xs text-muted-foreground">STC Price</div>
          <div class="text-xl font-bold">${parseFloat(stcPrice).toFixed(4)} <span class="text-sm text-muted-foreground">USDC</span></div>
        </div>
      </div>
      <Button variant="outline" size="sm" onclick={loadPrice}>
        <RefreshCw class="w-4 h-4 mr-2" /> Refresh
      </Button>
    </div>

    {#if !$isConnected}
      <div class="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
        <Wallet class="w-10 h-10 text-primary mx-auto" />
        <h2 class="text-xl font-semibold">Connect a wallet to swap</h2>
        <Button onclick={() => connectWallet()}>Connect Wallet</Button>
      </div>
    {:else}
      <!-- Swap card -->
      <div class="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between text-xs text-muted-foreground">
            <span>You pay</span>
            <span>Balance: {parseFloat(inputBalance).toLocaleString()} {inputLabel}</span>
          </div>
          <div class="flex gap-2 items-center bg-background border border-border rounded-lg px-3 py-3">
            <input
              type="number"
              min="0"
              step="0.0001"
              bind:value={inputAmount}
              placeholder="0.00"
              class="flex-1 bg-transparent text-lg font-semibold outline-none"
            />
            <span class="text-sm font-semibold text-muted-foreground">{inputLabel}</span>
          </div>
        </div>

        <div class="flex justify-center">
          <button
            type="button"
            onclick={flip}
            class="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
            aria-label="Flip direction"
          >
            <ArrowUpDown class="w-5 h-5 text-primary" />
          </button>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-xs text-muted-foreground">
            <span>You receive</span>
            <span>Price impact: {priceImpact.toFixed(2)}%</span>
          </div>
          <div class="flex gap-2 items-center bg-background border border-border rounded-lg px-3 py-3">
            <input
              type="text"
              readonly
              value={outputEstimate}
              class="flex-1 bg-transparent text-lg font-semibold outline-none"
            />
            <span class="text-sm font-semibold text-muted-foreground">{outputLabel}</span>
          </div>
        </div>

        <Button class="w-full" disabled={loading} onclick={handleSwap}>
          {loading ? 'Swapping...' : `Swap ${inputLabel} for ${outputLabel}`}
          <ArrowRight class="w-4 h-4 ml-2" />
        </Button>

        {#if message}
          <p class="text-xs text-muted-foreground text-center">{message}</p>
        {/if}

        <div class="text-xs text-muted-foreground pt-3 border-t border-border space-y-1">
          <div class="flex justify-between"><span>Pool fee</span><span>0.30%</span></div>
          <div class="flex justify-between"><span>Slippage tolerance</span><span>1.0%</span></div>
        </div>
      </div>
    {/if}

    <div class="flex flex-wrap gap-3 justify-center">
      <Button variant="outline" href="/staking"><span>Stake STC</span></Button>
      <Button variant="outline" href="/liquidity"><span>Provide Liquidity</span></Button>
      <Button variant="outline" href="/token">
        <span>Token Overview</span> <ExternalLink class="w-3.5 h-3.5 ml-2" />
      </Button>
    </div>
  </div>
</div>
