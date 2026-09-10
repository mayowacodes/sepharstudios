import { e as enforceRateLimit, a as AI_AGENT_LIMIT } from './rate-limit-36sk_Cg8.js';
import { a as analyzeUserEngagementPattern, s as scoreWatchEngagement } from './ai-token-scoring-DPaXSF38.js';
import { e as error, j as json } from './index.js-DwRgOKlO.js';
import './redis-b3AHkg5i.js';
import 'ioredis';
import './ai-provider-StSxp_t-.js';
import './ai-settings-Bn2doK5E.js';
import './drizzle-DlGuU73K.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

//#region src/routes/api/ai/token-score/+server.ts
/**
* POST /api/ai/token-score
* Scores engagement quality to determine STC token reward amounts.
*
* Body types:
*   { type: 'watch', ...watch session data }
*   { type: 'pattern', ...30-day stats }
*/
var POST = async ({ request, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	await enforceRateLimit(`ai:token-score:${locals.user.id}`, AI_AGENT_LIMIT);
	const body = await request.json();
	const { type } = body;
	if (!type) throw error(400, "type is required");
	switch (type) {
		case "watch": {
			const { completionPercent = 0, watchTimeSeconds = 0, totalDurationSeconds = 0, leftReview = false, sharedContent = false, addedToWatchlist = false, baseStcReward = 10 } = body;
			const result = await scoreWatchEngagement({
				completionPercent,
				watchTimeSeconds,
				totalDurationSeconds,
				leftReview,
				sharedContent,
				addedToWatchlist,
				baseStcReward
			});
			if (!result) throw error(503, "Scoring service unavailable");
			return json(result);
		}
		case "pattern": {
			const { last30DaysWatchSessions = 0, avgSessionDurationSeconds = 0, avgCompletionPercent = 0, reviewsLeft = 0, uniqueContentsWatched = 0, stcEarned30Days = 0, accountAgedays = 0 } = body;
			const result = await analyzeUserEngagementPattern({
				userId: locals.user.id,
				last30DaysWatchSessions,
				avgSessionDurationSeconds,
				avgCompletionPercent,
				reviewsLeft,
				uniqueContentsWatched,
				stcEarned30Days,
				accountAgedays
			});
			if (!result) throw error(503, "Pattern analysis unavailable");
			return json(result);
		}
		default: throw error(400, `Unknown type: ${type}`);
	}
};

export { POST };
//# sourceMappingURL=_server.ts-BgXKTrKa.js.map
