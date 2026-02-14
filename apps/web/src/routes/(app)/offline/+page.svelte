<script lang="ts">
  import { Wifi, WifiOff, RefreshCcw } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { Button } from "$lib/components/ui/button";

  let isOnline = true;

  const updateStatus = () => isOnline = navigator.onLine;
 
  onMount(() => {
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  });

  function refresh() {
    window.location.reload();
  }
</script>

<div class="min-h-screen bg-background flex items-center justify-center p-4">
  <div class="max-w-md w-full text-center space-y-6">
    <div class="flex justify-center">
      {#if isOnline}
        <Wifi class="w-20 h-20 text-primary" />
      {:else}
        <WifiOff class="w-20 h-20 text-destructive" />
      {/if}
    </div>

    <h1 class="text-4xl font-bold">
      {#if isOnline}
        Back Online
      {:else}
        No Internet Connection
      {/if}
    </h1>

    <p class="text-lg text-muted-foreground">
      {#if isOnline}
        Your connection has been restored. You can continue watching.
      {:else}
        Please check your internet connection and try again.
      {/if}
    </p>

    <div class="flex justify-center">
      <Button onclick={refresh} size="lg" class="gap-2">
        <RefreshCcw class="w-5 h-5" />
        Refresh Page
      </Button>
    </div>
  </div>
</div>