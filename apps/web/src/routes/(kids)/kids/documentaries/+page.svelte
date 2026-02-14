<!-- src/routes/kids/kiddies/documentaries/+page.svelte -->
<script lang="ts">
    import KidsMediaPage from '$lib/components/kids/KidsMediaPage.svelte';
    import { kidsDocumentaries } from '$lib/data/kidsdocumentaries';
  </script>
  
  <KidsMediaPage title="🧠 Kiddie Documentaries" mediaData={kidsDocumentaries} />