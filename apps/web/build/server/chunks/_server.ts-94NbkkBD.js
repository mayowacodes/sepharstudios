import { d as db, f as forumThreads, c as user, e as forumReplies, b as abuseReports } from './drizzle-C3SH12nS.js';
import { R as Role } from './constants-BiiFHz9b.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, desc, inArray, sql, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

//#region src/routes/api/creator/moderation/forum/+server.ts
/**
* GET /api/creator/moderation/forum
*
* Returns the creator's own forum threads + the replies on those threads.
* Replies tagged with `openReports` if anyone flagged them. Lets a creator
* self-moderate their own discussions.
*/
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const threads = await db.select().from(forumThreads).where(eq(forumThreads.authorId, session.user.id)).orderBy(desc(forumThreads.createdAt)).limit(100);
	if (threads.length === 0) return json({
		threads: [],
		replies: []
	});
	const threadIds = threads.map((t) => t.id);
	const replies = await db.select({
		id: forumReplies.id,
		threadId: forumReplies.threadId,
		authorId: forumReplies.authorId,
		body: forumReplies.body,
		status: forumReplies.status,
		likeCount: forumReplies.likeCount,
		createdAt: forumReplies.createdAt,
		authorName: user.name
	}).from(forumReplies).leftJoin(user, eq(forumReplies.authorId, user.id)).where(inArray(forumReplies.threadId, threadIds)).orderBy(desc(forumReplies.createdAt));
	const replyIds = replies.map((r) => r.id);
	const reportRows = replyIds.length === 0 ? [] : await db.select({
		targetId: abuseReports.targetId,
		count: sql`count(*)::int`
	}).from(abuseReports).where(and(eq(abuseReports.targetType, "forum_reply"), eq(abuseReports.status, "open"), inArray(abuseReports.targetId, replyIds))).groupBy(abuseReports.targetId);
	const reportMap = new Map(reportRows.map((r) => [r.targetId, Number(r.count)]));
	return json({
		threads,
		replies: replies.map((r) => ({
			...r,
			openReports: reportMap.get(r.id) ?? 0
		}))
	});
};

export { GET };
//# sourceMappingURL=_server.ts-94NbkkBD.js.map
