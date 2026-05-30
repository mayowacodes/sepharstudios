import { n as db, I as paystackSubscriptions, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { b as getGovernanceActor, h as listQueue, f as listProposals, g as getActivePause, l as listAuditEntries } from './governance-auth-MOcI2nxc.js';
import { j as json } from './index-5kYmxIr9.js';
import { count, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './admin-auth-Cru3g_J0.js';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/governance/status/+server.ts
var GET = async ({ locals }) => {
	const { actor, allowed } = await getGovernanceActor(locals, "governance.view");
	if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
	const [activeSubs, activeContent] = await Promise.all([db.select({ total: count() }).from(paystackSubscriptions).where(eq(paystackSubscriptions.status, "active")).then((r) => r[0]?.total ?? 0), db.select({ total: count() }).from(mediaLibrary).where(eq(mediaLibrary.isActive, true)).then((r) => r[0]?.total ?? 0)]);
	const [queue, proposals, emergency, audit] = await Promise.all([
		listQueue(),
		listProposals(),
		getActivePause(),
		listAuditEntries()
	]);
	return json({
		policyMode: "fixed_supply_recycle",
		mintAuthorityEnabled: false,
		timelockDelays: {
			routineHours: 72,
			monetaryChangeHours: 168
		},
		multisig: {
			threshold: 4,
			totalSigners: 7
		},
		admin: actor,
		metrics: {
			activeSubscriptions: activeSubs,
			activeContentItems: activeContent,
			totalProposals: proposals.length,
			queuedActions: queue.length,
			auditEvents: audit.length
		},
		incident: emergency
	});
};

export { GET };
//# sourceMappingURL=_server.ts-D19PYz1s.js.map
