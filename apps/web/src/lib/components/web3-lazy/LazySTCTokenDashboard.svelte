<script lang="ts">
	import { onMount } from 'svelte';
	import { Spinner } from '$lib/components/ui/spin-loader';

	let STCTokenDashboardComponent: any = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			// Dynamically import Web3 package
			const module = await import('@sephar/web3/components');
			STCTokenDashboardComponent = module.STCTokenDashboard;
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
		<Spinner />
		<p class="ml-3 text-muted-foreground">Loading token dashboard...</p>
	</div>
{:else if error}
	<div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
		<p class="text-sm text-destructive">{error}</p>
	</div>
{:else if STCTokenDashboardComponent}
	<svelte:component this={STCTokenDashboardComponent} />
{/if}