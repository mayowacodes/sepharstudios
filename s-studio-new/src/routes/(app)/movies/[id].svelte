<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { resolveAdultDataset } from '$lib/utils/resolveAdultDataset';
  import { openMediaById } from '$lib/utils/openMediaById';

  $: id = page.params.id;

  onMount(() => {
    const dataset = resolveAdultDataset('movies'); // <- This should return your movie dataset
    openMediaById(id, dataset);
  });
</script>
