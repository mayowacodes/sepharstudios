import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, episodes } from '$lib/db/schema/sepharstudios';
import { and, asc, eq } from 'drizzle-orm';

/**
 * GET  /api/creator/content/[id]/episodes — list episodes for this show
 * POST /api/creator/content/[id]/episodes — create a new episode
 *
 * Ownership: parent show (mediaLibrary row) must belong to the signed-in
 * creator and have a series-shaped mediaType. The wizard writes the
 * value 'series' (the canonical ContentType.SERIES enum); legacy rows
 * may still carry 'show' or 'tv'. All three are accepted so the
 * episodes manager works regardless of which value was written.
 */

const SERIES_LIKE_TYPES = new Set(['series', 'show', 'tv']);

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
	if (!SERIES_LIKE_TYPES.has(row.mediaType ?? '')) {
		return { row: null as null, status: 400 as const };
	}
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

	const seasonNumber = Number(body.seasonNumber);
	const episodeNumber = Number(body.episodeNumber);
	const title = body.title?.trim() ?? '';

	// Whole numbers only — Number.isFinite let 1.5 through to an integer
	// column (truncation / insert error). Cap at 1000 so a scripted loop
	// can't create unbounded rows per show.
	if (!Number.isInteger(seasonNumber) || seasonNumber < 1 || seasonNumber > 1000) {
		return json({ error: 'seasonNumber must be a whole number between 1 and 1000' }, { status: 400 });
	}
	if (!Number.isInteger(episodeNumber) || episodeNumber < 1 || episodeNumber > 1000) {
		return json({ error: 'episodeNumber must be a whole number between 1 and 1000' }, { status: 400 });
	}
	if (!title) return json({ error: 'title is required' }, { status: 400 });

	// De-dupe: one row per (show, season, episode). Without this a
	// double-submit (or a scripted loop) created duplicate S1E1 rows
	// that corrupted the episode list ordering and player next-up.
	const [dup] = await db.select({ id: episodes.id })
		.from(episodes)
		.where(and(
			eq(episodes.showId, row.id),
			eq(episodes.seasonNumber, seasonNumber),
			eq(episodes.episodeNumber, episodeNumber)
		))
		.limit(1);
	if (dup) {
		return json({
			error: `S${seasonNumber}E${episodeNumber} already exists for this show. Edit it instead, or pick a different number.`
		}, { status: 409 });
	}

	const id = crypto.randomUUID();
	await db.insert(episodes).values({
		id,
		showId: row.id,
		seasonNumber,
		episodeNumber,
		title: title.slice(0, 255),
		description: typeof body.description === 'string' ? body.description.slice(0, 5000) : null,
		thumbnail: typeof body.thumbnail === 'string' ? body.thumbnail.slice(0, 2048) : null,
		videoUrl: typeof body.videoUrl === 'string' ? body.videoUrl.slice(0, 2048) : null,
		duration: typeof body.duration === 'string' ? body.duration.slice(0, 50) : null,
		airDate: typeof body.airDate === 'string' ? body.airDate.slice(0, 20) : null
	});

	return json({ success: true, id });
};
