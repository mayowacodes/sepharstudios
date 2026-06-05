import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import {
	forumThreads,
	forumReplies,
	abuseReports
} from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * GET /api/creator/moderation/forum
 *
 * Returns the creator's own forum threads + the replies on those threads.
 * Replies tagged with `openReports` if anyone flagged them. Lets a creator
 * self-moderate their own discussions.
 */

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const threads = await db
		.select()
		.from(forumThreads)
		.where(eq(forumThreads.authorId, session.user.id))
		.orderBy(desc(forumThreads.createdAt))
		.limit(100);

	if (threads.length === 0) {
		return json({ threads: [], replies: [] });
	}

	const threadIds = threads.map((t) => t.id);

	const replies = await db
		.select({
			id: forumReplies.id,
			threadId: forumReplies.threadId,
			authorId: forumReplies.authorId,
			body: forumReplies.body,
			status: forumReplies.status,
			likeCount: forumReplies.likeCount,
			createdAt: forumReplies.createdAt,
			authorName: user.name
		})
		.from(forumReplies)
		.leftJoin(user, eq(forumReplies.authorId, user.id))
		.where(inArray(forumReplies.threadId, threadIds))
		.orderBy(desc(forumReplies.createdAt));

	// Drizzle's `inArray()` throws on an empty list, so a creator whose
	// threads have no replies would crash this endpoint with a 500 and
	// blank the moderation page. Guard the no-replies branch.
	const replyIds = replies.map((r) => r.id);
	const reportRows = replyIds.length === 0
		? []
		: await db
			.select({
				targetId: abuseReports.targetId,
				count: sql<number>`count(*)::int`
			})
			.from(abuseReports)
			.where(and(
				eq(abuseReports.targetType, 'forum_reply'),
				eq(abuseReports.status, 'open'),
				inArray(abuseReports.targetId, replyIds)
			))
			.groupBy(abuseReports.targetId);
	const reportMap = new Map(reportRows.map((r) => [r.targetId, Number(r.count)]));

	const enrichedReplies = replies.map((r) => ({
		...r,
		openReports: reportMap.get(r.id) ?? 0
	}));

	return json({ threads, replies: enrichedReplies });
};
