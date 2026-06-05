import { H as mediaLibrary, t as db } from "../../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { sql } from "drizzle-orm";
//#region src/routes/api/admin/workflow/stats/+server.ts
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const stats = (await db.select({
		totalProcessed: sql`sum(case when ${mediaLibrary.status} in ('approved','published','rejected') then 1 else 0 end)`,
		pendingReviews: sql`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
		approved: sql`sum(case when ${mediaLibrary.status} in ('approved','published') then 1 else 0 end)`,
		rejected: sql`sum(case when ${mediaLibrary.status} = 'rejected' then 1 else 0 end)`,
		avgSeconds: sql`avg(extract(epoch from (${mediaLibrary.reviewedAt} - ${mediaLibrary.createdAt})))`
	}).from(mediaLibrary))[0];
	const reviewedTotal = Number(stats?.approved ?? 0) + Number(stats?.rejected ?? 0);
	const approvalRate = reviewedTotal > 0 ? Math.round(Number(stats?.approved ?? 0) / reviewedTotal * 100) : 0;
	const avgDays = stats?.avgSeconds ? Number(stats.avgSeconds) / 86400 : 0;
	return json({
		totalProcessed: Number(stats?.totalProcessed ?? 0),
		avgProcessingTime: Number(avgDays.toFixed(1)),
		approvalRate,
		pendingReviews: Number(stats?.pendingReviews ?? 0)
	});
};
//#endregion
export { GET };
