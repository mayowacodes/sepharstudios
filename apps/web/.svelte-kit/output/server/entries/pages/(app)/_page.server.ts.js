import { K as mediaLibrary, t as db } from "../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../chunks/projections.js";
import { t as attachCatalogProgress } from "../../../chunks/catalog-progress.js";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
//#region src/routes/(app)/+page.server.ts
var actions = {};
var load = async ({ locals }) => {
	try {
		const [trendingShows, trendingMovies] = await Promise.all([db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, ["show", "series"]), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"))).orderBy(desc(mediaLibrary.createdAt)).limit(10), db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, ["movie", "short"]), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"))).orderBy(desc(mediaLibrary.createdAt)).limit(10)]);
		let continueWatching = [];
		const session = await locals.auth.getSession();
		if (session?.user.id) {
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
			const data = Array.isArray(rows) ? rows : rows.rows ?? [];
			data.sort((a, b) => b.updated_at > a.updated_at ? 1 : -1);
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
		const [showsWithProgress, moviesWithProgress, comingSoon] = await Promise.all([
			attachCatalogProgress(trendingShows, session?.user.id),
			attachCatalogProgress(trendingMovies, session?.user.id),
			db.select(mediaCardColumns).from(mediaLibrary).where(eq(mediaLibrary.status, "coming_soon")).orderBy(asc(mediaLibrary.scheduledPublishAt)).limit(12)
		]);
		return {
			shows: showsWithProgress,
			movies: moviesWithProgress,
			documentaries: [],
			continueWatching,
			comingSoon
		};
	} catch (error) {
		console.error("Homepage load failed, using fallback data:", error);
		return {
			shows: [],
			movies: [],
			documentaries: [],
			continueWatching: [],
			comingSoon: []
		};
	}
};
//#endregion
export { actions, load };
