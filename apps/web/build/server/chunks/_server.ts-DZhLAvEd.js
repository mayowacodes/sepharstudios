import { w as db, a0 as quizSessions } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/kids/quiz/submit/+server.ts
var POST = async ({ request, locals }) => {
	if (!await locals.auth.getSession()) return json({ error: "Unauthorized" }, { status: 401 });
	const { sessionId, answers } = await request.json();
	const [quizSession] = await db.select().from(quizSessions).where(eq(quizSessions.id, sessionId)).limit(1);
	if (!quizSession) return json({ error: "Quiz session not found" }, { status: 404 });
	const questions = quizSession.questions;
	let score = 0;
	const results = questions.map((q, i) => {
		const correct = answers[i] === q.correctIndex;
		if (correct) score++;
		return {
			correct,
			correctIndex: q.correctIndex
		};
	});
	const passed = score >= Math.ceil(questions.length * .6);
	await db.update(quizSessions).set({
		answers,
		score,
		completedAt: /* @__PURE__ */ new Date()
	}).where(eq(quizSessions.id, sessionId));
	return json({
		score,
		total: questions.length,
		passed,
		results
	});
};

export { POST };
//# sourceMappingURL=_server.ts-DZhLAvEd.js.map
