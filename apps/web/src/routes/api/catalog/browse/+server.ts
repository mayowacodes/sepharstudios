import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, desc, inArray } from 'drizzle-orm';

/**
 * GET /api/catalog/browse  →  { shows, movies, documentaries }
 *
 * The three trending rows on /browse, ten each, newest first.
 *
 * Media-type lists are widened the same way the per-catalog endpoint widens
 * them: the upload wizard writes 'series' and 'short' while legacy rows use
 * 'show' and 'movie', and a catalog that accepts only one of each silently
 * hides whatever creators most recently uploaded.
 */
export const GET: RequestHandler = async () => {
	const row = (mediaTypes: string[]) =>
		db
			.select(mediaCardColumns)
			.from(mediaLibrary)
			.where(and(inArray(mediaLibrary.mediaType, mediaTypes), eq(mediaLibrary.isActive, true)))
			.orderBy(desc(mediaLibrary.createdAt))
			.limit(10);

	const [shows, movies, documentaries] = await Promise.all([
		row(['show', 'series']),
		row(['movie', 'short']),
		row(['documentary'])
	]);

	return json({ shows, movies, documentaries });
};
