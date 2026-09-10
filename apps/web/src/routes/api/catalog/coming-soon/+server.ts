import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, asc } from 'drizzle-orm';

/**
 * GET /api/catalog/coming-soon  →  { items }
 *
 * Every row in the coming_soon state, sorted next-up. The page groups them by
 * month client-side from `scheduledPublishAt`, so no limit is applied here —
 * unlike the per-catalog carousels, this is the full listing.
 */
export const GET: RequestHandler = async () => {
	const items = await db
		.select(mediaCardColumns)
		.from(mediaLibrary)
		.where(eq(mediaLibrary.status, 'coming_soon'))
		.orderBy(asc(mediaLibrary.scheduledPublishAt));

	return json({ items });
};
