import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { n as getAIConfig, r as saveAIConfig, t as DEFAULT_AI_CONFIG } from "../../../../../../chunks/ai-settings.js";
import { json } from "@sveltejs/kit";
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
//#endregion
export { GET, PUT };
