import { R as paystackSubscriptions, j as mediaLibrary, t as db } from "../../../../../../chunks/drizzle.js";
import { l as listProposals, o as getActivePause, s as listAuditEntries, t as getGovernanceActor, u as listQueue } from "../../../../../../chunks/governance-auth.js";
import { json } from "@sveltejs/kit";
import { count, eq } from "drizzle-orm";
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
//#endregion
export { GET };
