import { json, type RequestHandler } from '@sveltejs/kit';
import { getGovernanceActor } from '$lib/server/governance-auth';
import { listQueue } from '$lib/server/governance-store';

export const GET: RequestHandler = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, 'governance.view');
	if (!allowed) return json({ error: 'Forbidden' }, { status: 403 });
	return json(await listQueue());
};
