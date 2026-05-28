// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async () => {
    try {
        const content = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.category, 'kids'),
                    eq(mediaLibrary.isActive, true)
                )
            );

        return { content };
    } catch (e) {
        console.error('Failed to load kiddies content', e);
        return { content: [] };
    }
};
;null as any as PageServerLoad;