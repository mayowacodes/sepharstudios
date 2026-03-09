import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { quizSessions, userMilestones } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { sessionId, answers } = await request.json() as { sessionId: string; answers: number[] };

	const [quizSession] = await db.select().from(quizSessions)
		.where(eq(quizSessions.id, sessionId))
		.limit(1);

	if (!quizSession) return json({ error: 'Quiz session not found' }, { status: 404 });

	const questions = quizSession.questions as { question: string; options: string[]; correctIndex: number }[];
	let score = 0;
	const results = questions.map((q, i) => {
		const correct = answers[i] === q.correctIndex;
		if (correct) score++;
		return { correct, correctIndex: q.correctIndex };
	});

	const passed = score >= Math.ceil(questions.length * 0.6); // 60% to pass

	await db.update(quizSessions)
		.set({ answers, score, completedAt: new Date() })
		.where(eq(quizSessions.id, sessionId));

	return json({ score, total: questions.length, passed, results });
};
