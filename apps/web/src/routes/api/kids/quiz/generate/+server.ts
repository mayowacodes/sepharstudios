import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, quizSessions } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { contentId, profileId } = await request.json() as { contentId: string; profileId?: string };
	const resolvedProfileId = profileId ?? locals.activeProfileId;

	if (!resolvedProfileId) {
		return json({ error: 'Profile is required' }, { status: 400 });
	}

	const [content] = await db.select({
		title: mediaLibrary.title,
		bibleReference: mediaLibrary.bibleReference,
		description: mediaLibrary.description,
		topics: mediaLibrary.topics
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);

	if (!content) return json({ error: 'Content not found' }, { status: 404 });

	const context = [
		content.bibleReference ? `Bible Reference: ${content.bibleReference}` : '',
		`Title: ${content.title}`,
		content.description ? `About: ${content.description.slice(0, 300)}` : '',
		content.topics?.length ? `Themes: ${(content.topics as string[]).join(', ')}` : ''
	].filter(Boolean).join('\n');

	const defaultQuestions = [
		{ question: `What is the main message of "${content.title}"?`, options: ['Faith', 'Family', 'Hope', 'All of the above'], correctIndex: 3 },
		{ question: `What Bible reference is associated with this story?`, options: [content.bibleReference ?? 'Genesis 1', 'John 3:16', 'Psalm 23', 'Matthew 5:9'], correctIndex: 0 },
		{ question: 'What should we do when we face challenges?', options: ['Give up', 'Pray and trust God', 'Ignore them', 'Be angry'], correctIndex: 1 },
		{ question: 'How can we show love to others?', options: ['Share and be kind', 'Keep things to ourselves', 'Be unkind', 'Ignore others'], correctIndex: 0 },
		{ question: 'What is the most important thing in life?', options: ['Money', 'Fame', 'Faith and love', 'Power'], correctIndex: 2 }
	];

	if (!env.OLLAMA_URL) {
		const [session_] = await db.insert(quizSessions).values({
			profileId: resolvedProfileId,
			contentId,
			questions: defaultQuestions
		}).returning();
		return json({ sessionId: session_.id, questions: defaultQuestions.map((q) => ({ question: q.question, options: q.options })) });
	}

	try {
		const ollamaRes = await fetch(`${env.OLLAMA_URL}/api/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: env.OLLAMA_MODEL ?? 'llama3.2',
				prompt: `You are a children's Bible quiz creator. Create 5 fun, age-appropriate multiple-choice questions for children aged 5-12 based on this content:\n\n${context}\n\nReturn ONLY a JSON array of 5 objects, each with: "question" (string), "options" (array of 4 strings), "correctIndex" (0-3). Example: [{"question":"...","options":["a","b","c","d"],"correctIndex":0}]`,
				stream: false
			}),
			signal: AbortSignal.timeout(15000)
		});

		if (ollamaRes.ok) {
			const ollamaData = await ollamaRes.json();
			const match = ollamaData.response?.match(/\[[\s\S]*?\]/);
			if (match) {
				const questions = JSON.parse(match[0]) as { question: string; options: string[]; correctIndex: number }[];
				if (Array.isArray(questions) && questions.length > 0) {
					const [session_] = await db.insert(quizSessions).values({ profileId: resolvedProfileId, contentId, questions }).returning();
					return json({ sessionId: session_.id, questions: questions.map((q) => ({ question: q.question, options: q.options })) });
				}
			}
		}
	} catch {
		// Fall through to default
	}

	const [session_] = await db.insert(quizSessions).values({ profileId: resolvedProfileId, contentId, questions: defaultQuestions }).returning();
	return json({ sessionId: session_.id, questions: defaultQuestions.map((q) => ({ question: q.question, options: q.options })) });
};
