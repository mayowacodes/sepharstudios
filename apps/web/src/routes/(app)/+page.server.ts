import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, and, desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

// Belt-and-suspenders 405 for POSTs to `/`. The form-probe POST filter in
// `hooks.server.ts` already catches `POST /` before it reaches SvelteKit,
// but if a future legitimate POST handler is added (or the hook filter is
// loosened), this empty `actions` map keeps the response clean: SvelteKit
// returns a plain 405 instead of `handle_action_request` dumping a full
// stack trace into the production log.
export const actions: Actions = {};

export const load: PageServerLoad = async () => {
    try {
        const trendingShows = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'show'),
                    eq(mediaLibrary.isActive, true),
                    eq(mediaLibrary.visibility, 'public')
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

        const trendingMovies = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    eq(mediaLibrary.mediaType, 'movie'),
                    eq(mediaLibrary.isActive, true),
                    eq(mediaLibrary.visibility, 'public')
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

        return {
            shows: trendingShows,
            movies: trendingMovies,
            documentaries: []
        };
    } catch (error) {
        console.error('Homepage load failed, using fallback data:', error);
        return {
            shows: [],
            movies: [],
            documentaries: []
        };
    }
};
