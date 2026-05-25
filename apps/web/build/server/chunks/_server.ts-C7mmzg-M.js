import { e as error, j as json } from './index-BcOZ6EV9.js';
import { c as callChat, S as SEPHAR_SYSTEM_PROMPT } from './ai-provider-BckqNG7d.js';
import './utils-FiC4zhrQ.js';
import './shared-server-BeisX7n9.js';
import './ai-settings-DGaRpVWA.js';
import './drizzle-CW7hPjGG.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';

const COMPANION_SYSTEM = (ctx) => `
${SEPHAR_SYSTEM_PROMPT}

You are the Watch Companion for this content:
- Title: "${ctx.contentTitle}"
- Type: ${ctx.contentType}
- Description: "${ctx.contentDescription}"
${ctx.bibleReference ? `- Bible Reference: ${ctx.bibleReference}` : ""}
${ctx.genres?.length ? `- Genres: ${ctx.genres.join(", ")}` : ""}
${ctx.topics?.length ? `- Themes: ${ctx.topics.join(", ")}` : ""}

Your role: Help viewers understand this content more deeply. 
Answer questions about scenes, characters, themes, and faith lessons.
Provide biblical context when relevant. Keep answers warm, clear, 
and under 200 words unless the question demands a longer response.
Suggest 2–3 follow-up questions the viewer might find interesting.

Always respond in this JSON format:
{
  "answer": "Your response here...",
  "suggestedFollowUps": ["What does this mean for...?", "How does this relate to...?"]
}
`.trim();
async function askCompanion(context, history, userMessage) {
  const recentHistory = history.slice(-6);
  const messages = [
    { role: "system", content: COMPANION_SYSTEM(context) },
    ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage }
  ];
  const result = await callChat(messages, {
    provider: "openrouter",
    temperature: 0.4,
    maxTokens: 512,
    timeoutMs: 2e4
  });
  if (!result) return null;
  try {
    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        answer: parsed.answer ?? result.content,
        suggestedFollowUps: parsed.suggestedFollowUps ?? [],
        aiProvider: `${result.provider}/${result.model}`
      };
    }
  } catch {
  }
  return { answer: result.content, suggestedFollowUps: [], aiProvider: `${result.provider}/${result.model}` };
}
async function getSceneInsight(contentTitle, bibleReference, sceneDescription) {
  const result = await callChat(
    [
      { role: "system", content: SEPHAR_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Provide a brief faith-based insight for this scene from "${contentTitle}".
${bibleReference ? `The main Bible reference is: ${bibleReference}` : ""}

Scene context: "${sceneDescription}"

Write 2–3 sentences explaining the spiritual lesson or biblical principle shown. 
Be warm, accessible, and faith-affirming. No JSON needed — plain text only.`
      }
    ],
    { temperature: 0.5, maxTokens: 200 }
  );
  return result?.content ?? null;
}
const POST = async ({ request, locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");
  const body = await request.json();
  const {
    contentTitle,
    contentDescription,
    bibleReference = "",
    genres = [],
    topics = [],
    contentType = "movie",
    history = [],
    message,
    sceneDescription,
    mode = "chat"
  } = body;
  if (mode === "scene_insight") {
    if (!contentTitle) throw error(400, "contentTitle required for scene_insight mode");
    if (!sceneDescription) throw error(400, "sceneDescription required for scene_insight mode");
    const insight = await getSceneInsight(contentTitle, bibleReference, sceneDescription);
    if (!insight) throw error(503, "AI service unavailable");
    return json({ insight });
  }
  if (!message?.trim()) throw error(400, "message is required");
  if (mode === "general") {
    const response2 = await askCompanion(
      {
        contentTitle: "Sephar Studios",
        contentDescription: "A faith-based streaming platform featuring Christian movies, documentaries, sermons, and family content from creators around the world.",
        contentType: "platform",
        bibleReference: "",
        genres: ["Drama", "Documentary", "Worship", "Sermon", "Kids"],
        topics: ["Faith", "Redemption", "Family", "Prayer", "Scripture", "Christian Living"]
      },
      history,
      message
    );
    if (!response2) throw error(503, "AI service unavailable — try again shortly");
    return json(response2);
  }
  if (!contentTitle || !contentDescription) {
    throw error(400, "contentTitle and contentDescription are required for chat mode");
  }
  const response = await askCompanion(
    { contentTitle, contentDescription, bibleReference, genres, topics, contentType },
    history,
    message
  );
  if (!response) throw error(503, "AI service unavailable — try again shortly");
  return json(response);
};

export { POST };
//# sourceMappingURL=_server.ts-C7mmzg-M.js.map
