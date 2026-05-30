import { g as creators, h as creatorFollowers, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
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
//#endregion
export { DELETE, GET, POST };
