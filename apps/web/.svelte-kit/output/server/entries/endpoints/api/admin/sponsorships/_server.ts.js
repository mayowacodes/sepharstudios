import { ft as sponsorshipApplications, t as db } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/routes/api/admin/sponsorships/+server.ts
var ALLOWED_STATUSES = new Set([
	"pending",
	"reviewing",
	"approved",
	"rejected"
]);
var GET = async ({ url, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const status = url.searchParams.get("status");
	return json({ applications: await db.select().from(sponsorshipApplications).where(status && ALLOWED_STATUSES.has(status) ? eq(sponsorshipApplications.status, status) : void 0).orderBy(desc(sponsorshipApplications.createdAt)).limit(100) });
};
//#endregion
export { GET };
