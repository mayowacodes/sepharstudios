<script lang="ts">
	import { onMount } from 'svelte';
	import SpinLoader from '$lib/components/ui/spin-loader/spin-loader.svelte';
	import type { Component } from 'svelte';

	let WalletConnectComponent = $state<Component | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const module = await import('$lib/components/web3/WalletConnect.svelte');
			WalletConnectComponent = module.default;
		} catch (err) {
			console.error('Failed to load Web3 components:', err);
			error = 'Failed to load wallet connection. Please refresh the page.';
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="flex items-center justify-center p-8">
		<SpinLoader class="size-8" />
		<p class="ml-3 text-muted-foreground">Loading wallet connection...</p>
	</div>
{:else if error}
	<div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
		<p class="text-sm text-destructive">{error}</p>
	</div>
{:else if WalletConnectComponent}
	<WalletConnectComponent />
{/if}
