import { callAgent, extractJsonObject, SEPHAR_SYSTEM_PROMPT } from './ai-provider';

/**
 * AI METADATA & AUTO-TAGGING ENGINE  [Hermes 3 — structured JSON output]
 * Called after a creator uploads content.
 */

export interface ContentMetadataSuggestion {
	genres: string[];
	topics: string[];
	keywords: string[];
	moodTags: string[];
	bibleReference: string;
	ageRating: string;
	shortDescription: string;
	sensitiveFlags: string[];
	aiProvider: string;
}

export async function generateContentMetadata(
	title: string,
	description: string,
	contentType: string
): Promise<ContentMetadataSuggestion | null> {
	const result = await callAgent(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Analyze this faith-based ${contentType} and return a JSON object with metadata.

Title: "${title}"
Description: "${description}"

Return ONLY this JSON structure, nothing else:
{
  "genres": ["Drama"],
  "topics": ["Redemption", "Faith"],
  "keywords": ["christian movie", "faith journey"],
  "moodTags": ["emotional", "uplifting"],
  "bibleReference": "Romans 8:28",
  "ageRating": "All",
  "shortDescription": "A compelling story about...",
  "sensitiveFlags": []
}

Rules:
- genres: 1–3 items from [Drama, Comedy, Documentary, Animation, Action, Romance, Thriller, Biography, Kids, Worship, Sermon]
- topics: 2–5 faith/life themes
- keywords: 4–8 SEO-friendly terms
- moodTags: 2–4 from [emotional, uplifting, thought-provoking, slow-burn, fast-paced, inspirational, heavy, light, family-friendly, intense]
- bibleReference: single most relevant Bible reference, or "" if none
- ageRating: one of "All", "7+", "12+", "16+"
- shortDescription: max 150 characters
- sensitiveFlags: content warnings if any, empty array if none`
			}
		],
		{ temperature: 0.2, maxTokens: 512 }
	);

	if (!result) return null;

	const parsed = extractJsonObject<ContentMetadataSuggestion>(result.content);
	if (!parsed) return null;

	return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}

/**
 * Quick genre + mood classification from a short prompt.
 * Used for semantic search preprocessing.
 */
export async function classifyUserSearchIntent(
	searchQuery: string
): Promise<{ genres: string[]; moods: string[]; topics: string[] } | null> {
	const result = await callAgent(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `A user on a Christian streaming platform typed this search: "${searchQuery}"

Extract what they're looking for and return ONLY this JSON:
{
  "genres": ["Drama"],
  "moods": ["emotional"],
  "topics": ["Redemption"]
}

Keep arrays concise (1–3 items max each). If the query is vague, infer meaningfully.`
			}
		],
		{ temperature: 0.1, maxTokens: 128 }
	);

	if (!result) return null;
	return extractJsonObject(result.content);
}
