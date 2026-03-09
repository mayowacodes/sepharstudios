import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and, isNotNull, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 50);
	const hasBibleRef = url.searchParams.get('hasBibleRef') === 'true';
	const mediaType = url.searchParams.get('type');

	const conditions = [
		eq(mediaLibrary.isActive, true),
		// Kids content: age ratings G, PG, or ageRating contains 'kids'/'children'
		sql`(${mediaLibrary.ageRating} IN ('G', 'PG', 'ALL_AGES') OR ${mediaLibrary.ageRating} ILIKE '%kids%' OR ${mediaLibrary.ageRating} ILIKE '%children%')`
	];

	if (hasBibleRef) {
		conditions.push(isNotNull(mediaLibrary.bibleReference));
	}

	if (mediaType) {
		conditions.push(eq(mediaLibrary.mediaType, mediaType));
	}

	const items = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			mediaType: mediaLibrary.mediaType,
			bibleReference: mediaLibrary.bibleReference,
			genres: mediaLibrary.genres,
			description: mediaLibrary.description
		})
		.from(mediaLibrary)
		.where(and(...conditions))
		.limit(limit);

	return json(items);
};
