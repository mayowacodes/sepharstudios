import { json, error, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creators, mediaLibrary, creatorFollowers } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { and, eq, sql } from 'drizzle-orm';

/**
 * GET /api/creators/:id/page  →  public creator profile payload.
 *
 * The former `(app)/creators/[id]/+page.server.ts` load. Named `/page` to sit
 * alongside the existing `/api/creators/[id]` resource without redefining it.
 */
async function buildCreatorPayload({ params, locals }: RequestEvent) {
	const creatorId = params.id;
	if (!creatorId) error(400, 'Missing creator id');

	const [creator] = await db
		.select({
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
		})
		.from(creators)
		.where(eq(creators.id, creatorId))
		.limit(1);

	if (!creator) error(404, 'Creator not found');

	const session = await locals.auth.getSession();

	const [content, followerRow, followRow] = await Promise.all([
		// Their published content, via the same card projection the catalogs use.
		db
			.select(mediaCardColumns)
			.from(mediaLibrary)
			.where(and(eq(mediaLibrary.creatorId, creator.userId), eq(mediaLibrary.isActive, true))),
		db
			.select({ count: sql<number>`count(*)::int` })
			.from(creatorFollowers)
			.where(and(eq(creatorFollowers.creatorId, creator.id), eq(creatorFollowers.status, 'active')))
			.then((r) => r[0]),
		// Is the viewer already following? Anonymous viewers skip the query.
		session
			? db
					.select({ id: creatorFollowers.id })
					.from(creatorFollowers)
					.where(
						and(
							eq(creatorFollowers.creatorId, creator.id),
							eq(creatorFollowers.userId, session.user.id),
							eq(creatorFollowers.status, 'active')
						)
					)
					.limit(1)
					.then((r) => r[0])
			: Promise.resolve(undefined)
	]);

	return {
		creator,
		content,
		followerCount: Number(followerRow?.count ?? 0),
		isFollowing: !!followRow,
		isOwnProfile: session?.user.id === creator.userId
	};
}

/** Response contract, exported so the page can type `data`. */
export type CreatorPagePayload = Awaited<ReturnType<typeof buildCreatorPayload>>;

export const GET: RequestHandler = async (event) => json(await buildCreatorPayload(event));
