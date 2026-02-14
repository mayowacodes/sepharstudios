<!-- src/routes/kids/teens/movies/+page.svelte -->
<script lang="ts">
    import KidsMediaPage from '$lib/components/kids/KidsMediaPage.svelte';
    import { teenagersMovies } from '$lib/data/teenMovies';
  </script>
  
  <KidsMediaPage title="🎬 Teen Movies" mediaData={teenagersMovies} />