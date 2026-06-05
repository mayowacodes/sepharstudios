import { w as db, M as mediaLibrary, ag as user, a3 as reviews, a as abuseReports } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, inArray, desc, sql, and } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
	const reportRows = await db.select({
		targetId: abuseReports.targetId,
		count: sql`count(*)::int`
	}).from(abuseReports).where(and(eq(abuseReports.targetType, "review"), eq(abuseReports.status, "open"), inArray(abuseReports.targetId, rows.map((r) => r.id)))).groupBy(abuseReports.targetId);
	const reportMap = new Map(reportRows.map((r) => [r.targetId, Number(r.count)]));
	const enriched = rows.map((r) => ({
		...r,
		content: contentMap.get(r.contentId) ?? null,
		openReports: reportMap.get(r.id) ?? 0
	}));
	return json({ reviews: filter === "pending" ? enriched.filter((r) => !r.isApproved) : filter === "flagged" ? enriched.filter((r) => r.openReports > 0) : enriched });
};

export { GET };
//# sourceMappingURL=_server.ts-BYNkiPHc.js.map
