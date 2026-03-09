import { json, type RequestHandler } from '@sveltejs/kit';
import { getGovernanceActor } from '$lib/server/governance-auth';
import { executeProposal } from '$lib/server/governance-store';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { actor, allowed } = await getGovernanceActor(locals, 'governance.proposal.execute');
	if (!actor || !allowed) return json({ error: 'Forbidden' }, { status: 403 });

	const { proposalId } = await request.json() as { proposalId?: string };
	if (!proposalId) return json({ error: 'proposalId required' }, { status: 400 });

	const proposal = await executeProposal(proposalId, { id: actor.id, name: actor.name });
	if (!proposal) return json({ error: 'Proposal not found' }, { status: 404 });

	if (proposal.status !== 'executed') {
		return json({ error: 'Proposal not yet executable', proposal }, { status: 409 });
	}

	return json(proposal);
};
