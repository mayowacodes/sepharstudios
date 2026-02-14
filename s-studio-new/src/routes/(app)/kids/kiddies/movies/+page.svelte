<!-- src/routes/kids/teens/movies/+page.svelte -->
<script lang="ts">
    import KidsMediaPage from '$lib/components/kids/KidsMediaPage.svelte';
    import { kidsMovies } from '$lib/data/kidsmovies';
  </script>
  
  <KidsMediaPage title="🎬 Teen Movies" mediaData={kidsMovies} />

  