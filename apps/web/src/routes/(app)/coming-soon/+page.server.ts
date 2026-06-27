import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

/**
 * Dedicated Coming Soon listing. Returns every row in the
 * coming_soon state sorted by next-up. The page groups them by
 * month client-side using scheduledPublishAt.
 */
export const load: PageServerLoad = async () => {
	try {
		const items = await db
			.select(mediaCardColumns)
			.from(mediaLibrary)
			.where(eq(mediaLibrary.status, 'coming_soon'))
			.orderBy(asc(mediaLibrary.scheduledPublishAt));

		return { items };
	} catch (err) {
		console.error('[coming-soon] load failed:', err);
		return { items: [] };
	}
};
