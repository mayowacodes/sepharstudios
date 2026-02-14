<!-- src/routes/kids/teens/shows/+page.svelte -->
<script lang="ts">
    import KidsMediaPage from '$lib/components/kids/KidsMediaPage.svelte';
    import { teenagersShows } from '$lib/data/teenagersShows';
  </script>
  
  <KidsMediaPage title="📺 Teen Shows" mediaData={teenagersShows} />