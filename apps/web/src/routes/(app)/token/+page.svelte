<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { ArrowUpDown, Wallet, RefreshCw, CheckCircle2, AlertCircle, Loader2, Coins, Zap, Lock, ExternalLink, ArrowRight } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import { tokenAMM, usdcToken, stcToken, subscriptionContract } from '$lib/web3/contracts';
  import { isConnected, walletAddress, connectWallet } from '$lib/web3/wallet';
  import { getContractAddresses, config, type SupportedChainId } from '$lib/web3/config';
  import { getChainId } from '@wagmi/core';
  import { parseUnits, formatUnits } from 'viem';

  type Direction = 'buy' | 'sell';

  // --- State ---
  let direction = $state<Direction>('buy');
  let inputAmount = $state('');
  let outputEstimate = $state('');
  let priceImpact = $state(0);

  let stcReserveRaw = $state(0n);
  let usdcReserveRaw = $state(0n);
  let poolPrice = $state('0');
  let poolStcBalance = $state('0');
  let poolUsdcBalance = $state('0');

  let stcBalance = $state('0');
  let usdcBalance = $state('0');
  let cooldownStatus = $state<{ secondsRemaining: number; nextCooldownDays: number } | null>(null);
  let stcRedeemAmount = $state('500'); // default until loaded from chain
  let stakingInfo = $state<{ amount: string; lockPeriod: number; discountTier: number; isUnlocked: boolean } | null>(null);
  let topUpAmount = $state('');
  let isTopUpApproving = $state(false);
  let isTopUpStaking = $state(false);
  let topUpNeedsApproval = $state(true);
  let topUpSuccess = $state('');
  let topUpError = $state('');

  let isLoadingPool = $state(true);
  let isLoadingBalances = $state(false);
  let isApproving = $state(false);
  let isSwapping = $state(false);
  let isRedeeming = $state(false);
  let needsApproval = $state(true);
  let txSuccess = $state('');
  let errorMsg = $state('');
  let ammAddr = $state('');
  let subAddr = $state('');

  // --- Pool math (mirrors Solidity _getAmountOutWithFee) ---
  function calcOutput(amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint {
    if (!reserveIn || !reserveOut || !amountIn) return 0n;
    const fee = (amountIn * 30n) / 10000n;
    const afterFee = amountIn - fee;
    return (afterFee * reserveOut) / (reserveIn + afterFee);
  }

  function calcImpact(amountIn: bigint, reserveIn: bigint): number {
    if (!reserveIn) return 0;
    return Math.min(Number((amountIn * 10000n) / reserveIn) / 100, 100);
  }

  // --- Update output estimate ---
  function updateEstimate() {
    if (!inputAmount || isNaN(Number(inputAmount)) || Number(inputAmount) <= 0) {
      outputEstimate = '';
      priceImpact = 0;
      return;
    }
    try {
      if (direction === 'buy') {
        const amtIn = parseUnits(inputAmount, 6);
        const out = calcOutput(amtIn, usdcReserveRaw, stcReserveRaw);
        outputEstimate = parseFloat(formatUnits(out, 18)).toFixed(2);
        priceImpact = calcImpact(amtIn, usdcReserveRaw);
      } else {
        const amtIn = parseUnits(inputAmount, 18);
        const out = calcOutput(amtIn, stcReserveRaw, usdcReserveRaw);
        outputEstimate = parseFloat(formatUnits(out, 6)).toFixed(4);
        priceImpact = calcImpact(amtIn, stcReserveRaw);
      }
    } catch {
      outputEstimate = '';
    }
  }

  // --- Load pool ---
  async function loadPool() {
    if (!browser) return;
    isLoadingPool = true;
    try {
      const [info, redeemAmt] = await Promise.all([
        tokenAMM.getPoolInfo(),
        subscriptionContract.getSTCSubscriptionAmount().catch(() => '500')
      ]);
      poolPrice = parseFloat(info.currentPrice).toFixed(6);
      poolStcBalance = parseFloat(info.stcBalance).toLocaleString(undefined, { maximumFractionDigits: 0 });
      poolUsdcBalance = parseFloat(info.usdcBalance).toLocaleString(undefined, { maximumFractionDigits: 2 });
      stcReserveRaw = parseUnits(info.stcBalance, 18);
      usdcReserveRaw = parseUnits(info.usdcBalance, 6);
      stcRedeemAmount = parseFloat(redeemAmt).toLocaleString(undefined, { maximumFractionDigits: 0 });
      updateEstimate();
    } catch (e) {
      console.error('Pool load error:', e);
    } finally {
      isLoadingPool = false;
    }
  }

  // --- Load user balances & cooldown ---
  async function loadBalances(addr: string) {
    isLoadingBalances = true;
    try {
      const [stc, usdc, stakeData, status] = await Promise.all([
        stcToken.balanceOf(addr),
        usdcToken.balanceOf(addr),
        stcToken.getStakingInfo(addr),
        subscriptionContract.getSTCCooldownStatus(addr)
      ]);
      stcBalance = parseFloat(stc).toLocaleString(undefined, { maximumFractionDigits: 2 });
      usdcBalance = parseFloat(usdc).toFixed(2);
      stakingInfo = stakeData;
      cooldownStatus = status;
    } catch (e) {
      console.error('Balance load error:', e);
    } finally {
      isLoadingBalances = false;
    }
  }

  async function handleTopUpApprove() {
    if (!topUpAmount || Number(topUpAmount) <= 0) return;
    topUpError = '';
    isTopUpApproving = true;
    try {
      await stcToken.approve(stcToken.contractAddress(), topUpAmount);
      topUpNeedsApproval = false;
    } catch (e: any) {
      topUpError = e?.message?.includes('rejected') ? 'Transaction cancelled.' : 'Approval failed.';
    } finally {
      isTopUpApproving = false;
    }
  }

  async function handleTopUpStake() {
    if (!topUpAmount || Number(topUpAmount) <= 0) return;
    topUpError = '';
    topUpSuccess = '';
    isTopUpStaking = true;
    try {
      await stcToken.addToStake(topUpAmount);
      topUpSuccess = `Added ${topUpAmount} STC to your stake. Tier recalculated.`;
      topUpAmount = '';
      topUpNeedsApproval = true;
      if ($walletAddress) await loadBalances($walletAddress);
    } catch (e: any) {
      if (e?.message?.includes('expired')) {
        topUpError = 'Your stake has expired. Use Stake for Discount to create a new stake.';
      } else if (e?.message?.includes('rejected')) {
        topUpError = 'Transaction cancelled.';
      } else {
        topUpError = 'Top-up failed. Check your balance and try again.';
      }
    } finally {
      isTopUpStaking = false;
    }
  }

  $effect(() => {
    if (topUpAmount && $walletAddress) {
      stcToken.allowance($walletAddress, stcToken.contractAddress()).then(allowance => {
        topUpNeedsApproval = parseFloat(allowance) < parseFloat(topUpAmount || '0');
      }).catch(() => { topUpNeedsApproval = true; });
    }
  });

  // --- Check allowance ---
  async function checkApproval() {
    if (!$walletAddress || !inputAmount || Number(inputAmount) <= 0) return;
    try {
      if (direction === 'buy') {
        const allowance = await usdcToken.allowance($walletAddress, ammAddr);
        needsApproval = parseFloat(allowance) < parseFloat(inputAmount);
      } else {
        const allowance = await stcToken.allowance($walletAddress, ammAddr);
        needsApproval = parseFloat(allowance) < parseFloat(inputAmount);
      }
    } catch {
      needsApproval = true;
    }
  }

  // --- Approve ---
  async function handleApprove() {
    errorMsg = '';
    isApproving = true;
    try {
      if (direction === 'buy') {
        await usdcToken.approve(ammAddr, inputAmount);
      } else {
        await stcToken.approve(ammAddr, inputAmount);
      }
      needsApproval = false;
    } catch (e: any) {
      errorMsg = e?.message?.includes('rejected') ? 'Transaction cancelled.' : 'Approval failed. Try again.';
    } finally {
      isApproving = false;
    }
  }

  // --- Swap ---
  async function handleSwap() {
    if (!inputAmount || !outputEstimate) return;
    errorMsg = '';
    txSuccess = '';
    isSwapping = true;
    try {
      const minOut = (parseFloat(outputEstimate) * 0.995).toString();
      if (direction === 'buy') {
        await tokenAMM.swapUSDCForSTC(inputAmount, parseFloat(minOut).toFixed(2));
        txSuccess = `Swap complete! You received ~${outputEstimate} STC.`;
      } else {
        await tokenAMM.swapSTCForUSDC(inputAmount, parseFloat(minOut).toFixed(6));
        txSuccess = `Swap complete! You received ~${outputEstimate} USDC.`;
      }
      inputAmount = '';
      outputEstimate = '';
      needsApproval = true;
      if ($walletAddress) await loadBalances($walletAddress);
      await loadPool();
    } catch (e: any) {
      errorMsg = e?.message?.includes('rejected') ? 'Transaction cancelled.' : 'Swap failed. Check your balance.';
    } finally {
      isSwapping = false;
    }
  }

  // --- Redeem STC for subscription ---
  async function handleRedeem() {
    if (!$walletAddress) return;
    errorMsg = '';
    txSuccess = '';
    isRedeeming = true;
    try {
      // Step 1: Approve STC for subscription contract
      const allowance = await stcToken.allowance($walletAddress, subAddr);
      const redeemAmt = stcRedeemAmount.replace(/,/g, '');
      if (parseFloat(allowance) < parseFloat(redeemAmt)) {
        await stcToken.approve(subAddr, redeemAmt);
      }
      // Step 2: Mint subscription
      await subscriptionContract.mintSubscriptionWithSTC();
      txSuccess = 'Success! 1 month Basic subscription activated.';
      if ($walletAddress) await loadBalances($walletAddress);
    } catch (e: any) {
      if (e?.message?.includes('cooldown')) {
        errorMsg = 'Cooldown active — check your remaining wait time below.';
      } else if (e?.message?.includes('Insufficient')) {
        errorMsg = `You need at least ${stcRedeemAmount} STC to redeem a subscription.`;
      } else if (e?.message?.includes('rejected')) {
        errorMsg = 'Transaction cancelled.';
      } else {
        errorMsg = 'Redemption failed. Try again.';
      }
    } finally {
      isRedeeming = false;
    }
  }

  function flipDirection() {
    direction = direction === 'buy' ? 'sell' : 'buy';
    inputAmount = '';
    outputEstimate = '';
    errorMsg = '';
    txSuccess = '';
    needsApproval = true;
  }

  function setMax() {
    const raw = direction === 'buy' ? usdcBalance : stcBalance;
    inputAmount = raw.replace(/,/g, '');
    updateEstimate();
  }

  function formatCooldown(secs: number): string {
    if (secs <= 0) return 'Ready now';
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    if (d > 0) return `${d}d ${h}h remaining`;
    return `${h}h remaining`;
  }

  // --- Effects ---
  $effect(() => {
    const _dir = direction;
    const _amt = inputAmount;
    updateEstimate();
    if ($walletAddress && _amt) checkApproval();
  });

  $effect(() => {
    const addr = $walletAddress;
    if (addr) loadBalances(addr);
  });

  onMount(() => {
    const chainId = getChainId(config) as SupportedChainId;
    const addrs = getContractAddresses(chainId);
    ammAddr = addrs.tokenAMM;
    subAddr = addrs.sepharSubscription;
    loadPool();
  });
</script>

<div class="relative min-h-screen bg-(--surface-charcoal) text-white overflow-hidden">
  <!-- Background glow -->
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-[#FFBF00]/8 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-0 right-1/4 w-100 h-75 bg-[#FF5E0E]/8 blur-[100px] rounded-full"></div>
  </div>

  <div class="relative z-10 container mx-auto px-4 pt-28 pb-20 max-w-5xl">

    <!-- Header -->
    <div class="text-center mb-10">
      <div class="inline-flex items-center gap-2 rounded-full border border-[#FFBF00]/30 bg-[#FFBF00]/10 px-3 py-1 text-sm font-medium text-[#FFBF00] mb-4">
        <Coins class="h-4 w-4" /> Studio Token · Polygon Network
      </div>
      <h1 class="text-4xl font-extrabold mb-2">STC Token</h1>
      <p class="text-white/55 max-w-xl mx-auto">Buy STC with USDC, sell STC for USDC, or redeem {stcRedeemAmount} STC for a free month subscription.</p>
    </div>

    <!-- Pool stats bar -->
    <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 mb-8 flex flex-wrap gap-6 items-center justify-between text-sm">
      {#if isLoadingPool}
        <div class="flex items-center gap-2 text-white/40 text-sm">
          <Loader2 class="h-4 w-4 animate-spin" /> Loading pool data...
        </div>
      {:else if stcReserveRaw === 0n}
        <div class="flex items-center gap-2 text-amber-400 text-sm">
          <AlertCircle class="h-4 w-4" /> Pool has no liquidity yet — check back at launch.
        </div>
      {:else}
        <div>
          <p class="text-white/40 text-xs uppercase tracking-widest mb-0.5">STC Price</p>
          <p class="text-lg font-bold text-[#FFBF00]">${poolPrice} <span class="text-xs font-normal text-white/40">USDC</span></p>
        </div>
        <div>
          <p class="text-white/40 text-xs uppercase tracking-widest mb-0.5">Pool STC</p>
          <p class="text-lg font-semibold">{poolStcBalance}</p>
        </div>
        <div>
          <p class="text-white/40 text-xs uppercase tracking-widest mb-0.5">Pool USDC</p>
          <p class="text-lg font-semibold">${poolUsdcBalance}</p>
        </div>
        <div>
          <p class="text-white/40 text-xs uppercase tracking-widest mb-0.5">Fee</p>
          <p class="text-lg font-semibold">0.3%</p>
        </div>
        <button onclick={loadPool} class="text-white/30 hover:text-white/70 transition-colors">
          <RefreshCw class="h-4 w-4" />
        </button>
      {/if}
    </div>

    <!-- Main grid -->
    <div class="grid lg:grid-cols-5 gap-6">

      <!-- Swap widget (3/5) -->
      <div class="lg:col-span-3">
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold">Swap</h2>
            <!-- Direction toggle -->
            <div class="flex rounded-xl border border-white/10 overflow-hidden text-sm">
              <button
                class="px-4 py-1.5 transition-colors {direction === 'buy' ? 'bg-[#FF5E0E] text-white' : 'text-white/50 hover:text-white/80'}"
                onclick={() => { direction = 'buy'; inputAmount = ''; outputEstimate = ''; errorMsg = ''; txSuccess = ''; needsApproval = true; }}
              >Buy STC</button>
              <button
                class="px-4 py-1.5 transition-colors {direction === 'sell' ? 'bg-[#FF5E0E] text-white' : 'text-white/50 hover:text-white/80'}"
                onclick={() => { direction = 'sell'; inputAmount = ''; outputEstimate = ''; errorMsg = ''; txSuccess = ''; needsApproval = true; }}
              >Sell STC</button>
            </div>
          </div>

          <!-- Input -->
          <div class="rounded-xl border border-white/10 bg-white/5 p-4 mb-2">
            <div class="flex justify-between text-xs text-white/40 mb-2">
              <span>You pay</span>
              <span>
                Balance: {direction === 'buy' ? usdcBalance : stcBalance} {direction === 'buy' ? 'USDC' : 'STC'}
                {#if $isConnected}
                  <button onclick={setMax} class="ml-1 text-[#FF5E0E] hover:underline">MAX</button>
                {/if}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <input
                type="number"
                placeholder="0.00"
                bind:value={inputAmount}
                min="0"
                class="flex-1 bg-transparent text-2xl font-bold outline-none placeholder-white/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <div class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">
                {#if direction === 'buy'}
                  <span class="text-[#3cba54] font-bold text-base">$</span> USDC
                {:else}
                  <Coins class="h-4 w-4 text-[#FFBF00]" /> STC
                {/if}
              </div>
            </div>
          </div>

          <!-- Flip arrow -->
          <div class="flex justify-center my-2">
            <button
              onclick={flipDirection}
              class="rounded-full border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
              aria-label="Flip direction"
            >
              <ArrowUpDown class="h-4 w-4 text-white/60" />
            </button>
          </div>

          <!-- Output -->
          <div class="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
            <div class="flex justify-between text-xs text-white/40 mb-2">
              <span>You receive (estimate)</span>
              <span>Balance: {direction === 'sell' ? usdcBalance : stcBalance} {direction === 'sell' ? 'USDC' : 'STC'}</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="flex-1 text-2xl font-bold text-white/80">
                {outputEstimate || '—'}
              </div>
              <div class="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">
                {#if direction === 'buy'}
                  <Coins class="h-4 w-4 text-[#FFBF00]" /> STC
                {:else}
                  <span class="text-[#3cba54] font-bold text-base">$</span> USDC
                {/if}
              </div>
            </div>
          </div>

          <!-- Details -->
          {#if outputEstimate && inputAmount}
            <div class="rounded-xl border border-white/8 bg-white/3 p-3 mb-4 text-xs text-white/50 space-y-1">
              <div class="flex justify-between">
                <span>Rate</span>
                <span class="text-white/70">
                  1 {direction === 'buy' ? 'USDC' : 'STC'} ≈ {(parseFloat(outputEstimate) / parseFloat(inputAmount)).toFixed(4)} {direction === 'buy' ? 'STC' : 'USDC'}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Fee</span>
                <span class="text-white/70">0.3%</span>
              </div>
              <div class="flex justify-between">
                <span>Price impact</span>
                <span class={priceImpact > 5 ? 'text-red-400 font-medium' : priceImpact > 2 ? 'text-amber-400' : 'text-green-400'}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              <div class="flex justify-between">
                <span>Min received (0.5% slippage)</span>
                <span class="text-white/70">{(parseFloat(outputEstimate) * 0.995).toFixed(4)} {direction === 'buy' ? 'STC' : 'USDC'}</span>
              </div>
            </div>
          {/if}

          <!-- Error / Success -->
          {#if errorMsg}
            <div class="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400 mb-4">
              <AlertCircle class="h-4 w-4 shrink-0" /> {errorMsg}
            </div>
          {/if}
          {#if txSuccess}
            <div class="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-400 mb-4">
              <CheckCircle2 class="h-4 w-4 shrink-0" /> {txSuccess}
            </div>
          {/if}

          <!-- Action button -->
          {#if !$isConnected}
            <Button
              onclick={() => connectWallet('injected')}
              class="w-full bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white h-12 text-base font-semibold"
            >
              <Wallet class="mr-2 h-5 w-5" /> Connect Wallet
            </Button>
          {:else if stcReserveRaw === 0n}
            <Button disabled class="w-full h-12 text-base opacity-50 cursor-not-allowed">
              No liquidity in pool
            </Button>
          {:else if !inputAmount || Number(inputAmount) <= 0}
            <Button disabled class="w-full h-12 text-base opacity-50 cursor-not-allowed">
              Enter an amount
            </Button>
          {:else if needsApproval}
            <Button
              onclick={handleApprove}
              disabled={isApproving}
              class="w-full bg-amber-500 hover:bg-amber-500/90 text-black h-12 text-base font-semibold"
            >
              {#if isApproving}
                <Loader2 class="mr-2 h-5 w-5 animate-spin" /> Approving...
              {:else}
                Step 1: Approve {direction === 'buy' ? 'USDC' : 'STC'}
              {/if}
            </Button>
          {:else}
            <Button
              onclick={handleSwap}
              disabled={isSwapping}
              class="w-full bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white h-12 text-base font-semibold"
            >
              {#if isSwapping}
                <Loader2 class="mr-2 h-5 w-5 animate-spin" /> Swapping...
              {:else}
                Step 2: {direction === 'buy' ? 'Buy STC' : 'Sell STC'}
              {/if}
            </Button>
          {/if}

          <p class="text-center text-xs text-white/30 mt-3">
            Internal platform AMM · Polygon Mainnet · Prices update in real time
          </p>
        </div>

        <!-- Redeem STC for subscription -->
        <div class="mt-4 rounded-2xl border border-[#FFBF00]/20 bg-[#FFBF00]/5 backdrop-blur-md p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="font-semibold mb-1 flex items-center gap-2">
                <Coins class="h-4 w-4 text-[#FFBF00]" />
                Redeem {stcRedeemAmount} STC → 1 Free Month
              </p>
              <p class="text-sm text-white/55 leading-relaxed">
                Spend {stcRedeemAmount} STC for one month Basic access. Cooldown: 100 days after 1st use, 200 days after 2nd, alternating. STC returns to platform pool.
              </p>
              {#if $isConnected && cooldownStatus !== null}
                <p class="text-xs mt-2 {cooldownStatus.secondsRemaining === 0 ? 'text-green-400' : 'text-amber-400'}">
                  {cooldownStatus.secondsRemaining === 0
                    ? 'Ready to redeem'
                    : formatCooldown(cooldownStatus.secondsRemaining) + ` · Next cooldown: ${cooldownStatus.nextCooldownDays} days`}
                </p>
              {/if}
            </div>
            {#if !$isConnected}
              <Button onclick={() => connectWallet('injected')} variant="outline" class="shrink-0 border-[#FFBF00]/40 text-[#FFBF00] hover:bg-[#FFBF00]/10">
                Connect
              </Button>
            {:else}
              <Button
                onclick={handleRedeem}
                disabled={isRedeeming || (cooldownStatus !== null && cooldownStatus.secondsRemaining > 0)}
                class="shrink-0 bg-[#FFBF00] text-black hover:bg-[#FFBF00]/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {#if isRedeeming}
                  <Loader2 class="mr-1 h-4 w-4 animate-spin" /> Redeeming...
                {:else}
                  Redeem
                {/if}
              </Button>
            {/if}
          </div>
        </div>
      </div>

      <!-- Sidebar (2/5) -->
      <div class="lg:col-span-2 space-y-4">

        <!-- Wallet card -->
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <h3 class="font-semibold mb-4 flex items-center gap-2 text-sm text-white/70 uppercase tracking-wider">
            <Wallet class="h-4 w-4" /> Your Wallet
          </h3>
          {#if !$isConnected}
            <div class="text-center py-4">
              <p class="text-sm text-white/40 mb-3">Connect your wallet to see balances</p>
              <Button onclick={() => connectWallet('injected')} class="bg-[#FF5E0E] hover:bg-[#FF5E0E]/90 text-white w-full">
                Connect Wallet
              </Button>
              <button onclick={() => connectWallet('walletConnect')} class="mt-2 w-full text-xs text-white/40 hover:text-white/60 transition-colors">
                Use WalletConnect (mobile)
              </button>
            </div>
          {:else}
            <div class="space-y-3">
              <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div class="flex items-center gap-2">
                  <Coins class="h-5 w-5 text-[#FFBF00]" />
                  <div>
                    <p class="text-xs text-white/40">STC Balance</p>
                    <p class="font-bold">{isLoadingBalances ? '...' : stcBalance}</p>
                  </div>
                </div>
                <p class="text-xs text-white/30">Studio Token</p>
              </div>
              <div class="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div class="flex items-center gap-2">
                  <span class="h-5 w-5 flex items-center justify-center text-[#3cba54] font-bold text-lg">$</span>
                  <div>
                    <p class="text-xs text-white/40">USDC Balance</p>
                    <p class="font-bold">{isLoadingBalances ? '...' : usdcBalance}</p>
                  </div>
                </div>
                <p class="text-xs text-white/30">USD Coin</p>
              </div>
              <button
                onclick={() => $walletAddress && loadBalances($walletAddress)}
                class="w-full text-xs text-white/30 hover:text-white/60 flex items-center justify-center gap-1 transition-colors py-1"
              >
                <RefreshCw class="h-3 w-3" /> Refresh balances
              </button>
            </div>
          {/if}
        </div>

        <!-- How to earn STC -->
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <h3 class="font-semibold mb-3 text-sm text-white/70 uppercase tracking-wider">How to Earn STC</h3>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FF5E0E]/15 flex items-center justify-center shrink-0">
                <Zap class="h-4 w-4 text-[#FF5E0E]" />
              </div>
              <div>
                <p class="font-medium">Watch content</p>
                <p class="text-white/45 text-xs">1 STC per hour · Max 5 STC/day</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FFBF00]/15 flex items-center justify-center shrink-0">
                <ArrowRight class="h-4 w-4 text-[#FFBF00]" />
              </div>
              <div>
                <p class="font-medium">Refer a friend</p>
                <p class="text-white/45 text-xs">10 STC when they subscribe</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="mt-0.5 w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                <Coins class="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p class="font-medium">Buy with USDC</p>
                <p class="text-white/45 text-xs">Use the swap above</p>
              </div>
            </div>
          </div>
        </div>

        <!-- What to do with STC -->
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
          <h3 class="font-semibold mb-3 text-sm text-white/70 uppercase tracking-wider">STC Utility</h3>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-3">
              <div class="mt-0.5 w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">
                <CheckCircle2 class="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p class="font-medium">Free subscription</p>
                <p class="text-white/45 text-xs">{stcRedeemAmount} STC = 1 month Basic</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="mt-0.5 w-7 h-7 rounded-lg bg-[#FFBF00]/15 flex items-center justify-center shrink-0">
                <Lock class="h-4 w-4 text-[#FFBF00]" />
              </div>
              <div>
                <p class="font-medium">Stake for discount</p>
                <p class="text-white/45 text-xs">1,000–35,000 STC → 10–50% off</p>
              </div>
            </div>
            <Button href="/plans" variant="outline" class="w-full mt-1 border-white/15 text-white/60 hover:bg-white/5 text-xs h-8">
              View Plans & Staking <ExternalLink class="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <!-- Top Up Stake — visible when user has active stake + unstaked STC -->
        {#if $isConnected && stakingInfo && parseFloat(stakingInfo.amount) > 0 && !stakingInfo.isUnlocked}
          <div class="rounded-2xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-xl p-5">
            <h3 class="font-semibold mb-1 text-sm text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Lock class="h-4 w-4" /> Top Up Stake
            </h3>
            <p class="text-xs text-white/45 mb-3">
              Add more STC to your existing stake to upgrade your discount tier without waiting for lock expiry.
            </p>
            <div class="mb-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60 space-y-1">
              <div class="flex justify-between"><span>Staked</span><span class="text-white/80 font-medium">{parseFloat(stakingInfo.amount).toLocaleString(undefined, {maximumFractionDigits: 0})} STC</span></div>
              <div class="flex justify-between"><span>Tier</span><span class="text-purple-300 font-medium">Tier {stakingInfo.discountTier} ({stakingInfo.discountTier === 1 ? 10 : stakingInfo.discountTier === 2 ? 20 : stakingInfo.discountTier === 3 ? 35 : stakingInfo.discountTier === 4 ? 50 : 0}% off)</span></div>
              <div class="flex justify-between"><span>Unstaked balance</span><span class="text-white/80 font-medium">{stcBalance} STC</span></div>
            </div>
            <input
              type="number"
              placeholder="Amount to add"
              bind:value={topUpAmount}
              min="0"
              class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none mb-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            {#if topUpError}
              <div class="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 mb-2">
                <AlertCircle class="h-3.5 w-3.5 shrink-0" /> {topUpError}
              </div>
            {/if}
            {#if topUpSuccess}
              <div class="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-xs text-green-400 mb-2">
                <CheckCircle2 class="h-3.5 w-3.5 shrink-0" /> {topUpSuccess}
              </div>
            {/if}
            {#if !topUpAmount || Number(topUpAmount) <= 0}
              <button disabled class="w-full rounded-lg bg-purple-500/20 text-purple-300/40 text-sm font-medium py-2 cursor-not-allowed">Enter amount</button>
            {:else if topUpNeedsApproval}
              <button
                onclick={handleTopUpApprove}
                disabled={isTopUpApproving}
                class="w-full rounded-lg bg-amber-500 hover:bg-amber-500/90 text-black text-sm font-semibold py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {#if isTopUpApproving}<Loader2 class="h-4 w-4 animate-spin" /> Approving...{:else}Step 1: Approve STC{/if}
              </button>
            {:else}
              <button
                onclick={handleTopUpStake}
                disabled={isTopUpStaking}
                class="w-full rounded-lg bg-purple-500 hover:bg-purple-500/90 text-white text-sm font-semibold py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {#if isTopUpStaking}<Loader2 class="h-4 w-4 animate-spin" /> Adding to stake...{:else}Step 2: Top Up Stake{/if}
              </button>
            {/if}
          </div>
        {/if}

      </div>
    </div>

  </div>
</div>
