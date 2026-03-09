<script lang="ts">
	import { onMount } from 'svelte';

	interface Review {
		id: string;
		rating: number;
		reviewText: string | null;
		createdAt: string;
		userId: string;
	}

	interface Props {
		contentId: string;
		contentType?: string;
	}

	let { contentId, contentType = 'movie' }: Props = $props();

	let reviews = $state<Review[]>([]);
	let userRating = $state(0);
	let hoverRating = $state(0);
	let reviewText = $state('');
	let submitting = $state(false);
	let submitted = $state(false);
	let loading = $state(true);

	const avgRating = $derived(
		reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null
	);

	onMount(async () => {
		try {
			const res = await fetch(`/api/reviews?contentId=${contentId}`);
			if (res.ok) reviews = await res.json();
		} finally {
			loading = false;
		}
	});

	async function submit() {
		if (!userRating) return;
		submitting = true;
		try {
			const res = await fetch('/api/reviews', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ contentId, contentType, rating: userRating, reviewText })
			});
			if (res.ok) {
				submitted = true;
				reviewText = '';
			}
		} finally {
			submitting = false;
		}
	}

	function starClass(star: number, current: number) {
		return star <= current ? 'text-[#FFBF00]' : 'text-gray-600';
	}
</script>

<div class="space-y-6">
	<div class="flex items-center gap-4">
		<h3 class="text-lg font-semibold text-white">Reviews</h3>
		{#if avgRating}
			<div class="flex items-center gap-1">
				<span class="text-[#FFBF00] font-bold">{avgRating}</span>
				<span class="text-[#FFBF00]">★</span>
				<span class="text-gray-400 text-sm">({reviews.length})</span>
			</div>
		{/if}
	</div>

	<!-- Rating form -->
	{#if !submitted}
		<div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
			<p class="text-sm text-gray-400">Rate this content</p>
			<div class="flex gap-1">
				{#each [1, 2, 3, 4, 5] as star}
					<button
						onclick={() => (userRating = star)}
						onmouseenter={() => (hoverRating = star)}
						onmouseleave={() => (hoverRating = 0)}
						class="text-2xl transition-colors {starClass(star, hoverRating || userRating)}"
						aria-label="Rate {star} star"
					>★</button>
				{/each}
			</div>
			{#if userRating > 0}
				<textarea
					bind:value={reviewText}
					placeholder="Share your thoughts (optional)..."
					rows="3"
					class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 resize-none focus:outline-none focus:border-[#FFBF00]/40"
				></textarea>
				<button
					onclick={submit}
					disabled={submitting}
					class="bg-[#FFBF00] hover:bg-[#FFBF00]/90 disabled:opacity-50 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
				>
					{submitting ? 'Submitting...' : 'Submit Review'}
				</button>
			{/if}
		</div>
	{:else}
		<div class="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
			Thanks for your review! It will appear after approval.
		</div>
	{/if}

	<!-- Review list -->
	{#if loading}
		<div class="space-y-3">
			{#each [1, 2] as _}
				<div class="h-20 bg-white/5 rounded-xl animate-pulse"></div>
			{/each}
		</div>
	{:else if reviews.length === 0}
		<p class="text-gray-500 text-sm">No reviews yet. Be the first!</p>
	{:else}
		<div class="space-y-3">
			{#each reviews as review (review.id)}
				<div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
					<div class="flex items-center gap-2">
						<div class="flex gap-0.5">
							{#each [1, 2, 3, 4, 5] as star}
								<span class="text-sm {starClass(star, review.rating)}">★</span>
							{/each}
						</div>
						<span class="text-gray-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
					</div>
					{#if review.reviewText}
						<p class="text-gray-300 text-sm">{review.reviewText}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
