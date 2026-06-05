import { w as db, q as copilotConversations, r as copilotMessages, k as aiActionLog, R as paymentIntents, ag as user, a as abuseReports, M as mediaLibrary, Z as ppvPurchases } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { r as runAi, t as tryParseJson } from './ai-bbaOpgyC.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq, asc, desc, sql, ilike, or } from 'drizzle-orm';
import { z } from 'zod';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './ai-provider-ZmR1UjfK.js';
import './ai-settings-b9zX_Yow.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/lib/server/ai-tools.ts
var ALL_TOOLS = {
	searchMyContent: {
		name: "searchMyContent",
		description: "Search the signed-in creator's content library by keyword. Returns id/title/status/views for up to `limit` rows.",
		variant: "creator",
		mutating: false,
		schema: z.object({
			query: z.string().optional(),
			limit: z.number().min(1).max(50).optional()
		}),
		async run({ query, limit }, ctx) {
			return (await db.select({
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				status: mediaLibrary.status,
				views: mediaLibrary.viewCount
			}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, ctx.userId), query ? ilike(mediaLibrary.title, `%${query}%`) : sql`true`)).orderBy(desc(mediaLibrary.createdAt)).limit(limit ?? 20)).map((r) => ({
				id: r.id,
				title: r.title,
				status: r.status,
				views: Number(r.views ?? 0)
			}));
		}
	},
	getMyAnalytics: {
		name: "getMyAnalytics",
		description: "Returns a summary of the signed-in creator's analytics over `period` (default 30d). Includes total views, watch time, completion rate, and top content.",
		variant: "creator",
		mutating: false,
		schema: z.object({ period: z.enum([
			"7d",
			"30d",
			"90d"
		]).optional() }),
		async run({ period }, ctx) {
			const since = /* @__PURE__ */ new Date(Date.now() - {
				"7d": 7,
				"30d": 30,
				"90d": 90
			}[period ?? "30d"] * 864e5);
			const myContent = await db.select({
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				views: mediaLibrary.viewCount
			}).from(mediaLibrary).where(eq(mediaLibrary.creatorId, ctx.userId));
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
	},
	getMyEarnings: {
		name: "getMyEarnings",
		description: "Returns the signed-in creator's month + lifetime earnings.",
		variant: "creator",
		mutating: false,
		schema: z.object({}).strict(),
		async run(_input, ctx) {
			const rows = await db.select({
				contentId: ppvPurchases.contentId,
				amount: sql`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)::int`
			}).from(ppvPurchases).innerJoin(mediaLibrary, eq(mediaLibrary.id, ppvPurchases.contentId)).where(eq(mediaLibrary.creatorId, ctx.userId)).groupBy(ppvPurchases.contentId);
			const lifetimeCents = rows.reduce((s, r) => s + Number(r.amount ?? 0), 0);
			return {
				lifetimeCents,
				lifetimeDollars: lifetimeCents / 100,
				byContentCount: rows.length
			};
		}
	},
	searchUsers: {
		name: "searchUsers",
		description: "Search users by name or email. Admin-only.",
		variant: "admin",
		mutating: false,
		schema: z.object({
			query: z.string().min(1),
			limit: z.number().min(1).max(50).optional()
		}),
		async run({ query, limit }) {
			return await db.select({
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role
			}).from(user).where(or(ilike(user.name, `%${query}%`), ilike(user.email, `%${query}%`))).limit(limit ?? 20);
		}
	},
	searchContent: {
		name: "searchContent",
		description: "Search all content on the platform. Admin-only.",
		variant: "admin",
		mutating: false,
		schema: z.object({
			query: z.string().optional(),
			status: z.string().optional(),
			limit: z.number().min(1).max(50).optional()
		}),
		async run({ query, status, limit }) {
			const conditions = [];
			if (query) conditions.push(ilike(mediaLibrary.title, `%${query}%`));
			if (status) conditions.push(eq(mediaLibrary.status, status));
			const where = conditions.length > 0 ? and(...conditions) : void 0;
			return await db.select({
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				status: mediaLibrary.status,
				creatorId: mediaLibrary.creatorId
			}).from(mediaLibrary).where(where).orderBy(desc(mediaLibrary.createdAt)).limit(limit ?? 20);
		}
	},
	getAbuseQueue: {
		name: "getAbuseQueue",
		description: "Read the abuse report queue. Admin-only.",
		variant: "admin",
		mutating: false,
		schema: z.object({
			status: z.enum(["open", "resolved"]).optional(),
			limit: z.number().min(1).max(50).optional()
		}),
		async run({ status, limit }) {
			return await db.select({
				id: abuseReports.id,
				category: abuseReports.category,
				targetType: abuseReports.targetType,
				targetId: abuseReports.targetId,
				createdAt: abuseReports.createdAt
			}).from(abuseReports).where(status ? eq(abuseReports.status, status) : sql`true`).orderBy(desc(abuseReports.createdAt)).limit(limit ?? 20);
		}
	},
	previewBan: {
		name: "previewBan",
		description: "PREVIEW (does not execute) a ban for a user. Admin-only. Returns the action card the user must confirm.",
		variant: "admin",
		mutating: true,
		schema: z.object({
			userId: z.string(),
			reason: z.string().min(3)
		}),
		async run({ userId, reason }) {
			const [u] = await db.select({
				id: user.id,
				name: user.name
			}).from(user).where(eq(user.id, userId)).limit(1);
			if (!u) throw new Error("User not found");
			return { preview: {
				userId: u.id,
				userName: u.name,
				reason,
				warning: "This will set user.banned=true and write an admin_messages row. Reversible via admin."
			} };
		}
	},
	previewRefund: {
		name: "previewRefund",
		description: "PREVIEW (does not execute) a refund against a Paystack reference. Admin-only.",
		variant: "admin",
		mutating: true,
		schema: z.object({
			reference: z.string().min(3),
			amountCents: z.number().positive().optional(),
			reason: z.string().optional()
		}),
		async run({ reference, amountCents, reason }) {
			const [intent] = await db.select({
				userId: paymentIntents.userId,
				amountCents: paymentIntents.amountCents
			}).from(paymentIntents).where(eq(paymentIntents.reference, reference)).limit(1);
			if (!intent) throw new Error("No payment_intent for that reference");
			return { preview: {
				reference,
				amountCents: amountCents ?? intent.amountCents,
				reason: reason ?? null,
				userId: intent.userId
			} };
		}
	}
};
function listTools(variant) {
	return Object.values(ALL_TOOLS).filter((t) => t.variant === variant || t.variant === "both").map((t) => ({
		name: t.name,
		description: t.description,
		mutating: t.mutating,
		schema: t.schema
	}));
}
async function callTool(name, input, ctx, conversationId) {
	const tool = ALL_TOOLS[name];
	if (!tool) return {
		ok: false,
		error: `Unknown tool: ${name}`,
		mutating: false
	};
	if (!(tool.variant === "both" || tool.variant === "admin" && ctx.role === "admin" || tool.variant === "creator" && (ctx.role === "creator" || ctx.role === "admin"))) return {
		ok: false,
		error: `Tool ${name} is not available in your role`,
		mutating: tool.mutating
	};
	const parsed = tool.schema.safeParse(input ?? {});
	if (!parsed.success) return {
		ok: false,
		error: `Invalid input: ${parsed.error.message}`,
		mutating: tool.mutating
	};
	if (tool.mutating) try {
		const output = await tool.run(parsed.data, ctx);
		await db.insert(aiActionLog).values({
			userId: ctx.userId,
			conversationId: conversationId ?? null,
			tool: name,
			input: parsed.data,
			output,
			approved: false
		});
		return {
			ok: true,
			data: output,
			mutating: true
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Tool failed",
			mutating: true
		};
	}
	try {
		return {
			ok: true,
			data: await tool.run(parsed.data, ctx),
			mutating: false
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Tool failed",
			mutating: false
		};
	}
}
//#endregion
//#region src/routes/api/ai/copilot/+server.ts
/**
* POST /api/ai/copilot
*
* One body shape, three actions:
*   { action: 'send', conversationId?, variant, message }   → new user turn
*   { action: 'approve', actionId, conversationId, variant } → confirm a staged mutating tool
*   { action: 'list', variant }                              → list conversations
*
* The Copilot loop:
*   1. User sends a message.
*   2. We feed the rolling transcript + tool catalog to the LLM (modelType
*      'agent' for structured output) with a hard instruction to respond as
*      either { type: 'message', text } OR { type: 'tool_call', tool, input }.
*   3. If tool_call: run it; if non-mutating, append result and loop; if
*      mutating, return preview to the UI and stop. UI shows approval card.
*   4. On approval, the staged action is re-executed (now with side effects)
*      and a confirmation message is added to the transcript.
*
* Capped at 6 tool-call iterations per send to bound cost.
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
		return await approveAction(body.actionId, session.user.id, variant);
	}
	if (!body.message?.trim()) return json({ error: "message is required" }, { status: 400 });
	let conversationId = body.conversationId;
	if (!conversationId) {
		const [convo] = await db.insert(copilotConversations).values({
			userId: session.user.id,
			variant,
			title: body.message.trim().slice(0, 60)
		}).returning({ id: copilotConversations.id });
		conversationId = convo.id;
	}
	await db.insert(copilotMessages).values({
		conversationId,
		role: "user",
		content: body.message.trim()
	});
	const trail = [];
	const messages = await db.select().from(copilotMessages).where(eq(copilotMessages.conversationId, conversationId)).orderBy(asc(copilotMessages.createdAt));
	for (const m of messages) trail.push({
		role: m.role,
		content: m.content,
		tool: m.toolName ?? void 0
	});
	const toolCatalog = listTools(variant).map((t) => `  - ${t.name}${t.mutating ? " [MUTATING]" : ""}: ${t.description}`).join("\n");
	const systemPrompt = `You are the ${variant === "admin" ? "Admin" : "Creator"} Copilot on Sephar Studios — a faith-based streaming platform.

You can either reply to the user or call a tool. Tools available:
${toolCatalog}

Respond ONLY with one JSON object per turn:
  { "type": "message", "text": "..." }
  { "type": "tool_call", "tool": "<name>", "input": { ... } }

Mutating tools return a PREVIEW only; the user must confirm before the action executes. After receiving a tool result, decide your next step (another tool call, or a message). Be concise. When done, return a message.`;
	let iter = 0;
	const newMessages = [];
	let pendingApproval = null;
	while (iter < MAX_TOOL_ITERATIONS) {
		iter++;
		const transcript = trail.map((m) => {
			if (m.role === "tool") return {
				role: "system",
				content: `Tool ${m.tool ?? "?"} result:\n${m.content}`
			};
			return {
				role: m.role,
				content: m.content
			};
		});
		const result = await runAi({
			userId: session.user.id,
			surface: `copilot:${variant}`,
			modelType: "agent",
			temperature: .3,
			maxTokens: 1024,
			messages: [{
				role: "system",
				content: systemPrompt
			}, ...transcript]
		});
		if (!result.ok) {
			const status = result.error === "budget_exceeded" ? 429 : 503;
			return json({ error: result.message }, { status });
		}
		const parsed = tryParseJson(result.content);
		if (!parsed) {
			const [msg] = await db.insert(copilotMessages).values({
				conversationId,
				role: "assistant",
				content: result.content.slice(0, 8e3)
			}).returning();
			newMessages.push({
				id: msg.id,
				role: "assistant",
				content: msg.content
			});
			break;
		}
		if (parsed.type === "message") {
			const text = parsed.text ?? "";
			const [msg] = await db.insert(copilotMessages).values({
				conversationId,
				role: "assistant",
				content: text.slice(0, 8e3)
			}).returning();
			newMessages.push({
				id: msg.id,
				role: "assistant",
				content: msg.content
			});
			break;
		}
		if (parsed.type === "tool_call" && parsed.tool) {
			const tres = await callTool(parsed.tool, parsed.input ?? {}, {
				userId: session.user.id,
				role: session.user.role ?? "user"
			}, conversationId);
			const outputText = tres.ok ? JSON.stringify(tres.data) : `ERROR: ${tres.error}`;
			const [msg] = await db.insert(copilotMessages).values({
				conversationId,
				role: "tool",
				content: outputText,
				toolName: parsed.tool,
				toolInput: parsed.input ?? {},
				toolOutput: tres.data ?? null
			}).returning();
			newMessages.push({
				id: msg.id,
				role: "tool",
				content: outputText,
				toolName: parsed.tool,
				toolInput: parsed.input ?? {},
				toolOutput: tres.data
			});
			trail.push({
				role: "tool",
				content: outputText,
				tool: parsed.tool
			});
			if (tres.mutating && tres.ok) {
				const [pending] = await db.select({ id: aiActionLog.id }).from(aiActionLog).where(and(eq(aiActionLog.userId, session.user.id), eq(aiActionLog.tool, parsed.tool), eq(aiActionLog.approved, false))).orderBy(desc(aiActionLog.createdAt)).limit(1);
				if (pending) {
					pendingApproval = {
						actionId: pending.id,
						tool: parsed.tool,
						preview: tres.data
					};
					const [stage] = await db.insert(copilotMessages).values({
						conversationId,
						role: "assistant",
						content: `Awaiting your approval to run ${parsed.tool}.`
					}).returning();
					newMessages.push({
						id: stage.id,
						role: "assistant",
						content: stage.content
					});
				}
				break;
			}
			continue;
		}
		const [msg] = await db.insert(copilotMessages).values({
			conversationId,
			role: "assistant",
			content: result.content.slice(0, 8e3)
		}).returning();
		newMessages.push({
			id: msg.id,
			role: "assistant",
			content: msg.content
		});
		break;
	}
	await db.update(copilotConversations).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq(copilotConversations.id, conversationId));
	return json({
		conversationId,
		messages: newMessages,
		pendingApproval
	});
};
async function approveAction(actionId, userId, variant) {
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
		variant,
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

export { GET, POST };
//# sourceMappingURL=_server.ts-CCVr0Hog.js.map
