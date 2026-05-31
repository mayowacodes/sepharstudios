<script lang="ts">
  import type { Component } from 'svelte';
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { ArrowUpRight, ArrowDownRight, Minus } from '@lucide/svelte';
  import Sparkline from './Sparkline.svelte';
  import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

  type Accent = 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'orange' | 'gray';

  interface Props {
    label: string;
    value: string | number;
    icon?: Component;
    href?: string;
    delta?: number | null;     // signed percentage
    deltaLabel?: string;       // e.g. "vs 30d"
    sparkline?: number[];
    accent?: Accent;
    variant?: 'default' | 'compact';
    loading?: boolean;
    /** Used to stagger entrance — caller passes the index in its grid. */
    index?: number;
  }

  let {
    label,
    value,
    icon: Icon,
    href,
    delta = null,
    deltaLabel,
    sparkline,
    accent = 'purple',
    variant = 'default',
    loading = false,
    index = 0
  }: Props = $props();

  const ACCENT: Record<Accent, { bar: string; text: string; spark: string }> = {
    purple: { bar: 'bg-purple-500', text: 'text-purple-300', spark: 'rgb(168 85 247)' },
    blue:   { bar: 'bg-blue-500',   text: 'text-blue-300',   spark: 'rgb(59 130 246)' },
    green:  { bar: 'bg-green-500',  text: 'text-green-300',  spark: 'rgb(34 197 94)' },
    yellow: { bar: 'bg-yellow-500', text: 'text-yellow-300', spark: 'rgb(234 179 8)' },
    red:    { bar: 'bg-red-500',    text: 'text-red-300',    spark: 'rgb(239 68 68)' },
    orange: { bar: 'bg-orange-500', text: 'text-orange-300', spark: 'rgb(249 115 22)' },
    gray:   { bar: 'bg-gray-500',   text: 'text-gray-300',   spark: 'rgb(156 163 175)' }
  };

  const a = $derived(ACCENT[accent]);
  const compact = $derived(variant === 'compact');

  function deltaClass(d: number | null): string {
    if (d === null || d === undefined) return 'text-gray-400';
    if (d > 0) return 'text-green-400';
    if (d < 0) return 'text-red-400';
    return 'text-gray-400';
  }
</script>

{#snippet body()}
  <div
    class="surface-2 relative overflow-hidden rounded-xl {compact ? 'p-4' : 'p-5'} transition-colors hover:bg-white/[0.09]"
    in:fly={{ y: 12, duration: 280, delay: index * 50, easing: quintOut }}
  >
    <!-- Accent edge -->
    <span class="absolute inset-y-0 left-0 w-1 {a.bar}"></span>

    <div class="flex items-start justify-between gap-2">
      <div class="text-xs uppercase tracking-wide text-gray-400">{label}</div>
      {#if Icon}
        <Icon class="w-4 h-4 {a.text}" />
      {/if}
    </div>

    <div class="mt-2 flex items-baseline gap-2">
      {#if loading}
        <Skeleton class={compact ? 'h-6 w-20' : 'h-8 w-28'} />
      {:else}
        <div class="{compact ? 'text-xl' : 'text-2xl'} font-semibold text-white tabular-nums">
          {value}
        </div>
      {/if}
    </div>

    {#if !loading && (delta !== null && delta !== undefined || sparkline)}
      <div class="mt-3 flex items-end justify-between gap-3">
        <div class="flex items-center gap-1 text-xs {deltaClass(delta)}">
          {#if delta === null || delta === undefined}
            <span class="text-gray-500">—</span>
          {:else if delta > 0}
            <ArrowUpRight class="w-3.5 h-3.5" />
            <span class="font-medium">+{delta.toFixed(1)}%</span>
          {:else if delta < 0}
            <ArrowDownRight class="w-3.5 h-3.5" />
            <span class="font-medium">{delta.toFixed(1)}%</span>
          {:else}
            <Minus class="w-3.5 h-3.5" />
            <span class="font-medium">0%</span>
          {/if}
          {#if deltaLabel}
            <span class="text-gray-500 ml-1">{deltaLabel}</span>
          {/if}
        </div>
        {#if sparkline && sparkline.length > 0}
          <div class="w-24 h-8" style="color: {a.spark}">
            <Sparkline data={sparkline} />
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/snippet}

{#if href}
  <a href={href} class="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl">
    {@render body()}
  </a>
{:else}
  {@render body()}
{/if}
