<script lang="ts">
	import { LazySubscriptionNFT } from '$lib/components/web3-lazy';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Premium Subscription - Sephar Studios</title>
	<meta name="description" content="Subscribe to Sephar Studios with NFT subscriptions" />
</svelte:head>

<div class="subscription-page">
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
		<h1 class="text-3xl font-bold tracking-tight">Premium Subscription</h1>
		<p class="mt-2 text-muted-foreground">
			Get premium access to all content with our NFT subscription system
		</p>
	</div>

	<!-- Subscription NFT Component (Lazy Loaded) -->
	<LazySubscriptionNFT />
</div>