import { t as getGovernanceActor, u as listQueue } from "../../../../../../chunks/governance-auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/admin/governance/timelock-queue/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	return json(await listQueue());
};
//#endregion
export { GET };
