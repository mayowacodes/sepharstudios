import { d as db, f as forumThreads, c as user, e as forumReplies, b as abuseReports } from './drizzle-CsnNxG5m.js';
import { R as Role } from './constants-DSOCQRom.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq, desc, inArray, sql, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

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
//# sourceMappingURL=_server.ts-MSEFPCUV.js.map
