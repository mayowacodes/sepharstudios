import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { faithTVShows } from '$lib/data/shows';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const shows = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'show'),
                    eq(mediaLibrary.isActive, true)
                )
            );

        return {
            shows
        };
    } catch (error) {
        console.error('Shows load failed, using fallback data:', error);
        return {
            shows: faithTVShows
        };
    }
};
