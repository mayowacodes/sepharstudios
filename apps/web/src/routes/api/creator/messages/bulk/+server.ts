import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminMessages } from '$lib/db/schema/sepharstudios';
import { and, eq, inArray } from 'drizzle-orm';

/**
 * POST /api/creator/messages/bulk
 *
 * Body: { ids: string[]; action: 'archive' | 'read' }
 *
 * Atomic creator-side bulk action. The WHERE clause re-asserts ownership
 * (creatorId === session.user.id) so a hostile caller passing someone
 * else's message ids can't archive them.
 */

const MAX_IDS = 200;
const ACTIONS = new Set(['archive', 'read']);

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json().catch(() => ({})) as { ids?: unknown; action?: unknown };
	const ids = Array.isArray(body.ids) ? body.ids.filter((id): id is string => typeof id === 'string') : [];
	const action = typeof body.action === 'string' ? body.action : '';

	if (!ACTIONS.has(action)) {
		return json({ error: 'action must be one of: archive, read' }, { status: 400 });
	}
	if (ids.length === 0) {
		return json({ error: 'ids is required and must be non-empty' }, { status: 400 });
	}
	if (ids.length > MAX_IDS) {
		return json({ error: `Too many ids (max ${MAX_IDS})` }, { status: 400 });
	}

	const status = action === 'archive' ? 'archived' : 'read';
	const result = await db.update(adminMessages)
		.set({ status })
		.where(and(
			inArray(adminMessages.id, ids),
			eq(adminMessages.creatorId, session.user.id)
		))
		.returning({ id: adminMessages.id });

	return json({ success: true, updated: result.length });
};
