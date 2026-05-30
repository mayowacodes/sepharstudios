import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { D as DEFAULT_AI_CONFIG, g as getAIConfig, s as saveAIConfig } from './ai-settings-Dm4yygKB.js';
import { j as json } from './index-5kYmxIr9.js';
import './drizzle-BjmsPAPl.js';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/ai/config/+server.ts
/**
* GET  /api/admin/ai/config  — returns current AI model config
* PUT  /api/admin/ai/config  — saves new AI model config
*/
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	return json({
		config: await getAIConfig(),
		defaults: DEFAULT_AI_CONFIG
	});
};
var PUT = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const body = await request.json();
	if (body.providerPreference && ![
		"auto",
		"ollama",
		"openrouter"
	].includes(body.providerPreference)) return json({ error: "Invalid providerPreference value" }, { status: 400 });
	await saveAIConfig({
		chatModel: body.chatModel,
		agentModel: body.agentModel,
		ollamaChatModel: body.ollamaChatModel,
		ollamaAgentModel: body.ollamaAgentModel,
		providerPreference: body.providerPreference
	});
	return json({
		success: true,
		config: await getAIConfig()
	});
};

export { GET, PUT };
//# sourceMappingURL=_server.ts-B6Daz4rh.js.map
