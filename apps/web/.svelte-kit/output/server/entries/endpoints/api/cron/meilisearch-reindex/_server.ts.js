import { t as private_env } from "../../../../../chunks/shared-server.js";
import { D as episodes, H as mediaLibrary, T as creators, t as db } from "../../../../../chunks/drizzle.js";
import { a as isMeiliConfigured, i as indexMedia, n as indexCreators, r as indexEpisodes } from "../../../../../chunks/meilisearch2.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/cron/meilisearch-reindex/+server.ts
/**
* POST /api/cron/meilisearch-reindex
*
* Re-pushes all indexable rows to Meilisearch in batches of 500.
*
* Auth: same CRON_SECRET bearer pattern as the other crons.
* Schedule: every 30 min (`*​/30 * * * *`).
*
* Falls through with `skipped: true` when Meili isn't configured — the
* /api/search endpoint will likewise no-op, and the search page will fall
* back entirely to AI semantic search.
*/
var BATCH = 500;
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured on server" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	if (!isMeiliConfigured()) return json({
		ok: true,
		skipped: true,
		reason: "Meilisearch is not configured (MEILISEARCH_URL / MEILISEARCH_MASTER_KEY missing)."
	});
	const result = {
		media: 0,
		episodes: 0,
		creators: 0,
		errors: []
	};
	try {
		const docs = (await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			genres: mediaLibrary.genres,
			topics: mediaLibrary.topics,
			keywords: mediaLibrary.keywords,
			bibleReference: mediaLibrary.bibleReference,
			mediaType: mediaLibrary.mediaType,
			category: mediaLibrary.category,
			year: mediaLibrary.year,
			ageRating: mediaLibrary.ageRating,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			viewCount: mediaLibrary.viewCount,
			createdAt: mediaLibrary.createdAt,
			cast: mediaLibrary.cast,
			crew: mediaLibrary.crew
		}).from(mediaLibrary).where(and(eq(mediaLibrary.isActive, true), eq(mediaLibrary.status, "approved"), eq(mediaLibrary.visibility, "public")))).map((r) => ({
			id: r.id,
			title: r.title,
			description: r.description,
			genres: r.genres ?? [],
			topics: r.topics ?? [],
			keywords: r.keywords ?? [],
			bibleReference: r.bibleReference,
			mediaType: r.mediaType,
			category: r.category,
			year: r.year,
			ageRating: r.ageRating,
			thumbnail: r.thumbnail,
			posterUrl: r.posterUrl,
			viewCount: Number(r.viewCount ?? 0),
			createdAt: r.createdAt.getTime(),
			castNames: Array.isArray(r.cast) ? r.cast.map((c) => c.name).filter(Boolean) : [],
			crewNames: Array.isArray(r.crew) ? r.crew.map((c) => c.name).filter(Boolean) : []
		}));
		for (let i = 0; i < docs.length; i += BATCH) await indexMedia(docs.slice(i, i + BATCH));
		result.media = docs.length;
	} catch (err) {
		result.errors.push(`media: ${err instanceof Error ? err.message : String(err)}`);
	}
	try {
		const docs = (await db.select({
			id: episodes.id,
			showId: episodes.showId,
			title: episodes.title,
			description: episodes.description,
			seasonNumber: episodes.seasonNumber,
			episodeNumber: episodes.episodeNumber
		}).from(episodes)).map((r) => ({
			id: r.id,
			showId: r.showId,
			title: r.title,
			description: r.description,
			seasonNumber: r.seasonNumber ?? null,
			episodeNumber: r.episodeNumber ?? null
		}));
		for (let i = 0; i < docs.length; i += BATCH) await indexEpisodes(docs.slice(i, i + BATCH));
		result.episodes = docs.length;
	} catch (err) {
		result.errors.push(`episodes: ${err instanceof Error ? err.message : String(err)}`);
	}
	try {
		const docs = (await db.select({
			id: creators.id,
			displayName: creators.displayName,
			bio: creators.bio,
			denomination: creators.denomination
		}).from(creators).where(eq(creators.isVerified, true))).map((r) => ({
			id: r.id,
			displayName: r.displayName,
			bio: r.bio,
			denomination: r.denomination
		}));
		for (let i = 0; i < docs.length; i += BATCH) await indexCreators(docs.slice(i, i + BATCH));
		result.creators = docs.length;
	} catch (err) {
		result.errors.push(`creators: ${err instanceof Error ? err.message : String(err)}`);
	}
	return json({
		ok: true,
		runAt: (/* @__PURE__ */ new Date()).toISOString(),
		...result
	});
};
//#endregion
export { POST };
