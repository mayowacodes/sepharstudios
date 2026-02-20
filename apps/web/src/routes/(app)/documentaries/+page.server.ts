import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const documentaries = await db.select()
        .from(mediaLibrary)
        .where(
            and(
                eq(mediaLibrary.mediaType, 'documentary'),
                eq(mediaLibrary.isActive, true)
            )
        );

    return {
        documentaries
    };
};
