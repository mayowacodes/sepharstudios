import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, desc, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // Card projection + parallel queries — full-row selects were
        // dragging chapters/cast/crew JSON blobs into the page payload,
        // and the three queries ran sequentially.
        // Same type-widening as /shows + /movies — accept the wizard's
        // literal ('series', 'short') alongside the legacy values.
        const [trendingShows, trendingMovies, documentaries] = await Promise.all([
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        inArray(mediaLibrary.mediaType, ['show', 'series']),
                        eq(mediaLibrary.isActive, true)
                    )
                )
                .orderBy(desc(mediaLibrary.createdAt))
                .limit(10),
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        inArray(mediaLibrary.mediaType, ['movie', 'short']),
                        eq(mediaLibrary.isActive, true)
                    )
                )
                .orderBy(desc(mediaLibrary.createdAt))
                .limit(10),
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        eq(mediaLibrary.mediaType, 'documentary'),
                        eq(mediaLibrary.isActive, true)
                    )
                )
                .orderBy(desc(mediaLibrary.createdAt))
                .limit(10)
        ]);

        return {
            shows: trendingShows,
            movies: trendingMovies,
            documentaries
        };
    } catch (error) {
        console.error('Browse page load failed:', error);
        return {
            shows: [],
            movies: [],
            documentaries: []
        };
    }
};
