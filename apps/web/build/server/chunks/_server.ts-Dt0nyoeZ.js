import { w as db, V as paystackSubscriptions, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { b as getGovernanceActor, h as listQueue, f as listProposals, g as getActivePause, l as listAuditEntries } from './governance-auth-Bawc8d5Y.js';
import { j as json } from './index-Cv5VcsYq.js';
import { count, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './admin-auth-DwogZLlW.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-Dt0nyoeZ.js.map
