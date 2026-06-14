// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { faithTVShows } from '$lib/data/shows';
import { eq, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { attachCatalogProgress } from '$lib/server/catalog-progress';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    const session = await locals.auth.getSession();
    try {
        const shows = await db.select(mediaCardColumns)
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'show'),
                    eq(mediaLibrary.isActive, true)
                )
            );

        return {
            shows: await attachCatalogProgress(shows, session?.user.id)
        };
    } catch (error) {
        console.error('Shows load failed, using fallback data:', error);
        return {
            shows: faithTVShows
        };
    }
};
