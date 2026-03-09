<script lang="ts">
	interface Props {
		contentId: string;
		contentTitle: string;
		priceCents: number;
		onPurchased?: () => void;
	}

	let { contentId, contentTitle, priceCents, onPurchased }: Props = $props();

	let loading = $state(false);
	let error = $state('');

	const priceDisplay = $derived(`$${(priceCents / 100).toFixed(2)}`);

	async function handlePurchase() {
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/ppv/purchase', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ contentId })
			});
			const data = await res.json();
			if (!res.ok) {
				error = data.error ?? 'Purchase failed. Please try again.';
				return;
			}
			if (data.authorizationUrl) {
				window.location.href = data.authorizationUrl;
			} else {
				onPurchased?.();
			}
		} catch {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex flex-col items-center justify-center gap-6 p-8 text-center max-w-md mx-auto">
	<div class="w-16 h-16 rounded-full bg-[#FFBF00]/10 flex items-center justify-center text-3xl">🎬</div>

	<div>
		<h2 class="text-xl font-bold text-white mb-2">Premium Content</h2>
		<p class="text-gray-400 text-sm">
			<strong class="text-white">{contentTitle}</strong> is available as pay-per-view. Purchase once and watch anytime.
		</p>
	</div>

	<div class="bg-white/5 border border-white/10 rounded-xl p-6 w-full">
		<div class="text-4xl font-bold text-[#FFBF00] mb-1">{priceDisplay}</div>
		<div class="text-gray-400 text-sm">One-time purchase · Watch anytime</div>
	</div>

	{#if error}
		<p class="text-red-400 text-sm">{error}</p>
	{/if}

	<button
		onclick={handlePurchase}
		disabled={loading}
		class="w-full bg-[#FFBF00] hover:bg-[#FFBF00]/90 disabled:opacity-50 text-black font-semibold py-3 px-6 rounded-xl transition-colors"
	>
		{loading ? 'Processing...' : `Buy for ${priceDisplay}`}
	</button>

	<p class="text-gray-500 text-xs">
		Upgrade to <a href="/plans" class="text-[#FFBF00] underline">Premium</a> for unlimited access to all content.
	</p>
</div>
