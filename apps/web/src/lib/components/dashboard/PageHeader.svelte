<script lang="ts">
  import type { Component, Snippet } from 'svelte';

  interface Props {
    icon?: Component;
    title: string;
    subtitle?: string;
    actions?: Snippet;
  }

  let { icon: Icon, title, subtitle, actions }: Props = $props();
</script>

<header class="flex items-start justify-between gap-4 flex-wrap mb-6">
  <div class="flex items-start gap-3">
    {#if Icon}
      <div class="surface-2 rounded-xl p-2.5 mt-0.5">
        <Icon class="w-5 h-5 text-purple-300" />
      </div>
    {/if}
    <div>
      <h1 class="text-2xl font-semibold text-white tracking-tight">{title}</h1>
      {#if subtitle}
        <p class="text-sm text-gray-400 mt-1">{subtitle}</p>
      {/if}
    </div>
  </div>
  {#if actions}
    <div class="flex items-center gap-2">
      {@render actions()}
    </div>
  {/if}
</header>
