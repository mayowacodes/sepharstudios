import { e as enforceRateLimit, b as AI_SEARCH_LIMIT } from './rate-limit-8igsU22q.js';
import { s as semanticSearch } from './recommendations-CzDDh4-b.js';
import { e as error, j as json } from './index.js-BP8aAXBX.js';
import './redis-8sKVJ4Iw.js';
import 'ioredis';
import './drizzle-CsnNxG5m.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-DSZS7CVy.js';
import './ai-settings-D6n_XJi6.js';

//#region src/routes/api/ai/search/+server.ts
/**
* GET /api/ai/search?q=something+emotional+but+uplifting&limit=12
* Semantic search: natural language → AI intent classification → scored content results
*/
var GET = async ({ url, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	await enforceRateLimit(`ai:search:${locals.user.id}`, AI_SEARCH_LIMIT);
	const query = url.searchParams.get("q")?.trim();
	if (!query || query.length < 3) throw error(400, "q must be at least 3 characters");
	const results = await semanticSearch(query, Math.min(parseInt(url.searchParams.get("limit") ?? "12"), 50));
	return json({
		query,
		count: results.length,
		results: results.map((r) => ({
			id: r.id,
			title: r.title,
			description: r.description,
			thumbnail: r.thumbnail,
			posterUrl: r.posterUrl,
			genres: r.genres,
			topics: r.topics,
			ageRating: r.ageRating,
			mediaType: r.mediaType,
			year: r.year,
			link: r.link
		}))
	});
};

export { GET };
//# sourceMappingURL=_server.ts-RYlZXYac.js.map
