import { a as user, t as db } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/admins/+server.ts
/**
* GET /api/admin/admins
*
* Lists users with role='admin'. Used to populate the review-queue assignment
* modal. Admin only.
*/
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	return json({ admins: await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		image: user.image
	}).from(user).where(eq(user.role, "admin")).orderBy(user.name) });
};
//#endregion
export { GET };
