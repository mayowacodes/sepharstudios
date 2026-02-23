// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { faithTVShows } from '$lib/data/shows';
import { faithMovies } from '$lib/data/movies';
import { faithDocumentaries } from '$lib/data/documentaries';
import { eq, and, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async () => {
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
            shows: trendingShows.length > 0 ? trendingShows : faithTVShows.slice(0, 10),
            movies: trendingMovies.length > 0 ? trendingMovies : faithMovies.slice(0, 10),
            documentaries: faithDocumentaries.slice(0, 10)
        };
    } catch (error) {
        console.error('Homepage load failed, using fallback data:', error);
        return {
            shows: faithTVShows.slice(0, 10),
            movies: faithMovies.slice(0, 10),
            documentaries: faithDocumentaries.slice(0, 10)
        };
    }
};
;null as any as PageServerLoad;