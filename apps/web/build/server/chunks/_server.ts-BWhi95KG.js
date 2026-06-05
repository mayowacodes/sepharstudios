import { r as runAi, t as tryParseJson } from './ai-bbaOpgyC.js';
import { j as json } from './index-Cv5VcsYq.js';
import './shared-server-DUDL94jl.js';
import './drizzle-CKUH7ukq.js';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-ZmR1UjfK.js';
import './ai-settings-b9zX_Yow.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/ai/admin/classify-abuse/+server.ts
/**
* POST /api/ai/admin/classify-abuse
*
* Body: { category, description, preview? }
* Returns: { severity: 'low'|'med'|'high'|'critical', rationale: string }
*
* Used by the abuse queue to auto-sort + flag obvious critical reports.
*/
var ALLOWED_SEVERITIES = new Set([
	"low",
	"med",
	"high",
	"critical"
]);
var POST = async ({ locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	if (!body.category) return json({ error: "category is required" }, { status: 400 });
	const result = await runAi({
		userId: locals.user.id,
		surface: "admin:classify-abuse",
		modelType: "agent",
		temperature: .1,
		maxTokens: 256,
		messages: [{
			role: "system",
			content: "You triage abuse reports on a Christian streaming platform. Be conservative on severity — bias toward lower when in doubt."
		}, {
			role: "user",
			content: `Classify this report.

Category: ${body.category}
Reporter note: """${(body.description ?? "").slice(0, 600)}"""
Target preview: """${(body.preview ?? "").slice(0, 600)}"""

Return ONLY this JSON:
{ "severity": "low", "rationale": "Short explanation (1 sentence)" }

Severity guide:
- low: spam, low-quality posts, minor off-topic
- med: rude tone, possible misinformation, copyright concern
- high: harassment, sexual content, hate speech
- critical: imminent self-harm, illegal activity, CSAM, doxxing`
		}]
	});
	if (!result.ok) {
		const status = result.error === "budget_exceeded" ? 429 : 503;
		return json({ error: result.message }, { status });
	}
	const parsed = tryParseJson(result.content);
	return json({
		severity: parsed?.severity && ALLOWED_SEVERITIES.has(parsed.severity) ? parsed.severity : "low",
		rationale: typeof parsed?.rationale === "string" ? parsed.rationale.slice(0, 280) : ""
	});
};

export { POST };
//# sourceMappingURL=_server.ts-BWhi95KG.js.map
