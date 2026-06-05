import { a as abuseReports, w as db, ag as user, a3 as reviews, E as forumThreads, D as forumReplies, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, and, sql, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/abuse/+server.ts
/**
* GET /api/admin/abuse — admin abuse queue.
*
* Query: `?status=open|all|resolved` (default open), `?countOnly=1` for the
* bell badge, `?targetType=` to narrow by type.
*
* Each row is enriched with the target's preview text so the admin can
* triage without clicking through to the source surface.
*/
async function previewFor(targetType, targetId) {
	if (targetType === "review") {
		const [r] = await db.select({ text: reviews.reviewText }).from(reviews).where(eq(reviews.id, targetId)).limit(1);
		return r?.text ?? null;
	}
	if (targetType === "forum_thread") {
		const [r] = await db.select({
			title: forumThreads.title,
			body: forumThreads.body
		}).from(forumThreads).where(eq(forumThreads.id, targetId)).limit(1);
		return r ? `${r.title} — ${r.body.slice(0, 200)}` : null;
	}
	if (targetType === "forum_reply") {
		const [r] = await db.select({ body: forumReplies.body }).from(forumReplies).where(eq(forumReplies.id, targetId)).limit(1);
		return r?.body ?? null;
	}
	if (targetType === "content") {
		const [r] = await db.select({ title: mediaLibrary.title }).from(mediaLibrary).where(eq(mediaLibrary.id, targetId)).limit(1);
		return r?.title ?? null;
	}
	if (targetType === "user") {
		const [r] = await db.select({
			name: user.name,
			email: user.email
		}).from(user).where(eq(user.id, targetId)).limit(1);
		return r ? `${r.name} (${r.email})` : null;
	}
	return null;
}
var GET = async ({ url, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const status = url.searchParams.get("status") ?? "open";
	const targetType = url.searchParams.get("targetType");
	const countOnly = url.searchParams.get("countOnly") === "1";
	const conditions = [];
	if (status !== "all") conditions.push(eq(abuseReports.status, status));
	if (targetType) conditions.push(eq(abuseReports.targetType, targetType));
	const where = conditions.length > 0 ? and(...conditions) : void 0;
	if (countOnly) {
		const [row] = await db.select({ count: sql`count(*)::int` }).from(abuseReports).where(where);
		return json({ count: Number(row?.count ?? 0) });
	}
	const rows = await db.select({
		id: abuseReports.id,
		reporterId: abuseReports.reporterId,
		targetType: abuseReports.targetType,
		targetId: abuseReports.targetId,
		category: abuseReports.category,
		description: abuseReports.description,
		status: abuseReports.status,
		resolution: abuseReports.resolution,
		createdAt: abuseReports.createdAt,
		resolvedAt: abuseReports.resolvedAt,
		reporterName: user.name,
		reporterEmail: user.email
	}).from(abuseReports).leftJoin(user, eq(abuseReports.reporterId, user.id)).where(where).orderBy(desc(abuseReports.createdAt)).limit(200);
	return json({ reports: await Promise.all(rows.map(async (r) => ({
		...r,
		preview: await previewFor(r.targetType, r.targetId)
	}))) });
};

export { GET };
//# sourceMappingURL=_server.ts-D6zVimNX.js.map
