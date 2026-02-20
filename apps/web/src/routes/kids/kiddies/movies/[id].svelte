<script lang="ts">
  import { page } from '$app/state';
  import { kidsMovies } from '$lib/data/kidsmovies';
  import { openMediaById } from '$lib/utils/openMediaById';

  const id = page.params.id;
  openMediaById(id, kidsMovies);
</script>
