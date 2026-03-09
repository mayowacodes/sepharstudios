<script lang="ts">
	import { onMount } from 'svelte';
	import RolePermissionsTable from '$lib/components/admin/governance/RolePermissionsTable.svelte';

	type Data = {
		matrix: Array<{ role: string; description: string; can: string[]; cannot: string[] }>;
		admins: Array<{
			id: string;
			name: string;
			email: string;
			role: string;
			governanceLabel: string;
			governanceActive: boolean;
			governancePermissions: string[];
		}>;
	};

	let loading = $state(true);
	let data = $state<Data | null>(null);

	onMount(async () => {
		try {
			const res = await fetch('/api/admin/governance/roles');
			if (res.ok) data = await res.json();
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Governance Roles - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 space-y-6">
	<h1 class="text-2xl font-bold text-white">Role Permissions</h1>

	{#if loading}
		<p class="text-sm text-gray-400">Loading roles...</p>
	{:else if data}
		<RolePermissionsTable roles={data.matrix} />

		<div class="rounded-xl border border-white/10 bg-white/5 p-4">
			<h2 class="text-lg font-semibold text-white mb-2">Admin Users</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="text-gray-400">
						<tr>
							<th class="text-left py-2">Name</th>
							<th class="text-left py-2">Email</th>
							<th class="text-left py-2">Role</th>
							<th class="text-left py-2">Governance Profile</th>
							<th class="text-left py-2">Permissions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.admins as admin}
							<tr class="border-t border-white/10">
								<td class="py-2 text-white">{admin.name}</td>
								<td class="py-2 text-gray-300">{admin.email}</td>
								<td class="py-2 text-gray-300">{admin.role}</td>
								<td class="py-2 text-gray-300">
									{admin.governanceLabel}
									{#if !admin.governanceActive}
										<span class="text-xs text-red-300 ml-2">(inactive)</span>
									{/if}
								</td>
								<td class="py-2 text-xs text-gray-400">
									{admin.governancePermissions.join(', ')}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
