import { t as private_env } from "../../../../../../chunks/shared-server.js";
import { m as agentRuns, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { desc } from "drizzle-orm";
//#region src/routes/api/admin/agents/status/+server.ts
/**
* GET /api/admin/agents/status
*
* Diagnostic endpoint for the /admin/ai-runs page. Tells the admin
* WHY the runs table might be empty:
*   - enabled=false → AI_AGENTS_ENABLED env var is off; runs never start
*   - enabled=true + no recent run → cron isn't firing the agents
*
* Returns:
*   { enabled: boolean, lastRunAt: string | null }
*/
var GET = async ({ locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const enabled = (private_env.AI_AGENTS_ENABLED ?? "").toLowerCase() === "true";
	let lastRunAt = null;
	try {
		const [row] = await db.select({ startedAt: agentRuns.startedAt }).from(agentRuns).orderBy(desc(agentRuns.startedAt)).limit(1);
		lastRunAt = row?.startedAt ? new Date(row.startedAt).toISOString() : null;
	} catch (err) {
		console.warn("[admin/agents/status] lastRunAt query failed", err);
	}
	return json({
		enabled,
		lastRunAt
	});
};
//#endregion
export { GET };
