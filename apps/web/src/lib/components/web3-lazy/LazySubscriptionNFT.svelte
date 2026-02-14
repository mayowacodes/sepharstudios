<script lang="ts">
	import { onMount } from 'svelte';
	import { Spinner } from '$lib/components/ui/spin-loader';

	let SubscriptionNFTComponent: any = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			// Dynamically import Web3 package
			const module = await import('@sephar/web3/components');
			SubscriptionNFTComponent = module.SubscriptionNFT;
		} catch (err) {
			console.error('Failed to load Subscription NFT:', err);
			error = 'Failed to load subscription system. Please refresh the page.';
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="flex items-center justify-center p-8">
		<Spinner />
		<p class="ml-3 text-muted-foreground">Loading subscription options...</p>
	</div>
{:else if error}
	<div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
		<p class="text-sm text-destructive">{error}</p>
	</div>
{:else if SubscriptionNFTComponent}
	<svelte:component this={SubscriptionNFTComponent} />
{/if}