// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async () => {
    try {
        const movies = await db.select(mediaCardColumns)
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'movie'),
                    eq(mediaLibrary.isActive, true),
                    ne(mediaLibrary.category, 'kids'),
                    ne(mediaLibrary.category, 'teens')
                )
            );

        return { movies };
    } catch (e) {
        const err = e instanceof Error ? e : null;
        console.error('Failed to load movies:', err?.message || e);
        if (err?.cause) console.error('Cause:', err.cause);
        if (err?.stack) console.error('Stack:', err.stack.split('\n').slice(0, 5).join('\n'));
        return { movies: [] };
    }
};
;null as any as PageServerLoad;