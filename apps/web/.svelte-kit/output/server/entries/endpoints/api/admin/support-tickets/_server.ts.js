import { _t as supportTickets, t as db } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
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
//#endregion
export { GET };
