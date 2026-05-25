import { error, json } from "@sveltejs/kit";
import { c as callAgent, S as SEPHAR_SYSTEM_PROMPT, a as extractJsonObject, b as callChat } from "../../../../../chunks/ai-provider.js";
import { d as db, g as creators, m as mediaLibrary } from "../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
async function generateCreatorInsights(opts) {
  const { creatorName, totalContent, totalViews, avgCompletionRate, avgRating, topContentTitles, recentContentTitles, contentTypes, totalRevenueSTC, totalRevenueUSD, followerGrowth30d } = opts;
  const result = await callAgent(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate personalized growth insights for a Christian content creator on Sephar Studios.

Creator: ${creatorName}
Content library: ${totalContent} items
Total views: ${totalViews.toLocaleString()}
Avg completion rate: ${avgCompletionRate}%
Avg rating: ${avgRating}/5
Top performing content: ${topContentTitles.join(", ")}
Recent uploads: ${recentContentTitles.join(", ")}
Content types: ${contentTypes.join(", ")}
Revenue (STC): ${totalRevenueSTC} STC
Revenue (USD): $${totalRevenueUSD}
Follower growth (30d): ${followerGrowth30d > 0 ? "+" : ""}${followerGrowth30d}%

Return ONLY this JSON:
{
  "headline": "One impactful headline insight",
  "topPerformingType": "Type of content doing best",
  "audienceInsight": "What your audience loves about your content",
  "nextContentSuggestion": "Specific recommendation for what to create next",
  "titleTips": ["Tip 1", "Tip 2", "Tip 3"],
  "growthTip": "Single most impactful action to grow faster",
  "engagementSummary": "2–3 sentence plain-English summary of engagement metrics"
}

Be specific, actionable, and encouraging. Reference faith-based content context.`
      }
    ],
    { provider: "openrouter", temperature: 0.4, maxTokens: 768, timeoutMs: 2e4 }
  );
  if (!result) return null;
  const parsed = extractJsonObject(result.content);
  if (!parsed) return null;
  return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}
async function optimizeContentTitle(opts) {
  const result = await callAgent(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Suggest better titles for this faith-based ${opts.contentType} on a Christian streaming platform.

Current title: "${opts.currentTitle}"
Description: "${opts.description}"
Genres: ${opts.genres.join(", ")}
Bible Reference: "${opts.bibleReference}"

Return ONLY this JSON:
{
  "suggestedTitles": ["Title Option 1", "Title Option 2", "Title Option 3"],
  "reasoning": "Why these titles work better for discovery and engagement",
  "keywordsToInclude": ["faith", "redemption", "christian movie"]
}

Title guidelines: emotionally resonant, faith-affirming, 3–8 words, specific and evocative, biblically-grounded.`
      }
    ],
    { provider: "openrouter", temperature: 0.5, maxTokens: 384 }
  );
  if (!result) return null;
  const parsed = extractJsonObject(result.content);
  if (!parsed) return null;
  return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}
async function narrateBlockchainActivity(transactions) {
  if (transactions.length === 0) return null;
  const txSummary = transactions.slice(0, 10).map((t) => `- ${t.type}: ${t.amount} ${t.currency}${t.contentTitle ? ` (${t.contentTitle})` : ""} at ${t.timestamp}`).join("\n");
  const result = await callChat(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Convert these blockchain transactions into a friendly, readable activity feed for a faith-based streaming platform user.

Transactions:
${txSummary}

Write 3–5 short, plain-English bullet points (not JSON) describing what happened.
Example: "• You earned 15 STC watching 'The Chosen' to completion"
Be warm and celebratory about token earnings. Keep each point under 60 characters.`
      }
    ],
    { temperature: 0.3, maxTokens: 256 }
  );
  return result?.content ?? null;
}
const GET = async ({ locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");
  const [creator] = await db.select().from(creators).where(eq(creators.userId, locals.user.id)).limit(1);
  if (!creator) throw error(404, "Creator profile not found");
  const content = await db.select({
    title: mediaLibrary.title,
    viewCount: mediaLibrary.viewCount,
    mediaType: mediaLibrary.mediaType,
    voteAverage: mediaLibrary.voteAverage,
    createdAt: mediaLibrary.createdAt
  }).from(mediaLibrary).where(eq(mediaLibrary.creatorId, locals.user.id)).limit(50);
  if (content.length === 0) {
    return json({ message: "No content yet — upload your first piece to get insights!" });
  }
  const totalViews = content.reduce((sum, c) => sum + (c.viewCount ?? 0), 0);
  const avgRating = content.reduce((sum, c) => sum + parseFloat(c.voteAverage ?? "0"), 0) / content.length;
  const contentTypes = [...new Set(content.map((c) => c.mediaType))];
  const sortedByViews = [...content].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
  const topContentTitles = sortedByViews.slice(0, 5).map((c) => c.title);
  const recentContentTitles = [...content].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map((c) => c.title);
  const insights = await generateCreatorInsights({
    creatorName: creator.displayName,
    totalContent: content.length,
    totalViews,
    avgCompletionRate: 72,
    // TODO: compute from mediaWatchProgress
    avgRating: parseFloat(avgRating.toFixed(1)),
    topContentTitles,
    recentContentTitles,
    contentTypes,
    totalRevenueSTC: creator.totalEarnings ?? 0,
    totalRevenueUSD: 0,
    // TODO: from paystackSubscriptions revenue attribution
    followerGrowth30d: 0
    // TODO: from subscriber tracking
  });
  if (!insights) throw error(503, "AI insights unavailable");
  return json(insights);
};
const POST = async ({ request, locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");
  const body = await request.json();
  const { type } = body;
  switch (type) {
    case "optimize_title": {
      const { contentId, title, description = "", genres = [], bibleReference = "", contentType = "movie" } = body;
      let resolvedTitle = title;
      if (contentId) {
        const [content] = await db.select({ title: mediaLibrary.title }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
        if (content) resolvedTitle = content.title;
      }
      if (!resolvedTitle) throw error(400, "title or contentId required");
      const result = await optimizeContentTitle({
        currentTitle: resolvedTitle,
        description,
        genres,
        bibleReference,
        contentType
      });
      if (!result) throw error(503, "Title optimizer unavailable");
      return json(result);
    }
    case "narrate_activity": {
      const { transactions = [] } = body;
      const narrative = await narrateBlockchainActivity(transactions);
      if (!narrative) throw error(503, "Activity narration unavailable");
      return json({ narrative });
    }
    default:
      throw error(400, `Unknown type: ${type}`);
  }
};
export {
  GET,
  POST
};
