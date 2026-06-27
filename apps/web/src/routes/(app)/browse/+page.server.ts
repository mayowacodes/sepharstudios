import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and, desc, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // Same widening as /shows + /movies — accept the wizard's literal
        // ('series', 'short') alongside the legacy values so /browse mirrors
        // the dedicated catalog pages.
        const trendingShows = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    inArray(mediaLibrary.mediaType, ['show', 'series']),
                    eq(mediaLibrary.isActive, true)
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

        const trendingMovies = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    inArray(mediaLibrary.mediaType, ['movie', 'short']),
                    eq(mediaLibrary.isActive, true)
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

        const documentaries = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'documentary'),
                    eq(mediaLibrary.isActive, true)
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

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
