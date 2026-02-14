<!-- src/routes/kids/teens/documentaries/+page.svelte -->
<script lang="ts">
    import KidsMediaPage from '$lib/components/kids/KidsMediaPage.svelte';
    import { teenagersDocumentaries } from '$lib/data/teenagersDocumentaries';
  </script>
  
  <KidsMediaPage title="🎓 Teen Documentaries" mediaData={teenagersDocumentaries} />