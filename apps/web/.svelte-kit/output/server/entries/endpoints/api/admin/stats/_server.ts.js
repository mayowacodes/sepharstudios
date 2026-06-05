import { C as creatorApplications, H as mediaLibrary, a as user, t as db } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";
//#region src/routes/api/admin/stats/+server.ts
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	let contentStats;
	try {
		[contentStats] = await db.select({
			pendingReviews: sql`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
			publishedContent: sql`sum(case when ${mediaLibrary.isActive} then 1 else 0 end)`,
			rejectedContent: sql`sum(case when ${mediaLibrary.status} = 'rejected' then 1 else 0 end)`,
			totalViews: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`
		}).from(mediaLibrary);
	} catch (err) {
		console.warn("[api/admin/stats] media_library query failed:", err);
	}
	let creatorStats;
	try {
		[creatorStats] = await db.select({ totalCreators: sql`count(*)` }).from(user).where(eq(user.role, "creator"));
	} catch (err) {
		console.warn("[api/admin/stats] user query failed:", err);
	}
	const now = /* @__PURE__ */ new Date();
	const startOf7 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
	const startOf30 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
	let applicationStats;
	try {
		[applicationStats] = await db.select({
			pendingApplications: sql`sum(case when ${creatorApplications.status} = 'pending' then 1 else 0 end)`,
			approved7: sql`sum(case when ${creatorApplications.status} = 'approved' and ${creatorApplications.reviewedAt} >= ${startOf7} then 1 else 0 end)`,
			approved30: sql`sum(case when ${creatorApplications.status} = 'approved' and ${creatorApplications.reviewedAt} >= ${startOf30} then 1 else 0 end)`,
			avgApprovalHours: sql`avg(extract(epoch from (${creatorApplications.reviewedAt} - ${creatorApplications.createdAt})))/3600`
		}).from(creatorApplications);
	} catch (err) {
		console.warn("[api/admin/stats] creator_applications query failed:", err);
	}
	return json({
		pendingReviews: Number(contentStats?.pendingReviews ?? 0),
		publishedContent: Number(contentStats?.publishedContent ?? 0),
		rejectedContent: Number(contentStats?.rejectedContent ?? 0),
		totalViews: Number(contentStats?.totalViews ?? 0),
		totalCreators: Number(creatorStats?.totalCreators ?? 0),
		pendingApplications: Number(applicationStats?.pendingApplications ?? 0),
		approvedApplications7d: Number(applicationStats?.approved7 ?? 0),
		approvedApplications30d: Number(applicationStats?.approved30 ?? 0),
		avgApprovalHours: Number(applicationStats?.avgApprovalHours ?? 0)
	});
};
//#endregion
export { GET };
