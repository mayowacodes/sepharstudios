import { json, type RequestHandler } from '@sveltejs/kit';
import { getGovernanceActor } from '$lib/server/governance-auth';
import { getActivePause, listPauseEvents, triggerPause } from '$lib/server/governance-store';

export const GET: RequestHandler = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, 'governance.view');
	if (!allowed) return json({ error: 'Forbidden' }, { status: 403 });
	return json({
		active: await getActivePause(),
		history: await listPauseEvents()
	});
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const { actor, allowed } = await getGovernanceActor(locals, 'governance.pause.trigger');
	if (!actor || !allowed) return json({ error: 'Forbidden' }, { status: 403 });

	const { reason } = await request.json() as { reason?: string };
	if (!reason || reason.trim().length < 12) {
		return json({ error: 'Provide a detailed incident reason (min 12 chars)' }, { status: 400 });
	}

	const event = await triggerPause(reason.trim(), { id: actor.id, name: actor.name });
	return json(event, { status: 201 });
};
