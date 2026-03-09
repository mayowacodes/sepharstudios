<script lang="ts">
	interface PoolItem {
		key: string;
		label: string;
		control: string;
		status: string;
	}

	interface Props {
		pools: PoolItem[];
	}

	let { pools }: Props = $props();
</script>

<div class="overflow-x-auto rounded-xl border border-white/10">
	<table class="w-full text-sm">
		<thead class="bg-white/5 text-gray-300">
			<tr>
				<th class="text-left px-4 py-3">Pool</th>
				<th class="text-left px-4 py-3">Control</th>
				<th class="text-left px-4 py-3">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each pools as pool}
				<tr class="border-t border-white/10">
					<td class="px-4 py-3 text-white">{pool.label}</td>
					<td class="px-4 py-3 text-gray-300">{pool.control}</td>
					<td class="px-4 py-3">
						<span class="px-2 py-1 rounded bg-amber-500/20 text-amber-300 text-xs">{pool.status}</span>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

