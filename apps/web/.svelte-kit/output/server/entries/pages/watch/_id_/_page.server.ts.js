import { A as episodes, K as mediaLibrary, at as ppvPurchases, it as ppvContent, q as mediaWatchProgress, t as db, x as contentSubtitleTracks } from "../../../../chunks/drizzle.js";
import { n as resolvePlaybackUrl } from "../../../../chunks/encoder-playback.js";
import { t as fingerprintFromHeaders } from "../../../../chunks/ua-country.js";
import { t as normalizeLocale } from "../../../../chunks/role-labels.js";
import { error } from "@sveltejs/kit";
import { and, desc, eq, ne, or, sql } from "drizzle-orm";
//#region src/lib/server/region-gate.ts
function isRegionAllowed(input) {
	if (input.isOwner) return true;
	if (input.mode === "all" || !input.mode) return true;
	if (!input.viewerCountry) return true;
	const inList = input.regions.includes(input.viewerCountry.toUpperCase());
	if (input.mode === "allow") return inList;
	if (input.mode === "block") return !inList;
	return true;
}
//#endregion
//#region src/routes/watch/[id]/+page.server.ts
var load = async ({ params, locals, request, url }) => {
	const session = await locals.auth.getSession();
	if (!session) error(401, "Please sign in to watch content");
	const requestedEpisodeId = url.searchParams.get("episode");
	const content = await db.select({
		id: mediaLibrary.id,
		slug: mediaLibrary.slug,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		thumbnail: mediaLibrary.thumbnail,
		posterUrl: mediaLibrary.posterUrl,
		backdropUrl: mediaLibrary.backdropUrl,
		videoUrl: mediaLibrary.videoUrl,
		videoId: mediaLibrary.videoId,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		mediaType: mediaLibrary.mediaType,
		genres: mediaLibrary.genres,
		topics: mediaLibrary.topics,
		duration: mediaLibrary.duration,
		year: mediaLibrary.year,
		rating: mediaLibrary.rating,
		ageRating: mediaLibrary.ageRating,
		bibleReference: mediaLibrary.bibleReference,
		language: mediaLibrary.language,
		category: mediaLibrary.category,
		trailerUrl: mediaLibrary.trailerUrl,
		createdAt: mediaLibrary.createdAt,
		isActive: mediaLibrary.isActive,
		visibility: mediaLibrary.visibility,
		creatorId: mediaLibrary.creatorId,
		chapters: mediaLibrary.chapters,
		cast: mediaLibrary.cast,
		crew: mediaLibrary.crew,
		geoMode: mediaLibrary.geoMode,
		geoRegions: mediaLibrary.geoRegions,
		nextUpContentIds: mediaLibrary.nextUpContentIds,
		previewThumbnailsVtt: mediaLibrary.previewThumbnailsVtt,
		previewSpriteUrls: mediaLibrary.previewSpriteUrls,
		posterAutoUrl: mediaLibrary.posterAutoUrl
	}).from(mediaLibrary).where(or(eq(mediaLibrary.id, params.id), eq(mediaLibrary.slug, params.id))).then((r) => r[0]);
	if (!content || !content.isActive) error(404, "Content not found");
	const isOwner = content.creatorId === session.user.id;
	if (content.visibility === "private" && !isOwner) error(404, "Content not found");
	const fingerprint = fingerprintFromHeaders(request.headers);
	if (!isRegionAllowed({
		mode: content.geoMode ?? "all",
		regions: Array.isArray(content.geoRegions) ? content.geoRegions : [],
		viewerCountry: fingerprint.country,
		isOwner
	})) error(451, "This title isn’t available in your region.");
	const isTvLike = content.mediaType === "tv" || content.mediaType === "series";
	const paywallQ = (async () => {
		if (isOwner) return null;
		const [ppvRow] = await db.select({
			priceCents: ppvContent.finalPriceCents,
			currency: ppvContent.currency
		}).from(ppvContent).where(and(eq(ppvContent.contentId, content.id), eq(ppvContent.isActive, true))).limit(1);
		if (!ppvRow) return null;
		const [purchase] = await db.select({ id: ppvPurchases.id }).from(ppvPurchases).where(and(eq(ppvPurchases.userId, session.user.id), eq(ppvPurchases.contentId, content.id))).limit(1);
		return {
			required: !purchase,
			priceCents: ppvRow.priceCents,
			currency: (ppvRow.currency ?? "USD").toUpperCase()
		};
	})();
	const [paywall, tracks, requestedEp, allEpisodes] = await Promise.all([
		paywallQ,
		db.select().from(contentSubtitleTracks).where(eq(contentSubtitleTracks.contentId, content.id)),
		requestedEpisodeId ? db.select({
			id: episodes.id,
			showId: episodes.showId,
			seasonNumber: episodes.seasonNumber,
			episodeNumber: episodes.episodeNumber,
			title: episodes.title,
			description: episodes.description,
			thumbnail: episodes.thumbnail,
			duration: episodes.duration,
			videoUrl: episodes.videoUrl
		}).from(episodes).where(eq(episodes.id, requestedEpisodeId)).limit(1).then((r) => r[0] ?? null) : Promise.resolve(null),
		isTvLike ? db.select({
			id: episodes.id,
			seasonNumber: episodes.seasonNumber,
			episodeNumber: episodes.episodeNumber,
			title: episodes.title,
			thumbnail: episodes.thumbnail,
			duration: episodes.duration
		}).from(episodes).where(eq(episodes.showId, content.id)).orderBy(episodes.seasonNumber, episodes.episodeNumber) : Promise.resolve([])
	]);
	const subtitles = tracks.filter((t) => t.kind !== "descriptions").map((t) => ({
		label: t.label,
		src: t.fileUrl,
		srclang: t.language
	}));
	const descriptions = tracks.filter((t) => t.kind === "descriptions").map((t) => ({
		label: t.label,
		src: t.fileUrl,
		srclang: t.language
	}));
	let playbackUrl = resolvePlaybackUrl({
		videoUrl: content.videoUrl,
		encoderJobId: content.encoderJobId,
		processingStatus: content.processingStatus
	});
	let activeEpisode = null;
	if (requestedEp && requestedEp.showId === content.id) {
		activeEpisode = {
			id: requestedEp.id,
			seasonNumber: requestedEp.seasonNumber,
			episodeNumber: requestedEp.episodeNumber,
			title: requestedEp.title,
			description: requestedEp.description,
			thumbnail: requestedEp.thumbnail,
			duration: requestedEp.duration,
			videoUrl: requestedEp.videoUrl
		};
		if (requestedEp.videoUrl) playbackUrl = requestedEp.videoUrl;
	}
	let watchProgress = null;
	if (session.user.id) {
		const [row] = await db.select({
			positionSeconds: mediaWatchProgress.positionSeconds,
			durationSeconds: mediaWatchProgress.durationSeconds,
			completionPercent: mediaWatchProgress.completionPercent
		}).from(mediaWatchProgress).where(and(eq(mediaWatchProgress.userId, session.user.id), eq(mediaWatchProgress.contentId, content.id), activeEpisode ? eq(mediaWatchProgress.episodeId, activeEpisode.id) : sql`${mediaWatchProgress.episodeId} IS NULL`)).orderBy(desc(mediaWatchProgress.updatedAt)).limit(1);
		if (row) watchProgress = {
			positionSeconds: row.positionSeconds ?? 0,
			durationSeconds: row.durationSeconds,
			completionPercent: row.completionPercent ?? 0
		};
	}
	const nextUp = [];
	let endOfSeries = false;
	let nextEpisodeHref = null;
	if (isTvLike) {
		if (allEpisodes.length > 0) {
			let nextEp = allEpisodes[0];
			if (activeEpisode) {
				const idx = allEpisodes.findIndex((e) => e.seasonNumber === activeEpisode.seasonNumber && e.episodeNumber === activeEpisode.episodeNumber);
				nextEp = idx >= 0 ? allEpisodes[idx + 1] : void 0;
				if (idx >= 0 && !nextEp) endOfSeries = true;
			}
			if (nextEp) {
				const href = `/watch/${content.slug || content.id}?episode=${nextEp.id}`;
				nextEpisodeHref = href;
				nextUp.push({
					id: nextEp.id,
					slug: null,
					title: `S${nextEp.seasonNumber} E${nextEp.episodeNumber}: ${nextEp.title}`,
					thumbnail: nextEp.thumbnail,
					duration: nextEp.duration,
					href,
					kind: "Next episode"
				});
			}
		}
	}
	const curatedIds = Array.isArray(content.nextUpContentIds) ? content.nextUpContentIds : [];
	if (curatedIds.length > 0) {
		const curatedRows = await db.select({
			id: mediaLibrary.id,
			slug: mediaLibrary.slug,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(sql`${mediaLibrary.id} = ANY(${curatedIds})`, eq(mediaLibrary.isActive, true))).limit(3);
		const byId = new Map(curatedRows.map((r) => [r.id, r]));
		for (const cid of curatedIds) {
			const r = byId.get(cid);
			if (!r) continue;
			nextUp.push({
				id: r.id,
				slug: r.slug ?? null,
				title: r.title,
				thumbnail: r.thumbnail ?? null,
				duration: r.duration ?? null
			});
			if (nextUp.length >= 3) break;
		}
	}
	if (nextUp.length < 3 && content.creatorId) {
		const sameCreator = await db.select({
			id: mediaLibrary.id,
			slug: mediaLibrary.slug,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, content.creatorId), ne(mediaLibrary.id, content.id), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"))).orderBy(desc(mediaLibrary.viewCount)).limit(3 - nextUp.length);
		for (const r of sameCreator) {
			if (nextUp.find((x) => x.id === r.id)) continue;
			nextUp.push({
				id: r.id,
				slug: r.slug ?? null,
				title: r.title,
				thumbnail: r.thumbnail ?? null,
				duration: r.duration ?? null
			});
			if (nextUp.length >= 3) break;
		}
	}
	if (nextUp.length < 3 && Array.isArray(content.genres) && content.genres.length > 0) {
		const genres = content.genres;
		const sameGenre = await db.select({
			id: mediaLibrary.id,
			slug: mediaLibrary.slug,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(ne(mediaLibrary.id, content.id), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"), sql`${mediaLibrary.genres} ?| array[${sql.join(genres.map((g) => sql`${g}`), sql`, `)}]`)).orderBy(desc(mediaLibrary.viewCount)).limit(3 - nextUp.length);
		for (const r of sameGenre) if (!nextUp.find((x) => x.id === r.id)) nextUp.push({
			id: r.id,
			slug: r.slug ?? null,
			title: r.title,
			thumbnail: r.thumbnail ?? null,
			duration: r.duration ?? null
		});
	}
	const localeOverride = new URL(request.url).searchParams.get("locale");
	const acceptLang = request.headers.get("accept-language")?.split(",")[0]?.trim();
	const viewerLocale = normalizeLocale(localeOverride || acceptLang);
	const paywallLocked = paywall?.required === true;
	return {
		content: {
			...content,
			playbackUrl: paywallLocked ? null : playbackUrl,
			videoUrl: paywallLocked ? null : content.videoUrl
		},
		activeEpisode: paywallLocked && activeEpisode ? {
			...activeEpisode,
			videoUrl: null
		} : activeEpisode,
		watchProgress,
		subtitles,
		descriptions,
		nextUp,
		endOfSeries,
		nextEpisodeHref,
		viewerLocale,
		paywall,
		activeProfileId: locals.activeProfileId
	};
};
//#endregion
export { load };
