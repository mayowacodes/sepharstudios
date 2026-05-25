import { c as callAgent, a as extractJsonObject, S as SEPHAR_SYSTEM_PROMPT } from "./ai-provider.js";
async function generateContentMetadata(title, description, contentType) {
  const result = await callAgent(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
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
  const parsed = extractJsonObject(result.content);
  if (!parsed) return null;
  return { ...parsed, aiProvider: `${result.provider}/${result.model}` };
}
async function classifyUserSearchIntent(searchQuery) {
  const result = await callAgent(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
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
export {
  classifyUserSearchIntent as c,
  generateContentMetadata as g
};
