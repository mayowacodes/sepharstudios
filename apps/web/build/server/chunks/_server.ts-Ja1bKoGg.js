import { b as getGovernanceActor, d as listPauseEvents, g as getActivePause, t as triggerPause } from './governance-auth-MOcI2nxc.js';
import { j as json } from './index-5kYmxIr9.js';
import './drizzle-BjmsPAPl.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-Cru3g_J0.js';
import './index-DBqjc0Yf.js';

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
//# sourceMappingURL=_server.ts-Ja1bKoGg.js.map
