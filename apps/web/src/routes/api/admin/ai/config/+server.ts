import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAIConfig, saveAIConfig, DEFAULT_AI_CONFIG } from '$lib/server/ai-settings';

/**
 * GET  /api/admin/ai/config  — returns current AI model config
 * PUT  /api/admin/ai/config  — saves new AI model config
 */

async function requireAdmin(locals: App.Locals) {
	const session = await locals.auth.getSession();
	if (!session) return { error: json({ error: 'Unauthorized' }, { status: 401 }) };
	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return { error: json({ error: 'Forbidden' }, { status: 403 }) };
	return { error: null };
}

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
