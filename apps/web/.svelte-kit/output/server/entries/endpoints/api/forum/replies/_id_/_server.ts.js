import { N as forumReplies, P as forumThreads, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";
//#region src/routes/api/forum/replies/[id]/+server.ts
/**
* DELETE /api/forum/replies/[id] — soft-delete a reply (author or admin).
* Decrements the thread's reply_count when the reply was visible.
*/
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [reply] = await db.select({
		id: forumReplies.id,
		authorId: forumReplies.authorId,
		threadId: forumReplies.threadId,
		status: forumReplies.status
	}).from(forumReplies).where(eq(forumReplies.id, params.id)).limit(1);
	if (!reply) return json({ error: "Reply not found" }, { status: 404 });
	const isAuthor = reply.authorId === session.user.id;
	const isAdmin = session.user.role === "admin";
	if (!isAuthor && !isAdmin) return json({ error: "Forbidden" }, { status: 403 });
	if (reply.status === "removed") return json({
		success: true,
		alreadyRemoved: true
	});
	await db.update(forumReplies).set({
		status: "removed",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(forumReplies.id, reply.id));
	if (reply.status === "published") await db.update(forumThreads).set({ replyCount: sql`GREATEST(${forumThreads.replyCount} - 1, 0)` }).where(eq(forumThreads.id, reply.threadId));
	return json({ success: true });
};
//#endregion
export { DELETE };
