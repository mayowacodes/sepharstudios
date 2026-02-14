<script lang="ts">
  export let title: string;
  export let isLoading: boolean;
</script>

<div>
  <h3 class="text-md font-medium mb-2 text-muted-foreground">{title}</h3>
  <div class="rounded-lg border p-4 bg-muted/30">
    {#if isLoading}
      <div class="h-[100px] w-full rounded-md bg-muted/20 animate-pulse"></div>
    {:else}
      <slot />
    {/if}
  </div>
</div>
