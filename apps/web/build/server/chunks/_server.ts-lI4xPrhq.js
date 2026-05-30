import { n as db, B as mediaLibrary, a0 as user, j as creatorApplications } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { sql, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/stats/+server.ts
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const [contentStats] = await db.select({
		pendingReviews: sql`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
		publishedContent: sql`sum(case when ${mediaLibrary.isActive} then 1 else 0 end)`,
		rejectedContent: sql`sum(case when ${mediaLibrary.status} = 'rejected' then 1 else 0 end)`,
		totalViews: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`
	}).from(mediaLibrary);
	const [creatorStats] = await db.select({ totalCreators: sql`count(*)` }).from(user).where(eq(user.role, "creator"));
	const now = /* @__PURE__ */ new Date();
	const startOf7 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
	const startOf30 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
	const [applicationStats] = await db.select({
		pendingApplications: sql`sum(case when ${creatorApplications.status} = 'pending' then 1 else 0 end)`,
		approved7: sql`sum(case when ${creatorApplications.status} = 'approved' and ${creatorApplications.reviewedAt} >= ${startOf7} then 1 else 0 end)`,
		approved30: sql`sum(case when ${creatorApplications.status} = 'approved' and ${creatorApplications.reviewedAt} >= ${startOf30} then 1 else 0 end)`,
		avgApprovalHours: sql`avg(extract(epoch from (${creatorApplications.reviewedAt} - ${creatorApplications.createdAt})))/3600`
	}).from(creatorApplications);
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

export { GET };
//# sourceMappingURL=_server.ts-lI4xPrhq.js.map
