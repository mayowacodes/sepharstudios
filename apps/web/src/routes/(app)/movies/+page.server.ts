import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and, ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const movies = await db.select()
        .from(mediaLibrary)
        .where(
            and(
                eq(mediaLibrary.mediaType, 'movie'),
                eq(mediaLibrary.isActive, true),
                ne(mediaLibrary.category, 'kids'),
                ne(mediaLibrary.category, 'teens')
            )
        );

    return {
        movies
    };
};
