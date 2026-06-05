import { w as db, C as forumLikes, D as forumReplies } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq, sql } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/forum/replies/[id]/like/+server.ts
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [reply] = await db.select({ id: forumReplies.id }).from(forumReplies).where(eq(forumReplies.id, params.id)).limit(1);
	if (!reply) return json({ error: "Reply not found" }, { status: 404 });
	if ((await db.insert(forumLikes).values({
		userId: session.user.id,
		replyId: reply.id
	}).onConflictDoNothing().returning({ id: forumLikes.id })).length > 0) await db.update(forumReplies).set({ likeCount: sql`${forumReplies.likeCount} + 1` }).where(eq(forumReplies.id, reply.id));
	const [row] = await db.select({ likeCount: forumReplies.likeCount }).from(forumReplies).where(eq(forumReplies.id, reply.id)).limit(1);
	return json({
		success: true,
		liked: true,
		likeCount: Number(row?.likeCount ?? 0)
	});
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.delete(forumLikes).where(and(eq(forumLikes.userId, session.user.id), eq(forumLikes.replyId, params.id))).returning({ id: forumLikes.id })).length > 0) await db.update(forumReplies).set({ likeCount: sql`GREATEST(${forumReplies.likeCount} - 1, 0)` }).where(eq(forumReplies.id, params.id));
	const [row] = await db.select({ likeCount: forumReplies.likeCount }).from(forumReplies).where(eq(forumReplies.id, params.id)).limit(1);
	return json({
		success: true,
		liked: false,
		likeCount: Number(row?.likeCount ?? 0)
	});
};

export { DELETE, POST };
//# sourceMappingURL=_server.ts-WFNtrfdl.js.map
