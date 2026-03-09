<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    // Redirect to the unified watch page which uses real DB + VideoPlayer
    goto(`/watch/${page.params.id}`, { replaceState: true });
  });
</script>
