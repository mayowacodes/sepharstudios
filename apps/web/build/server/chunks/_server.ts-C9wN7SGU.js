import { j as json } from './index-BcOZ6EV9.js';
import { g as getGovernanceActor, l as listAuditEntries } from './governance-auth-C645BtCl.js';
import './utils-FiC4zhrQ.js';
import './drizzle-CW7hPjGG.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

const GET = async ({ locals }) => {
  const { allowed } = await getGovernanceActor(locals, "governance.reports.view");
  if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
  return json(await listAuditEntries());
};

export { GET };
//# sourceMappingURL=_server.ts-C9wN7SGU.js.map
