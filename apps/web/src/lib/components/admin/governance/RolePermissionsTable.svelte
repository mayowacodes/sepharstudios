<script lang="ts">
	interface RoleEntry {
		role: string;
		description: string;
		can: string[];
		cannot: string[];
	}

	interface Props {
		roles: RoleEntry[];
	}

	let { roles }: Props = $props();
</script>

<div class="space-y-4">
	{#each roles as role}
		<div class="rounded-xl border border-white/10 bg-white/5 p-4">
			<h3 class="text-sm font-semibold text-white">{role.role}</h3>
			<p class="text-xs text-gray-400 mt-1">{role.description}</p>
			<div class="grid md:grid-cols-2 gap-4 mt-3">
				<div>
					<p class="text-xs text-green-300 mb-1">Can</p>
					<ul class="text-xs text-gray-300 space-y-1">
						{#each role.can as item}
							<li>- {item}</li>
						{/each}
					</ul>
				</div>
				<div>
					<p class="text-xs text-red-300 mb-1">Cannot</p>
					<ul class="text-xs text-gray-300 space-y-1">
						{#each role.cannot as item}
							<li>- {item}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/each}
</div>

