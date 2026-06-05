<script lang="ts">
  import { page } from '$app/state';
  import { openMediaById } from '$lib/utils/openMediaById';
  import { resolveDataset } from '$lib/utils/mediaDatasetResolver';

  let id = $derived(page.params.id);
  let dataset = $derived(resolveDataset('kiddies', 'documentaries'));

  $effect(() => {
    if (id) openMediaById(id, dataset);
  });
</script>
