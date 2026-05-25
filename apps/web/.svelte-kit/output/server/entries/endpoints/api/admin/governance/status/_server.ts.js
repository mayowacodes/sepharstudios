import { json } from "@sveltejs/kit";
import { d as db, i as paystackSubscriptions, m as mediaLibrary } from "../../../../../../chunks/drizzle.js";
import { count, eq } from "drizzle-orm";
import { g as getGovernanceActor, f as listQueue, d as listProposals, c as getActivePause, l as listAuditEntries } from "../../../../../../chunks/governance-auth.js";
const GET = async ({ locals }) => {
  const { actor, allowed } = await getGovernanceActor(locals, "governance.view");
  if (!actor || !allowed) return json({ error: "Forbidden" }, { status: 403 });
  const [activeSubs, activeContent] = await Promise.all([
    db.select({ total: count() }).from(paystackSubscriptions).where(eq(paystackSubscriptions.status, "active")).then((r) => r[0]?.total ?? 0),
    db.select({ total: count() }).from(mediaLibrary).where(eq(mediaLibrary.isActive, true)).then((r) => r[0]?.total ?? 0)
  ]);
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
export {
  GET
};
