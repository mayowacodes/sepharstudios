import { MeiliSearch, type Index } from 'meilisearch';
import { env } from '$env/dynamic/private';

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

let cached: MeiliSearch | null = null;

export function isMeiliConfigured(): boolean {
	return !!(env.MEILISEARCH_URL && env.MEILISEARCH_MASTER_KEY);
}

export function getMeiliClient(): MeiliSearch | null {
	if (cached) return cached;
	if (!isMeiliConfigured()) return null;
	cached = new MeiliSearch({
		host: env.MEILISEARCH_URL!,
		apiKey: env.MEILISEARCH_MASTER_KEY!
	});
	return cached;
}

export interface MediaDoc {
	id: string;
	title: string;
	description: string | null;
	genres: string[];
	topics: string[];
	keywords: string[];
	bibleReference: string | null;
	mediaType: string | null;
	category: string | null;
	year: string | null;
	ageRating: string | null;
	thumbnail: string | null;
	posterUrl: string | null;
	viewCount: number;
	createdAt: number;
}

export interface EpisodeDoc {
	id: string;
	showId: string;
	title: string;
	description: string | null;
	seasonNumber: number | null;
	episodeNumber: number | null;
}

export interface CreatorDoc {
	id: string;
	displayName: string;
	bio: string | null;
	denomination: string | null;
}

async function ensureIndex(client: MeiliSearch, uid: string, opts: {
	searchable: string[];
	filterable: string[];
	sortable: string[];
}): Promise<Index> {
	try {
		await client.createIndex(uid, { primaryKey: 'id' });
	} catch {
		// Already exists — that's fine. createIndex throws when the index exists,
		// but the index returned by getIndex still works.
	}
	const idx = client.index(uid);
	// Re-applying settings is cheap and lets us migrate settings on deploy.
	await idx.updateSettings({
		searchableAttributes: opts.searchable,
		filterableAttributes: opts.filterable,
		sortableAttributes: opts.sortable
	}).catch((err) => console.warn(`[meili] updateSettings(${uid}) failed:`, err));
	return idx;
}

export async function indexMedia(docs: MediaDoc[]): Promise<void> {
	const client = getMeiliClient();
	if (!client || docs.length === 0) return;
	const index = await ensureIndex(client, 'media', {
		searchable: ['title', 'description', 'genres', 'topics', 'keywords', 'bibleReference'],
		filterable: ['genres', 'mediaType', 'ageRating', 'year', 'category'],
		sortable: ['viewCount', 'createdAt']
	});
	await index.addDocuments(docs);
}

export async function indexEpisodes(docs: EpisodeDoc[]): Promise<void> {
	const client = getMeiliClient();
	if (!client || docs.length === 0) return;
	const index = await ensureIndex(client, 'episodes', {
		searchable: ['title', 'description'],
		filterable: ['showId'],
		sortable: ['seasonNumber', 'episodeNumber']
	});
	await index.addDocuments(docs);
}

export async function indexCreators(docs: CreatorDoc[]): Promise<void> {
	const client = getMeiliClient();
	if (!client || docs.length === 0) return;
	const index = await ensureIndex(client, 'creators', {
		searchable: ['displayName', 'bio', 'denomination'],
		filterable: ['denomination'],
		sortable: []
	});
	await index.addDocuments(docs);
}

export interface MediaSearchOptions {
	limit?: number;
	offset?: number;
	filter?: string[]; // Meili filter expressions, e.g. `genres = "Drama"`
	sort?: string[];
}

export async function searchMedia(query: string, opts: MediaSearchOptions = {}): Promise<MediaDoc[]> {
	const client = getMeiliClient();
	if (!client) return [];
	const idx = client.index('media');
	const result = await idx.search<MediaDoc>(query, {
		limit: opts.limit ?? 20,
		offset: opts.offset ?? 0,
		filter: opts.filter,
		sort: opts.sort
	});
	return result.hits;
}
