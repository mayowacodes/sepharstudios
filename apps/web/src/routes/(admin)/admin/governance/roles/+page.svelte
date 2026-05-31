<script lang="ts">
	import { onMount } from 'svelte';
	import RolePermissionsTable from '$lib/components/admin/governance/RolePermissionsTable.svelte';
	import { ShieldCheck } from '@lucide/svelte';
	import PageHeader from '$lib/components/dashboard/PageHeader.svelte';

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
	<PageHeader icon={ShieldCheck} title="Role Permissions" subtitle="Who can do what across the platform." />

	{#if loading}
		<p class="text-sm text-muted-foreground">Loading roles...</p>
	{:else if data}
		<RolePermissionsTable roles={data.matrix} />

		<div class="rounded-xl border border-border/40 surface-1 p-4">
			<h2 class="text-lg font-semibold text-foreground mb-2">Admin Users</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="text-muted-foreground">
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
							<tr class="border-t border-border/40">
								<td class="py-2 text-foreground">{admin.name}</td>
								<td class="py-2 text-foreground/80">{admin.email}</td>
								<td class="py-2 text-foreground/80">{admin.role}</td>
								<td class="py-2 text-foreground/80">
									{admin.governanceLabel}
									{#if !admin.governanceActive}
										<span class="text-xs text-red-300 ml-2">(inactive)</span>
									{/if}
								</td>
								<td class="py-2 text-xs text-muted-foreground">
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
