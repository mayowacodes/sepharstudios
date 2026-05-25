import { json } from "@sveltejs/kit";
import { d as db, w as quizSessions } from "../../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
const POST = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { sessionId, answers } = await request.json();
  const [quizSession] = await db.select().from(quizSessions).where(eq(quizSessions.id, sessionId)).limit(1);
  if (!quizSession) return json({ error: "Quiz session not found" }, { status: 404 });
  const questions = quizSession.questions;
  let score = 0;
  const results = questions.map((q, i) => {
    const correct = answers[i] === q.correctIndex;
    if (correct) score++;
    return { correct, correctIndex: q.correctIndex };
  });
  const passed = score >= Math.ceil(questions.length * 0.6);
  await db.update(quizSessions).set({ answers, score, completedAt: /* @__PURE__ */ new Date() }).where(eq(quizSessions.id, sessionId));
  return json({ score, total: questions.length, passed, results });
};
export {
  POST
};
