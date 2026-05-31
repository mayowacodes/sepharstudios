import { json, type RequestHandler } from '@sveltejs/kit';
import { Role } from '$lib/constants';
import { runAi } from '$lib/server/ai';

/**
 * POST /api/ai/suggest/review-reply
 *
 * Body: { reviewText, rating, contentTitle, tone? }
 * Returns: { reply: string }
 *
 * Drafts a warm, professional reply to a viewer's review on the creator's
 * content. Tone defaults to 'gracious'. Creator can edit + send.
 */

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({})) as {
		reviewText?: string;
		rating?: number;
		contentTitle?: string;
		tone?: 'gracious' | 'apologetic' | 'enthusiastic';
	};
	const reviewText = body.reviewText?.trim() ?? '';
	const contentTitle = body.contentTitle?.trim() ?? 'this video';
	const tone = body.tone ?? 'gracious';
	if (!reviewText) return json({ error: 'reviewText is required' }, { status: 400 });

	const result = await runAi({
		userId: session.user.id,
		surface: 'creator:suggest-review-reply',
		modelType: 'chat',
		temperature: 0.6,
		maxTokens: 256,
		messages: [
			{
				role: 'system',
				content: 'You are a Christian content creator replying to a viewer\'s review on your faith-based video. Be warm, specific, and humble.'
			},
			{
				role: 'user',
				content: `Draft a reply to this review on "${contentTitle}".

Star rating: ${body.rating ?? '?'}/5
Review: """${reviewText.slice(0, 800)}"""

Tone: ${tone}

Rules:
- 1-2 sentences
- Address the reviewer warmly
- If criticism: acknowledge without being defensive
- If praise: thank them, don't gush
- Plain text — no JSON wrapper, no markdown`
			}
		]
	});

	if (!result.ok) {
		const status = result.error === 'budget_exceeded' ? 429 : 503;
		return json({ error: result.message }, { status });
	}

	return json({ reply: result.content.trim().slice(0, 1000) });
};
