// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { faithDocumentaries } from '$lib/data/documentaries';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load = async () => {
    try {
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
    } catch (error) {
        console.error('Documentaries load failed, using fallback data:', error);
        return {
            documentaries: faithDocumentaries
        };
    }
};
;null as any as PageServerLoad;