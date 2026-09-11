import { I as creatorFollowers, L as creators, t as db, tt as mediaLibrary } from "../../../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../../../chunks/projections.js";
import { error, json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
//#region src/routes/api/creators/[id]/page/+server.ts
/**
* GET /api/creators/:id/page  →  public creator profile payload.
*
* The former `(app)/creators/[id]/+page.server.ts` load. Named `/page` to sit
* alongside the existing `/api/creators/[id]` resource without redefining it.
*/
async function buildCreatorPayload({ params, locals }) {
	const creatorId = params.id;
	if (!creatorId) error(400, "Missing creator id");
	const [creator] = await db.select({
		id: creators.id,
		userId: creators.userId,
		displayName: creators.displayName,
		creatorType: creators.creatorType,
		bio: creators.bio,
		avatarUrl: creators.avatarUrl,
		bannerUrl: creators.bannerUrl,
		denomination: creators.denomination,
		organizationName: creators.organizationName,
		socialLinks: creators.socialLinks,
		isVerified: creators.isVerified
	}).from(creators).where(eq(creators.id, creatorId)).limit(1);
	if (!creator) error(404, "Creator not found");
	const session = await locals.auth.getSession();
	const [content, followerRow, followRow] = await Promise.all([
		db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, creator.userId), eq(mediaLibrary.isActive, true))),
		db.select({ count: sql`count(*)::int` }).from(creatorFollowers).where(and(eq(creatorFollowers.creatorId, creator.id), eq(creatorFollowers.status, "active"))).then((r) => r[0]),
		session ? db.select({ id: creatorFollowers.id }).from(creatorFollowers).where(and(eq(creatorFollowers.creatorId, creator.id), eq(creatorFollowers.userId, session.user.id), eq(creatorFollowers.status, "active"))).limit(1).then((r) => r[0]) : Promise.resolve(void 0)
	]);
	return {
		creator,
		content,
		followerCount: Number(followerRow?.count ?? 0),
		isFollowing: !!followRow,
		isOwnProfile: session?.user.id === creator.userId
	};
}
var GET = async (event) => json(await buildCreatorPayload(event));
//#endregion
export { GET };
