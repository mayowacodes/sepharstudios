<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	// Preload Web3 modules when entering Web3 routes
	onMount(() => {
		import('$lib/web3/wallet').catch(err => {
			console.warn('Failed to preload Web3 modules:', err);
		});
	});
</script>

<!-- Web3 Routes Layout -->
<div class="web3-layout min-h-screen">
	<div class="container mx-auto px-4 py-8">
		{@render children()}
	</div>
</div>

<style>
	.web3-layout {
		/* Add any Web3-specific styling */
		background: linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted) / 0.1));
	}
</style>