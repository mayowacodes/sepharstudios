// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { faithTVShows } from '$lib/data/shows';
import { eq, and, or, isNull, notInArray, inArray, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { attachCatalogProgress } from '$lib/server/catalog-progress';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
    const session = await locals.auth.getSession();
    try {
        // The wizard sends mediaType='series' but legacy rows + the
        // tv-aliased detail loader also use 'show'. Accept both so the
        // catalog actually lists what creators submit. Kids/Teens shows
        // get filtered out so they only appear in the kids portal.
        const [shows, comingSoon] = await Promise.all([
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        inArray(mediaLibrary.mediaType, ['show', 'series']),
                        eq(mediaLibrary.isActive, true),
                        or(
                            isNull(mediaLibrary.category),
                            notInArray(mediaLibrary.category, ['kids', 'teens'])
                        )
                    )
                ),
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        inArray(mediaLibrary.mediaType, ['show', 'series']),
                        eq(mediaLibrary.status, 'coming_soon')
                    )
                )
                .orderBy(asc(mediaLibrary.scheduledPublishAt))
                .limit(20)
        ]);

        return {
            shows: await attachCatalogProgress(shows, session?.user.id),
            comingSoon
        };
    } catch (error) {
        console.error('Shows load failed, using fallback data:', error);
        return {
            shows: faithTVShows,
            comingSoon: []
        };
    }
};
