import { callAgent, callChat, extractJsonObject, SEPHAR_SYSTEM_PROMPT } from './ai-provider';

/**
 * CREATOR INSIGHTS & GROWTH TOOLS
 *   generateCreatorInsights()   → callAgent({ provider: 'openrouter' }) — structured analytics
 *   optimizeContentTitle()      → callAgent({ provider: 'openrouter' }) — structured suggestions
 *   narrateBlockchainActivity() → callChat()                            — warm plain-text narration
 */

export interface CreatorInsightsResult {
	headline: string;
	topPerformingType: string;
	audienceInsight: string;
	nextContentSuggestion: string;
	titleTips: string[];
	growthTip: string;
	engagementSummary: string;
	aiProvider: string;
}

export interface TitleOptimizationResult {
	suggestedTitles: string[];
	reasoning: string;
	keywordsToInclude: string[];
	aiProvider: string;
}

export async function generateCreatorInsights(opts: {
	creatorName: string;
	totalContent: number;
	totalViews: number;
	avgCompletionRate: number;
	avgRating: number;
	topContentTitles: string[];
	recentContentTitles: string[];
	contentTypes: string[];
	totalRevenueSTC: number;
	totalRevenueUSD: number;
	followerGrowth30d: number;
}): Promise<CreatorInsightsResult | null> {
	const { creatorName, totalContent, totalViews, avgCompletionRate, avgRating, topContentTitles, recentContentTitles, contentTypes, totalRevenueSTC, totalRevenueUSD, followerGrowth30d } = opts;

	const result = await callAgent(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Generate personalized growth insights for a Christian content creator on Sephar Studios.

Creator: ${creatorName}
Content library: ${totalContent} items
Total views: ${totalViews.toLocaleString()}
Avg completion rate: ${avgCompletionRate}%
Avg rating: ${avgRating}/5
Top performing content: ${topContentTitles.join(', ')}
Recent uploads: ${recentContentTitles.join(', ')}
Content types: ${contentTypes.join(', ')}
Revenue (STC): ${totalRevenueSTC} STC
Revenue (USD): $${totalRevenueUSD}
Follower growth (30d): ${followerGrowth30d > 0 ? '+' : ''}${followerGrowth30d}%

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
		{ provider: 'openrouter', temperature: 0.4, maxTokens: 768, timeoutMs: 20000 }
	);

	if (!result) return null;
	const parsed = extractJsonObject<Omit<CreatorInsightsResult, 'aiProvider'>>(result.content);
	if (!parsed) return null;
	return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}

export async function optimizeContentTitle(opts: {
	currentTitle: string;
	description: string;
	genres: string[];
	bibleReference: string;
	contentType: string;
}): Promise<TitleOptimizationResult | null> {
	const result = await callAgent(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Suggest better titles for this faith-based ${opts.contentType} on a Christian streaming platform.

Current title: "${opts.currentTitle}"
Description: "${opts.description}"
Genres: ${opts.genres.join(', ')}
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
		{ provider: 'openrouter', temperature: 0.5, maxTokens: 384 }
	);

	if (!result) return null;
	const parsed = extractJsonObject<Omit<TitleOptimizationResult, 'aiProvider'>>(result.content);
	if (!parsed) return null;
	return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}

export async function narrateBlockchainActivity(transactions: Array<{
	type: string;
	amount: number;
	currency: string;
	timestamp: string;
	contentTitle?: string;
}>): Promise<string | null> {
	if (transactions.length === 0) return null;

	const txSummary = transactions
		.slice(0, 10)
		.map((t) => `- ${t.type}: ${t.amount} ${t.currency}${t.contentTitle ? ` (${t.contentTitle})` : ''} at ${t.timestamp}`)
		.join('\n');

	const result = await callChat(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
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
