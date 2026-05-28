import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

/**
 * POST /api/creator/content/[id]/duplicate
 *
 * Creates a copy of the creator's existing content row. Resets:
 *   - id (new uuid)
 *   - title → "Copy of …"
 *   - slug → unique-ified with timestamp
 *   - status → 'submitted' (must be re-reviewed)
 *   - viewCount → 0
 *   - encoder/video fields → null (creator must re-upload)
 *   - createdAt/updatedAt → now
 *
 * Returns the new row so the page can navigate to /creator/upload?edit=<id>.
 */

export const POST: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const sourceId = params.id!;

	const [source] = await db.select()
		.from(mediaLibrary)
		.where(and(
			eq(mediaLibrary.id, sourceId),
			eq(mediaLibrary.creatorId, session.user.id)
		))
		.limit(1);

	if (!source) return json({ error: 'Content not found or not yours' }, { status: 404 });

	const newId = crypto.randomUUID();
	const now = new Date();
	const slugSuffix = Date.now().toString(36);

	const [duplicate] = await db.insert(mediaLibrary).values({
		id: newId,
		title: `Copy of ${source.title}`,
		description: source.description,
		thumbnail: source.thumbnail,
		backdropUrl: source.backdropUrl,
		posterUrl: source.posterUrl,
		// reset playback fields — the new row needs its own upload + encoding
		trailerUrl: null,
		videoUrl: null,
		encoderJobId: null,
		processingStatus: 'not_started',
		creatorId: session.user.id,
		videoId: null,
		thumbnailId: source.thumbnailId,
		backdropId: source.backdropId,
		posterId: source.posterId,
		trailerId: null,
		link: source.link,
		slug: `${source.slug ?? 'copy'}-${slugSuffix}`,
		mediaType: source.mediaType,
		category: source.category,
		genres: source.genres,
		topics: source.topics,
		keywords: source.keywords,
		rating: source.rating,
		ageRating: source.ageRating,
		duration: source.duration,
		quality: source.quality,
		year: source.year,
		releaseDate: source.releaseDate,
		language: source.language,
		bibleReference: source.bibleReference,
		featured: false,
		isNew: false,
		isActive: false,
		status: 'submitted',
		viewCount: 0,
		voteAverage: null,
		voteCount: null,
		popularity: null,
		createdAt: now,
		updatedAt: now
	}).returning();

	return json({ success: true, content: duplicate }, { status: 201 });
};
