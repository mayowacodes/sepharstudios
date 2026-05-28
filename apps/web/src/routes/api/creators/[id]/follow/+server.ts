import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creatorFollowers, creators } from '$lib/db/schema/sepharstudios';
import { and, eq, sql } from 'drizzle-orm';

/**
 * POST /api/creators/[id]/follow    — follow this creator
 * DELETE /api/creators/[id]/follow  — unfollow
 * GET /api/creators/[id]/follow     — { following: boolean, followerCount: number }
 *
 * The `[id]` segment is the `creators.id` (not the underlying `user.id`).
 * Auth required for POST/DELETE; GET is anonymous-safe (anyone can see the
 * count, but `following` is always false when not signed in).
 */

async function getFollowerCount(creatorId: string): Promise<number> {
	const [row] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(creatorFollowers)
		.where(and(
			eq(creatorFollowers.creatorId, creatorId),
			eq(creatorFollowers.status, 'active')
		));
	return Number(row?.count ?? 0);
}

async function isFollowing(creatorId: string, userId: string): Promise<boolean> {
	const [row] = await db
		.select({ id: creatorFollowers.id })
		.from(creatorFollowers)
		.where(and(
			eq(creatorFollowers.creatorId, creatorId),
			eq(creatorFollowers.userId, userId),
			eq(creatorFollowers.status, 'active')
		))
		.limit(1);
	return !!row;
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const creatorId = params.id!;
	const session = await locals.auth.getSession().catch(() => null);

	const [creator] = await db.select({ id: creators.id })
		.from(creators)
		.where(eq(creators.id, creatorId))
		.limit(1);
	if (!creator) return json({ error: 'Creator not found' }, { status: 404 });

	const followerCount = await getFollowerCount(creatorId);
	const following = session ? await isFollowing(creatorId, session.user.id) : false;

	return json({ following, followerCount });
};

export const POST: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const creatorId = params.id!;

	const [creator] = await db.select({ id: creators.id, userId: creators.userId })
		.from(creators)
		.where(eq(creators.id, creatorId))
		.limit(1);
	if (!creator) return json({ error: 'Creator not found' }, { status: 404 });
	if (creator.userId === session.user.id) {
		return json({ error: 'You cannot follow yourself' }, { status: 400 });
	}

	// Upsert — re-activate if a prior unfollow soft-deleted the row.
	await db.insert(creatorFollowers)
		.values({ creatorId, userId: session.user.id, status: 'active' })
		.onConflictDoUpdate({
			target: [creatorFollowers.creatorId, creatorFollowers.userId],
			set: { status: 'active' }
		});

	const followerCount = await getFollowerCount(creatorId);
	return json({ following: true, followerCount });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const creatorId = params.id!;

	await db.update(creatorFollowers)
		.set({ status: 'unfollowed' })
		.where(and(
			eq(creatorFollowers.creatorId, creatorId),
			eq(creatorFollowers.userId, session.user.id)
		));

	const followerCount = await getFollowerCount(creatorId);
	return json({ following: false, followerCount });
};
