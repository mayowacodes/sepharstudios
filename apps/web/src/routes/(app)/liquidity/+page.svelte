<script lang="ts">
  import { Droplets, Wallet, ArrowRight, Coins, TrendingUp, Info } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { tokenAMM, stcToken, usdcToken } from '$lib/web3/contracts';
  import { isConnected, walletAddress, connectWallet } from '$lib/web3/wallet';

  let pool = $state({ stcBalance: '0', usdcBalance: '0', totalLiquidity: 0 });
  let myShare = $state({ lp: '0', stc: '0', usdc: '0', sharePct: 0 });
  let stcAmount = $state('');
  let usdcAmount = $state('');
  let loading = $state(false);
  let message = $state('');
  let mode = $state<'add' | 'remove'>('add');
  let removePct = $state(50);

  $effect(() => {
    void loadPool();
    if ($isConnected && $walletAddress) void loadShare();
  });

  async function loadPool() {
    try {
      const info = await tokenAMM.getPoolInfo();
      pool = {
        stcBalance: info.stcBalance ?? '0',
        usdcBalance: info.usdcBalance ?? '0',
        totalLiquidity: info.totalLiquidity ?? 0
      };
    } catch (err) {
      console.error('Pool load failed:', err);
    }
  }

  async function loadShare() {
    if (!$walletAddress) return;
    try {
      const share = await tokenAMM.getMyLPShare($walletAddress);
      // STC + USDC entitlements derived from sharePct of pool reserves.
      const stcEntitled = (parseFloat(pool.stcBalance) * (share.sharePct / 100)).toFixed(4);
      const usdcEntitled = (parseFloat(pool.usdcBalance) * (share.sharePct / 100)).toFixed(4);
      myShare = {
        lp: share.lpAmount,
        stc: stcEntitled,
        usdc: usdcEntitled,
        sharePct: share.sharePct
      };
    } catch (err) {
      console.error('Share load failed:', err);
      myShare = { lp: '0', stc: '0', usdc: '0', sharePct: 0 };
    }
  }

  $effect(() => {
    // Auto-balance the pair based on current pool ratio
    if (mode !== 'add' || !stcAmount || parseFloat(stcAmount) <= 0) return;
    const stcR = parseFloat(pool.stcBalance);
    const usdcR = parseFloat(pool.usdcBalance);
    if (stcR > 0 && usdcR > 0) {
      usdcAmount = ((parseFloat(stcAmount) / stcR) * usdcR).toFixed(4);
    }
  });

  async function handleAdd() {
    if (!stcAmount || parseFloat(stcAmount) <= 0) {
      message = 'Enter STC amount';
      return;
    }
    if (!usdcAmount || parseFloat(usdcAmount) <= 0) {
      message = 'USDC amount missing — wait for auto-balance.';
      return;
    }
    if (!$walletAddress) {
      message = 'Connect your wallet first.';
      return;
    }

    loading = true;
    message = '';
    try {
      // Wallet prompts three times: approve STC, approve USDC, addLiquidity.
      const ammAddress = tokenAMM.contractAddress();
      message = 'Approving STC…';
      await stcToken.approve(ammAddress, stcAmount);
      message = 'Approving USDC…';
      await usdcToken.approve(ammAddress, usdcAmount);
      message = 'Adding liquidity…';
      const txHash = await tokenAMM.addLiquidity(stcAmount, usdcAmount);
      message = `Liquidity added (tx ${(txHash as string).slice(0, 10)}…).`;
      stcAmount = '';
      usdcAmount = '';
      // Refresh on-chain reads after a few seconds so the new LP tokens show.
      setTimeout(() => { void loadPool(); void loadShare(); }, 2500);
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Add liquidity failed';
      message = /user rejected|user denied|rejected.*request/i.test(raw)
        ? 'Transaction cancelled.'
        : raw.length > 140 ? `${raw.slice(0, 140)}…` : raw;
    } finally {
      loading = false;
    }
  }

  async function handleRemove() {
    if (parseFloat(myShare.lp) <= 0) {
      message = 'You have no LP tokens to remove.';
      return;
    }
    if (!$walletAddress) {
      message = 'Connect your wallet first.';
      return;
    }
    loading = true;
    message = '';
    try {
      // Burn `removePct%` of the user's LP balance. Accept up to 1% slippage
      // on the underlying STC/USDC withdrawal versus the pool ratio.
      const lpToBurn = (parseFloat(myShare.lp) * (removePct / 100)).toFixed(18);
      const expectedStc = parseFloat(myShare.stc) * (removePct / 100);
      const expectedUsdc = parseFloat(myShare.usdc) * (removePct / 100);
      const minStc = (expectedStc * 0.99).toFixed(18);
      const minUsdc = (expectedUsdc * 0.99).toFixed(6);

      message = 'Removing liquidity…';
      const txHash = await tokenAMM.removeLiquidity(lpToBurn, minStc, minUsdc);
      message = `Liquidity removed (tx ${(txHash as string).slice(0, 10)}…). STC + USDC sent to your wallet.`;
      setTimeout(() => { void loadPool(); void loadShare(); }, 2500);
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Remove liquidity failed';
      message = /user rejected|user denied|rejected.*request/i.test(raw)
        ? 'Transaction cancelled.'
        : raw.length > 140 ? `${raw.slice(0, 140)}…` : raw;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>STC Liquidity · Sephar Studios</title>
  <meta name="description" content="Provide liquidity to the STC/USDC pool and earn a share of swap fees." />
</svelte:head>

<div class="min-h-screen bg-background text-white px-4 py-10">
  <div class="max-w-4xl mx-auto space-y-8">
    <header class="text-center">
      <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
        <Droplets class="w-4 h-4" /> STC/USDC Pool
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-3">Provide Liquidity</h1>
      <p class="text-muted-foreground max-w-xl mx-auto">
        Deposit STC and USDC in equal value to the pool. You'll earn a proportional share of the 0.30% swap fee
        on every trade — passive income that compounds while the catalogue grows.
      </p>
    </header>

    <!-- Pool stats -->
    <div class="grid sm:grid-cols-3 gap-4">
      <div class="bg-card border border-border rounded-xl p-5">
        <div class="text-xs text-muted-foreground uppercase tracking-wide mb-2">STC in pool</div>
        <div class="text-xl font-bold">{parseFloat(pool.stcBalance).toLocaleString()}</div>
      </div>
      <div class="bg-card border border-border rounded-xl p-5">
        <div class="text-xs text-muted-foreground uppercase tracking-wide mb-2">USDC in pool</div>
        <div class="text-xl font-bold">${parseFloat(pool.usdcBalance).toLocaleString()}</div>
      </div>
      <div class="bg-card border border-border rounded-xl p-5">
        <div class="text-xs text-muted-foreground uppercase tracking-wide mb-2">Total liquidity</div>
        <div class="text-xl font-bold">${pool.totalLiquidity.toLocaleString()}</div>
      </div>
    </div>

    {#if !$isConnected}
      <div class="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
        <Wallet class="w-10 h-10 text-primary mx-auto" />
        <h2 class="text-xl font-semibold">Connect a wallet to provide liquidity</h2>
        <Button onclick={() => connectWallet()}>Connect Wallet</Button>
      </div>
    {:else}
      <!-- My position -->
      <div class="bg-card border border-border rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your position</h2>
          {#if myShare.sharePct > 0}
            <span class="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/30">{myShare.sharePct.toFixed(2)}% of pool</span>
          {/if}
        </div>
        <div class="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div class="text-xs text-muted-foreground">LP tokens</div>
            <div class="font-semibold">{parseFloat(myShare.lp).toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
          </div>
          <div>
            <div class="text-xs text-muted-foreground">STC</div>
            <div class="font-semibold">{parseFloat(myShare.stc).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
          <div>
            <div class="text-xs text-muted-foreground">USDC</div>
            <div class="font-semibold">${parseFloat(myShare.usdc).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      <!-- Add / remove tabs -->
      <div class="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div class="flex gap-2 border-b border-border pb-3">
          <button
            class="px-4 py-1.5 text-sm rounded-lg transition-colors {mode === 'add' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white'}"
            onclick={() => (mode = 'add')}>Add Liquidity</button>
          <button
            class="px-4 py-1.5 text-sm rounded-lg transition-colors {mode === 'remove' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white'}"
            onclick={() => (mode = 'remove')}>Remove</button>
        </div>

        {#if mode === 'add'}
          <div class="space-y-3">
            <label class="block text-xs text-muted-foreground" for="add-stc">STC amount</label>
            <input
              id="add-stc"
              type="number"
              min="0"
              step="0.01"
              bind:value={stcAmount}
              placeholder="0.00"
              class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
            <label class="block text-xs text-muted-foreground" for="add-usdc">USDC amount (auto-matched)</label>
            <input
              id="add-usdc"
              type="number"
              min="0"
              step="0.01"
              bind:value={usdcAmount}
              placeholder="0.00"
              class="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm"
            />
            <Button class="w-full" disabled={loading} onclick={handleAdd}>
              {loading ? 'Depositing...' : 'Add Liquidity'} <ArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </div>
        {:else}
          <div class="space-y-3">
            <label class="block text-xs text-muted-foreground" for="remove-pct">Remove {removePct}% of position</label>
            <input
              id="remove-pct"
              type="range"
              min="0"
              max="100"
              bind:value={removePct}
              class="w-full"
            />
            <div class="flex gap-2 text-xs">
              {#each [25, 50, 75, 100] as p}
                <button
                  class="flex-1 px-2 py-1.5 rounded border border-border hover:bg-primary/10"
                  onclick={() => (removePct = p)}>{p}%</button>
              {/each}
            </div>
            <Button class="w-full" disabled={loading} onclick={handleRemove}>
              {loading ? 'Withdrawing...' : 'Remove Liquidity'}
            </Button>
          </div>
        {/if}

        {#if message}
          <p class="text-xs text-muted-foreground text-center">{message}</p>
        {/if}
      </div>
    {/if}

    <!-- Info -->
    <div class="bg-card border border-border rounded-2xl p-6 space-y-3">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <Info class="w-5 h-5 text-primary" /> Things to know
      </h2>
      <ul class="text-sm text-muted-foreground space-y-2">
        <li class="flex gap-2"><Coins class="w-4 h-4 mt-0.5 text-primary shrink-0" /> You must supply both STC and USDC in equal value at the current pool ratio.</li>
        <li class="flex gap-2"><TrendingUp class="w-4 h-4 mt-0.5 text-primary shrink-0" /> You receive LP tokens representing your share. Burn them anytime to withdraw your underlying assets + earned fees.</li>
        <li class="flex gap-2"><Droplets class="w-4 h-4 mt-0.5 text-primary shrink-0" /> Impermanent loss applies — if STC price diverges significantly from USDC, your withdrawn position may be worth less than holding spot.</li>
      </ul>

      <div class="pt-3 flex flex-wrap gap-3">
        <Button variant="outline" href="/staking">Stake STC</Button>
        <Button variant="outline" href="/exchange">Swap STC</Button>
        <Button variant="outline" href="/token">Token Overview</Button>
      </div>
    </div>
  </div>
</div>
