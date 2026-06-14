import { json, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { playlists, playlistItems } from '$lib/db/schema/sepharstudios';

/**
 * Convenience API around the existing playlists table for the
 * detail-page "My List" toggle.
 *
 *   POST    /api/my-list/<contentId>   → add to default playlist
 *   DELETE  /api/my-list/<contentId>   → remove from default playlist
 *
 * The user's default playlist (`is_default = true`, name = "My List") is
 * created lazily on the first POST so a brand-new account doesn't need
 * to provision anything ahead of time. Both endpoints are idempotent —
 * POSTing twice is a no-op success, DELETE is no-op when not present.
 *
 * Membership lookup happens in `media-detail-load` directly via the same
 * tables, so there's no GET endpoint here. The detail page already
 * receives `isInMyList` from the server load.
 */

async function ensureDefaultPlaylist(userId: string): Promise<string> {
	const [existing] = await db
		.select({ id: playlists.id })
		.from(playlists)
		.where(and(eq(playlists.userId, userId), eq(playlists.isDefault, true)))
		.limit(1);
	if (existing) return existing.id;
	const [created] = await db
		.insert(playlists)
		.values({ userId, name: 'My List', isDefault: true })
		.returning({ id: playlists.id });
	if (!created) throw new Error('Failed to create default playlist');
	return created.id;
}

export const POST: RequestHandler = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'unauthorized' }, { status: 401 });

	const contentId = params.contentId;
	if (!contentId) return json({ error: 'contentId required' }, { status: 400 });

	const body = await request.json().catch(() => ({})) as { contentType?: string };
	const contentType = typeof body.contentType === 'string' ? body.contentType : 'movie';

	const playlistId = await ensureDefaultPlaylist(session.user.id);
	const [existing] = await db
		.select({ id: playlistItems.id })
		.from(playlistItems)
		.where(and(
			eq(playlistItems.playlistId, playlistId),
			eq(playlistItems.contentId, contentId)
		))
		.limit(1);
	if (existing) return json({ alreadyAdded: true, inList: true });

	await db.insert(playlistItems).values({ playlistId, contentId, contentType });
	return json({ inList: true });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'unauthorized' }, { status: 401 });

	const contentId = params.contentId;
	if (!contentId) return json({ error: 'contentId required' }, { status: 400 });

	// We don't auto-create the default playlist on DELETE — if it doesn't
	// exist, the item isn't in any list either. Idempotent no-op success.
	const [playlist] = await db
		.select({ id: playlists.id })
		.from(playlists)
		.where(and(eq(playlists.userId, session.user.id), eq(playlists.isDefault, true)))
		.limit(1);
	if (!playlist) return json({ inList: false });

	await db
		.delete(playlistItems)
		.where(and(
			eq(playlistItems.playlistId, playlist.id),
			eq(playlistItems.contentId, contentId)
		));

	return json({ inList: false });
};
