<script lang="ts">
	interface QueueItem {
		id: string;
		title: string;
		type: string;
		status: string;
		eta?: string;
	}

	interface Props {
		items: QueueItem[];
		onExecute?: (id: string) => void;
	}

	let { items, onExecute }: Props = $props();

	function isReady(eta?: string): boolean {
		return !!eta && Date.now() >= Date.parse(eta);
	}
</script>

<div class="overflow-x-auto rounded-xl border border-white/10">
	<table class="w-full text-sm">
		<thead class="bg-white/5 text-gray-300">
			<tr>
				<th class="text-left px-4 py-3">Proposal</th>
				<th class="text-left px-4 py-3">Type</th>
				<th class="text-left px-4 py-3">ETA</th>
				<th class="text-left px-4 py-3">Status</th>
				<th class="text-left px-4 py-3">Action</th>
			</tr>
		</thead>
		<tbody>
			{#if items.length === 0}
				<tr>
					<td colspan="5" class="px-4 py-6 text-center text-gray-400">No queued actions.</td>
				</tr>
			{:else}
				{#each items as item}
					<tr class="border-t border-white/10">
						<td class="px-4 py-3 text-white">{item.title}</td>
						<td class="px-4 py-3 text-gray-300">{item.type}</td>
						<td class="px-4 py-3 text-gray-300">{item.eta ? new Date(item.eta).toLocaleString() : '-'}</td>
						<td class="px-4 py-3">
							<span class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">{item.status}</span>
						</td>
						<td class="px-4 py-3">
							<button
								class="px-3 py-1 rounded text-xs bg-green-600 hover:bg-green-700 disabled:opacity-40"
								disabled={!isReady(item.eta)}
								onclick={() => onExecute?.(item.id)}
							>
								Execute
							</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

