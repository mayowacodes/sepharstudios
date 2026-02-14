<script lang="ts">
  import type { Snippet } from 'svelte';

  let { title, isLoading, children } = $props<{
    title: string;
    isLoading: boolean;
    children: Snippet;
  }>();
</script>

<div>
  <h3 class="text-md font-medium mb-2 text-muted-foreground">{title}</h3>
  <div class="rounded-lg border p-4 bg-muted/30">
    {#if isLoading}
      <div class="h-[100px] w-full rounded-md bg-muted/20 animate-pulse"></div>
    {:else}
      {@render children()}
    {/if}
  </div>
</div>
