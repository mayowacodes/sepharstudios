import { A as episodes, K as mediaLibrary, nt as playlistItems, q as mediaWatchProgress, rt as playlists, t as db } from "./drizzle.js";
import { n as resolvePlaybackUrl } from "./encoder-playback.js";
import { error } from "@sveltejs/kit";
import { and, desc, eq, or } from "drizzle-orm";
//#region src/lib/server/media-detail-load.ts
/**
* Shared load function for the audience-specific detail pages
* (movies / shows / documentaries / kids / teens). The route's own
* +page.server.ts passes the URL param and the expected `mediaType`
* filter so a `/movies/<slug>` request can't resolve a TV-series row,
* and an optional `category` filter so the kids / teens routes only
* resolve content marked for those audiences.
*
* The `slug | uuid` lookup matches the watch route's behaviour — both
* shapes work, slug is preferred for user-visible URLs.
*
* Episodes are fetched only when the row is `tv` (or `series`); for
* movies + documentaries the array stays empty and the detail page
* skips its episodes section.
*/
async function loadMediaDetail(params) {
	const { slug, mediaType, category, userId } = params;
	const typeMatches = mediaType ? mediaType === "tv" ? or(eq(mediaLibrary.mediaType, "tv"), eq(mediaLibrary.mediaType, "series")) : mediaType === "movie" ? or(eq(mediaLibrary.mediaType, "movie"), eq(mediaLibrary.mediaType, "short")) : eq(mediaLibrary.mediaType, mediaType) : void 0;
	const categoryMatches = category ? eq(mediaLibrary.category, category) : void 0;
	const [row] = await db.select({
		id: mediaLibrary.id,
		slug: mediaLibrary.slug,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		thumbnail: mediaLibrary.thumbnail,
		backdropUrl: mediaLibrary.backdropUrl,
		posterUrl: mediaLibrary.posterUrl,
		logoTitleUrl: mediaLibrary.logoTitleUrl,
		trailerUrl: mediaLibrary.trailerUrl,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		ageRating: mediaLibrary.ageRating,
		genres: mediaLibrary.genres,
		topics: mediaLibrary.topics,
		year: mediaLibrary.year,
		duration: mediaLibrary.duration,
		language: mediaLibrary.language,
		bibleReference: mediaLibrary.bibleReference,
		cast: mediaLibrary.cast,
		crew: mediaLibrary.crew,
		mediaType: mediaLibrary.mediaType,
		isActive: mediaLibrary.isActive,
		visibility: mediaLibrary.visibility,
		status: mediaLibrary.status,
		scheduledPublishAt: mediaLibrary.scheduledPublishAt
	}).from(mediaLibrary).where(and(or(eq(mediaLibrary.id, slug), eq(mediaLibrary.slug, slug)), ...typeMatches ? [typeMatches] : [], ...categoryMatches ? [categoryMatches] : [])).limit(1);
	if (!row || !row.isActive && row.status !== "coming_soon") error(404, "Content not found");
	if (row.visibility === "private") error(404, "Content not found");
	const playbackUrl = resolvePlaybackUrl({
		videoUrl: row.videoUrl,
		encoderJobId: row.encoderJobId,
		processingStatus: row.processingStatus
	});
	let episodeRows = [];
	if (mediaType === "tv" || mediaType === "series" || row.mediaType === "tv" || row.mediaType === "series") episodeRows = await db.select().from(episodes).where(eq(episodes.showId, row.id));
	let watchProgress = null;
	if (userId) {
		const [wp] = await db.select({
			positionSeconds: mediaWatchProgress.positionSeconds,
			durationSeconds: mediaWatchProgress.durationSeconds,
			completionPercent: mediaWatchProgress.completionPercent,
			episodeId: mediaWatchProgress.episodeId
		}).from(mediaWatchProgress).where(and(eq(mediaWatchProgress.userId, userId), eq(mediaWatchProgress.contentId, row.id))).orderBy(desc(mediaWatchProgress.updatedAt)).limit(1);
		if (wp) {
			const lastWasComplete = (wp.completionPercent ?? 0) >= 95;
			const lastEp = wp.episodeId ? episodeRows.find((e) => e.id === wp.episodeId) : void 0;
			if (lastWasComplete && lastEp && episodeRows.length > 0) {
				const sorted = [...episodeRows].sort((a, b) => a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber);
				const idx = sorted.findIndex((e) => e.seasonNumber === lastEp.seasonNumber && e.episodeNumber === lastEp.episodeNumber);
				const next = idx >= 0 ? sorted[idx + 1] : void 0;
				if (next) watchProgress = {
					positionSeconds: 0,
					durationSeconds: null,
					completionPercent: 0,
					episodeId: next.id,
					episodeSeason: next.seasonNumber,
					episodeNumber: next.episodeNumber,
					episodeTitle: next.title,
					isNextEpisode: true
				};
			}
			if (!watchProgress && (wp.positionSeconds ?? 0) >= 15 && (wp.completionPercent ?? 0) < 95) watchProgress = {
				positionSeconds: wp.positionSeconds ?? 0,
				durationSeconds: wp.durationSeconds,
				completionPercent: wp.completionPercent ?? 0,
				episodeId: wp.episodeId,
				episodeSeason: lastEp?.seasonNumber ?? null,
				episodeNumber: lastEp?.episodeNumber ?? null,
				episodeTitle: lastEp?.title ?? null
			};
		}
	}
	let isInMyList = false;
	if (userId) {
		const [hit] = await db.select({ id: playlistItems.id }).from(playlistItems).innerJoin(playlists, eq(playlistItems.playlistId, playlists.id)).where(and(eq(playlists.userId, userId), eq(playlists.isDefault, true), eq(playlistItems.contentId, row.id))).limit(1);
		isInMyList = !!hit;
	}
	return {
		content: {
			...row,
			playbackUrl
		},
		episodes: episodeRows.map((ep) => ({
			id: ep.id,
			seasonNumber: ep.seasonNumber,
			episodeNumber: ep.episodeNumber,
			title: ep.title,
			description: ep.description,
			thumbnail: ep.thumbnail,
			duration: ep.duration
		})),
		watchProgress,
		isInMyList
	};
}
//#endregion
export { loadMediaDetail as t };
