import { g as getGovernanceActor, l as listAuditEntries } from './governance-auth-Fa5l47Rl.js';
import { j as json } from './index.js-CxPEndTa.js';
import './drizzle-C3SH12nS.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-C5lShqv4.js';

//#region src/routes/api/admin/governance/audit/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.reports.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	return json(await listAuditEntries());
};

export { GET };
//# sourceMappingURL=_server.ts-Cq1-AieM.js.map
