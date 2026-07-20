import { gt as successStories, t as db } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/routes/api/admin/success-stories/+server.ts
var ALLOWED_STATUSES = new Set([
	"pending",
	"approved",
	"rejected"
]);
var GET = async ({ url, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const status = url.searchParams.get("status");
	return json({ stories: await db.select().from(successStories).where(status && ALLOWED_STATUSES.has(status) ? eq(successStories.status, status) : void 0).orderBy(desc(successStories.createdAt)).limit(100) });
};
//#endregion
export { GET };
