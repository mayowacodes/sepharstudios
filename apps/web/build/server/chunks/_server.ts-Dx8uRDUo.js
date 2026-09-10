import { g as getGovernanceActor, h as listQueue } from './governance-auth-Pot4Aj6r.js';
import { j as json } from './index.js-DwRgOKlO.js';
import './drizzle-DlGuU73K.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './admin-auth-i1sA9-vE.js';

//#region src/routes/api/admin/governance/timelock-queue/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	return json(await listQueue());
};

export { GET };
//# sourceMappingURL=_server.ts-Dx8uRDUo.js.map
