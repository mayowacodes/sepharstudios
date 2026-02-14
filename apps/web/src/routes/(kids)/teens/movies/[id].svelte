<script lang="ts">
  import { page } from '$app/state';
  import { openMediaById } from '$lib/utils/openMediaById';
  import { resolveDataset } from '$lib/utils/mediaDatasetResolver';

  $: id = page.params.id;
  $: dataset = resolveDataset('teens', 'movies');
  $: openMediaById(id, dataset);
</script>
