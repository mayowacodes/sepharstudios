import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const content = await db.select()
        .from(mediaLibrary)
        .where(
            and(
                eq(mediaLibrary.category, 'kids'),
                eq(mediaLibrary.isActive, true)
            )
        );

    return {
        content
    };
};
