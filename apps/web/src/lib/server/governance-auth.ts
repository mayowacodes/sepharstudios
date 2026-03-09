import type { RequestEvent } from '@sveltejs/kit';
import { getAdminActor } from '$lib/server/admin-auth';
import { hasGovernancePermission, type GovernancePermission } from '$lib/server/governance-store';

export async function getGovernanceActor(
	locals: RequestEvent['locals'],
	requiredPermission: GovernancePermission
): Promise<{ actor: { id: string; name: string; email: string } | null; allowed: boolean }> {
	const actor = await getAdminActor(locals);
	if (!actor) return { actor: null, allowed: false };

	const allowed = await hasGovernancePermission(actor.id, requiredPermission);
	return { actor, allowed };
}
