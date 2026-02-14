<!-- src/components/LazyMovieModal.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { mediaModalStore } from '$lib/stores/mediaModalStore';

  let MovieModal: typeof import('../MovieModal.svelte').default | null = null;

  onMount(async () => {
    const module = await import('../MovieModal.svelte');
    MovieModal = module.default;
  });
</script>

{#if MovieModal}
  <svelte:component this={MovieModal} />
{/if}
