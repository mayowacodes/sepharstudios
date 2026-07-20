import { t as private_env } from "../../../../../chunks/shared-server.js";
import { C as copilotConversations, K as mediaLibrary, Z as paymentIntents, a as user, at as ppvPurchases, h as aiActionLog, o as abuseReports, t as db, w as copilotMessages } from "../../../../../chunks/drizzle.js";
import { n as getAIConfig } from "../../../../../chunks/ai-settings.js";
import { r as Role } from "../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
//#region src/lib/server/ai-model.ts
var OPENROUTER_HEADERS = {
	"HTTP-Referer": "https://sepharstudios.com",
	"X-Title": "Sephar Studios AI"
};
async function resolveModel(modelType) {
	const aiConfig = await getAIConfig().catch(() => null);
	const preference = aiConfig?.providerPreference ?? "auto";
	const wantOpenRouter = preference === "openrouter" || preference === "auto";
	const wantOllama = preference === "ollama" || preference === "auto";
	if (wantOpenRouter && private_env.OPENROUTER_API_KEY) {
		const modelId = modelType === "agent" ? aiConfig?.agentModel ?? private_env.OPENROUTER_AGENT_MODEL ?? "meta-llama/llama-3.1-70b-instruct:free" : aiConfig?.chatModel ?? private_env.OPENROUTER_CHAT_MODEL ?? "google/gemma-2-9b-it:free";
		return {
			model: createOpenAI({
				baseURL: "https://openrouter.ai/api/v1",
				apiKey: private_env.OPENROUTER_API_KEY,
				headers: OPENROUTER_HEADERS
			})(modelId),
			provider: "openrouter",
			modelId
		};
	}
	if (wantOllama && private_env.OLLAMA_URL) {
		const modelId = modelType === "agent" ? aiConfig?.ollamaAgentModel ?? private_env.OLLAMA_AGENT_MODEL ?? "hermes3" : aiConfig?.ollamaChatModel ?? private_env.OLLAMA_CHAT_MODEL ?? "gemma4";
		return {
			model: createOpenAI({
				baseURL: `${private_env.OLLAMA_URL.replace(/\/$/, "")}/v1`,
				apiKey: "ollama"
			})(modelId),
			provider: "ollama",
			modelId
		};
	}
	throw new Error("No AI provider available. Set OPENROUTER_API_KEY (recommended — works with :free models without credit) or OLLAMA_URL (requires `ollama pull <model>` for each model). Configure /admin/settings to change model ids.");
}
/**
* Returns a Vercel AI SDK `LanguageModel` for `streamText()` to consume.
* Throws if no provider is reachable.
*/
async function getAiModel(modelType) {
	return resolveModel(modelType);
}
//#endregion
//#region src/lib/server/ai-tools-sdk.ts
function isAdmin(role) {
	return role === "admin";
}
function isCreator(role) {
	return role === "creator" || role === "admin";
}
var searchMyContent = (opts) => tool({
	description: "Search the signed-in creator's content library by keyword. Returns id/title/status/views for up to `limit` rows.",
	inputSchema: z.object({
		query: z.string().optional(),
		limit: z.number().min(1).max(50).optional()
	}),
	async execute({ query, limit }) {
		return (await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			status: mediaLibrary.status,
			views: mediaLibrary.viewCount
		}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, opts.userId), query ? ilike(mediaLibrary.title, `%${query}%`) : sql`true`)).orderBy(desc(mediaLibrary.createdAt)).limit(limit ?? 20)).map((r) => ({
			id: r.id,
			title: r.title,
			status: r.status,
			views: Number(r.views ?? 0)
		}));
	}
});
var getMyAnalytics = (opts) => tool({
	description: "Returns a summary of the signed-in creator's analytics over `period` (default 30d). Includes total views, watch time, completion rate, and top content.",
	inputSchema: z.object({ period: z.enum([
		"7d",
		"30d",
		"90d"
	]).optional() }),
	async execute({ period }) {
		const since = /* @__PURE__ */ new Date(Date.now() - {
			"7d": 7,
			"30d": 30,
			"90d": 90
		}[period ?? "30d"] * 864e5);
		const myContent = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			views: mediaLibrary.viewCount
		}).from(mediaLibrary).where(eq(mediaLibrary.creatorId, opts.userId));
		const top = [...myContent].sort((a, b) => Number(b.views ?? 0) - Number(a.views ?? 0)).slice(0, 5);
		return {
			period: period ?? "30d",
			since: since.toISOString(),
			contentCount: myContent.length,
			totalViews: myContent.reduce((s, c) => s + Number(c.views ?? 0), 0),
			topContent: top.map((c) => ({
				id: c.id,
				title: c.title,
				views: Number(c.views ?? 0)
			}))
		};
	}
});
var getMyEarnings = (opts) => tool({
	description: "Returns the signed-in creator's month + lifetime earnings.",
	inputSchema: z.object({}).strict(),
	async execute() {
		const rows = await db.select({
			contentId: ppvPurchases.contentId,
			amount: sql`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)::int`
		}).from(ppvPurchases).innerJoin(mediaLibrary, eq(mediaLibrary.id, ppvPurchases.contentId)).where(eq(mediaLibrary.creatorId, opts.userId)).groupBy(ppvPurchases.contentId);
		const lifetimeCents = rows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
		return {
			lifetimeCents,
			lifetimeDollars: lifetimeCents / 100,
			byContentCount: rows.length
		};
	}
});
var searchUsers = () => tool({
	description: "Search users by name or email. Admin-only.",
	inputSchema: z.object({
		query: z.string().min(1),
		limit: z.number().min(1).max(50).optional()
	}),
	async execute({ query, limit }) {
		return db.select({
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role
		}).from(user).where(or(ilike(user.name, `%${query}%`), ilike(user.email, `%${query}%`))).limit(limit ?? 20);
	}
});
var searchContent = () => tool({
	description: "Search all content on the platform. Admin-only.",
	inputSchema: z.object({
		query: z.string().optional(),
		status: z.string().optional(),
		limit: z.number().min(1).max(50).optional()
	}),
	async execute({ query, status, limit }) {
		const conditions = [];
		if (query) conditions.push(ilike(mediaLibrary.title, `%${query}%`));
		if (status) conditions.push(eq(mediaLibrary.status, status));
		const where = conditions.length > 0 ? and(...conditions) : void 0;
		return db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			status: mediaLibrary.status,
			creatorId: mediaLibrary.creatorId
		}).from(mediaLibrary).where(where).orderBy(desc(mediaLibrary.createdAt)).limit(limit ?? 20);
	}
});
var getAbuseQueue = () => tool({
	description: "Read the abuse report queue. Admin-only.",
	inputSchema: z.object({
		status: z.enum(["open", "resolved"]).optional(),
		limit: z.number().min(1).max(50).optional()
	}),
	async execute({ status, limit }) {
		return db.select({
			id: abuseReports.id,
			category: abuseReports.category,
			targetType: abuseReports.targetType,
			targetId: abuseReports.targetId,
			createdAt: abuseReports.createdAt
		}).from(abuseReports).where(status ? eq(abuseReports.status, status) : sql`true`).orderBy(desc(abuseReports.createdAt)).limit(limit ?? 20);
	}
});
var previewBan = (opts) => tool({
	description: "PREVIEW (does not execute) a ban for a user. Admin-only. The user MUST click Confirm in the rail before the ban applies.",
	inputSchema: z.object({
		userId: z.string(),
		reason: z.string().min(3)
	}),
	async execute({ userId, reason }) {
		const [u] = await db.select({
			id: user.id,
			name: user.name
		}).from(user).where(eq(user.id, userId)).limit(1);
		if (!u) return {
			approval: "failed",
			error: "User not found"
		};
		const [logRow] = await db.insert(aiActionLog).values({
			userId: opts.userId,
			conversationId: opts.conversationId ?? null,
			tool: "previewBan",
			input: {
				userId,
				reason
			},
			output: {
				userName: u.name,
				reason
			},
			approved: false
		}).returning({ id: aiActionLog.id });
		return {
			approval: "required",
			actionId: logRow.id,
			tool: "previewBan",
			preview: {
				userId: u.id,
				userName: u.name,
				reason,
				warning: "This will set user.banned=true and write an admin_messages row. Reversible via admin."
			}
		};
	}
});
var previewRefund = (opts) => tool({
	description: "PREVIEW (does not execute) a refund against a Paystack reference. Admin-only. The user MUST click Confirm before the refund applies.",
	inputSchema: z.object({
		reference: z.string().min(3),
		amountCents: z.number().positive().optional(),
		reason: z.string().optional()
	}),
	async execute({ reference, amountCents, reason }) {
		const [intent] = await db.select({
			userId: paymentIntents.userId,
			amountCents: paymentIntents.amountCents
		}).from(paymentIntents).where(eq(paymentIntents.reference, reference)).limit(1);
		if (!intent) return {
			approval: "failed",
			error: "No payment_intent for that reference"
		};
		const resolvedAmount = amountCents ?? intent.amountCents;
		const [logRow] = await db.insert(aiActionLog).values({
			userId: opts.userId,
			conversationId: opts.conversationId ?? null,
			tool: "previewRefund",
			input: {
				reference,
				amountCents: resolvedAmount,
				reason
			},
			output: { userId: intent.userId },
			approved: false
		}).returning({ id: aiActionLog.id });
		return {
			approval: "required",
			actionId: logRow.id,
			tool: "previewRefund",
			preview: {
				reference,
				amountCents: resolvedAmount,
				reason: reason ?? null,
				userId: intent.userId
			}
		};
	}
});
/**
* Returns the `tools` map ready to pass to `streamText({ tools })`. Each
* tool's `execute` already has the right userId / conversationId bound,
* and the admin-only tools are simply absent for creator variant — the
* model can't call what it can't see.
*/
function buildCopilotTools(opts) {
	const tools = {};
	if (isCreator(opts.role)) {
		tools.searchMyContent = searchMyContent(opts);
		tools.getMyAnalytics = getMyAnalytics(opts);
		tools.getMyEarnings = getMyEarnings(opts);
	}
	if (opts.variant === "admin" && isAdmin(opts.role)) {
		tools.searchUsers = searchUsers();
		tools.searchContent = searchContent();
		tools.getAbuseQueue = getAbuseQueue();
		tools.previewBan = previewBan(opts);
		tools.previewRefund = previewRefund(opts);
	}
	return tools;
}
/**
* System prompt for the Copilot — instructs the model on the platform
* context + the two-stage approval contract for mutating tools.
*/
function copilotSystemPrompt(variant) {
	return [
		"You are an AI assistant for Sephar Studios, a faith-based streaming platform.",
		variant === "admin" ? "You are the admin Copilot. You can search users, content, and the abuse queue, and PREVIEW destructive admin actions (ban, refund) for the admin to confirm." : "You are the creator Copilot. You can search the signed-in creator's own content, analytics, and earnings.",
		"Be respectful of Christian faith, theologically sensitive, family-appropriate, and concise.",
		"When calling a tool, prefer a single, focused call over many. Summarize results in plain language for the user.",
		"For MUTATING tools (previewBan, previewRefund): the tool returns ONLY a preview. The user must click Confirm in the UI before the action runs. Do not pretend the action has been applied — tell the user the preview is ready and waiting for their confirmation."
	].join(" ");
}
//#endregion
//#region src/routes/api/ai/copilot/+server.ts
/**
* POST /api/ai/copilot
*
* Streaming Copilot endpoint built on Vercel AI SDK 6's `streamText`. Returns
* a UI-message stream the `@ai-sdk/svelte` `Chat` class on the client
* consumes directly. Tokens, tool calls, and tool results stream as
* individual parts so the rail visibly fills in within ~500ms of the
* first byte — replacing the previous in-house loop that returned one
* large JSON blob after 10–30s of silence.
*
* Behaviour:
*   - body: { variant: 'creator' | 'admin', conversationId?, messages: UIMessage[], action?: 'list' | 'approve' }
*   - send (default)   → resolve / create the conversation row, stream the
*                        response, persist messages in `onFinish`.
*   - action 'list'    → return the last 20 conversations for this user +
*                        variant. (The dedicated GET /conversations route
*                        is preferred; this legacy branch stays for any
*                        client still using it.)
*   - action 'approve' → flip a staged ai_action_log row to approved.
*                        (The dedicated POST /approve route is preferred.)
*
* Conversation persistence:
*   The latest user message is written to `copilot_messages` before the
*   stream starts, so a network drop mid-stream can't lose the question.
*   The assistant + tool turns are persisted from `onFinish` once the
*   stream completes (or aborts cleanly).
*
* Approval flow for mutating tools:
*   `buildCopilotTools` returns mutating tools (previewBan, previewRefund)
*   whose `execute()` writes an `ai_action_log` row with `approved: false`
*   and resolves to `{ approval: 'required', actionId, tool, preview }`.
*   The UI renders this as a Confirm/Decline card and POSTs to
*   `/api/ai/copilot/approve` to flip the row.
*/
var MAX_TOOL_ITERATIONS = 6;
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json().catch(() => ({}));
	const variant = body.variant === "admin" ? "admin" : "creator";
	if (variant === "admin" && session.user.role !== "admin") return json({ error: "Admin variant requires admin role" }, { status: 403 });
	if (variant === "creator" && ![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Creator variant requires creator role" }, { status: 403 });
	if (body.action === "list") return json({ conversations: await db.select().from(copilotConversations).where(and(eq(copilotConversations.userId, session.user.id), eq(copilotConversations.variant, variant))).orderBy(desc(copilotConversations.updatedAt)).limit(20) });
	if (body.action === "approve") {
		if (!body.actionId) return json({ error: "actionId required" }, { status: 400 });
		return await approveAction(body.actionId, session.user.id);
	}
	if (!Array.isArray(body.messages) || body.messages.length === 0) return json({ error: "messages array is required" }, { status: 400 });
	return streamingSend({
		variant,
		role: session.user.role ?? "user",
		userId: session.user.id,
		incoming: body.messages,
		conversationId: body.conversationId
	});
};
async function streamingSend(opts) {
	let conversationId = opts.conversationId ?? null;
	if (!conversationId) {
		const seedTitle = lastUserText(opts.incoming).slice(0, 60) || "New chat";
		const [convo] = await db.insert(copilotConversations).values({
			userId: opts.userId,
			variant: opts.variant,
			title: seedTitle
		}).returning({ id: copilotConversations.id });
		conversationId = convo.id;
	}
	const lastUser = opts.incoming[opts.incoming.length - 1];
	if (lastUser?.role === "user") await db.insert(copilotMessages).values({
		conversationId,
		role: "user",
		content: lastUser.parts.filter((p) => p.type === "text").map((p) => p.text).join("\n")
	});
	const resolved = await getAiModel("agent").catch((err) => {
		console.error("[copilot] no AI provider available:", err);
		return null;
	});
	if (!resolved) return json({ error: "No AI provider configured. Set OLLAMA_URL or OPENROUTER_API_KEY." }, { status: 503 });
	const tools = buildCopilotTools({
		variant: opts.variant,
		userId: opts.userId,
		role: opts.role,
		conversationId
	});
	const modelMessages = await convertToModelMessages(opts.incoming);
	return streamText({
		model: resolved.model,
		system: copilotSystemPrompt(opts.variant),
		messages: modelMessages,
		tools,
		stopWhen: stepCountIs(MAX_TOOL_ITERATIONS),
		temperature: .3,
		onFinish: async ({ text, toolCalls, toolResults, usage }) => {
			try {
				if (text.trim()) await db.insert(copilotMessages).values({
					conversationId,
					role: "assistant",
					content: text.slice(0, 8e3)
				});
				for (let i = 0; i < toolCalls.length; i++) {
					const call = toolCalls[i];
					const res = toolResults?.[i];
					await db.insert(copilotMessages).values({
						conversationId,
						role: "tool",
						content: res ? JSON.stringify(res.output) : "(no result)",
						toolName: call.toolName,
						toolInput: call.input ?? {},
						toolOutput: res?.output ?? null
					});
				}
				await db.update(copilotConversations).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq(copilotConversations.id, conversationId));
				console.log("[copilot] stream finished", {
					conversationId,
					tokens: usage?.totalTokens,
					tools: toolCalls.length
				});
			} catch (err) {
				console.error("[copilot] onFinish persist failed:", err);
			}
		},
		onError: ({ error }) => {
			console.error("[copilot] streamText error:", error);
		}
	}).toUIMessageStreamResponse({ headers: { "x-conversation-id": conversationId } });
}
function lastUserText(messages) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const m = messages[i];
		if (m.role === "user") return m.parts.filter((p) => p.type === "text").map((p) => p.text).join(" ");
	}
	return "";
}
async function approveAction(actionId, userId) {
	const [row] = await db.select().from(aiActionLog).where(and(eq(aiActionLog.id, actionId), eq(aiActionLog.userId, userId))).limit(1);
	if (!row) return json({ error: "Action not found" }, { status: 404 });
	if (row.approved) return json({ error: "Action already approved" }, { status: 400 });
	await db.update(aiActionLog).set({
		approved: true,
		executedAt: /* @__PURE__ */ new Date()
	}).where(eq(aiActionLog.id, actionId));
	if (row.conversationId) await db.insert(copilotMessages).values({
		conversationId: row.conversationId,
		role: "assistant",
		content: `Approved. To execute ${row.tool}, use the existing admin surface (the Copilot does not directly mutate state).`
	});
	return json({
		ok: true,
		tool: row.tool
	});
}
var GET = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const conversationId = url.searchParams.get("conversationId");
	if (!conversationId) return json({ error: "conversationId required" }, { status: 400 });
	const [convo] = await db.select().from(copilotConversations).where(and(eq(copilotConversations.id, conversationId), eq(copilotConversations.userId, session.user.id))).limit(1);
	if (!convo) return json({ error: "Not found" }, { status: 404 });
	return json({
		conversation: convo,
		messages: await db.select().from(copilotMessages).where(eq(copilotMessages.conversationId, conversationId)).orderBy(asc(copilotMessages.createdAt))
	});
};
//#endregion
export { GET, POST };
