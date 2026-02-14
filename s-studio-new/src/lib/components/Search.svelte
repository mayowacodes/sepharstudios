<script lang="ts">
  import { debounce } from 'lodash-es';
  import { Search, X } from 'lucide-svelte';

  // Props
  export let placeholder: string = 'Search...';
  export let value: string = '';

  // Create an event handler for search
  const search = new EventTarget();

  // Debounced search function
  const updateSearch = debounce((term: string) => {
    search.dispatchEvent(new CustomEvent('search', { detail: term }));
  }, 300);

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    updateSearch(value);
  }

  function clearSearch() {
    value = '';
    search.dispatchEvent(new CustomEvent('search', { detail: '' }));
  }
</script>

<div class="relative w-full max-w-md">
  <input
    type="text"
    bind:value
    class="w-full rounded-lg border bg-background px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    placeholder={placeholder}
    on:input={handleInput}
  />
  <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
    {#if value}
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground"
        on:click={clearSearch}
      >
        <X class="h-4 w-4" />
      </button>
    {/if}
    <Search class="h-4 w-4 text-muted-foreground" />
  </div>
</div>
