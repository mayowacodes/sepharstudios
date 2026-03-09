<script lang="ts">
  import { Search, X } from '@lucide/svelte';

  // Props
  export let placeholder: string = 'Search...';
  export let value: string = '';

  // Create an event handler for search
  const createSearchEvent = (term: string) => {
    return new CustomEvent('search', { detail: term });
  };

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  // Debounced search function
  const updateSearch = (term: string) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      window.dispatchEvent(createSearchEvent(term));
    }, 300);
  };

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    updateSearch(value);
  }

  function clearSearch() {
    value = '';
    window.dispatchEvent(createSearchEvent(''));
  }
</script>

<div class="relative w-full max-w-md">
  <input
    type="text"
    bind:value
    class="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 pr-10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
    placeholder={placeholder}
    oninput={handleInput}
  />
  <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
    {#if value}
      <button
        type="button"
        class="text-white/60 hover:text-white"
        onclick={clearSearch}
      >
        <X class="h-4 w-4" />
      </button>
    {/if}
    <Search class="h-4 w-4 text-white/60" />
  </div>
</div>
