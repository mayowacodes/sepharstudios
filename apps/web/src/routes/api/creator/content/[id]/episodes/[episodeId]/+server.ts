import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, episodes } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

const ALLOWED_FIELDS = new Set([
	'seasonNumber', 'episodeNumber', 'title', 'description',
	'thumbnail', 'videoUrl', 'duration', 'airDate'
]);

async function loadShowAndEpisode(contentId: string, episodeId: string, ownerId: string) {
	const [show] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!show || show.creatorId !== ownerId) return null;

	const [ep] = await db.select()
		.from(episodes)
		.where(and(eq(episodes.id, episodeId), eq(episodes.showId, contentId)))
		.limit(1);
	if (!ep) return null;
	return ep;
}

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const ep = await loadShowAndEpisode(params.id!, params.episodeId!, session.user.id);
	if (!ep) return json({ error: 'Episode not found' }, { status: 404 });

	const body = await request.json().catch(() => ({})) as Record<string, unknown>;
	const updates: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (!ALLOWED_FIELDS.has(key)) continue;
		if (key === 'seasonNumber' || key === 'episodeNumber') {
			const n = Number(value);
			if (!Number.isFinite(n) || n < 1) {
				return json({ error: `${key} must be a positive integer` }, { status: 400 });
			}
			updates[key] = n;
		} else if (key === 'title') {
			const t = String(value ?? '').trim();
			if (!t) return json({ error: 'title cannot be empty' }, { status: 400 });
			updates.title = t.slice(0, 255);
		} else {
			updates[key] = value;
		}
	}

	if (Object.keys(updates).length === 0) {
		return json({ error: 'No updatable fields supplied' }, { status: 400 });
	}

	const [updated] = await db.update(episodes)
		.set(updates as Parameters<typeof db.update>[0] extends never ? never : Record<string, unknown>)
		.where(eq(episodes.id, ep.id))
		.returning();

	return json({ success: true, episode: updated });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const ep = await loadShowAndEpisode(params.id!, params.episodeId!, session.user.id);
	if (!ep) return json({ error: 'Episode not found' }, { status: 404 });

	await db.delete(episodes).where(eq(episodes.id, ep.id));
	return json({ success: true });
};
