import { w as db, C as forumLikes, E as forumThreads } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq, sql } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

export { DELETE, POST };
//# sourceMappingURL=_server.ts-G8Nv0yw8.js.map
