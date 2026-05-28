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
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary"
>
	Skip to main content
</a>

<div class="web3-layout min-h-screen">
	<main id="main-content" tabindex="-1" class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>

<style>
	.web3-layout {
		/* Add any Web3-specific styling */
		background: linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted) / 0.1));
	}
</style>