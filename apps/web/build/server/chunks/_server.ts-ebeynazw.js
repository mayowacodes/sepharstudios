import { d as db, P as paystackSubscriptions, m as mediaLibrary } from './drizzle-C3SH12nS.js';
import { g as getGovernanceActor, h as listQueue, d as listProposals, c as getActivePause, l as listAuditEntries } from './governance-auth-Fa5l47Rl.js';
import { j as json } from './index.js-CxPEndTa.js';
import { count, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './admin-auth-C5lShqv4.js';

//#region src/routes/api/admin/governance/status/+server.ts
var GET = async ({ locals }) => {
	const { actor, allowed } = await getGovernanceActor(locals, "governance.view");
	if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
	const safe = async (fn, fallback, label) => {
		try {
			return await fn();
		} catch (err) {
			console.error(`[admin/governance/status] ${label} failed:`, err);
			return fallback;
		}
	};
	const [activeSubs, activeContent, queue, proposals, emergency, audit] = await Promise.all([
		safe(() => db.select({ total: count() }).from(paystackSubscriptions).where(eq(paystackSubscriptions.status, "active")).then((r) => r[0]?.total ?? 0), 0, "activeSubs"),
		safe(() => db.select({ total: count() }).from(mediaLibrary).where(eq(mediaLibrary.isActive, true)).then((r) => r[0]?.total ?? 0), 0, "activeContent"),
		safe(() => listQueue(), [], "queue"),
		safe(() => listProposals(), [], "proposals"),
		safe(() => getActivePause(), null, "emergency"),
		safe(() => listAuditEntries(), [], "audit")
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
//# sourceMappingURL=_server.ts-ebeynazw.js.map
