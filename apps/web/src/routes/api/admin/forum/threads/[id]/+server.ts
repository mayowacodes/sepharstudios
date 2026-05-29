import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { forumThreads } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

/**
 * PATCH /api/admin/forum/threads/[id]
 *
 * Admin-only thread mod: { isSticky?, isLocked?, status?, moderationNote? }.
 */

const ALLOWED_STATUSES = new Set(['published', 'hidden', 'removed']);

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const body = await request.json().catch(() => ({})) as {
		isSticky?: boolean;
		isLocked?: boolean;
		status?: string;
		moderationNote?: string;
	};

	const updates: Record<string, unknown> = { updatedAt: new Date() };
	if (typeof body.isSticky === 'boolean') updates.isSticky = body.isSticky;
	if (typeof body.isLocked === 'boolean') updates.isLocked = body.isLocked;
	if (body.status && ALLOWED_STATUSES.has(body.status)) updates.status = body.status;
	if (typeof body.moderationNote === 'string') updates.moderationNote = body.moderationNote;

	if (Object.keys(updates).length === 1) {
		return json({ error: 'No updatable fields supplied' }, { status: 400 });
	}

	const [updated] = await db.update(forumThreads)
		.set(updates)
		.where(eq(forumThreads.id, params.id!))
		.returning();

	if (!updated) return json({ error: 'Thread not found' }, { status: 404 });
	return json({ success: true, thread: updated });
};
