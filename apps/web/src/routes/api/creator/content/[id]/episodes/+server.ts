import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, episodes } from '$lib/db/schema/sepharstudios';
import { and, asc, eq } from 'drizzle-orm';

/**
 * GET  /api/creator/content/[id]/episodes — list episodes for this show
 * POST /api/creator/content/[id]/episodes — create a new episode
 *
 * Ownership: parent show (mediaLibrary row) must belong to the signed-in
 * creator and have mediaType='show'.
 */

async function loadShow(contentId: string, ownerId: string) {
	const [row] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId,
		mediaType: mediaLibrary.mediaType
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!row) return { row: null as null, status: 404 as const };
	if (row.creatorId !== ownerId) return { row: null as null, status: 403 as const };
	if (row.mediaType !== 'show') return { row: null as null, status: 400 as const };
	return { row, status: 200 as const };
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { row, status } = await loadShow(params.id!, session.user.id);
	if (status !== 200) {
		return json({ error: status === 404 ? 'Show not found' : status === 400 ? 'Content is not a show' : 'Forbidden' }, { status });
	}

	const rows = await db.select()
		.from(episodes)
		.where(eq(episodes.showId, row.id))
		.orderBy(asc(episodes.seasonNumber), asc(episodes.episodeNumber));

	return json({ episodes: rows });
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { row, status } = await loadShow(params.id!, session.user.id);
	if (status !== 200) {
		return json({ error: status === 404 ? 'Show not found' : status === 400 ? 'Content is not a show' : 'Forbidden' }, { status });
	}

	const body = await request.json().catch(() => ({})) as {
		seasonNumber?: number;
		episodeNumber?: number;
		title?: string;
		description?: string;
		thumbnail?: string;
		videoUrl?: string;
		duration?: string;
		airDate?: string;
	};

	const seasonNumber = Number.isFinite(body.seasonNumber) ? Number(body.seasonNumber) : NaN;
	const episodeNumber = Number.isFinite(body.episodeNumber) ? Number(body.episodeNumber) : NaN;
	const title = body.title?.trim() ?? '';

	if (!Number.isFinite(seasonNumber) || seasonNumber < 1) {
		return json({ error: 'seasonNumber must be a positive integer' }, { status: 400 });
	}
	if (!Number.isFinite(episodeNumber) || episodeNumber < 1) {
		return json({ error: 'episodeNumber must be a positive integer' }, { status: 400 });
	}
	if (!title) return json({ error: 'title is required' }, { status: 400 });

	const id = crypto.randomUUID();
	await db.insert(episodes).values({
		id,
		showId: row.id,
		seasonNumber,
		episodeNumber,
		title: title.slice(0, 255),
		description: body.description ?? null,
		thumbnail: body.thumbnail ?? null,
		videoUrl: body.videoUrl ?? null,
		duration: body.duration ?? null,
		airDate: body.airDate ?? null
	});

	return json({ success: true, id });
};
