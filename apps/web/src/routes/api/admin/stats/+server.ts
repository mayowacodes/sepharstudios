import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creatorApplications, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	// Each sub-query is wrapped so a missing/out-of-sync table on this
	// host doesn't 500 the entire admin dashboard.
	let contentStats: { pendingReviews?: number; publishedContent?: number; rejectedContent?: number; totalViews?: number } | undefined;
	try {
		[contentStats] = await db
			.select({
				pendingReviews: sql<number>`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
				publishedContent: sql<number>`sum(case when ${mediaLibrary.isActive} then 1 else 0 end)`,
				rejectedContent: sql<number>`sum(case when ${mediaLibrary.status} = 'rejected' then 1 else 0 end)`,
				totalViews: sql<number>`coalesce(sum(${mediaLibrary.viewCount}), 0)`
			})
			.from(mediaLibrary);
	} catch (err) {
		console.warn('[api/admin/stats] media_library query failed:', err);
	}

	let creatorStats: { totalCreators?: number } | undefined;
	try {
		[creatorStats] = await db
			.select({
				totalCreators: sql<number>`count(*)`
			})
			.from(user)
			.where(eq(user.role, 'creator'));
	} catch (err) {
		console.warn('[api/admin/stats] user query failed:', err);
	}

	const now = new Date();
	const startOf7 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
	const startOf30 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

	let applicationStats: { pendingApplications?: number; approved7?: number; approved30?: number; avgApprovalHours?: number } | undefined;
	try {
		[applicationStats] = await db
			.select({
				pendingApplications: sql<number>`sum(case when ${creatorApplications.status} = 'pending' then 1 else 0 end)`,
				approved7: sql<number>`sum(case when ${creatorApplications.status} = 'approved' and ${creatorApplications.reviewedAt} >= ${startOf7} then 1 else 0 end)`,
				approved30: sql<number>`sum(case when ${creatorApplications.status} = 'approved' and ${creatorApplications.reviewedAt} >= ${startOf30} then 1 else 0 end)`,
				avgApprovalHours: sql<number>`avg(extract(epoch from (${creatorApplications.reviewedAt} - ${creatorApplications.createdAt})))/3600`
			})
			.from(creatorApplications);
	} catch (err) {
		console.warn('[api/admin/stats] creator_applications query failed:', err);
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
