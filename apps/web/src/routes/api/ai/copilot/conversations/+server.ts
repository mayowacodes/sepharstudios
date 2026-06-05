import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { copilotConversations, copilotMessages } from '$lib/db/schema/sepharstudios';
import { and, asc, desc, eq } from 'drizzle-orm';

/**
 * GET /api/ai/copilot/conversations?variant=creator|admin
 *   Returns the signed-in user's last 20 conversations for that variant.
 *   Used by the rail's conversation-switcher dropdown.
 *
 * GET /api/ai/copilot/conversations?id=<conversationId>
 *   Returns the conversation + ordered messages, shaped for the
 *   `@ai-sdk/svelte` `Chat({ initialMessages })` constructor — each row
 *   gets converted to a UIMessage with a single text part. Tool turns get
 *   role 'assistant' with a 'tool-' part type so the rail renders them
 *   inline like new turns.
 */

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const conversationId = url.searchParams.get('id');
	if (conversationId) {
		const [convo] = await db.select()
			.from(copilotConversations)
			.where(and(
				eq(copilotConversations.id, conversationId),
				eq(copilotConversations.userId, session.user.id)
			))
			.limit(1);
		if (!convo) return json({ error: 'Not found' }, { status: 404 });

		const rows = await db.select()
			.from(copilotMessages)
			.where(eq(copilotMessages.conversationId, conversationId))
			.orderBy(asc(copilotMessages.createdAt));

		// Shape rows into UIMessage[] for Chat({ initialMessages }).
		const initialMessages = rows.map((m) => ({
			id: m.id,
			role: m.role === 'tool' ? 'assistant' : m.role,
			parts: m.role === 'tool'
				? [{
					type: `tool-${m.toolName ?? 'unknown'}` as const,
					toolCallId: m.id,
					state: 'output-available' as const,
					input: m.toolInput,
					output: m.toolOutput
				}]
				: [{ type: 'text' as const, text: m.content }]
		}));

		return json({ conversation: convo, initialMessages });
	}

	const variant = url.searchParams.get('variant') === 'admin' ? 'admin' : 'creator';
	const conversations = await db.select({
		id: copilotConversations.id,
		title: copilotConversations.title,
		variant: copilotConversations.variant,
		createdAt: copilotConversations.createdAt,
		updatedAt: copilotConversations.updatedAt
	})
		.from(copilotConversations)
		.where(and(
			eq(copilotConversations.userId, session.user.id),
			eq(copilotConversations.variant, variant)
		))
		.orderBy(desc(copilotConversations.updatedAt))
		.limit(20);

	return json({ conversations });
};
