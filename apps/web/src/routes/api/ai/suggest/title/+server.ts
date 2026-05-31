import { json, type RequestHandler } from '@sveltejs/kit';
import { Role } from '$lib/constants';
import { runAi, tryParseJson } from '$lib/server/ai';

/**
 * POST /api/ai/suggest/title
 *
 * Body: { description, contentType?, currentTitle? }
 * Returns: { suggestions: string[] } — up to 3 candidates
 */

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({})) as {
		description?: string;
		contentType?: string;
		currentTitle?: string;
	};
	const description = body.description?.trim() ?? '';
	if (!description) {
		return json({ error: 'description is required' }, { status: 400 });
	}

	const result = await runAi({
		userId: session.user.id,
		surface: 'creator:suggest-title',
		modelType: 'agent',
		temperature: 0.7,
		maxTokens: 256,
		messages: [
			{
				role: 'system',
				content: 'You write concise, compelling titles for faith-based video content on a Christian streaming platform.'
			},
			{
				role: 'user',
				content: `Generate 3 candidate titles for a ${body.contentType ?? 'video'}.

Description: """${description.slice(0, 1200)}"""

${body.currentTitle ? `Current title (improve on it): "${body.currentTitle}"` : ''}

Return ONLY this JSON:
{ "suggestions": ["Title 1", "Title 2", "Title 3"] }

Rules:
- 4-8 words each
- Clear, specific, evocative
- No clickbait, no all-caps
- Avoid generic words like "amazing" or "incredible"`
			}
		]
	});

	if (!result.ok) {
		const status = result.error === 'budget_exceeded' ? 429 : 503;
		return json({ error: result.message }, { status });
	}

	const parsed = tryParseJson<{ suggestions?: unknown }>(result.content);
	const suggestions = Array.isArray(parsed?.suggestions)
		? parsed.suggestions.filter((s): s is string => typeof s === 'string').slice(0, 3)
		: [];

	if (suggestions.length === 0) {
		return json({ error: 'AI did not return valid suggestions' }, { status: 502 });
	}

	return json({ suggestions });
};
