import { c as callAgent, b as extractJsonObject, S as SEPHAR_SYSTEM_PROMPT } from './ai-provider-ZmR1UjfK.js';

//#region src/lib/server/ai-moderation.ts
async function moderateComment(commentText, contentTitle) {
	const result = await callAgent([{
		role: "system",
		content: SEPHAR_SYSTEM_PROMPT
	}, {
		role: "user",
		content: `Moderate this comment on a Christian streaming platform. The content title is: "${contentTitle}"

Comment: "${commentText}"

Return ONLY this JSON:
{
  "verdict": "approve",
  "reason": "Genuine thoughtful comment",
  "isSpam": false,
  "isHarmful": false,
  "isOffTopic": false,
  "qualityScore": 7
}

Verdict rules:
- "approve": genuine, relevant, family-safe
- "flag": borderline, needs human review
- "reject": spam, harmful, deeply off-topic, or abusive

qualityScore 0–10:
- 0–2: spam/gibberish/single word
- 3–5: generic ("good movie", "loved it")
- 6–8: thoughtful, specific to the content
- 9–10: detailed insight with faith reflection`
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
async function moderateContentMetadata(title, description, genres, topics, bibleReference, contentType) {
	const result = await callAgent([{
		role: "system",
		content: SEPHAR_SYSTEM_PROMPT
	}, {
		role: "user",
		content: `Pre-screen this content submission for a faith-based Christian streaming platform.

Title: "${title}"
Type: ${contentType}
Description: "${description}"
Genres: ${genres.join(", ")}
Topics: ${topics.join(", ")}
Bible Reference: "${bibleReference}"

Return ONLY this JSON:
{
  "verdict": "approve",
  "flags": [],
  "theologyScore": 8,
  "familySafeScore": 9,
  "reason": "Aligns with Christian values, family appropriate",
  "recommendedAgeRating": "All"
}

Scoring:
- theologyScore 0–10: does content align with core Christian doctrine?
- familySafeScore 0–10: 10 = all ages, 0 = extremely inappropriate
- verdict: "approve" | "flag" | "reject"
- flags: concerns for human reviewers`
	}], {
		temperature: .2,
		maxTokens: 512
	});
	if (!result) return null;
	const parsed = extractJsonObject(result.content);
	if (!parsed) return null;
	return {
		...parsed,
		aiProvider: `${result.provider}/${result.model}`
	};
}
async function scoreReviewQuality(reviewText, rating, contentTitle) {
	const result = await callAgent([{
		role: "system",
		content: SEPHAR_SYSTEM_PROMPT
	}, {
		role: "user",
		content: `Score this user review on a Christian streaming platform for quality and authenticity.
This score determines how many STC tokens the reviewer earns.

Content: "${contentTitle}"
Star Rating: ${rating}/5
Review: "${reviewText}"

Return ONLY this JSON:
{
  "qualityScore": 7,
  "isGenuine": true,
  "isThoughtful": true,
  "hasFaithInsight": false,
  "tokenRewardMultiplier": 1.0
}

Scoring rules:
- qualityScore 0–10 based on length, specificity, and engagement
- isGenuine: false if bot, copy-paste, or reward farming
- isThoughtful: true if it references actual content details
- hasFaithInsight: true if it mentions biblical themes or faith lessons
- tokenRewardMultiplier: 0.0 = spam, 0.5 = generic, 1.0 = solid, 1.5 = faith-engaged`
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

export { moderateContentMetadata as a, moderateComment as m, scoreReviewQuality as s };
//# sourceMappingURL=ai-moderation-C26N-v5x.js.map
