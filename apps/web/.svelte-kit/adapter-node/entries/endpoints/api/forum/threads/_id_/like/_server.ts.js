import { C as forumLikes, T as forumThreads, t as db } from "../../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
//#region src/routes/api/forum/threads/[id]/like/+server.ts
/**
* POST   /api/forum/threads/[id]/like — like (idempotent)
* DELETE /api/forum/threads/[id]/like — unlike (idempotent)
*/
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [thread] = await db.select({ id: forumThreads.id }).from(forumThreads).where(eq(forumThreads.id, params.id)).limit(1);
	if (!thread) return json({ error: "Thread not found" }, { status: 404 });
	if ((await db.insert(forumLikes).values({
		userId: session.user.id,
		threadId: thread.id
	}).onConflictDoNothing().returning({ id: forumLikes.id })).length > 0) await db.update(forumThreads).set({ likeCount: sql`${forumThreads.likeCount} + 1` }).where(eq(forumThreads.id, thread.id));
	const [row] = await db.select({ likeCount: forumThreads.likeCount }).from(forumThreads).where(eq(forumThreads.id, thread.id)).limit(1);
	return json({
		success: true,
		liked: true,
		likeCount: Number(row?.likeCount ?? 0)
	});
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.delete(forumLikes).where(and(eq(forumLikes.userId, session.user.id), eq(forumLikes.threadId, params.id))).returning({ id: forumLikes.id })).length > 0) await db.update(forumThreads).set({ likeCount: sql`GREATEST(${forumThreads.likeCount} - 1, 0)` }).where(eq(forumThreads.id, params.id));
	const [row] = await db.select({ likeCount: forumThreads.likeCount }).from(forumThreads).where(eq(forumThreads.id, params.id)).limit(1);
	return json({
		success: true,
		liked: false,
		likeCount: Number(row?.likeCount ?? 0)
	});
};
//#endregion
export { DELETE, POST };
