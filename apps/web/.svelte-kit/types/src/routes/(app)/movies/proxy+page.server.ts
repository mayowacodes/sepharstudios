// @ts-nocheck
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, or, isNull, notInArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { attachCatalogProgress } from '$lib/server/catalog-progress';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
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
        const movies = await db.select(mediaCardColumns)
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'movie'),
                    eq(mediaLibrary.isActive, true),
                    or(
                        isNull(mediaLibrary.category),
                        notInArray(mediaLibrary.category, ['kids', 'teens'])
                    )
                )
            );

        // Augment each card with the viewer's in-progress overlay
        // (progressPercent + positionSeconds) when applicable. Anonymous
        // viewers get the rows unchanged; the helper short-circuits.
        const enriched = await attachCatalogProgress(movies, session?.user.id);
        return { movies: enriched };
    } catch (e) {
        const err = e instanceof Error ? e : null;
        console.error('Failed to load movies:', err?.message || e);
        if (err?.cause) console.error('Cause:', err.cause);
        if (err?.stack) console.error('Stack:', err.stack.split('\n').slice(0, 5).join('\n'));
        return { movies: [] };
    }
};
