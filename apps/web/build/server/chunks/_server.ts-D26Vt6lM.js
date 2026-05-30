import { n as db, k as creatorFollowers, l as creators } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { and, eq, sql } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/creators/[id]/follow/+server.ts
/**
* POST /api/creators/[id]/follow    — follow this creator
* DELETE /api/creators/[id]/follow  — unfollow
* GET /api/creators/[id]/follow     — { following: boolean, followerCount: number }
*
* The `[id]` segment is the `creators.id` (not the underlying `user.id`).
* Auth required for POST/DELETE; GET is anonymous-safe (anyone can see the
* count, but `following` is always false when not signed in).
*/
async function getFollowerCount(creatorId) {
	const [row] = await db.select({ count: sql`count(*)::int` }).from(creatorFollowers).where(and(eq(creatorFollowers.creatorId, creatorId), eq(creatorFollowers.status, "active")));
	return Number(row?.count ?? 0);
}
async function isFollowing(creatorId, userId) {
	const [row] = await db.select({ id: creatorFollowers.id }).from(creatorFollowers).where(and(eq(creatorFollowers.creatorId, creatorId), eq(creatorFollowers.userId, userId), eq(creatorFollowers.status, "active"))).limit(1);
	return !!row;
}
var GET = async ({ params, locals }) => {
	const creatorId = params.id;
	const session = await locals.auth.getSession().catch(() => null);
	const [creator] = await db.select({ id: creators.id }).from(creators).where(eq(creators.id, creatorId)).limit(1);
	if (!creator) return json({ error: "Creator not found" }, { status: 404 });
	const followerCount = await getFollowerCount(creatorId);
	return json({
		following: session ? await isFollowing(creatorId, session.user.id) : false,
		followerCount
	});
};
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const creatorId = params.id;
	const [creator] = await db.select({
		id: creators.id,
		userId: creators.userId
	}).from(creators).where(eq(creators.id, creatorId)).limit(1);
	if (!creator) return json({ error: "Creator not found" }, { status: 404 });
	if (creator.userId === session.user.id) return json({ error: "You cannot follow yourself" }, { status: 400 });
	await db.insert(creatorFollowers).values({
		creatorId,
		userId: session.user.id,
		status: "active"
	}).onConflictDoUpdate({
		target: [creatorFollowers.creatorId, creatorFollowers.userId],
		set: { status: "active" }
	});
	return json({
		following: true,
		followerCount: await getFollowerCount(creatorId)
	});
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const creatorId = params.id;
	await db.update(creatorFollowers).set({ status: "unfollowed" }).where(and(eq(creatorFollowers.creatorId, creatorId), eq(creatorFollowers.userId, session.user.id)));
	return json({
		following: false,
		followerCount: await getFollowerCount(creatorId)
	});
};

export { DELETE, GET, POST };
//# sourceMappingURL=_server.ts-D26Vt6lM.js.map
