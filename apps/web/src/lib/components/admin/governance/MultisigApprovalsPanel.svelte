<script lang="ts">
	interface Props {
		approvals: number;
		required: number;
	}

	let { approvals, required }: Props = $props();
	const pct = $derived(required > 0 ? Math.min(100, Math.round((approvals / required) * 100)) : 0);
</script>

<div class="rounded-lg border border-white/10 bg-black/30 p-3">
	<div class="flex items-center justify-between text-xs text-gray-300">
		<span>Multisig approvals</span>
		<span>{approvals}/{required}</span>
	</div>
	<div class="mt-2 h-2 rounded bg-white/10 overflow-hidden">
		<div class="h-full bg-cyan-500" style={`width:${pct}%`}></div>
	</div>
</div>

