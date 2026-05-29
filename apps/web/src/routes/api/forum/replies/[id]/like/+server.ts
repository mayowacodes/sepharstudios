import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { forumReplies, forumLikes } from '$lib/db/schema/sepharstudios';
import { and, eq, sql } from 'drizzle-orm';

export const POST: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [reply] = await db.select({ id: forumReplies.id })
		.from(forumReplies)
		.where(eq(forumReplies.id, params.id!))
		.limit(1);
	if (!reply) return json({ error: 'Reply not found' }, { status: 404 });

	const inserted = await db.insert(forumLikes).values({
		userId: session.user.id,
		replyId: reply.id
	}).onConflictDoNothing().returning({ id: forumLikes.id });

	if (inserted.length > 0) {
		await db.update(forumReplies)
			.set({ likeCount: sql`${forumReplies.likeCount} + 1` })
			.where(eq(forumReplies.id, reply.id));
	}

	const [row] = await db.select({ likeCount: forumReplies.likeCount })
		.from(forumReplies)
		.where(eq(forumReplies.id, reply.id))
		.limit(1);

	return json({ success: true, liked: true, likeCount: Number(row?.likeCount ?? 0) });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const removed = await db.delete(forumLikes)
		.where(and(eq(forumLikes.userId, session.user.id), eq(forumLikes.replyId, params.id!)))
		.returning({ id: forumLikes.id });

	if (removed.length > 0) {
		await db.update(forumReplies)
			.set({ likeCount: sql`GREATEST(${forumReplies.likeCount} - 1, 0)` })
			.where(eq(forumReplies.id, params.id!));
	}

	const [row] = await db.select({ likeCount: forumReplies.likeCount })
		.from(forumReplies)
		.where(eq(forumReplies.id, params.id!))
		.limit(1);

	return json({ success: true, liked: false, likeCount: Number(row?.likeCount ?? 0) });
};
