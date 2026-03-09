import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user } from '$lib/db/schema';
import { governanceMemberships } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { getGovernanceActor } from '$lib/server/governance-auth';
import { DEFAULT_GOVERNANCE_PERMISSIONS } from '$lib/server/governance-store';

export const GET: RequestHandler = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, 'governance.roles.manage');
	if (!allowed) return json({ error: 'Forbidden' }, { status: 403 });

	const admins = await db
		.select({ id: user.id, name: user.name, email: user.email, role: user.role })
		.from(user)
		.where(eq(user.role, 'admin'));

	const memberships = await db
		.select({
			userId: governanceMemberships.userId,
			label: governanceMemberships.label,
			permissions: governanceMemberships.permissions,
			active: governanceMemberships.active
		})
		.from(governanceMemberships);

	const membershipByUserId = new Map(
		memberships.map((row) => [row.userId, { label: row.label, active: row.active, permissions: row.permissions ?? [] }])
	);

	return json({
		matrix: [
			{
				role: 'PAUSER_ROLE',
				description: 'May trigger emergency pause only',
				can: ['Trigger pause', 'View incidents'],
				cannot: ['Execute monetary changes', 'Change ownership']
			},
			{
				role: 'TREASURY_ROLE',
				description: 'May propose treasury actions within limits',
				can: ['Draft treasury proposals', 'View treasury'],
				cannot: ['Bypass timelock', 'Mint tokens']
			},
			{
				role: 'POLICY_ROLE',
				description: 'May propose parameter updates within guardrails',
				can: ['Draft policy updates', 'Queue approved changes'],
				cannot: ['Disable guardrails', 'Execute before timelock']
			}
		],
		admins: admins.map((admin) => {
			const assignment = membershipByUserId.get(admin.id);
			return {
				...admin,
				governanceLabel: assignment?.label ?? 'default_admin',
				governanceActive: assignment?.active ?? true,
				governancePermissions: (assignment?.permissions as string[] | undefined) ?? DEFAULT_GOVERNANCE_PERMISSIONS
			};
		})
	});
};
