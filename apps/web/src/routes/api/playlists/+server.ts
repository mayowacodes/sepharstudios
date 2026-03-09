import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { playlists, playlistItems, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and, desc } from 'drizzle-orm';

// GET /api/playlists — list playlists for user (including item count)
export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const userPlaylists = await db.select().from(playlists)
		.where(eq(playlists.userId, session.user.id))
		.orderBy(desc(playlists.isDefault));

	return json(userPlaylists);
};

// POST /api/playlists — create playlist or add to default "My List"
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { name, description } = await request.json() as { name?: string; description?: string };

	const [playlist] = await db.insert(playlists).values({
		userId: session.user.id,
		name: name ?? 'My List',
		description,
		isDefault: !name
	}).returning();

	return json(playlist, { status: 201 });
};
