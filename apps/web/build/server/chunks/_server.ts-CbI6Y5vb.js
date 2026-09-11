import { d as db, a1 as supportTickets } from './drizzle-CsnNxG5m.js';
import { r as requireAdmin } from './admin-auth-5N0bBtTQ.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/support-tickets/+server.ts
var ALLOWED_STATUSES = /* @__PURE__ */ new Set([
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
//# sourceMappingURL=_server.ts-CbI6Y5vb.js.map
