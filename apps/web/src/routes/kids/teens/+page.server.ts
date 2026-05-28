import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const content = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.category, 'teens'),
                    eq(mediaLibrary.isActive, true)
                )
            );

        return { content };
    } catch (e) {
        console.error('Failed to load teens content', e);
        return { content: [] };
    }
};
