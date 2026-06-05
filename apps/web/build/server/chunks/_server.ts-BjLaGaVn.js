import { w as db, E as forumThreads, ag as user, D as forumReplies, a as abuseReports } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc, inArray, sql, and } from 'drizzle-orm';
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
	const reportRows = await db.select({
		targetId: abuseReports.targetId,
		count: sql`count(*)::int`
	}).from(abuseReports).where(and(eq(abuseReports.targetType, "forum_reply"), eq(abuseReports.status, "open"), inArray(abuseReports.targetId, replies.map((r) => r.id)))).groupBy(abuseReports.targetId);
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
//# sourceMappingURL=_server.ts-BjLaGaVn.js.map
