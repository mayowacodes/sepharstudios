import { t as private_env } from "./shared-server.js";
import { Meilisearch } from "meilisearch";
//#region src/lib/server/meilisearch.ts
/**
* Meilisearch client + helpers. Three indexes:
*
*   media     — primary content catalog (movies/shows/documentaries)
*   episodes  — for show episodes
*   creators  — for creator profile pages
*
* Indexes are re-pushed by `/api/cron/meilisearch-reindex` every 30 minutes
* and incrementally by the content-publish endpoint after a release ships.
*
* Env:
*   MEILISEARCH_URL          required — full http(s)://host[:port] URL
*   MEILISEARCH_MASTER_KEY   required server-side — used for admin ops
*
* The client is a lazy singleton: zero cost when search isn't called, and
* `isMeiliConfigured()` lets callers fall back gracefully when env is missing.
*/
var cached = null;
function isMeiliConfigured() {
	return !!(private_env.MEILISEARCH_URL && private_env.MEILISEARCH_MASTER_KEY);
}
function getMeiliClient() {
	if (cached) return cached;
	if (!isMeiliConfigured()) return null;
	cached = new Meilisearch({
		host: private_env.MEILISEARCH_URL,
		apiKey: private_env.MEILISEARCH_MASTER_KEY
	});
	return cached;
}
async function ensureIndex(client, uid, opts) {
	try {
		await client.createIndex(uid, { primaryKey: "id" });
	} catch {}
	const idx = client.index(uid);
	await idx.updateSettings({
		searchableAttributes: opts.searchable,
		filterableAttributes: opts.filterable,
		sortableAttributes: opts.sortable
	}).catch((err) => console.warn(`[meili] updateSettings(${uid}) failed:`, err));
	return idx;
}
async function indexMedia(docs) {
	const client = getMeiliClient();
	if (!client || docs.length === 0) return;
	await (await ensureIndex(client, "media", {
		searchable: [
			"title",
			"description",
			"genres",
			"topics",
			"keywords",
			"bibleReference"
		],
		filterable: [
			"genres",
			"mediaType",
			"ageRating",
			"year",
			"category"
		],
		sortable: ["viewCount", "createdAt"]
	})).addDocuments(docs);
}
async function indexEpisodes(docs) {
	const client = getMeiliClient();
	if (!client || docs.length === 0) return;
	await (await ensureIndex(client, "episodes", {
		searchable: ["title", "description"],
		filterable: ["showId"],
		sortable: ["seasonNumber", "episodeNumber"]
	})).addDocuments(docs);
}
async function indexCreators(docs) {
	const client = getMeiliClient();
	if (!client || docs.length === 0) return;
	await (await ensureIndex(client, "creators", {
		searchable: [
			"displayName",
			"bio",
			"denomination"
		],
		filterable: ["denomination"],
		sortable: []
	})).addDocuments(docs);
}
async function searchMedia(query, opts = {}) {
	const client = getMeiliClient();
	if (!client) return [];
	return (await client.index("media").search(query, {
		limit: opts.limit ?? 20,
		offset: opts.offset ?? 0,
		filter: opts.filter,
		sort: opts.sort
	})).hits;
}
//#endregion
export { searchMedia as a, isMeiliConfigured as i, indexEpisodes as n, indexMedia as r, indexCreators as t };
