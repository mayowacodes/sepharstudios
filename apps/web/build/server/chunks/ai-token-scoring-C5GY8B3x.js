import { c as callAgent, b as extractJsonObject, S as SEPHAR_SYSTEM_PROMPT } from './ai-provider-ZmR1UjfK.js';

//#region src/lib/server/ai-token-scoring.ts
async function scoreWatchEngagement(opts) {
	const { completionPercent, watchTimeSeconds, totalDurationSeconds, leftReview, sharedContent, addedToWatchlist, baseStcReward } = opts;
	if (completionPercent < 10) return {
		tokenMultiplier: 0,
		isSuspicious: false,
		engagementQuality: "low",
		reasons: ["Watched less than 10% — no reward earned"],
		recommendedStcReward: 0,
		aiProvider: "rule-engine"
	};
	const result = await callAgent([{
		role: "system",
		content: SEPHAR_SYSTEM_PROMPT
	}, {
		role: "user",
		content: `Score this viewing session on a Christian streaming platform that rewards engagement with STC tokens.

Session data:
- Completion: ${completionPercent}%
- Watch time: ${watchTimeSeconds}s out of ${totalDurationSeconds}s total
- Left a review: ${leftReview}
- Shared content: ${sharedContent}
- Added to watchlist: ${addedToWatchlist}
- Base STC reward: ${baseStcReward} STC

Return ONLY this JSON:
{
  "tokenMultiplier": 1.0,
  "isSuspicious": false,
  "engagementQuality": "medium",
  "reasons": ["Good completion rate"],
  "recommendedStcReward": 10
}

Multiplier rules:
- < 25% completion: 0.0 | 25–49%: 0.3 | 50–74%: 0.6 | 75–89%: 0.8 | 90–100%: 1.0
- +0.15 for review, +0.15 for share, +0.1 for watchlist (max 1.5x total)
- isSuspicious=true if watch time is implausibly fast vs duration`
	}], {
		temperature: .1,
		maxTokens: 256
	});
	if (!result) {
		const finalMultiplier = Math.min(1.5, (completionPercent >= 90 ? 1 : completionPercent >= 75 ? .8 : completionPercent >= 50 ? .6 : completionPercent >= 25 ? .3 : 0) + ((leftReview ? .15 : 0) + (sharedContent ? .15 : 0) + (addedToWatchlist ? .1 : 0)));
		return {
			tokenMultiplier: finalMultiplier,
			isSuspicious: false,
			engagementQuality: finalMultiplier >= .8 ? "high" : finalMultiplier >= .5 ? "medium" : "low",
			reasons: ["Rule-based (AI unavailable)"],
			recommendedStcReward: Math.round(baseStcReward * finalMultiplier),
			aiProvider: "rule-engine"
		};
	}
	const parsed = extractJsonObject(result.content);
	if (!parsed) return null;
	return {
		...parsed,
		aiProvider: `${result.provider}/${result.model}`
	};
}
async function analyzeUserEngagementPattern(opts) {
	const result = await callAgent([{
		role: "system",
		content: SEPHAR_SYSTEM_PROMPT
	}, {
		role: "user",
		content: `Analyze this user's engagement pattern for potential token farming abuse on our STC reward platform.

30-day stats:
- Watch sessions: ${opts.last30DaysWatchSessions}
- Avg session duration: ${opts.avgSessionDurationSeconds}s
- Avg completion: ${opts.avgCompletionPercent}%
- Reviews left: ${opts.reviewsLeft}
- Unique titles watched: ${opts.uniqueContentsWatched}
- STC earned: ${opts.stcEarned30Days}
- Account age: ${opts.accountAgedays} days

Return ONLY this JSON:
{
  "riskLevel": "low",
  "isFarmerRisk": false,
  "patterns": [],
  "recommendation": "reward"
}

Risk indicators: very short sessions with high completion, rewatching same content, new account with disproportionate STC, review volume out of proportion with watch time.
recommendation options: "reward" | "reduce" | "hold" | "ban"`
	}], {
		temperature: .1,
		maxTokens: 256
	});
	if (!result) return null;
	const parsed = extractJsonObject(result.content);
	if (!parsed) return null;
	return {
		...parsed,
		aiProvider: `${result.provider}/${result.model}`
	};
}

export { analyzeUserEngagementPattern as a, scoreWatchEngagement as s };
//# sourceMappingURL=ai-token-scoring-C5GY8B3x.js.map
