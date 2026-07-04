import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // Card projection + a LIMIT — this used to serialize EVERY teens
        // row's FULL columns (chapters/cast/crew JSON included) into the
        // page data on every load, unbounded.
        const content = await db.select(mediaCardColumns)
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.category, 'teens'),
                    eq(mediaLibrary.isActive, true)
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(60);

        return { content };
    } catch (e) {
        console.error('Failed to load teens content', e);
        return { content: [] };
    }
};
