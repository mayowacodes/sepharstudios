import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const trendingShows = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'show'),
                    eq(mediaLibrary.isActive, true)
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

        const trendingMovies = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'movie'),
                    eq(mediaLibrary.isActive, true)
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

        return {
            shows: trendingShows,
            movies: trendingMovies,
            documentaries: []
        };
    } catch (error) {
        console.error('Homepage load failed, using fallback data:', error);
        return {
            shows: [],
            movies: [],
            documentaries: []
        };
    }
};
