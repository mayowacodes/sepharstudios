import { g as getGovernanceActor, b as listPauseEvents, c as getActivePause, t as triggerPause } from './governance-auth-Pot4Aj6r.js';
import { j as json } from './index.js-DwRgOKlO.js';
import './drizzle-DlGuU73K.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-i1sA9-vE.js';

//#region src/routes/api/admin/governance/emergency/pause/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	return json({
		active: await getActivePause(),
		history: await listPauseEvents()
	});
};
var POST = async ({ locals, request }) => {
	const { actor, allowed } = await getGovernanceActor(locals, "governance.pause.trigger");
	if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
	const { reason } = await request.json();
	if (!reason || reason.trim().length < 12) return json({ error: "Provide a detailed incident reason (min 12 chars)" }, { status: 400 });
	return json(await triggerPause(reason.trim(), {
		id: actor.id,
		name: actor.name
	}), { status: 201 });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-DKWjvBQG.js.map
