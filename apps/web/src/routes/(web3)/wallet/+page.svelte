<script lang="ts">
	import { LazyWalletConnect } from '$lib/components/web3-lazy';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Wallet Connection - Sephar Studios</title>
	<meta name="description" content="Connect your wallet to access Web3 features on Sephar Studios" />
</svelte:head>

<div class="wallet-page">
	<!-- Back Navigation -->
	<div class="mb-6">
		<a
			href="/dashboard"
			class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
		>
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Dashboard
		</a>
	</div>

	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold tracking-tight">Connect Your Wallet</h1>
		<p class="mt-2 text-muted-foreground">
			Access Web3 features including STC tokens, NFT subscriptions, and creator payments
		</p>
	</div>

	<!-- Wallet Connection Component (Lazy Loaded) -->
	<LazyWalletConnect />
</div>