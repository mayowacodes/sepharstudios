import { i as enforceRateLimit, t as AI_AGENT_LIMIT } from "../../../../../chunks/rate-limit.js";
import { n as scoreWatchEngagement, t as analyzeUserEngagementPattern } from "../../../../../chunks/ai-token-scoring.js";
import { error, json } from "@sveltejs/kit";
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
//#endregion
export { POST };
