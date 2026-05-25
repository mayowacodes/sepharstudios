import { error, json } from "@sveltejs/kit";
import { c as callAgent, a as extractJsonObject, S as SEPHAR_SYSTEM_PROMPT } from "../../../../../chunks/ai-provider.js";
async function scoreWatchEngagement(opts) {
  const { completionPercent, watchTimeSeconds, totalDurationSeconds, leftReview, leftComment, sharedContent, addedToWatchlist, baseStcReward } = opts;
  if (completionPercent < 10) {
    return { tokenMultiplier: 0, isSuspicious: false, engagementQuality: "low", reasons: ["Watched less than 10% — no reward earned"], recommendedStcReward: 0, aiProvider: "rule-engine" };
  }
  const result = await callAgent(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
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
    const multiplier = completionPercent >= 90 ? 1 : completionPercent >= 75 ? 0.8 : completionPercent >= 50 ? 0.6 : completionPercent >= 25 ? 0.3 : 0;
    const bonus = (leftReview ? 0.1 : 0) + (leftComment ? 0.1 : 0) + (sharedContent ? 0.1 : 0);
    const finalMultiplier = Math.min(1.5, multiplier + bonus);
    return { tokenMultiplier: finalMultiplier, isSuspicious: false, engagementQuality: finalMultiplier >= 0.8 ? "high" : finalMultiplier >= 0.5 ? "medium" : "low", reasons: ["Rule-based (AI unavailable)"], recommendedStcReward: Math.round(baseStcReward * finalMultiplier), aiProvider: "rule-engine" };
  }
  const parsed = extractJsonObject(result.content);
  if (!parsed) return null;
  return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}
async function analyzeUserEngagementPattern(opts) {
  const result = await callAgent(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
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
  const parsed = extractJsonObject(result.content);
  if (!parsed) return null;
  return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}
const POST = async ({ request, locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");
  const body = await request.json();
  const { type } = body;
  if (!type) throw error(400, "type is required");
  switch (type) {
    case "watch": {
      const {
        completionPercent = 0,
        watchTimeSeconds = 0,
        totalDurationSeconds = 0,
        leftReview = false,
        leftComment = false,
        sharedContent = false,
        addedToWatchlist = false,
        baseStcReward = 10
      } = body;
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
      const {
        last30DaysWatchSessions = 0,
        avgSessionDurationSeconds = 0,
        avgCompletionPercent = 0,
        reviewsLeft = 0,
        commentsLeft = 0,
        uniqueContentsWatched = 0,
        stcEarned30Days = 0,
        accountAgedays = 0
      } = body;
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
    default:
      throw error(400, `Unknown type: ${type}`);
  }
};
export {
  POST
};
