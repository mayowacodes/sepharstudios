// @ts-nocheck
import { error } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creators, mediaLibrary, creatorFollowers } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { and, eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
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
		.where(eq(creators.id, params.id))
		.limit(1);

	if (!creator) error(404, 'Creator not found');

	// Their published content. The same projection helper used by movies/shows.
	const content = await db
		.select(mediaCardColumns)
		.from(mediaLibrary)
		.where(and(
			eq(mediaLibrary.creatorId, creator.userId),
			eq(mediaLibrary.isActive, true)
		));

	const [followerRow] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(creatorFollowers)
		.where(and(
			eq(creatorFollowers.creatorId, creator.id),
			eq(creatorFollowers.status, 'active')
		));
	const followerCount = Number(followerRow?.count ?? 0);

	// Is the current user already following?
	let isFollowing = false;
	const session = await locals.auth.getSession();
	if (session) {
		const [followRow] = await db
			.select({ id: creatorFollowers.id })
			.from(creatorFollowers)
			.where(and(
				eq(creatorFollowers.creatorId, creator.id),
				eq(creatorFollowers.userId, session.user.id),
				eq(creatorFollowers.status, 'active')
			))
			.limit(1);
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
