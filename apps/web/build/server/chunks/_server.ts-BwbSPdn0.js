import { n as db, v as forumThreads, a0 as user, u as forumReplies, t as forumLikes } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, asc, and, inArray } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/forum/threads/[id]/+server.ts
/**
* GET    /api/forum/threads/[id] — full thread + nested replies + my-likes
* DELETE /api/forum/threads/[id] — soft-delete (author or admin)
*/
var GET = async ({ params, locals }) => {
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
	}).from(forumThreads).leftJoin(user, eq(user.id, forumThreads.authorId)).where(eq(forumThreads.id, params.id)).limit(1);
	if (!thread || thread.status === "removed") return json({ error: "Thread not found" }, { status: 404 });
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
	}).from(forumReplies).leftJoin(user, eq(user.id, forumReplies.authorId)).where(eq(forumReplies.threadId, thread.id)).orderBy(asc(forumReplies.createdAt));
	let likedReplyIds = /* @__PURE__ */ new Set();
	let likedThread = false;
	if (session?.user.id && replyRows.length > 0) {
		const ids = replyRows.map((r) => r.id);
		const myLikes = await db.select({ replyId: forumLikes.replyId }).from(forumLikes).where(and(eq(forumLikes.userId, session.user.id), inArray(forumLikes.replyId, ids)));
		likedReplyIds = new Set(myLikes.map((l) => l.replyId).filter((v) => !!v));
	}
	if (session?.user.id) {
		const [tLike] = await db.select({ id: forumLikes.id }).from(forumLikes).where(and(eq(forumLikes.userId, session.user.id), eq(forumLikes.threadId, thread.id))).limit(1);
		likedThread = !!tLike;
	}
	const byId = /* @__PURE__ */ new Map();
	const roots = [];
	for (const r of replyRows) byId.set(r.id, {
		id: r.id,
		threadId: r.threadId,
		parentReplyId: r.parentReplyId,
		authorId: r.authorId,
		authorName: r.authorName,
		authorImage: r.authorImage,
		body: r.status === "removed" ? "[removed]" : r.body,
		likeCount: r.likeCount,
		status: r.status,
		createdAt: r.createdAt,
		likedByMe: likedReplyIds.has(r.id),
		children: []
	});
	for (const r of replyRows) {
		const node = byId.get(r.id);
		if (r.parentReplyId && byId.has(r.parentReplyId)) byId.get(r.parentReplyId).children.push(node);
		else roots.push(node);
	}
	return json({
		thread: {
			...thread,
			likedByMe: likedThread
		},
		replies: roots,
		isAuthor: session?.user.id === thread.authorId,
		isAdmin: session?.user.role === "admin"
	});
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [thread] = await db.select({ authorId: forumThreads.authorId }).from(forumThreads).where(eq(forumThreads.id, params.id)).limit(1);
	if (!thread) return json({ error: "Thread not found" }, { status: 404 });
	const isAuthor = thread.authorId === session.user.id;
	const isAdmin = session.user.role === "admin";
	if (!isAuthor && !isAdmin) return json({ error: "Forbidden" }, { status: 403 });
	await db.update(forumThreads).set({
		status: "removed",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(forumThreads.id, params.id));
	return json({ success: true });
};

export { DELETE, GET };
//# sourceMappingURL=_server.ts-BwbSPdn0.js.map
