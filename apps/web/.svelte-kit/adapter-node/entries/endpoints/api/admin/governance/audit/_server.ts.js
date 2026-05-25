import { json } from "@sveltejs/kit";
import { g as getGovernanceActor, l as listAuditEntries } from "../../../../../../chunks/governance-auth.js";
const GET = async ({ locals }) => {
  const { allowed } = await getGovernanceActor(locals, "governance.reports.view");
  if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
  return json(await listAuditEntries());
};
export {
  GET
};
