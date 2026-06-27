import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, or, isNull, notInArray, inArray, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { attachCatalogProgress } from '$lib/server/catalog-progress';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.getSession();
    try {
        // Movies catalog = the general-audience feed. We exclude items
        // explicitly tagged for the Kids / Teens portals because those have
        // their own routes with stricter content rules. NULL `category` is
        // the new-creator default (the upload wizard doesn't ask for it
        // yet), so it MUST count as "general audience" — otherwise every
        // freshly-published movie would be silently invisible here. Before
        // this fix, `ne(category, 'kids')` returned NULL for NULL columns,
        // and NULL in a WHERE clause filters the row out, so creators saw
        // their movie set `isActive=true` in the DB but it never appeared
        // on /movies. Use `OR (IS NULL, NOT IN (...))` to make NULL pass.
        const [movies, comingSoon] = await Promise.all([
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        // Short Film uploads (mediaType='short') are lumped in with movies —
// /movies is the only public catalog page that makes sense for them.
inArray(mediaLibrary.mediaType, ['movie', 'short']),
                        eq(mediaLibrary.isActive, true),
                        or(
                            isNull(mediaLibrary.category),
                            notInArray(mediaLibrary.category, ['kids', 'teens'])
                        )
                    )
                ),
            // Coming Soon row — rows the admin has approved into the
            // coming_soon state. Sorted by next-up so the imminent
            // releases appear first in the carousel. Capped because
            // the carousel scrolls and visibility tails off past ~20.
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(
                    and(
                        // Short Film uploads (mediaType='short') are lumped in with movies —
// /movies is the only public catalog page that makes sense for them.
inArray(mediaLibrary.mediaType, ['movie', 'short']),
                        eq(mediaLibrary.status, 'coming_soon')
                    )
                )
                .orderBy(asc(mediaLibrary.scheduledPublishAt))
                .limit(20)
        ]);

        // Augment each card with the viewer's in-progress overlay
        // (progressPercent + positionSeconds) when applicable. Anonymous
        // viewers get the rows unchanged; the helper short-circuits.
        const enriched = await attachCatalogProgress(movies, session?.user.id);
        return { movies: enriched, comingSoon };
    } catch (e) {
        const err = e instanceof Error ? e : null;
        console.error('Failed to load movies:', err?.message || e);
        if (err?.cause) console.error('Cause:', err.cause);
        if (err?.stack) console.error('Stack:', err.stack.split('\n').slice(0, 5).join('\n'));
        return { movies: [], comingSoon: [] };
    }
};
