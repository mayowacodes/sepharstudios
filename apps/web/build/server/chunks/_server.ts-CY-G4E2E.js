import { g as getGovernanceActor, l as listAuditEntries } from './governance-auth-g-hBa7oy.js';
import { j as json } from './index.js-BP8aAXBX.js';
import './drizzle-CsnNxG5m.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-5N0bBtTQ.js';

//#region src/routes/api/admin/governance/audit/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.reports.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	return json(await listAuditEntries());
};

export { GET };
//# sourceMappingURL=_server.ts-CY-G4E2E.js.map
