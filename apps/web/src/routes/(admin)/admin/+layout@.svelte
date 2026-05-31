<!-- Admin Section Layout — wraps every /admin route in the unified
     PortalShell. Replaces the old AdminNav top bar with a collapsible
     left sidebar + AI Copilot rail + command-first ⌘K palette. -->
<script lang="ts">
  import '../../../app.css';
  import PortalShell from '$lib/components/shell/PortalShell.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>Admin - Sephar Studios</title>
</svelte:head>

<PortalShell portal="admin">
  {@render children()}
</PortalShell>
