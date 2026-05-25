import { callChat, SEPHAR_SYSTEM_PROMPT } from './ai-provider';

/**
 * AI WATCH COMPANION  [Gemma 4 — conversational, faith-aware]
 *   askCompanion()    → callChat({ provider: 'openrouter' }) — cloud for depth
 *   getSceneInsight() → callChat()                          — local Gemma 4
 */

export interface CompanionContext {
	contentTitle: string;
	contentDescription: string;
	bibleReference?: string;
	genres?: string[];
	topics?: string[];
	contentType: string;
}

export interface CompanionMessage {
	role: 'user' | 'assistant';
	content: string;
}

export interface CompanionResponse {
	answer: string;
	suggestedFollowUps: string[];
	aiProvider: string;
}

const COMPANION_SYSTEM = (ctx: CompanionContext) => `
${SEPHAR_SYSTEM_PROMPT}

You are the Watch Companion for this content:
- Title: "${ctx.contentTitle}"
- Type: ${ctx.contentType}
- Description: "${ctx.contentDescription}"
${ctx.bibleReference ? `- Bible Reference: ${ctx.bibleReference}` : ''}
${ctx.genres?.length ? `- Genres: ${ctx.genres.join(', ')}` : ''}
${ctx.topics?.length ? `- Themes: ${ctx.topics.join(', ')}` : ''}

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

export async function askCompanion(
	context: CompanionContext,
	history: CompanionMessage[],
	userMessage: string
): Promise<CompanionResponse | null> {
	const recentHistory = history.slice(-6);

	const messages = [
		{ role: 'system' as const, content: COMPANION_SYSTEM(context) },
		...recentHistory.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
		{ role: 'user' as const, content: userMessage }
	];

	const result = await callChat(messages, {
		provider: 'openrouter',
		temperature: 0.4,
		maxTokens: 512,
		timeoutMs: 20000
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
	} catch { /* return raw */ }

	return { answer: result.content, suggestedFollowUps: [], aiProvider: `${result.provider}/${result.model}` };
}

export async function getSceneInsight(
	contentTitle: string,
	bibleReference: string,
	sceneDescription: string
): Promise<string | null> {
	const result = await callChat(
		[
			{ role: 'system', content: SEPHAR_SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Provide a brief faith-based insight for this scene from "${contentTitle}".
${bibleReference ? `The main Bible reference is: ${bibleReference}` : ''}

Scene context: "${sceneDescription}"

Write 2–3 sentences explaining the spiritual lesson or biblical principle shown. 
Be warm, accessible, and faith-affirming. No JSON needed — plain text only.`
			}
		],
		{ temperature: 0.5, maxTokens: 200 }
	);

	return result?.content ?? null;
}
