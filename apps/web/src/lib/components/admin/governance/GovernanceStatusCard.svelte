<script lang="ts">
	interface Props {
		title: string;
		value: string | number;
		subtitle?: string;
		tone?: 'default' | 'good' | 'warn' | 'danger';
	}

	let { title, value, subtitle = '', tone = 'default' }: Props = $props();

	const toneClass = $derived(
		tone === 'good'
			? 'text-green-400'
			: tone === 'warn'
				? 'text-amber-400'
				: tone === 'danger'
					? 'text-red-400'
					: 'text-white'
	);
</script>

<div class="bg-white/5 border border-white/10 rounded-xl p-4">
	<p class="text-xs uppercase tracking-wide text-gray-400">{title}</p>
	<p class={`text-2xl font-bold mt-1 ${toneClass}`}>{value}</p>
	{#if subtitle}
		<p class="text-xs text-gray-400 mt-2">{subtitle}</p>
	{/if}
</div>

