import { json, type RequestHandler } from '@sveltejs/kit';
import { getAIConfig, saveAIConfig, DEFAULT_AI_CONFIG } from '$lib/server/ai-settings';
import { requireAdmin } from '$lib/server/admin-auth';

/**
 * GET  /api/admin/ai/config  — returns current AI model config
 * PUT  /api/admin/ai/config  — saves new AI model config
 */

export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const config = await getAIConfig();
	return json({ config, defaults: DEFAULT_AI_CONFIG });
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const body = await request.json() as {
		chatModel?: string;
		agentModel?: string;
		ollamaChatModel?: string;
		ollamaAgentModel?: string;
		providerPreference?: 'auto' | 'ollama' | 'openrouter';
	};

	// Basic validation
	if (body.providerPreference && !['auto', 'ollama', 'openrouter'].includes(body.providerPreference)) {
		return json({ error: 'Invalid providerPreference value' }, { status: 400 });
	}

	await saveAIConfig({
		chatModel: body.chatModel,
		agentModel: body.agentModel,
		ollamaChatModel: body.ollamaChatModel,
		ollamaAgentModel: body.ollamaAgentModel,
		providerPreference: body.providerPreference
	});

	const updated = await getAIConfig();
	return json({ success: true, config: updated });
};
