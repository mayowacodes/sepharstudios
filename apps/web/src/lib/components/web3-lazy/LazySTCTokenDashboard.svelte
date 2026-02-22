<script lang="ts">
	import { onMount } from 'svelte';
	import SpinLoader from '$lib/components/ui/spin-loader/spin-loader.svelte';
	import type { Component } from 'svelte';

	let STCTokenDashboardComponent = $state<Component | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const module = await import('$lib/components/web3/STCTokenDashboard.svelte');
			STCTokenDashboardComponent = module.default;
		} catch (err) {
			console.error('Failed to load STC Token Dashboard:', err);
			error = 'Failed to load token dashboard. Please refresh the page.';
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="flex items-center justify-center p-8">
		<SpinLoader class="size-8" />
		<p class="ml-3 text-muted-foreground">Loading token dashboard...</p>
	</div>
{:else if error}
	<div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
		<p class="text-sm text-destructive">{error}</p>
	</div>
{:else if STCTokenDashboardComponent}
	<STCTokenDashboardComponent />
{/if}
