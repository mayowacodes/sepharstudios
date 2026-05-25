import { callAgent, extractJsonObject, SEPHAR_SYSTEM_PROMPT } from './ai-provider';

/**
 * TOKEN REWARD INTELLIGENCE ENGINE  [Hermes 3 — structured JSON decisions]
 * Prevents token farming by scoring engagement quality before issuing STC.
 */

export interface WatchEngagementScore {
	tokenMultiplier: number;
	isSuspicious: boolean;
	engagementQuality: 'high' | 'medium' | 'low' | 'suspicious';
	reasons: string[];
	recommendedStcReward: number;
	aiProvider: string;
}

export interface EngagementPatternResult {
	riskLevel: 'low' | 'medium' | 'high' | 'critical';
	isFarmerRisk: boolean;
	patterns: string[];
	recommendation: 'reward' | 'reduce' | 'hold' | 'ban';
	aiProvider: string;
}

export async function scoreWatchEngagement(opts: {
	completionPercent: number;
	watchTimeSeconds: number;
	totalDurationSeconds: number;
	leftReview: boolean;
	leftComment: boolean;
	sharedContent: boolean;
	addedToWatchlist: boolean;
	baseStcReward: number;
}): Promise<WatchEngagementScore | null> {
	const { completionPercent, watchTimeSeconds, totalDurationSeconds, leftReview, leftComment, sharedContent, addedToWatchlist, baseStcReward } = opts;

	if (completionPercent < 10) {
		return { tokenMultiplier: 0, isSuspicious: false, engagementQuality: 'low', reasons: ['Watched less than 10% — no reward earned'], recommendedStcReward: 0, aiProvider: 'rule-engine' };
	}

	const result = await callAgent(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Score this viewing session on a Christian streaming platform that rewards engagement with STC tokens.

Session data:
- Completion: ${completionPercent}%
- Watch time: ${watchTimeSeconds}s out of ${totalDurationSeconds}s total
- Left a review: ${leftReview}
- Left a comment: ${leftComment}
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
- +0.1 for review, +0.1 for comment, +0.1 for share (max 1.5x total)
- isSuspicious=true if watch time is implausibly fast vs duration`
			}
		],
		{ temperature: 0.1, maxTokens: 256 }
	);

	if (!result) {
		const multiplier = completionPercent >= 90 ? 1.0 : completionPercent >= 75 ? 0.8 : completionPercent >= 50 ? 0.6 : completionPercent >= 25 ? 0.3 : 0.0;
		const bonus = (leftReview ? 0.1 : 0) + (leftComment ? 0.1 : 0) + (sharedContent ? 0.1 : 0);
		const finalMultiplier = Math.min(1.5, multiplier + bonus);
		return { tokenMultiplier: finalMultiplier, isSuspicious: false, engagementQuality: finalMultiplier >= 0.8 ? 'high' : finalMultiplier >= 0.5 ? 'medium' : 'low', reasons: ['Rule-based (AI unavailable)'], recommendedStcReward: Math.round(baseStcReward * finalMultiplier), aiProvider: 'rule-engine' };
	}

	const parsed = extractJsonObject<Omit<WatchEngagementScore, 'aiProvider'>>(result.content);
	if (!parsed) return null;
	return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}

export async function analyzeUserEngagementPattern(opts: {
	userId: string;
	last30DaysWatchSessions: number;
	avgSessionDurationSeconds: number;
	avgCompletionPercent: number;
	reviewsLeft: number;
	commentsLeft: number;
	uniqueContentsWatched: number;
	stcEarned30Days: number;
	accountAgedays: number;
}): Promise<EngagementPatternResult | null> {
	const result = await callAgent(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Analyze this user's engagement pattern for potential token farming abuse on our STC reward platform.

30-day stats:
- Watch sessions: ${opts.last30DaysWatchSessions}
- Avg session duration: ${opts.avgSessionDurationSeconds}s
- Avg completion: ${opts.avgCompletionPercent}%
- Reviews left: ${opts.reviewsLeft}
- Comments: ${opts.commentsLeft}
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

Risk indicators: very short sessions with high completion, rewatching same content, new account with disproportionate STC, review/comment volume out of proportion with watch time.
recommendation options: "reward" | "reduce" | "hold" | "ban"`
			}
		],
		{ temperature: 0.1, maxTokens: 256 }
	);

	if (!result) return null;
	const parsed = extractJsonObject<Omit<EngagementPatternResult, 'aiProvider'>>(result.content);
	if (!parsed) return null;
	return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}
