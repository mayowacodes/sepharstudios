import { m as agentRuns, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/routes/api/admin/agent-runs/+server.ts
/**
* GET /api/admin/agent-runs?agent=&status=&limit=
*
* Returns recent agent_runs rows. Admin-only.
*/
var GET = async ({ url, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const agentFilter = url.searchParams.get("agent");
	const statusFilter = url.searchParams.get("status");
	const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 200);
	return json({ runs: await db.select().from(agentRuns).where(agentFilter ? statusFilter ? eq(agentRuns.agent, agentFilter) : eq(agentRuns.agent, agentFilter) : statusFilter ? eq(agentRuns.status, statusFilter) : void 0).orderBy(desc(agentRuns.startedAt)).limit(limit) });
};
//#endregion
export { GET };
