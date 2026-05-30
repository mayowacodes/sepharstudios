import { e as enforceRateLimit, A as AI_AGENT_LIMIT } from './rate-limit-x9C_uZ2V.js';
import { a as analyzeUserEngagementPattern, s as scoreWatchEngagement } from './ai-token-scoring-DBJ6whLw.js';
import { e as error, j as json } from './index-5kYmxIr9.js';
import './redis-DrYH5PkI.js';
import './shared-server-DUDL94jl.js';
import 'ioredis';
import './ai-provider-Baql0hxE.js';
import './ai-settings-Dm4yygKB.js';
import './drizzle-BjmsPAPl.js';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './index-DBqjc0Yf.js';

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
			const { completionPercent = 0, watchTimeSeconds = 0, totalDurationSeconds = 0, leftReview = false, leftComment = false, sharedContent = false, addedToWatchlist = false, baseStcReward = 10 } = body;
			const result = await scoreWatchEngagement({
				completionPercent,
				watchTimeSeconds,
				totalDurationSeconds,
				leftReview,
				leftComment,
				sharedContent,
				addedToWatchlist,
				baseStcReward
			});
			if (!result) throw error(503, "Scoring service unavailable");
			return json(result);
		}
		case "pattern": {
			const { last30DaysWatchSessions = 0, avgSessionDurationSeconds = 0, avgCompletionPercent = 0, reviewsLeft = 0, commentsLeft = 0, uniqueContentsWatched = 0, stcEarned30Days = 0, accountAgedays = 0 } = body;
			const result = await analyzeUserEngagementPattern({
				userId: locals.user.id,
				last30DaysWatchSessions,
				avgSessionDurationSeconds,
				avgCompletionPercent,
				reviewsLeft,
				commentsLeft,
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
//# sourceMappingURL=_server.ts-jyKci0Sh.js.map
