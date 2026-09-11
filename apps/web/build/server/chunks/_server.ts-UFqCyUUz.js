import { j as json, p as private_env } from './index.js-CxPEndTa.js';
import { d as db, g as agentRuns } from './drizzle-C3SH12nS.js';
import { desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

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

export { GET };
//# sourceMappingURL=_server.ts-UFqCyUUz.js.map
