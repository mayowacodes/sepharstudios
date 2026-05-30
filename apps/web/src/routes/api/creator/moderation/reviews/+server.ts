import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import {
	reviews,
	mediaLibrary,
	abuseReports
} from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * GET /api/creator/moderation/reviews
 *
 * Returns reviews on the signed-in creator's content. The list includes
 * pending (`isApproved=false`) and flagged (at least one open abuse report)
 * reviews — those are the ones the creator can actually act on.
 *
 * Query: `?filter=pending|flagged|all` (default `pending`)
 */

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const filter = url.searchParams.get('filter') ?? 'pending';

	// All content this creator owns. Narrows the review query so we never
	// surface reviews on someone else's content.
	const myContent = await db
		.select({ id: mediaLibrary.id, title: mediaLibrary.title, thumbnail: mediaLibrary.thumbnail })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.creatorId, session.user.id));
	if (myContent.length === 0) return json({ reviews: [] });

	const contentIds = myContent.map((c) => c.id);
	const contentMap = new Map(myContent.map((c) => [c.id, c]));

	const rows = await db
		.select({
			id: reviews.id,
			contentId: reviews.contentId,
			userId: reviews.userId,
			rating: reviews.rating,
			reviewText: reviews.reviewText,
			isApproved: reviews.isApproved,
			helpfulCount: reviews.helpfulCount,
			createdAt: reviews.createdAt,
			reviewerName: user.name,
			reviewerImage: user.image
		})
		.from(reviews)
		.leftJoin(user, eq(reviews.userId, user.id))
		.where(inArray(reviews.contentId, contentIds))
		.orderBy(desc(reviews.createdAt))
		.limit(200);

	// Open reports keyed by review id — used to tag rows + to drive the
	// "flagged" filter without joining (the reports table can be sparse).
	const reportRows = await db
		.select({
			targetId: abuseReports.targetId,
			count: sql<number>`count(*)::int`
		})
		.from(abuseReports)
		.where(and(
			eq(abuseReports.targetType, 'review'),
			eq(abuseReports.status, 'open'),
			inArray(abuseReports.targetId, rows.map((r) => r.id))
		))
		.groupBy(abuseReports.targetId);
	const reportMap = new Map(reportRows.map((r) => [r.targetId, Number(r.count)]));

	const enriched = rows.map((r) => ({
		...r,
		content: contentMap.get(r.contentId) ?? null,
		openReports: reportMap.get(r.id) ?? 0
	}));

	const filtered = filter === 'pending'
		? enriched.filter((r) => !r.isApproved)
		: filter === 'flagged'
			? enriched.filter((r) => r.openReports > 0)
			: enriched;

	return json({ reviews: filtered });
};
