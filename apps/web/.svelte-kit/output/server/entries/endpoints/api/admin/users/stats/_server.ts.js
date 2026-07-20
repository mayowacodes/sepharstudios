import { a as user, t as db } from "../../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { sql } from "drizzle-orm";
//#region src/routes/api/admin/users/stats/+server.ts
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const now = /* @__PURE__ */ new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const startOfWeek = new Date(startOfToday);
	startOfWeek.setDate(startOfWeek.getDate() - 6);
	const [agg] = await db.select({
		totalUsers: sql`count(*)`,
		creators: sql`sum(case when ${user.role} = 'creator' then 1 else 0 end)`,
		admins: sql`sum(case when ${user.role} = 'admin' then 1 else 0 end)`,
		editors: sql`sum(case when ${user.role} = 'editor' then 1 else 0 end)`,
		banned: sql`sum(case when ${user.banned} = true then 1 else 0 end)`,
		newToday: sql`sum(case when ${user.createdAt} >= ${startOfToday.toISOString()} then 1 else 0 end)`,
		newWeek: sql`sum(case when ${user.createdAt} >= ${startOfWeek.toISOString()} then 1 else 0 end)`
	}).from(user);
	return json({
		totalUsers: Number(agg?.totalUsers ?? 0),
		creators: Number(agg?.creators ?? 0),
		admins: Number(agg?.admins ?? 0),
		editors: Number(agg?.editors ?? 0),
		banned: Number(agg?.banned ?? 0),
		newToday: Number(agg?.newToday ?? 0),
		newWeek: Number(agg?.newWeek ?? 0)
	});
};
//#endregion
export { GET };
