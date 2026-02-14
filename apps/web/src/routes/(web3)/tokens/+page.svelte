<script lang="ts">
	import { LazySTCTokenDashboard } from '$lib/components/web3-lazy';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<svelte:head>
	<title>STC Tokens - Sephar Studios</title>
	<meta name="description" content="Manage your STC tokens and participate in the Sephar Studios ecosystem" />
</svelte:head>

<div class="tokens-page">
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
		<h1 class="text-3xl font-bold tracking-tight">STC Token Dashboard</h1>
		<p class="mt-2 text-muted-foreground">
			Manage your StudioChain tokens, stake for discounts, and swap on the AMM
		</p>
	</div>

	<!-- Token Dashboard (Lazy Loaded) -->
	<LazySTCTokenDashboard />
</div>