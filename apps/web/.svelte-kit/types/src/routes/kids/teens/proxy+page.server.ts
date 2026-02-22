// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async () => {
    const content = await db.select()
        .from(mediaLibrary)
        .where(
            and(
                eq(mediaLibrary.category, 'teens'),
                eq(mediaLibrary.isActive, true)
            )
        );

    return {
        content
    };
};
;null as any as PageServerLoad;