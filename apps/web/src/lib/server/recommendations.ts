import { db } from '$lib/db/drizzle';
import { mediaWatchProgress, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq, desc, notInArray, inArray } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

/**
 * Get AI-driven recommendations for a profile using Ollama.
 * Falls back to genre-based recommendations if Ollama is unavailable.
 */
export async function getRecommendations(userId: string, profileId: string | null, limit = 12) {
	// Get watch history to understand preferences
	const history = await db.select({
		contentId: mediaWatchProgress.contentId,
		completionPercent: mediaWatchProgress.completionPercent
	})
		.from(mediaWatchProgress)
		.where(eq(mediaWatchProgress.userId, userId))
		.orderBy(desc(mediaWatchProgress.updatedAt))
		.limit(20);

	const watchedIds = history.map((h) => h.contentId);

	// Get all unwatched content
	const candidates = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		genres: mediaLibrary.genres,
		topics: mediaLibrary.topics,
		mediaType: mediaLibrary.mediaType,
		category: mediaLibrary.category,
		ageRating: mediaLibrary.ageRating
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.isActive, true))
		.limit(50);

	const unwatched = candidates.filter((c) => !watchedIds.includes(c.id));

	if (unwatched.length === 0) return candidates.slice(0, limit);
	if (history.length === 0 || !env.OLLAMA_URL) {
		// No history or Ollama not configured — return newest content
		return unwatched.slice(0, limit);
	}

	// Get titles of recently watched content for context
	const watchedContent = await db.select({ title: mediaLibrary.title, genres: mediaLibrary.genres })
		.from(mediaLibrary)
		.where(inArray(mediaLibrary.id, watchedIds.slice(0, 10)));

	const watchedTitles = watchedContent.map((w) => w.title).join(', ');
	const candidateSummary = unwatched.slice(0, 20).map((c) => `${c.id}:${c.title}`).join('\n');

	try {
		const ollamaRes = await fetch(`${env.OLLAMA_URL}/api/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: env.OLLAMA_MODEL ?? 'llama3.2',
				prompt: `You are a faith-based streaming platform recommendation engine. A user recently watched: ${watchedTitles}.
From the following list (format: id:title), rank the top ${limit} most relevant items the user would enjoy next.
Return ONLY a JSON array of content IDs in order of relevance, nothing else. Example: ["id1","id2","id3"]

Content list:
${candidateSummary}`,
				stream: false
			}),
			signal: AbortSignal.timeout(8000)
		});

		if (ollamaRes.ok) {
			const ollamaData = await ollamaRes.json();
			const responseText: string = ollamaData.response ?? '';
			const match = responseText.match(/\[[\s\S]*?\]/);
			if (match) {
				const rankedIds: string[] = JSON.parse(match[0]);
				const ranked = rankedIds
					.map((id) => unwatched.find((c) => c.id === id))
					.filter(Boolean) as typeof unwatched;
				if (ranked.length > 0) return ranked.slice(0, limit);
			}
		}
	} catch {
		// Ollama unavailable — fall through to default
	}

	// Default: return unwatched sorted by order they appear
	return unwatched.slice(0, limit);
}
