import { H as mediaLibrary, et as ppvContent, t as db, tt as ppvPurchases, y as contentSubtitleTracks } from "../../../../chunks/drizzle.js";
import { a as getEncoderPlayback } from "../../../../chunks/encoder-orchestrator.js";
import { t as fingerprintFromHeaders } from "../../../../chunks/ua-country.js";
import { t as normalizeLocale } from "../../../../chunks/role-labels.js";
import { error } from "@sveltejs/kit";
import { and, desc, eq, ne, sql } from "drizzle-orm";
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
var load = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) error(401, "Please sign in to watch content");
	const content = await db.select({
		id: mediaLibrary.id,
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
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).then((r) => r[0]);
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
	let paywall = null;
	if (!isOwner) {
		const [ppvRow] = await db.select({
			priceCents: ppvContent.finalPriceCents,
			currency: ppvContent.currency
		}).from(ppvContent).where(and(eq(ppvContent.contentId, content.id), eq(ppvContent.isActive, true))).limit(1);
		if (ppvRow) {
			const [purchase] = await db.select({ id: ppvPurchases.id }).from(ppvPurchases).where(and(eq(ppvPurchases.userId, session.user.id), eq(ppvPurchases.contentId, content.id))).limit(1);
			paywall = {
				required: !purchase,
				priceCents: ppvRow.priceCents,
				currency: (ppvRow.currency ?? "USD").toUpperCase()
			};
		}
	}
	const tracks = await db.select().from(contentSubtitleTracks).where(eq(contentSubtitleTracks.contentId, content.id));
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
	let playbackUrl = content.videoUrl;
	if (!playbackUrl && content.encoderJobId && content.processingStatus === "ready") try {
		playbackUrl = (await getEncoderPlayback(content.encoderJobId)).playback.master;
	} catch (err) {
		console.error(`Failed to sign playback URL for ${content.id}:`, err);
	}
	const nextUp = [];
	const curatedIds = Array.isArray(content.nextUpContentIds) ? content.nextUpContentIds : [];
	if (curatedIds.length > 0) {
		const curatedRows = await db.select({
			id: mediaLibrary.id,
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
				title: r.title,
				thumbnail: r.thumbnail ?? null,
				duration: r.duration ?? null
			});
			if (nextUp.length >= 3) break;
		}
	}
	if (nextUp.length === 0 && content.creatorId) {
		const sameCreator = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, content.creatorId), ne(mediaLibrary.id, content.id), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"))).orderBy(desc(mediaLibrary.viewCount)).limit(3);
		for (const r of sameCreator) nextUp.push({
			id: r.id,
			title: r.title,
			thumbnail: r.thumbnail ?? null,
			duration: r.duration ?? null
		});
	}
	if (nextUp.length < 3 && Array.isArray(content.genres) && content.genres.length > 0) {
		const genres = content.genres;
		const sameGenre = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(ne(mediaLibrary.id, content.id), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"), sql`${mediaLibrary.genres} ?| array[${sql.join(genres.map((g) => sql`${g}`), sql`, `)}]`)).orderBy(desc(mediaLibrary.viewCount)).limit(3 - nextUp.length);
		for (const r of sameGenre) if (!nextUp.find((x) => x.id === r.id)) nextUp.push({
			id: r.id,
			title: r.title,
			thumbnail: r.thumbnail ?? null,
			duration: r.duration ?? null
		});
	}
	const localeOverride = new URL(request.url).searchParams.get("locale");
	const acceptLang = request.headers.get("accept-language")?.split(",")[0]?.trim();
	const viewerLocale = normalizeLocale(localeOverride || acceptLang);
	return {
		content: {
			...content,
			playbackUrl
		},
		subtitles,
		descriptions,
		nextUp,
		viewerLocale,
		paywall,
		activeProfileId: locals.activeProfileId
	};
};
//#endregion
export { load };
