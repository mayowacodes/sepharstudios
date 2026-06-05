import { H as mediaLibrary, Z as paystackSubscriptions, t as db } from "../../../../../../chunks/drizzle.js";
import { l as listProposals, o as getActivePause, s as listAuditEntries, t as getGovernanceActor, u as listQueue } from "../../../../../../chunks/governance-auth.js";
import { json } from "@sveltejs/kit";
import { count, eq } from "drizzle-orm";
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
//#endregion
export { GET };
