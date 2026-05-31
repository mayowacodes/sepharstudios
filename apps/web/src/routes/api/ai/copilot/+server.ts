import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { copilotConversations, copilotMessages, aiActionLog } from '$lib/db/schema/sepharstudios';
import { and, asc, desc, eq } from 'drizzle-orm';
import { runAi, tryParseJson } from '$lib/server/ai';
import { callTool, listTools, type ToolVariant } from '$lib/server/ai-tools';
import { Role } from '$lib/constants';

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

const MAX_TOOL_ITERATIONS = 6;

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json().catch(() => ({})) as {
		action?: string;
		conversationId?: string;
		variant?: string;
		message?: string;
		actionId?: string;
	};

	const variant = body.variant === 'admin' ? 'admin' : 'creator';
	// Variant gate.
	if (variant === 'admin' && session.user.role !== 'admin') {
		return json({ error: 'Admin variant requires admin role' }, { status: 403 });
	}
	if (variant === 'creator' && ![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Creator variant requires creator role' }, { status: 403 });
	}

	if (body.action === 'list') {
		const convos = await db.select()
			.from(copilotConversations)
			.where(and(eq(copilotConversations.userId, session.user.id), eq(copilotConversations.variant, variant)))
			.orderBy(desc(copilotConversations.updatedAt))
			.limit(20);
		return json({ conversations: convos });
	}

	if (body.action === 'approve') {
		if (!body.actionId) return json({ error: 'actionId required' }, { status: 400 });
		return await approveAction(body.actionId, session.user.id, variant as ToolVariant);
	}

	// Default: 'send'
	if (!body.message?.trim()) return json({ error: 'message is required' }, { status: 400 });

	let conversationId = body.conversationId;
	if (!conversationId) {
		const [convo] = await db.insert(copilotConversations).values({
			userId: session.user.id,
			variant,
			title: body.message.trim().slice(0, 60)
		}).returning({ id: copilotConversations.id });
		conversationId = convo.id;
	}

	// Persist user message.
	await db.insert(copilotMessages).values({
		conversationId,
		role: 'user',
		content: body.message.trim()
	});

	const trail: Array<{ role: 'user' | 'assistant' | 'tool'; content: string; tool?: string }> = [];
	const messages = await db.select()
		.from(copilotMessages)
		.where(eq(copilotMessages.conversationId, conversationId))
		.orderBy(asc(copilotMessages.createdAt));
	for (const m of messages) trail.push({ role: m.role as never, content: m.content, tool: m.toolName ?? undefined });

	const tools = listTools(variant as ToolVariant);
	const toolCatalog = tools.map((t) => `  - ${t.name}${t.mutating ? ' [MUTATING]' : ''}: ${t.description}`).join('\n');
	const systemPrompt = `You are the ${variant === 'admin' ? 'Admin' : 'Creator'} Copilot on Sephar Studios — a faith-based streaming platform.

You can either reply to the user or call a tool. Tools available:
${toolCatalog}

Respond ONLY with one JSON object per turn:
  { "type": "message", "text": "..." }
  { "type": "tool_call", "tool": "<name>", "input": { ... } }

Mutating tools return a PREVIEW only; the user must confirm before the action executes. After receiving a tool result, decide your next step (another tool call, or a message). Be concise. When done, return a message.`;

	let iter = 0;
	const newMessages: Array<{ id: string; role: string; content: string; toolName?: string; toolInput?: unknown; toolOutput?: unknown }> = [];
	let pendingApproval: { actionId: string; tool: string; preview: unknown } | null = null;

	while (iter < MAX_TOOL_ITERATIONS) {
		iter++;
		const transcript = trail.map((m) => {
			if (m.role === 'tool') return { role: 'system' as const, content: `Tool ${m.tool ?? '?'} result:\n${m.content}` };
			return { role: m.role as 'user' | 'assistant', content: m.content };
		});
		const result = await runAi({
			userId: session.user.id,
			surface: `copilot:${variant}`,
			modelType: 'agent',
			temperature: 0.3,
			maxTokens: 1024,
			messages: [{ role: 'system', content: systemPrompt }, ...transcript]
		});

		if (!result.ok) {
			const status = result.error === 'budget_exceeded' ? 429 : 503;
			return json({ error: result.message }, { status });
		}

		const parsed = tryParseJson<{ type?: string; text?: string; tool?: string; input?: Record<string, unknown> }>(result.content);
		if (!parsed) {
			// Fall back to treating the whole content as a message.
			const [msg] = await db.insert(copilotMessages).values({ conversationId, role: 'assistant', content: result.content.slice(0, 8000) }).returning();
			newMessages.push({ id: msg.id, role: 'assistant', content: msg.content });
			break;
		}

		if (parsed.type === 'message') {
			const text = parsed.text ?? '';
			const [msg] = await db.insert(copilotMessages).values({ conversationId, role: 'assistant', content: text.slice(0, 8000) }).returning();
			newMessages.push({ id: msg.id, role: 'assistant', content: msg.content });
			break;
		}

		if (parsed.type === 'tool_call' && parsed.tool) {
			const tres = await callTool(parsed.tool, parsed.input ?? {}, { userId: session.user.id, role: session.user.role ?? 'user' }, conversationId);
			const outputText = tres.ok ? JSON.stringify(tres.data) : `ERROR: ${tres.error}`;
			const [msg] = await db.insert(copilotMessages).values({
				conversationId,
				role: 'tool',
				content: outputText,
				toolName: parsed.tool,
				toolInput: parsed.input ?? {},
				toolOutput: (tres.data ?? null) as Record<string, unknown> | null
			}).returning();
			newMessages.push({ id: msg.id, role: 'tool', content: outputText, toolName: parsed.tool, toolInput: parsed.input ?? {}, toolOutput: tres.data });
			trail.push({ role: 'tool', content: outputText, tool: parsed.tool });

			if (tres.mutating && tres.ok) {
				// Find the just-inserted action_log row to expose its id for approval.
				const [pending] = await db.select({ id: aiActionLog.id })
					.from(aiActionLog)
					.where(and(eq(aiActionLog.userId, session.user.id), eq(aiActionLog.tool, parsed.tool), eq(aiActionLog.approved, false)))
					.orderBy(desc(aiActionLog.createdAt))
					.limit(1);
				if (pending) {
					pendingApproval = { actionId: pending.id, tool: parsed.tool, preview: tres.data };
					// Add a synthetic assistant message describing the staging.
					const [stage] = await db.insert(copilotMessages).values({
						conversationId,
						role: 'assistant',
						content: `Awaiting your approval to run ${parsed.tool}.`
					}).returning();
					newMessages.push({ id: stage.id, role: 'assistant', content: stage.content });
				}
				break;
			}
			continue;
		}

		// Unrecognized shape — treat as message + stop.
		const [msg] = await db.insert(copilotMessages).values({ conversationId, role: 'assistant', content: result.content.slice(0, 8000) }).returning();
		newMessages.push({ id: msg.id, role: 'assistant', content: msg.content });
		break;
	}

	await db.update(copilotConversations)
		.set({ updatedAt: new Date() })
		.where(eq(copilotConversations.id, conversationId));

	return json({
		conversationId,
		messages: newMessages,
		pendingApproval
	});
};

async function approveAction(actionId: string, userId: string, variant: ToolVariant) {
	const [row] = await db.select().from(aiActionLog).where(and(eq(aiActionLog.id, actionId), eq(aiActionLog.userId, userId))).limit(1);
	if (!row) return json({ error: 'Action not found' }, { status: 404 });
	if (row.approved) return json({ error: 'Action already approved' }, { status: 400 });

	// In this round the mutating tools are PREVIEW-only ("previewBan",
	// "previewRefund"). Actually firing the side effect routes through the
	// existing admin endpoints; we just mark the audit row approved + record
	// the time. The Copilot UI then nudges the admin to the relevant endpoint
	// (or directly calls /api/admin/users/:id/ban etc.).
	await db.update(aiActionLog)
		.set({ approved: true, executedAt: new Date() })
		.where(eq(aiActionLog.id, actionId));

	// Append a confirmation message to the conversation if one exists.
	if (row.conversationId) {
		await db.insert(copilotMessages).values({
			conversationId: row.conversationId,
			role: 'assistant',
			content: `Approved. To execute ${row.tool}, use the existing admin surface (the Copilot does not directly mutate state).`
		});
	}

	return json({ ok: true, variant, tool: row.tool });
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	const conversationId = url.searchParams.get('conversationId');
	if (!conversationId) return json({ error: 'conversationId required' }, { status: 400 });

	const [convo] = await db.select().from(copilotConversations).where(and(
		eq(copilotConversations.id, conversationId),
		eq(copilotConversations.userId, session.user.id)
	)).limit(1);
	if (!convo) return json({ error: 'Not found' }, { status: 404 });

	const messages = await db.select()
		.from(copilotMessages)
		.where(eq(copilotMessages.conversationId, conversationId))
		.orderBy(asc(copilotMessages.createdAt));

	return json({ conversation: convo, messages });
};
