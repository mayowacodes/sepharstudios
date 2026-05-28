import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { sql } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const rows = await db
		.select({
			totalProcessed: sql<number>`sum(case when ${mediaLibrary.status} in ('approved','published','rejected') then 1 else 0 end)`,
			pendingReviews: sql<number>`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
			approved: sql<number>`sum(case when ${mediaLibrary.status} in ('approved','published') then 1 else 0 end)`,
			rejected: sql<number>`sum(case when ${mediaLibrary.status} = 'rejected' then 1 else 0 end)`,
			avgSeconds: sql<number>`avg(extract(epoch from (${mediaLibrary.reviewedAt} - ${mediaLibrary.createdAt})))`
		})
		.from(mediaLibrary);

	const stats = rows[0];
	const reviewedTotal = Number(stats?.approved ?? 0) + Number(stats?.rejected ?? 0);
	const approvalRate = reviewedTotal > 0 ? Math.round((Number(stats?.approved ?? 0) / reviewedTotal) * 100) : 0;
	const avgDays = stats?.avgSeconds ? Number(stats.avgSeconds) / 86400 : 0;

	return json({
		totalProcessed: Number(stats?.totalProcessed ?? 0),
		avgProcessingTime: Number(avgDays.toFixed(1)),
		approvalRate,
		pendingReviews: Number(stats?.pendingReviews ?? 0)
	});
};
