import { json } from "@sveltejs/kit";
import { g as getGovernanceActor, f as listQueue } from "../../../../../../chunks/governance-auth.js";
const GET = async ({ locals }) => {
  const { allowed } = await getGovernanceActor(locals, "governance.view");
  if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
  return json(await listQueue());
};
export {
  GET
};
