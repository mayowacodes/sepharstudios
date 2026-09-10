import { d as db, m as mediaLibrary, c as user, r as reviews, b as abuseReports } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq, inArray, desc, sql, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

//#region src/routes/api/creator/moderation/reviews/+server.ts
/**
* GET /api/creator/moderation/reviews
*
* Returns reviews on the signed-in creator's content. The list includes
* pending (`isApproved=false`) and flagged (at least one open abuse report)
* reviews — those are the ones the creator can actually act on.
*
* Query: `?filter=pending|flagged|all` (default `pending`)
*/
var GET = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const filter = url.searchParams.get("filter") ?? "pending";
	const myContent = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		thumbnail: mediaLibrary.thumbnail
	}).from(mediaLibrary).where(eq(mediaLibrary.creatorId, session.user.id));
	if (myContent.length === 0) return json({ reviews: [] });
	const contentIds = myContent.map((c) => c.id);
	const contentMap = new Map(myContent.map((c) => [c.id, c]));
	const rows = await db.select({
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
	}).from(reviews).leftJoin(user, eq(reviews.userId, user.id)).where(inArray(reviews.contentId, contentIds)).orderBy(desc(reviews.createdAt)).limit(200);
	const reviewIds = rows.map((r) => r.id);
	const reportRows = reviewIds.length === 0 ? [] : await db.select({
		targetId: abuseReports.targetId,
		count: sql`count(*)::int`
	}).from(abuseReports).where(and(eq(abuseReports.targetType, "review"), eq(abuseReports.status, "open"), inArray(abuseReports.targetId, reviewIds))).groupBy(abuseReports.targetId);
	const reportMap = new Map(reportRows.map((r) => [r.targetId, Number(r.count)]));
	const enriched = rows.map((r) => ({
		...r,
		content: contentMap.get(r.contentId) ?? null,
		openReports: reportMap.get(r.id) ?? 0
	}));
	return json({ reviews: filter === "pending" ? enriched.filter((r) => !r.isApproved) : filter === "flagged" ? enriched.filter((r) => r.openReports > 0) : enriched });
};

export { GET };
//# sourceMappingURL=_server.ts-C3IWg1g7.js.map
