import { w as db, j as agentRuns } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

export { GET };
//# sourceMappingURL=_server.ts-fIj5TcTv.js.map
