import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { forumThreads, forumReplies, forumLikes } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';

interface ReplyNode {
	id: string;
	threadId: string;
	parentReplyId: string | null;
	authorId: string;
	authorName: string | null;
	authorImage: string | null;
	body: string;
	likeCount: number;
	status: string;
	createdAt: Date;
	likedByMe: boolean;
	children: ReplyNode[];
}

/**
 * GET    /api/forum/threads/[id] — full thread + nested replies + my-likes
 * DELETE /api/forum/threads/[id] — soft-delete (author or admin)
 */

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();

	const [thread] = await db.select({
		id: forumThreads.id,
		authorId: forumThreads.authorId,
		title: forumThreads.title,
		category: forumThreads.category,
		body: forumThreads.body,
		isSticky: forumThreads.isSticky,
		isLocked: forumThreads.isLocked,
		likeCount: forumThreads.likeCount,
		replyCount: forumThreads.replyCount,
		status: forumThreads.status,
		createdAt: forumThreads.createdAt,
		authorName: user.name,
		authorImage: user.image
	})
		.from(forumThreads)
		.leftJoin(user, eq(user.id, forumThreads.authorId))
		.where(eq(forumThreads.id, params.id!))
		.limit(1);

	if (!thread || thread.status === 'removed') {
		return json({ error: 'Thread not found' }, { status: 404 });
	}

	const replyRows = await db.select({
		id: forumReplies.id,
		threadId: forumReplies.threadId,
		parentReplyId: forumReplies.parentReplyId,
		authorId: forumReplies.authorId,
		body: forumReplies.body,
		likeCount: forumReplies.likeCount,
		status: forumReplies.status,
		createdAt: forumReplies.createdAt,
		authorName: user.name,
		authorImage: user.image
	})
		.from(forumReplies)
		.leftJoin(user, eq(user.id, forumReplies.authorId))
		.where(eq(forumReplies.threadId, thread.id))
		.orderBy(asc(forumReplies.createdAt));

	// Figure out which of these the current user has liked, plus whether they
	// liked the thread itself.
	let likedReplyIds = new Set<string>();
	let likedThread = false;
	if (session?.user.id && replyRows.length > 0) {
		const ids = replyRows.map((r) => r.id);
		const myLikes = await db.select({ replyId: forumLikes.replyId })
			.from(forumLikes)
			.where(and(eq(forumLikes.userId, session.user.id), inArray(forumLikes.replyId, ids)));
		likedReplyIds = new Set(myLikes.map((l) => l.replyId).filter((v): v is string => !!v));
	}
	if (session?.user.id) {
		const [tLike] = await db.select({ id: forumLikes.id })
			.from(forumLikes)
			.where(and(eq(forumLikes.userId, session.user.id), eq(forumLikes.threadId, thread.id)))
			.limit(1);
		likedThread = !!tLike;
	}

	// Build nested tree. Skip removed branches' children (preserve placeholders
	// so reply chains don't collapse confusingly).
	const byId = new Map<string, ReplyNode>();
	const roots: ReplyNode[] = [];
	for (const r of replyRows) {
		byId.set(r.id, {
			id: r.id,
			threadId: r.threadId,
			parentReplyId: r.parentReplyId,
			authorId: r.authorId,
			authorName: r.authorName,
			authorImage: r.authorImage,
			body: r.status === 'removed' ? '[removed]' : r.body,
			likeCount: r.likeCount,
			status: r.status,
			createdAt: r.createdAt,
			likedByMe: likedReplyIds.has(r.id),
			children: []
		});
	}
	for (const r of replyRows) {
		const node = byId.get(r.id)!;
		if (r.parentReplyId && byId.has(r.parentReplyId)) {
			byId.get(r.parentReplyId)!.children.push(node);
		} else {
			roots.push(node);
		}
	}

	return json({
		thread: { ...thread, likedByMe: likedThread },
		replies: roots,
		isAuthor: session?.user.id === thread.authorId,
		isAdmin: session?.user.role === 'admin'
	});
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [thread] = await db.select({ authorId: forumThreads.authorId })
		.from(forumThreads)
		.where(eq(forumThreads.id, params.id!))
		.limit(1);
	if (!thread) return json({ error: 'Thread not found' }, { status: 404 });

	const isAuthor = thread.authorId === session.user.id;
	const isAdmin = session.user.role === 'admin';
	if (!isAuthor && !isAdmin) return json({ error: 'Forbidden' }, { status: 403 });

	await db.update(forumThreads)
		.set({ status: 'removed', updatedAt: new Date() })
		.where(eq(forumThreads.id, params.id!));

	return json({ success: true });
};
