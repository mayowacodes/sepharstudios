import { db } from '$lib/db/drizzle';
import { mediaWatchProgress, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, desc, inArray, and, or, sql, ilike } from 'drizzle-orm';
import { callAgent, extractJsonArray, SEPHAR_SYSTEM_PROMPT } from './ai-provider';
import { getRedis } from './redis';

/**
 * AI-DRIVEN RECOMMENDATIONS  [Hermes 3 — structured JSON ranking]
 * Fallback chain: Redis cache → Hermes 3 (local) → OpenRouter Hermes → recency order
 *
 * The LLM ranking is EXPENSIVE (up to two 15s provider timeouts back to
 * back), so the ranked ID list is cached in Redis per user+profile:
 *   - 1h TTL on a successful LLM ranking
 *   - 10min TTL when we had to fall back to recency order (so the LLM
 *     gets retried soon without hammering it on every dashboard visit)
 * Cache stores IDs only; the card data is re-fetched fresh so title /
 * poster edits show up immediately.
 */

const REC_CACHE_TTL_RANKED = 3600;   // 1h — LLM ranking succeeded
const REC_CACHE_TTL_FALLBACK = 600;  // 10min — recency fallback, retry soon
const REC_LLM_TIMEOUT_MS = 8000;     // bound the request-path LLM wait

const recCandidateColumns = {
	id: mediaLibrary.id,
	title: mediaLibrary.title,
	genres: mediaLibrary.genres,
	topics: mediaLibrary.topics,
	mediaType: mediaLibrary.mediaType,
	category: mediaLibrary.category,
	ageRating: mediaLibrary.ageRating,
	// Poster + thumbnail — the dashboard Recommendations card reads
	// `posterUrl ?? thumbnail` for its artwork.
	thumbnail: mediaLibrary.thumbnail,
	posterUrl: mediaLibrary.posterUrl
};

type RecCandidate = Awaited<ReturnType<typeof fetchCandidateRows>>[number];

function fetchCandidateRows(ids: string[]) {
	return db
		.select(recCandidateColumns)
		.from(mediaLibrary)
		.where(and(inArray(mediaLibrary.id, ids), eq(mediaLibrary.isActive, true)));
}

/** Fetch card rows for a ranked ID list, preserving the ranking order. */
async function fetchByIdsOrdered(ids: string[], limit: number): Promise<RecCandidate[]> {
	if (ids.length === 0) return [];
	const rows = await fetchCandidateRows(ids);
	const byId = new Map(rows.map((r) => [r.id, r]));
	return ids.map((id) => byId.get(id)).filter((r): r is RecCandidate => !!r).slice(0, limit);
}

export async function getRecommendations(userId: string, profileId: string | null, limit = 12) {
	// 1. Cache hit → re-fetch fresh card data in ranked order and return.
	//    Redis being down just means we skip the cache (never fail recs).
	const cacheKey = `recs:v2:${userId}:${profileId ?? '_'}`;
	try {
		const cached = await getRedis().get(cacheKey);
		if (cached) {
			const ids = JSON.parse(cached) as string[];
			const rows = await fetchByIdsOrdered(ids, limit);
			if (rows.length > 0) return rows;
		}
	} catch { /* cache unavailable — compute fresh */ }

	const history = await db
		.select({ contentId: mediaWatchProgress.contentId, completionPercent: mediaWatchProgress.completionPercent })
		.from(mediaWatchProgress)
		.where(eq(mediaWatchProgress.userId, userId))
		.orderBy(desc(mediaWatchProgress.updatedAt))
		.limit(20);

	const watchedIds = history.map((h) => h.contentId);

	// Newest-first so the LLM ranks a meaningful pool. The old query had
	// NO ORDER BY — Postgres returned 50 arbitrary rows, so the "top 50
	// candidates" were whatever the planner happened to emit.
	const candidates = await db
		.select(recCandidateColumns)
		.from(mediaLibrary)
		.where(eq(mediaLibrary.isActive, true))
		.orderBy(desc(mediaLibrary.createdAt))
		.limit(50);

	const unwatched = candidates.filter((c) => !watchedIds.includes(c.id));

	const cacheAndReturn = async (rows: RecCandidate[], ttl: number) => {
		try {
			await getRedis().set(cacheKey, JSON.stringify(rows.map((r) => r.id)), 'EX', ttl);
		} catch { /* cache unavailable — still return results */ }
		return rows.slice(0, limit);
	};

	if (unwatched.length === 0) return cacheAndReturn(candidates, REC_CACHE_TTL_FALLBACK);
	if (history.length === 0) return cacheAndReturn(unwatched, REC_CACHE_TTL_FALLBACK);

	const watchedContent = await db
		.select({ title: mediaLibrary.title, genres: mediaLibrary.genres })
		.from(mediaLibrary)
		.where(inArray(mediaLibrary.id, watchedIds.slice(0, 10)));

	const watchedTitles = watchedContent.map((w) => w.title).join(', ');
	const candidateSummary = unwatched.slice(0, 20).map((c) => `${c.id}:${c.title}`).join('\n');

	// Bounded LLM wait: 8s instead of the provider default (15s Ollama
	// + 15s OpenRouter = 30s worst case). A slow model just means this
	// request serves the recency fallback and the 10min TTL retries.
	const result = await callAgent(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `You are a recommendation engine for a faith-based streaming platform.
A user recently watched: ${watchedTitles}.

From the following list (format: id:title), rank the top ${limit} most relevant items.
Return ONLY a JSON array of content IDs in order of relevance, nothing else.
Example: ["id1","id2","id3"]

Content list:
${candidateSummary}`
			}
		],
		{ temperature: 0.2, maxTokens: 512, timeoutMs: REC_LLM_TIMEOUT_MS }
	);

	if (result) {
		const rankedIds = extractJsonArray<string>(result.content);
		if (rankedIds && rankedIds.length > 0) {
			const ranked = rankedIds.map((id) => unwatched.find((c) => c.id === id)).filter(Boolean) as typeof unwatched;
			if (ranked.length > 0) return cacheAndReturn(ranked, REC_CACHE_TTL_RANKED);
		}
	}

	return cacheAndReturn(unwatched, REC_CACHE_TTL_FALLBACK);
}

/**
 * Fallback text search — used ONLY when Meilisearch isn't configured
 * (the /api/search endpoint is the primary path; the search page falls
 * back to /api/ai/search → here on a Meili 503).
 *
 * This used to run an LLM intent-classification call (up to two 15s
 * provider timeouts) + fetch 100 FULL rows and score them in JS per
 * request. Replaced with a single indexed ILIKE query: match the full
 * phrase or any significant word against title/description, rank
 * full-phrase title matches first, then popularity. No LLM in the
 * request path.
 */
export async function semanticSearch(
	query: string,
	limit = 12
): Promise<typeof mediaLibrary.$inferSelect[]> {
	const trimmed = query.trim();
	if (!trimmed) return [];

	// Full phrase + up to 6 significant words (>2 chars), escaped for LIKE.
	const esc = (s: string) => s.replace(/[%_\\]/g, (m) => `\\${m}`);
	const words = trimmed.toLowerCase().split(/\s+/).filter((w) => w.length > 2).slice(0, 6);
	const phrasePattern = `%${esc(trimmed)}%`;
	const wordPatterns = words.map((w) => `%${esc(w)}%`);
	const allPatterns = [phrasePattern, ...wordPatterns];

	return db
		.select()
		.from(mediaLibrary)
		.where(and(
			eq(mediaLibrary.isActive, true),
			or(
				sql`${mediaLibrary.title} ILIKE ANY(${allPatterns})`,
				sql`${mediaLibrary.description} ILIKE ANY(${allPatterns})`
			)
		))
		.orderBy(
			// Full-phrase title hit ranks above word hits; popularity breaks ties.
			desc(ilike(mediaLibrary.title, phrasePattern)),
			desc(mediaLibrary.viewCount)
		)
		.limit(limit);
}
