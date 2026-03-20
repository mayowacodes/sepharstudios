import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq, sql } from 'drizzle-orm';

async function requireAdmin(locals: App.Locals) {
	const session = await locals.auth.getSession();
	if (!session) return { error: json({ error: 'Unauthorized' }, { status: 401 }) };
	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return { error: json({ error: 'Forbidden' }, { status: 403 }) };
	return { error: null };
}

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
