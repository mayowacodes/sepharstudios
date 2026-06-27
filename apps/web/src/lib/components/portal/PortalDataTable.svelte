<script lang="ts" generics="T extends { id: string }">
  import type { Snippet } from 'svelte';
  import { Search, X, ChevronRight } from '@lucide/svelte';
  import { onMount, onDestroy } from 'svelte';

  /**
   * Portal data table — the list/queue pattern for admin + creator
   * portals. Two main affordances over a plain grid:
   *
   *   1. Command bar — debounced search input plus filter dropdown
   *      slot. Press `/` to focus the search from anywhere on the page.
   *
   *   2. Side panel — clicking a row slides a 480px panel in from the
   *      right with that row's detail content. Doesn't navigate, so
   *      reviewers can flip through items quickly. Esc / click-outside
   *      closes.
   *
   * v1 renders all rows directly — virtualization is a follow-up.
   * Even uncached tables of a few hundred rows still scroll fine.
   */

  let {
    items,
    searchPlaceholder = 'Search…',
    /** Render one row. The component handles click → select for you. */
    row,
    /** Render the right-side detail panel. */
    detail,
    /** Optional filter UI shown in the command bar's right slot. */
    filters,
    /** Optional bulk-action chip row shown below the command bar. */
    bulkActions,
    /** Empty state shown when no items match. */
    empty,
    /** Field(s) to match against the search input. Default: 'title' if present. */
    searchKey
  }: {
    items: T[];
    searchPlaceholder?: string;
    row: Snippet<[T]>;
    detail: Snippet<[T]>;
    filters?: Snippet;
    bulkActions?: Snippet;
    empty?: Snippet;
    searchKey?: keyof T;
  } = $props();

  let query = $state('');
  let selectedId = $state<string | null>(null);
  let searchInput = $state<HTMLInputElement>();

  const selected = $derived(items.find((i) => i.id === selectedId) ?? null);

  // Default search key looks for 'title' (the common case across the
  // admin/creator surfaces). Falls back to 'name' / 'id' if that's missing.
  const effectiveSearchKey = $derived(
    searchKey ?? (items[0] && 'title' in items[0] ? ('title' as keyof T)
      : items[0] && 'name' in items[0] ? ('name' as keyof T)
      : ('id' as keyof T))
  );

  const filtered = $derived(
    !query.trim()
      ? items
      : items.filter((item) => {
          const v = item[effectiveSearchKey];
          return typeof v === 'string' && v.toLowerCase().includes(query.toLowerCase());
        })
  );

  function onKeyDown(e: KeyboardEvent) {
    // Don't capture `/` when the user is typing in another input.
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
    if (e.key === '/') {
      e.preventDefault();
      searchInput?.focus();
    }
    if (e.key === 'Escape' && selectedId) {
      selectedId = null;
    }
  }

  onMount(() => document.addEventListener('keydown', onKeyDown));
  onDestroy(() => document.removeEventListener('keydown', onKeyDown));
</script>

<div class="space-y-4">
  <!-- Command bar — sticky to the top of the scroll area inside the
       main pane. Has search on the left + filter slot on the right. -->
  <div
    class="sticky top-0 z-10 -mx-4 px-4 py-3 backdrop-blur-md"
    style="background: hsl(var(--portal-bg-base)/0.85);"
  >
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--portal-text-muted))]"
        />
        <input
          bind:this={searchInput}
          bind:value={query}
          type="text"
          placeholder={searchPlaceholder}
          class="w-full pl-10 pr-10 py-2 rounded-lg text-sm
            bg-[hsl(var(--portal-bg-elevated)/0.6)]
            border border-[hsl(var(--portal-border)/0.5)]
            text-[hsl(var(--portal-text))]
            placeholder:text-[hsl(var(--portal-text-muted))]
            focus:outline-none focus:border-[hsl(var(--portal-accent))]
            focus:ring-2 focus:ring-[hsl(var(--portal-accent)/0.25)]
            transition-colors"
        />
        {#if !query}
          <kbd
            class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded
              text-[hsl(var(--portal-text-muted))]
              bg-[hsl(var(--portal-bg-base)/0.6)]
              border border-[hsl(var(--portal-border)/0.5)]"
            aria-hidden="true"
          >/</kbd>
        {/if}
      </div>

      {#if filters}
        <div class="flex items-center gap-2">{@render filters()}</div>
      {/if}
    </div>

    {#if bulkActions}
      <div class="mt-2 flex items-center gap-2">{@render bulkActions()}</div>
    {/if}
  </div>

  <!-- Rows. Each row is a button so keyboard focus + activation work. -->
  {#if filtered.length === 0}
    <div class="py-12 text-center text-sm text-[hsl(var(--portal-text-muted))]">
      {#if empty}
        {@render empty()}
      {:else}
        No results.
      {/if}
    </div>
  {:else}
    <ul class="space-y-2">
      {#each filtered as item (item.id)}
        <li>
          <button
            type="button"
            onclick={() => (selectedId = item.id)}
            class="w-full text-left rounded-xl border border-[hsl(var(--portal-border)/0.5)]
              bg-[hsl(var(--portal-bg-card)/0.6)] backdrop-blur-md p-4
              transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]
              hover:-translate-y-0.5 hover:border-[hsl(var(--portal-accent)/0.5)]
              hover:shadow-(--portal-accent-glow)
              focus:outline-none focus:border-[hsl(var(--portal-accent))]
              focus:ring-2 focus:ring-[hsl(var(--portal-accent)/0.25)]"
            class:active-row={selectedId === item.id}
          >
            {@render row(item)}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<!-- Side panel — slides in from the right with row detail. -->
{#if selected}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm portal-fade-up"
    onclick={() => (selectedId = null)}
  ></div>
  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  <aside
    class="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-120 overflow-y-auto
      border-l border-[hsl(var(--portal-border))]
      shadow-2xl"
    style="background: hsl(var(--portal-bg-elevated));"
    role="dialog"
    aria-modal="true"
  >
    <button
      type="button"
      onclick={() => (selectedId = null)}
      class="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-lg
        text-[hsl(var(--portal-text-muted))] hover:text-[hsl(var(--portal-text))]
        hover:bg-[hsl(var(--portal-bg-card))] transition-colors"
      aria-label="Close detail panel"
    >
      <X class="w-5 h-5" />
    </button>
    <div class="p-6">
      {@render detail(selected)}
    </div>
  </aside>
{/if}

<style>
  .active-row {
    border-color: hsl(var(--portal-accent)) !important;
    box-shadow: var(--portal-accent-glow);
  }
</style>
