import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { forumReplies, forumThreads, abuseReports } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * PATCH /api/creator/moderation/forum/replies/[id]
 *
 * Body: { action: 'hide' }
 *
 * Ownership: the reply must live on a thread the creator authored.
 * Resolves any open abuse reports against the reply as a side effect.
 */

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({})) as { action?: string };
	if (body.action !== 'hide') {
		return json({ error: 'Invalid action' }, { status: 400 });
	}

	const [row] = await db
		.select({
			id: forumReplies.id,
			threadAuthorId: forumThreads.authorId
		})
		.from(forumReplies)
		.leftJoin(forumThreads, eq(forumReplies.threadId, forumThreads.id))
		.where(eq(forumReplies.id, params.id!))
		.limit(1);

	if (!row) return json({ error: 'Not found' }, { status: 404 });
	if (row.threadAuthorId !== session.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	await db.update(forumReplies)
		.set({ status: 'hidden' })
		.where(eq(forumReplies.id, row.id));

	await db.update(abuseReports)
		.set({
			status: 'resolved',
			resolution: 'hidden',
			resolvedBy: session.user.id,
			resolvedAt: new Date()
		})
		.where(and(
			eq(abuseReports.targetType, 'forum_reply'),
			eq(abuseReports.targetId, row.id),
			eq(abuseReports.status, 'open')
		));

	return json({ success: true });
};
