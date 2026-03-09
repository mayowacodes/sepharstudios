import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { playlists, playlistItems, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and } from 'drizzle-orm';

// GET /api/playlists/[id]/items — list items in a playlist with content details
export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	// Verify playlist belongs to user
	const [playlist] = await db.select().from(playlists)
		.where(and(eq(playlists.id, params.id!), eq(playlists.userId, session.user.id)))
		.limit(1);
	if (!playlist) return json({ error: 'Not found' }, { status: 404 });

	const items = await db.select({
		itemId: playlistItems.id,
		addedAt: playlistItems.addedAt,
		sortOrder: playlistItems.sortOrder,
		content: {
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			mediaType: mediaLibrary.mediaType,
			duration: mediaLibrary.duration,
			ageRating: mediaLibrary.ageRating,
			year: mediaLibrary.year
		}
	})
		.from(playlistItems)
		.innerJoin(mediaLibrary, eq(playlistItems.contentId, mediaLibrary.id))
		.where(eq(playlistItems.playlistId, params.id!));

	return json(items);
};

// POST /api/playlists/[id]/items — add item
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { contentId, contentType } = await request.json() as { contentId: string; contentType?: string };

	const [playlist] = await db.select().from(playlists)
		.where(and(eq(playlists.id, params.id!), eq(playlists.userId, session.user.id)))
		.limit(1);
	if (!playlist) return json({ error: 'Not found' }, { status: 404 });

	// Check not already in list
	const [existing] = await db.select().from(playlistItems)
		.where(and(eq(playlistItems.playlistId, params.id!), eq(playlistItems.contentId, contentId)))
		.limit(1);
	if (existing) return json({ alreadyAdded: true });

	const [item] = await db.insert(playlistItems).values({
		playlistId: params.id!,
		contentId,
		contentType: contentType ?? 'movie'
	}).returning();

	return json(item, { status: 201 });
};

// DELETE /api/playlists/[id]/items?contentId=xxx — remove item
export const DELETE: RequestHandler = async ({ params, url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const contentId = url.searchParams.get('contentId');
	if (!contentId) return json({ error: 'contentId required' }, { status: 400 });

	await db.delete(playlistItems)
		.where(and(eq(playlistItems.playlistId, params.id!), eq(playlistItems.contentId, contentId)));

	return json({ success: true });
};
