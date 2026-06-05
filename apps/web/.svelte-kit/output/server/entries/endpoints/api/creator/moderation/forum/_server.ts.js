import { N as forumReplies, P as forumThreads, a as user, o as abuseReports, t as db } from "../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
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
//#endregion
export { GET };
