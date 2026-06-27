import { db } from '$lib/db/drizzle';
import { mediaLibrary, mediaWatchProgress, episodes } from '$lib/db/schema/sepharstudios';
import { mediaCardColumns } from '$lib/db/projections';
import { eq, and, desc, asc, sql, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { attachCatalogProgress } from '$lib/server/catalog-progress';

// Belt-and-suspenders 405 for POSTs to `/`. The form-probe POST filter in
// `hooks.server.ts` already catches `POST /` before it reaches SvelteKit,
// but if a future legitimate POST handler is added (or the hook filter is
// loosened), this empty `actions` map keeps the response clean: SvelteKit
// returns a plain 405 instead of `handle_action_request` dumping a full
// stack trace into the production log.
export const actions: Actions = {};

export const load: PageServerLoad = async ({ locals }) => {
    try {
        // Accept both wizard literal ('series') and legacy ('show') so the
        // landing page doesn't miss rows the catalog at /shows now lists.
        const trendingShows = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    inArray(mediaLibrary.mediaType, ['show', 'series']),
                    eq(mediaLibrary.isActive, true),
                    eq(mediaLibrary.visibility, 'public')
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

        // Short Film lumped into trending movies — matches /movies coverage.
        const trendingMovies = await db.select()
            .from(mediaLibrary)
            .where(
                and(
                    inArray(mediaLibrary.mediaType, ['movie', 'short']),
                    eq(mediaLibrary.isActive, true),
                    eq(mediaLibrary.visibility, 'public')
                )
            )
            .orderBy(desc(mediaLibrary.createdAt))
            .limit(10);

        // Continue Watching — signed-in viewers get a row of in-progress
        // titles (positionSeconds >= 15, completionPercent < 95).
        // Anonymous viewers + no-progress accounts get an empty array
        // and the row simply doesn't render. The query selects the
        // single most-recent watch row per content (DISTINCT ON the
        // contentId, ordered by updated_at) so a viewer who watched
        // five different episodes of one show only sees ONE card for
        // the show, surfaced at the most recent episode they touched.
        let continueWatching: Array<{
            contentId: string;
            slug: string | null;
            category: string | null;
            title: string;
            thumbnail: string | null;
            posterUrl: string | null;
            backdropUrl: string | null;
            mediaType: string | null;
            positionSeconds: number;
            durationSeconds: number | null;
            completionPercent: number;
            episodeId: string | null;
            episodeSeason: number | null;
            episodeNumber: number | null;
            episodeTitle: string | null;
        }> = [];
        const session = await locals.auth.getSession();
        if (session?.user.id) {
            // Postgres DISTINCT ON keeps the most-recent row per
            // content. Joined with mediaLibrary for the card data and
            // LEFT JOINed with episodes so a row carrying an
            // episodeId can attach the season/number/title for the
            // chip overlay. Limit 10 — the carousel scrolls if more.
            const rows = await db.execute(sql`
                SELECT DISTINCT ON (mwp.content_id)
                    mwp.content_id          AS content_id,
                    mwp.position_seconds    AS position_seconds,
                    mwp.duration_seconds    AS duration_seconds,
                    mwp.completion_percent  AS completion_percent,
                    mwp.episode_id          AS episode_id,
                    mwp.updated_at          AS updated_at,
                    ml.slug                 AS slug,
                    ml.category             AS category,
                    ml.title                AS title,
                    ml.thumbnail            AS thumbnail,
                    ml.poster_url           AS poster_url,
                    ml.backdrop_url         AS backdrop_url,
                    ml.media_type           AS media_type,
                    ep.season_number        AS episode_season,
                    ep.episode_number       AS episode_number,
                    ep.title                AS episode_title
                FROM media_watch_progress mwp
                JOIN media_library ml ON ml.id = mwp.content_id
                LEFT JOIN episodes ep ON ep.id = mwp.episode_id
                WHERE mwp.user_id = ${session.user.id}
                  AND ml.is_active = true
                  AND mwp.position_seconds >= 15
                  AND COALESCE(mwp.completion_percent, 0) < 95
                ORDER BY mwp.content_id, mwp.updated_at DESC
                LIMIT 10
            `);
            const data = (Array.isArray(rows) ? rows : (rows as { rows?: unknown[] }).rows ?? []) as Array<{
                content_id: string;
                slug: string | null;
                category: string | null;
                title: string;
                thumbnail: string | null;
                poster_url: string | null;
                backdrop_url: string | null;
                media_type: string | null;
                position_seconds: number;
                duration_seconds: number | null;
                completion_percent: number;
                episode_id: string | null;
                episode_season: number | null;
                episode_number: number | null;
                episode_title: string | null;
                updated_at: string;
            }>;
            // Re-sort by recency (DISTINCT ON forces ordering by
            // content_id first, so we need a second pass to put the
            // truly most-recent title first).
            data.sort((a, b) => (b.updated_at > a.updated_at ? 1 : -1));
            continueWatching = data.map((r) => ({
                contentId: r.content_id,
                slug: r.slug,
                category: r.category,
                title: r.title,
                thumbnail: r.thumbnail,
                posterUrl: r.poster_url,
                backdropUrl: r.backdrop_url,
                mediaType: r.media_type,
                positionSeconds: r.position_seconds ?? 0,
                durationSeconds: r.duration_seconds,
                completionPercent: r.completion_percent ?? 0,
                episodeId: r.episode_id,
                episodeSeason: r.episode_season,
                episodeNumber: r.episode_number,
                episodeTitle: r.episode_title
            }));
        }

        // Catalog cards on the home page get the same in-progress
        // overlay as the dedicated /movies + /shows pages so the
        // "you started this" signal stays consistent across the site.
        // Coming Soon row gets the next 12 across all media types so
        // the carousel surfaces a representative mix on the landing.
        const [showsWithProgress, moviesWithProgress, comingSoon] = await Promise.all([
            attachCatalogProgress(trendingShows, session?.user.id),
            attachCatalogProgress(trendingMovies, session?.user.id),
            db.select(mediaCardColumns)
                .from(mediaLibrary)
                .where(eq(mediaLibrary.status, 'coming_soon'))
                .orderBy(asc(mediaLibrary.scheduledPublishAt))
                .limit(12)
        ]);

        return {
            shows: showsWithProgress,
            movies: moviesWithProgress,
            documentaries: [],
            continueWatching,
            comingSoon
        };
    } catch (error) {
        console.error('Homepage load failed, using fallback data:', error);
        return {
            shows: [],
            movies: [],
            documentaries: [],
            continueWatching: [],
            comingSoon: []
        };
    }
};
