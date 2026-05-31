import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, transactions } from '$lib/db/schema/sepharstudios';
import { eq, sql } from 'drizzle-orm';
import { Role } from '$lib/constants';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const creatorId = session.user.id;
	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

	// Each query is independently fault-tolerant — when a downstream table
	// is missing (DB out of sync with the latest migrations on this host)
	// we log + fall back to zero rather than 500ing the whole dashboard.
	let counts: { totalContent?: number; published?: number; pendingReview?: number; totalViews?: number } | undefined;
	try {
		[counts] = await db
			.select({
				totalContent: sql<number>`count(*)`,
				published: sql<number>`sum(case when ${mediaLibrary.isActive} then 1 else 0 end)`,
				pendingReview: sql<number>`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
				totalViews: sql<number>`coalesce(sum(${mediaLibrary.viewCount}), 0)`
			})
			.from(mediaLibrary)
			.where(eq(mediaLibrary.creatorId, creatorId));
	} catch (err) {
		console.warn('[api/creator/stats] media_library query failed:', err);
	}

	let monthlyEarnings = 0;
	try {
		const [earningsRow] = await db
			.select({
				monthlyEarnings: sql<number>`coalesce(sum(${transactions.amount}), 0)`
			})
			.from(transactions)
			.where(
				sql`${transactions.userId} = ${creatorId} and ${transactions.type} = 'earn' and ${transactions.createdAt} >= ${monthStart}`
			);
		monthlyEarnings = Number(earningsRow?.monthlyEarnings ?? 0);
	} catch (err) {
		console.warn('[api/creator/stats] transactions query failed:', err);
	}

	return json({
		totalContent: Number(counts?.totalContent ?? 0),
		published: Number(counts?.published ?? 0),
		pendingReview: Number(counts?.pendingReview ?? 0),
		totalViews: Number(counts?.totalViews ?? 0),
		monthlyEarnings
	});
};
