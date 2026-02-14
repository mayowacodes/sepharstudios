<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { Check, X, AlertCircle } from '@lucide/svelte';
  
  export let type: 'success' | 'error' = 'success';
  export let message: string;
  export let duration = 5000;
  
  let visible = true;
  
  if (duration > 0) {
    setTimeout(() => {
      visible = false;
    }, duration);
  }
</script>

{#if visible}
  <div
    class="fixed top-4 right-4 z-50"
    transition:fly={{ y: -20, duration: 200 }}
  >
    <div
      class="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg"
      class:bg-green-500={type === 'success'}
      class:bg-red-500={type === 'error'}
    >
      {#if type === 'success'}
        <Check class="w-5 h-5 text-white" />
      {:else}
        <AlertCircle class="w-5 h-5 text-white" />
      {/if}
      
      <p class="text-white">{message}</p>
      
      <button
        class="ml-2 text-white hover:text-white/80"
        on:click={() => visible = false}
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
{/if}