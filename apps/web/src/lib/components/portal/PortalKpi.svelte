<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Component } from 'svelte';
  import { ArrowDown, ArrowUp } from '@lucide/svelte';
  import { animateCount } from '$lib/motion';
  import PortalCard from './PortalCard.svelte';

  /**
   * Portal KPI tile. Animates a count-up on mount, hides the sparkline
   * until hover so the card breathes at rest, and pulses a positive
   * delta pill once on arrival. Replaces the older KpiCard.svelte
   * inside the portal scope.
   *
   * Numbers are reset + re-animated whenever `value` changes (e.g. when
   * the parent re-fetches stats), so this stays responsive to live
   * data without the parent needing to remount the card.
   */
  let {
    label,
    value,
    href,
    icon,
    delta,
    deltaLabel,
    sparkline,
    formatValue
  }: {
    label: string;
    /** Either a number (animated) or any string (rendered as-is). */
    value: number | string;
    href?: string;
    icon?: Component;
    /** Percent change vs the prior period. Drives the colored delta pill. */
    delta?: number;
    deltaLabel?: string;
    /** Optional micro-trend data. Renders as a faint line that brightens on hover. */
    sparkline?: number[];
    /** Format the animated number — default is .toLocaleString(). */
    formatValue?: (v: number) => string;
  } = $props();

  // Animated display value. For numeric `value` we tween from 0 → target;
  // for strings we pass through unchanged.
  let displayed = $state<number>(0);
  let cancel: (() => void) | null = null;

  $effect(() => {
    if (typeof value !== 'number') return;
    cancel?.();
    cancel = animateCount(value, (v) => (displayed = v));
    return () => cancel?.();
  });

  onDestroy(() => cancel?.());

  const formattedNumber = $derived(
    typeof value === 'number' ? (formatValue ? formatValue(displayed) : displayed.toLocaleString()) : value
  );

  const deltaTone = $derived(
    typeof delta === 'number' && delta > 0
      ? 'pos'
      : typeof delta === 'number' && delta < 0
      ? 'neg'
      : 'neutral'
  );

  const sparkPath = $derived.by(() => {
    if (!sparkline?.length) return '';
    const w = 100;
    const h = 28;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const span = max - min || 1;
    return sparkline
      .map((v, i) => {
        const x = (i / Math.max(1, sparkline.length - 1)) * w;
        const y = h - ((v - min) / span) * h;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  const Icon = $derived(icon);
  let mounted = $state(false);
  onMount(() => {
    requestAnimationFrame(() => (mounted = true));
  });
</script>

{#snippet body()}
  <PortalCard accent interactive={!!href} class="group portal-fade-up">
    <div class="flex items-start justify-between gap-3 mb-3">
      <span class="text-[10px] uppercase tracking-[0.18em] font-semibold text-[hsl(var(--portal-text-muted))]">
        {label}
      </span>
      {#if Icon}
        <span class="text-[hsl(var(--portal-accent))] opacity-70 group-hover:opacity-100 transition-opacity">
          <Icon class="h-4 w-4" />
        </span>
      {/if}
    </div>

    <div class="text-3xl md:text-4xl font-bold text-[hsl(var(--portal-text))] tracking-tight tabular-nums">
      {formattedNumber}
    </div>

    {#if typeof delta === 'number' || deltaLabel}
      <div class="mt-2 flex items-center gap-1.5 text-[11px]">
        {#if typeof delta === 'number'}
          <span
            class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-semibold"
            class:bg-emerald-500-15={deltaTone === 'pos'}
            style:background={deltaTone === 'pos'
              ? 'hsl(var(--portal-success)/0.18)'
              : deltaTone === 'neg'
              ? 'hsl(var(--portal-danger)/0.18)'
              : 'hsl(var(--portal-text-muted)/0.12)'}
            style:color={deltaTone === 'pos'
              ? 'hsl(var(--portal-success))'
              : deltaTone === 'neg'
              ? 'hsl(var(--portal-danger))'
              : 'hsl(var(--portal-text-muted))'}
          >
            {#if deltaTone === 'pos'}
              <ArrowUp class="w-2.5 h-2.5" />
            {:else if deltaTone === 'neg'}
              <ArrowDown class="w-2.5 h-2.5" />
            {/if}
            {Math.abs(delta).toFixed(1)}%
          </span>
        {/if}
        {#if deltaLabel}
          <span class="text-[hsl(var(--portal-text-muted))]">{deltaLabel}</span>
        {/if}
      </div>
    {/if}

    {#if sparkPath && mounted}
      <!-- Sparkline — opacity transitions in on hover so the card stays
           visually quiet until the user engages with it. -->
      <svg
        viewBox="0 0 100 28"
        preserveAspectRatio="none"
        class="mt-3 w-full h-7 opacity-30 group-hover:opacity-100 transition-opacity duration-300"
      >
        <path
          d={sparkPath}
          fill="none"
          stroke="hsl(var(--portal-accent))"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    {/if}
  </PortalCard>
{/snippet}

{#if href}
  <a {href} class="block focus-visible:outline-none">
    {@render body()}
  </a>
{:else}
  {@render body()}
{/if}
