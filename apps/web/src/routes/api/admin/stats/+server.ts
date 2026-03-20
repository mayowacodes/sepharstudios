import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creatorApplications, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [contentStats] = await db
		.select({
			pendingReviews: sql<number>`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
			publishedContent: sql<number>`sum(case when ${mediaLibrary.isActive} then 1 else 0 end)`,
			rejectedContent: sql<number>`sum(case when ${mediaLibrary.status} = 'rejected' then 1 else 0 end)`,
			totalViews: sql<number>`coalesce(sum(${mediaLibrary.viewCount}), 0)`
		})
		.from(mediaLibrary);

	const [creatorStats] = await db
		.select({
			totalCreators: sql<number>`count(*)`
		})
		.from(user)
		.where(eq(user.role, 'creator'));

	const now = new Date();
	const startOf7 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
	const startOf30 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

	const [applicationStats] = await db
		.select({
			pendingApplications: sql<number>`sum(case when ${creatorApplications.status} = 'pending' then 1 else 0 end)`,
			approved7: sql<number>`sum(case when ${creatorApplications.status} = 'approved' and ${creatorApplications.reviewedAt} >= ${startOf7} then 1 else 0 end)`,
			approved30: sql<number>`sum(case when ${creatorApplications.status} = 'approved' and ${creatorApplications.reviewedAt} >= ${startOf30} then 1 else 0 end)`,
			avgApprovalHours: sql<number>`avg(extract(epoch from (${creatorApplications.reviewedAt} - ${creatorApplications.createdAt})))/3600`
		})
		.from(creatorApplications);

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
