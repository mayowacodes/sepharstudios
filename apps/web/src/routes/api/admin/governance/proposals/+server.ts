import { json, type RequestHandler } from '@sveltejs/kit';
import { getGovernanceActor } from '$lib/server/governance-auth';
import { createProposal, listProposals, type ProposalType } from '$lib/server/governance-store';
import { assessRisk, getGuardrailWarnings, getHardValidationErrors } from '$lib/server/governance-validation';

export const GET: RequestHandler = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, 'governance.view');
	if (!allowed) return json({ error: 'Forbidden' }, { status: 403 });
	return json(await listProposals());
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const { actor, allowed } = await getGovernanceActor(locals, 'governance.proposal.create');
	if (!actor || !allowed) return json({ error: 'Forbidden' }, { status: 403 });

	const body = await request.json() as {
		title?: string;
		description?: string;
		type?: ProposalType;
		payload?: Record<string, unknown>;
	};

	if (!body.title || !body.description || !body.type) {
		return json({ error: 'title, description, and type are required' }, { status: 400 });
	}

	const payload = body.payload ?? {};
	const validationErrors = getHardValidationErrors(body.type, payload);
	if (validationErrors.length > 0) {
		return json({ error: validationErrors[0], details: validationErrors }, { status: 400 });
	}

	const proposal = createProposal({
		title: body.title,
		description: body.description,
		type: body.type,
		payload,
		createdBy: actor.id,
		createdByName: actor.name,
		riskLevel: assessRisk(body.type, payload),
		guardrailWarnings: getGuardrailWarnings(body.type, payload)
	}, actor);

	return json(proposal, { status: 201 });
};
