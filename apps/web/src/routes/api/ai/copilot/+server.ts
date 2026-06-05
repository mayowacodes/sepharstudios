import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { copilotConversations, copilotMessages, aiActionLog } from '$lib/db/schema/sepharstudios';
import { and, asc, desc, eq } from 'drizzle-orm';
import {
	streamText,
	convertToModelMessages,
	stepCountIs,
	type UIMessage
} from 'ai';
import { getAiModel } from '$lib/server/ai-model';
import { buildCopilotTools, copilotSystemPrompt, type CopilotVariant } from '$lib/server/ai-tools-sdk';
import { Role } from '$lib/constants';

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

const MAX_TOOL_ITERATIONS = 6;

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json().catch(() => ({})) as {
		action?: string;
		conversationId?: string;
		variant?: string;
		messages?: UIMessage[];
		actionId?: string;
	};

	const variant: CopilotVariant = body.variant === 'admin' ? 'admin' : 'creator';

	if (variant === 'admin' && session.user.role !== 'admin') {
		return json({ error: 'Admin variant requires admin role' }, { status: 403 });
	}
	if (variant === 'creator' && ![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Creator variant requires creator role' }, { status: 403 });
	}

	// ── Compat: action=list (prefer GET /conversations) ────────────────────
	if (body.action === 'list') {
		const convos = await db.select()
			.from(copilotConversations)
			.where(and(eq(copilotConversations.userId, session.user.id), eq(copilotConversations.variant, variant)))
			.orderBy(desc(copilotConversations.updatedAt))
			.limit(20);
		return json({ conversations: convos });
	}

	// ── Compat: action=approve (prefer POST /approve) ──────────────────────
	if (body.action === 'approve') {
		if (!body.actionId) return json({ error: 'actionId required' }, { status: 400 });
		return await approveAction(body.actionId, session.user.id);
	}

	// ── Streaming send (default + only) ────────────────────────────────────
	if (!Array.isArray(body.messages) || body.messages.length === 0) {
		return json({ error: 'messages array is required' }, { status: 400 });
	}
	return streamingSend({
		variant,
		role: session.user.role ?? 'user',
		userId: session.user.id,
		incoming: body.messages,
		conversationId: body.conversationId
	});
};

interface StreamingSendOpts {
	variant: CopilotVariant;
	role: string;
	userId: string;
	incoming: UIMessage[];
	conversationId?: string;
}

async function streamingSend(opts: StreamingSendOpts): Promise<Response> {
	let conversationId = opts.conversationId ?? null;
	if (!conversationId) {
		const seedTitle = lastUserText(opts.incoming).slice(0, 60) || 'New chat';
		const [convo] = await db.insert(copilotConversations).values({
			userId: opts.userId,
			variant: opts.variant,
			title: seedTitle
		}).returning({ id: copilotConversations.id });
		conversationId = convo.id;
	}

	// Persist the latest user turn immediately so a network drop can't
	// lose what they asked.
	const lastUser = opts.incoming[opts.incoming.length - 1];
	if (lastUser?.role === 'user') {
		await db.insert(copilotMessages).values({
			conversationId,
			role: 'user',
			content: lastUser.parts
				.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
				.map((p) => p.text)
				.join('\n')
		});
	}

	const resolved = await getAiModel('agent').catch((err) => {
		console.error('[copilot] no AI provider available:', err);
		return null;
	});
	if (!resolved) {
		return json({
			error: 'No AI provider configured. Set OLLAMA_URL or OPENROUTER_API_KEY.'
		}, { status: 503 });
	}

	const tools = buildCopilotTools({
		variant: opts.variant,
		userId: opts.userId,
		role: opts.role,
		conversationId
	});

	const modelMessages = await convertToModelMessages(opts.incoming);
	const result = streamText({
		model: resolved.model,
		system: copilotSystemPrompt(opts.variant),
		messages: modelMessages,
		tools,
		stopWhen: stepCountIs(MAX_TOOL_ITERATIONS),
		temperature: 0.3,
		onFinish: async ({ text, toolCalls, toolResults, usage }) => {
			try {
				if (text.trim()) {
					await db.insert(copilotMessages).values({
						conversationId: conversationId!,
						role: 'assistant',
						content: text.slice(0, 8000)
					});
				}
				for (let i = 0; i < toolCalls.length; i++) {
					const call = toolCalls[i];
					const res = toolResults?.[i];
					await db.insert(copilotMessages).values({
						conversationId: conversationId!,
						role: 'tool',
						content: res ? JSON.stringify(res.output) : '(no result)',
						toolName: call.toolName,
						toolInput: (call.input ?? {}) as Record<string, unknown>,
						toolOutput: (res?.output ?? null) as Record<string, unknown> | null
					});
				}
				await db.update(copilotConversations)
					.set({ updatedAt: new Date() })
					.where(eq(copilotConversations.id, conversationId!));
				console.log('[copilot] stream finished', {
					conversationId,
					tokens: usage?.totalTokens,
					tools: toolCalls.length
				});
			} catch (err) {
				console.error('[copilot] onFinish persist failed:', err);
			}
		},
		onError: ({ error }) => {
			console.error('[copilot] streamText error:', error);
		}
	});

	return result.toUIMessageStreamResponse({
		headers: {
			'x-conversation-id': conversationId
		}
	});
}

function lastUserText(messages: UIMessage[]): string {
	for (let i = messages.length - 1; i >= 0; i--) {
		const m = messages[i];
		if (m.role === 'user') {
			return m.parts
				.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
				.map((p) => p.text)
				.join(' ');
		}
	}
	return '';
}

async function approveAction(actionId: string, userId: string) {
	const [row] = await db.select().from(aiActionLog)
		.where(and(eq(aiActionLog.id, actionId), eq(aiActionLog.userId, userId)))
		.limit(1);
	if (!row) return json({ error: 'Action not found' }, { status: 404 });
	if (row.approved) return json({ error: 'Action already approved' }, { status: 400 });

	await db.update(aiActionLog)
		.set({ approved: true, executedAt: new Date() })
		.where(eq(aiActionLog.id, actionId));

	if (row.conversationId) {
		await db.insert(copilotMessages).values({
			conversationId: row.conversationId,
			role: 'assistant',
			content: `Approved. To execute ${row.tool}, use the existing admin surface (the Copilot does not directly mutate state).`
		});
	}

	return json({ ok: true, tool: row.tool });
}

// ─── Conversation history loader ────────────────────────────────────────────
// The dedicated GET /api/ai/copilot/conversations is preferred, but this
// stays for clients that still load a single conversation through the
// main endpoint with `?conversationId=`.

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
