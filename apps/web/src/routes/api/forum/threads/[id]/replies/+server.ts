import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { forumThreads, forumReplies } from '$lib/db/schema/sepharstudios';
import { eq, sql } from 'drizzle-orm';
import { take } from '$lib/server/rate-limit';
import { moderateComment } from '$lib/server/ai-moderation';
import { notify } from '$lib/server/notify';

/**
 * POST /api/forum/threads/[id]/replies  { body, parentReplyId? }
 *
 * AI-moderates the reply text. Bumps thread reply_count + last_reply_at
 * atomically. If parentReplyId is provided, notifies that reply's author.
 * Always notifies the thread author (unless they're replying to themselves).
 */

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const limit = await take(`forum-reply:${session.user.id}`, { capacity: 10, refillPerSec: 1 / 60 });
	if (!limit.allowed) return json({ error: 'Slow down — try again in a minute.' }, { status: 429 });

	const body = await request.json().catch(() => ({})) as { body?: string; parentReplyId?: string };
	const text = body.body?.trim() ?? '';
	if (!text || text.length < 3) return json({ error: 'Reply is too short.' }, { status: 400 });
	if (text.length > 5000) return json({ error: 'Reply is too long (max 5000 chars).' }, { status: 400 });

	const [thread] = await db.select({
		id: forumThreads.id,
		authorId: forumThreads.authorId,
		title: forumThreads.title,
		isLocked: forumThreads.isLocked,
		status: forumThreads.status
	})
		.from(forumThreads)
		.where(eq(forumThreads.id, params.id!))
		.limit(1);
	if (!thread || thread.status === 'removed') return json({ error: 'Thread not found' }, { status: 404 });
	if (thread.isLocked) return json({ error: 'Thread is locked.' }, { status: 403 });

	// Validate parentReplyId belongs to this thread if supplied.
	let parentReply: { id: string; authorId: string } | null = null;
	if (body.parentReplyId) {
		const [p] = await db.select({
			id: forumReplies.id,
			authorId: forumReplies.authorId,
			threadId: forumReplies.threadId
		})
			.from(forumReplies)
			.where(eq(forumReplies.id, body.parentReplyId))
			.limit(1);
		if (!p || p.threadId !== thread.id) {
			return json({ error: 'Parent reply not found.' }, { status: 400 });
		}
		parentReply = p;
	}

	const verdict = await moderateComment(text, thread.title).catch(() => null);
	if (verdict?.verdict === 'reject') {
		return json({ error: 'Your reply was rejected by automated moderation. Please rephrase.' }, { status: 400 });
	}
	const status = verdict?.verdict === 'flag' ? 'hidden' : 'published';

	const now = new Date();
	const [reply] = await db.insert(forumReplies).values({
		threadId: thread.id,
		authorId: session.user.id,
		parentReplyId: parentReply?.id ?? null,
		body: text,
		status
	}).returning({ id: forumReplies.id, status: forumReplies.status });

	// Only count published replies toward the visible reply_count.
	if (status === 'published') {
		await db.update(forumThreads)
			.set({
				replyCount: sql`${forumThreads.replyCount} + 1`,
				lastReplyAt: now,
				updatedAt: now
			})
			.where(eq(forumThreads.id, thread.id));
	}

	// Notifications — best-effort, never block the response.
	const notifyTargets = new Set<string>();
	if (parentReply && parentReply.authorId !== session.user.id) {
		notifyTargets.add(parentReply.authorId);
	}
	if (thread.authorId !== session.user.id) notifyTargets.add(thread.authorId);
	for (const userId of notifyTargets) {
		notify({
			userId,
			kind: 'system',
			title: `New reply on "${thread.title.slice(0, 60)}"`,
			message: text.slice(0, 200),
			actionUrl: `/creator/forum/${thread.id}`
		}).catch(() => undefined);
	}

	return json({ success: true, id: reply.id, status: reply.status });
};
