<!-- src/routes/kids/kiddies/shows/+page.svelte -->
<script lang="ts">
    import KidsMediaPage from '$lib/components/kids/KidsMediaPage.svelte';
    import { kidsShows } from '$lib/data/kidsshows';
  </script>
  
  <KidsMediaPage title="🐣 Kiddie Shows" mediaData={kidsShows} />