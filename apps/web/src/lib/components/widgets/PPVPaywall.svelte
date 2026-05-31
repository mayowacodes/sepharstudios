<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		contentId: string;
		contentTitle: string;
		/** Fallback display when /api/content/[id]/price is unreachable. */
		priceCents: number;
		onPurchased?: () => void;
	}

	interface PriceResponse {
		ppv: boolean;
		priceCents?: number;
		currency?: string;
		display?: string;
		localized?: { currency: string; cents: number; display: string } | null;
	}

	let { contentId, contentTitle, priceCents, onPurchased }: Props = $props();

	let loading = $state(false);
	let error = $state('');
	let price = $state<PriceResponse | null>(null);

	// Fallback formatting if the price API is unreachable. We can't know the
	// viewer's locale here, so default to USD-style $X.XX. The async fetch
	// below replaces this with the proper Intl-formatted display.
	const fallbackDisplay = $derived(`$${(priceCents / 100).toFixed(2)}`);
	const canonicalDisplay = $derived(price?.display ?? fallbackDisplay);
	const localized = $derived(price?.localized ?? null);

	onMount(async () => {
		try {
			const res = await fetch(`/api/content/${contentId}/price`);
			if (res.ok) price = (await res.json()) as PriceResponse;
		} catch {
			// silent — fallback already covers
		}
	});

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
		<div class="text-4xl font-bold text-[#FFBF00] mb-1">{canonicalDisplay}</div>
		{#if localized}
			<div class="text-sm text-gray-300 mt-1">
				≈ <span class="font-medium text-white">{localized.display}</span>
				<span class="text-gray-500">({localized.currency})</span>
			</div>
		{/if}
		<div class="text-gray-400 text-sm mt-2">One-time purchase · Watch anytime</div>
	</div>

	{#if error}
		<p class="text-red-400 text-sm">{error}</p>
	{/if}

	<button
		onclick={handlePurchase}
		disabled={loading}
		class="w-full bg-[#FFBF00] hover:bg-[#FFBF00]/90 disabled:opacity-50 text-black font-semibold py-3 px-6 rounded-xl transition-colors"
	>
		{loading ? 'Processing...' : `Buy for ${canonicalDisplay}`}
	</button>

	{#if localized}
		<p class="text-[10px] text-gray-500">Charged in {price?.currency}. Local currency shown for reference; final amount may vary by your card's FX.</p>
	{/if}

	<p class="text-gray-500 text-xs">
		Upgrade to <a href="/plans" class="text-[#FFBF00] underline">Premium</a> for unlimited access to all content.
	</p>
</div>
