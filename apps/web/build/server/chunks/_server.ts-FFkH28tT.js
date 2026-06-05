import { e as enforceRateLimit, b as AI_SEARCH_LIMIT } from './rate-limit-C3y7GHEd.js';
import { s as semanticSearch } from './recommendations-BzbQ4mQv.js';
import { e as error, j as json } from './index-Cv5VcsYq.js';
import './redis-B0W1dNO5.js';
import './shared-server-DUDL94jl.js';
import 'ioredis';
import './drizzle-CKUH7ukq.js';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-ZmR1UjfK.js';
import './ai-settings-b9zX_Yow.js';
import './ai-tagging-5RV1tce2.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-FFkH28tT.js.map
