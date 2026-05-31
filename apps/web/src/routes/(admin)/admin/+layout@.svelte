<!-- Admin Section Layout -->
<script lang="ts">
	import '../../../app.css';
	import AdminNav from '$lib/components/admin/AdminNav.svelte';
	import CommandPalette from '$lib/components/dashboard/CommandPalette.svelte';
	import CopilotPanel from '$lib/components/dashboard/CopilotPanel.svelte';
	import { Sparkles } from '@lucide/svelte';

	let { children } = $props();

	let paletteOpen = $state(false);
	let copilotOpen = $state(false);
	function onKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			paletteOpen = !paletteOpen;
		}
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
			e.preventDefault();
			copilotOpen = !copilotOpen;
		}
	}
</script>

<svelte:head>
	<title>Admin - Sephar Studios</title>
</svelte:head>

<svelte:window on:keydown={onKeydown} />
<CommandPalette bind:open={paletteOpen} variant="admin" />
<CopilotPanel bind:open={copilotOpen} variant="admin" />

<button
	type="button"
	onclick={() => (copilotOpen = !copilotOpen)}
	class="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 {copilotOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}"
	aria-label="Open Copilot (⌘J)"
	title="Open Copilot (⌘J)"
>
	<Sparkles class="w-5 h-5" />
</button>

<div class="admin-section min-h-screen bg-linear-to-b from-gray-900 to-black text-white">
	<a
		href="#admin-main"
		class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded"
	>Skip to content</a>
	<AdminNav />
	<main id="admin-main" class="pt-20">
		{@render children()}
	</main>
</div>