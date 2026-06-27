<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<!-- Diagonal portal shimmer. Replaces the older animate-pulse blink
     with a 1.4s sweeping gradient that pulls from --portal-accent so
     loading states match the surrounding portal palette. Falls back to
     a static surface under prefers-reduced-motion. -->
<div
	bind:this={ref}
	data-slot="skeleton"
	class={cn("portal-skeleton rounded-md", className)}
	{...restProps}
></div>

<style>
	:global(.portal-skeleton) {
		position: relative;
		overflow: hidden;
		background: hsl(var(--portal-bg-elevated, 222 22% 13%) / 0.6);
		isolation: isolate;
	}
	:global(.portal-skeleton)::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			115deg,
			transparent 25%,
			hsl(var(--portal-accent, 175 60% 48%) / 0.12) 50%,
			transparent 75%
		);
		transform: translateX(-100%);
		animation: portal-shimmer 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}
	@keyframes portal-shimmer {
		100% { transform: translateX(100%); }
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.portal-skeleton)::after {
			animation: none;
			opacity: 0;
		}
	}
</style>
