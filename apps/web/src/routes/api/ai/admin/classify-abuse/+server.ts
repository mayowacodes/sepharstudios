import { json, type RequestHandler } from '@sveltejs/kit';
import { runAi, tryParseJson } from '$lib/server/ai';

/**
 * POST /api/ai/admin/classify-abuse
 *
 * Body: { category, description, preview? }
 * Returns: { severity: 'low'|'med'|'high'|'critical', rationale: string }
 *
 * Used by the abuse queue to auto-sort + flag obvious critical reports.
 */

const ALLOWED_SEVERITIES = new Set(['low', 'med', 'high', 'critical']);

export const POST: RequestHandler = async ({ locals, request }) => {
	if (locals.user?.role !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({})) as {
		category?: string;
		description?: string;
		preview?: string;
	};
	if (!body.category) return json({ error: 'category is required' }, { status: 400 });

	const result = await runAi({
		userId: locals.user!.id,
		surface: 'admin:classify-abuse',
		modelType: 'agent',
		temperature: 0.1,
		maxTokens: 256,
		messages: [
			{
				role: 'system',
				content: 'You triage abuse reports on a Christian streaming platform. Be conservative on severity — bias toward lower when in doubt.'
			},
			{
				role: 'user',
				content: `Classify this report.

Category: ${body.category}
Reporter note: """${(body.description ?? '').slice(0, 600)}"""
Target preview: """${(body.preview ?? '').slice(0, 600)}"""

Return ONLY this JSON:
{ "severity": "low", "rationale": "Short explanation (1 sentence)" }

Severity guide:
- low: spam, low-quality posts, minor off-topic
- med: rude tone, possible misinformation, copyright concern
- high: harassment, sexual content, hate speech
- critical: imminent self-harm, illegal activity, CSAM, doxxing`
			}
		]
	});

	if (!result.ok) {
		const status = result.error === 'budget_exceeded' ? 429 : 503;
		return json({ error: result.message }, { status });
	}

	const parsed = tryParseJson<{ severity?: string; rationale?: string }>(result.content);
	const severity = parsed?.severity && ALLOWED_SEVERITIES.has(parsed.severity) ? parsed.severity : 'low';
	const rationale = typeof parsed?.rationale === 'string' ? parsed.rationale.slice(0, 280) : '';

	return json({ severity, rationale });
};
