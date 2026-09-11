import { g as getGovernanceActor, h as listQueue } from './governance-auth-g-hBa7oy.js';
import { j as json } from './index.js-BP8aAXBX.js';
import './drizzle-CsnNxG5m.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-5N0bBtTQ.js';

//#region src/routes/api/admin/governance/timelock-queue/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	return json(await listQueue());
};

export { GET };
//# sourceMappingURL=_server.ts-CFcsCHrV.js.map
