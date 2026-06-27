// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { faithDocumentaries } from '$lib/data/documentaries';
import { eq, and, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { attachCatalogProgress } from '$lib/server/catalog-progress';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    const session = await locals.auth.getSession();
    try {
        const [documentaries, comingSoon] = await Promise.all([
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        eq(mediaLibrary.mediaType, 'documentary'),
                        eq(mediaLibrary.isActive, true)
                    )
                ),
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        eq(mediaLibrary.mediaType, 'documentary'),
                        eq(mediaLibrary.status, 'coming_soon')
                    )
                )
                .orderBy(asc(mediaLibrary.scheduledPublishAt))
                .limit(20)
        ]);

        return {
            documentaries: await attachCatalogProgress(documentaries, session?.user.id),
            comingSoon
        };
    } catch (error) {
        console.error('Documentaries load failed, using fallback data:', error);
        return {
            documentaries: faithDocumentaries,
            comingSoon: []
        };
    }
};
