<script lang="ts">
  import { createPopperActions } from 'svelte-popperjs';
  import { onClickOutside } from '$lib/utils/onClickOutside';
  import { onMount } from 'svelte';

  export let label = 'Menu';
  export const items: string[] = []; // or just export let items if it's to be used inside

  let isOpen = false;
  let button: HTMLButtonElement;
  let menu: HTMLDivElement;
  let popper = createPopperActions({ placement: 'bottom-start' });

  const toggleMenu = () => (isOpen = !isOpen);
  const closeMenu = () => (isOpen = false);

  onMount(() => {
    // This ensures the menu is initialized before being used
    if (menu) {
      onClickOutside(() => closeMenu(), menu);
    }
  });
</script>

<div class="relative inline-block text-left" use:popper[0]>
  <button
    bind:this={button}
    class="text-sm font-medium focus:outline-none"
    aria-haspopup="true"
    aria-expanded={isOpen}
    on:click={toggleMenu}>
    {label}
  </button>

  {#if isOpen}
    <div
      bind:this={menu}
      class="z-50 mt-2 w-48 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in"
      use:popper[1]
      role="menu"
      aria-orientation="vertical">
      <slot />
    </div>
  {/if}
</div>

<style>
  .animate-in {
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
