import { d as db, m as mediaLibrary, w as mediaWatchProgress } from './drizzle-CW7hPjGG.js';
import { eq, desc, inArray } from 'drizzle-orm';
import { a as callAgent, b as extractJsonArray, S as SEPHAR_SYSTEM_PROMPT } from './ai-provider-BckqNG7d.js';
import { c as classifyUserSearchIntent } from './ai-tagging-BQ3HJZC1.js';

async function getRecommendations(userId, profileId, limit = 12) {
  const history = await db.select({ contentId: mediaWatchProgress.contentId, completionPercent: mediaWatchProgress.completionPercent }).from(mediaWatchProgress).where(eq(mediaWatchProgress.userId, userId)).orderBy(desc(mediaWatchProgress.updatedAt)).limit(20);
  const watchedIds = history.map((h) => h.contentId);
  const candidates = await db.select({ id: mediaLibrary.id, title: mediaLibrary.title, genres: mediaLibrary.genres, topics: mediaLibrary.topics, mediaType: mediaLibrary.mediaType, category: mediaLibrary.category, ageRating: mediaLibrary.ageRating }).from(mediaLibrary).where(eq(mediaLibrary.isActive, true)).limit(50);
  const unwatched = candidates.filter((c) => !watchedIds.includes(c.id));
  if (unwatched.length === 0) return candidates.slice(0, limit);
  if (history.length === 0) return unwatched.slice(0, limit);
  const watchedContent = await db.select({ title: mediaLibrary.title, genres: mediaLibrary.genres }).from(mediaLibrary).where(inArray(mediaLibrary.id, watchedIds.slice(0, 10)));
  const watchedTitles = watchedContent.map((w) => w.title).join(", ");
  const candidateSummary = unwatched.slice(0, 20).map((c) => `${c.id}:${c.title}`).join("\n");
  const result = await callAgent(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `You are a recommendation engine for a faith-based streaming platform.
A user recently watched: ${watchedTitles}.

From the following list (format: id:title), rank the top ${limit} most relevant items.
Return ONLY a JSON array of content IDs in order of relevance, nothing else.
Example: ["id1","id2","id3"]

Content list:
${candidateSummary}`
      }
    ],
    { temperature: 0.2, maxTokens: 512 }
  );
  if (result) {
    const rankedIds = extractJsonArray(result.content);
    if (rankedIds && rankedIds.length > 0) {
      const ranked = rankedIds.map((id) => unwatched.find((c) => c.id === id)).filter(Boolean);
      if (ranked.length > 0) return ranked.slice(0, limit);
    }
  }
  return unwatched.slice(0, limit);
}
async function semanticSearch(query, limit = 12) {
  const intent = await classifyUserSearchIntent(query);
  if (!intent) return [];
  const allContent = await db.select().from(mediaLibrary).where(eq(mediaLibrary.isActive, true)).limit(100);
  if (allContent.length === 0) return [];
  const scored = allContent.map((item) => {
    let score = 0;
    const itemGenres = item.genres ?? [];
    const itemTopics = item.topics ?? [];
    for (const g of intent.genres) {
      if (itemGenres.some((ig) => ig.toLowerCase() === g.toLowerCase())) score += 3;
    }
    for (const t of intent.topics) {
      if (itemTopics.some((it) => it.toLowerCase().includes(t.toLowerCase()))) score += 2;
    }
    const keywords = item.keywords ?? [];
    for (const m of intent.moods) {
      if (keywords.some((k) => k.toLowerCase().includes(m.toLowerCase()))) score += 1;
    }
    const titleLower = item.title.toLowerCase();
    const descLower = (item.description ?? "").toLowerCase();
    const queryWords = query.toLowerCase().split(" ").filter((w) => w.length > 3);
    for (const word of queryWords) {
      if (titleLower.includes(word)) score += 2;
      if (descLower.includes(word)) score += 1;
    }
    return { item, score };
  }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.item);
  return scored;
}

export { getRecommendations as g, semanticSearch as s };
//# sourceMappingURL=recommendations-BWTeiXrZ.js.map
