import { H as mediaLibrary, T as creators, t as db, w as creatorFollowers } from "../../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../../chunks/projections.js";
import { error } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";
//#region src/routes/(app)/creators/[id]/+page.server.ts
var load = async ({ params, locals }) => {
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
	}).from(creators).where(eq(creators.id, params.id)).limit(1);
	if (!creator) error(404, "Creator not found");
	const content = await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, creator.userId), eq(mediaLibrary.isActive, true)));
	const [followerRow] = await db.select({ count: sql`count(*)::int` }).from(creatorFollowers).where(and(eq(creatorFollowers.creatorId, creator.id), eq(creatorFollowers.status, "active")));
	const followerCount = Number(followerRow?.count ?? 0);
	let isFollowing = false;
	const session = await locals.auth.getSession();
	if (session) {
		const [followRow] = await db.select({ id: creatorFollowers.id }).from(creatorFollowers).where(and(eq(creatorFollowers.creatorId, creator.id), eq(creatorFollowers.userId, session.user.id), eq(creatorFollowers.status, "active"))).limit(1);
		isFollowing = !!followRow;
	}
	return {
		creator,
		content,
		followerCount,
		isFollowing,
		isOwnProfile: session?.user.id === creator.userId
	};
};
//#endregion
export { load };
