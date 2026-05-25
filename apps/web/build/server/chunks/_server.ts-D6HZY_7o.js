import { e as error, j as json } from './index-BcOZ6EV9.js';
import { s as semanticSearch } from './recommendations-BWTeiXrZ.js';
import './utils-FiC4zhrQ.js';
import './drizzle-CW7hPjGG.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-BckqNG7d.js';
import './ai-settings-DGaRpVWA.js';
import './ai-tagging-BQ3HJZC1.js';

const GET = async ({ url, locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");
  const query = url.searchParams.get("q")?.trim();
  if (!query || query.length < 3) throw error(400, "q must be at least 3 characters");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "12"), 50);
  const results = await semanticSearch(query, limit);
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
//# sourceMappingURL=_server.ts-D6HZY_7o.js.map
