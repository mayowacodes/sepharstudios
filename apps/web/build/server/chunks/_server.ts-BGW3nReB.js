import { n as db, Z as supportTickets } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/support-tickets/+server.ts
var ALLOWED_STATUSES = new Set([
	"open",
	"in_progress",
	"resolved",
	"closed"
]);
var GET = async ({ url, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const status = url.searchParams.get("status");
	return json({ tickets: await db.select().from(supportTickets).where(status && ALLOWED_STATUSES.has(status) ? eq(supportTickets.status, status) : void 0).orderBy(desc(supportTickets.createdAt)).limit(100) });
};

export { GET };
//# sourceMappingURL=_server.ts-BGW3nReB.js.map
