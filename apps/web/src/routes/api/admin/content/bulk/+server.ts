import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { inArray } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

/**
 * POST /api/admin/content/bulk
 *
 * Performs a single action on multiple media_library items at once.
 *
 * Body: { ids: string[], action: 'approve' | 'reject' | 'delete' | 'archive' | 'priority-high' | 'priority-medium' | 'priority-low' }
 *
 * Wired from the admin content moderation page's bulk-action UI. Admin only.
 */

const VALID_ACTIONS = new Set([
	'approve', 'reject', 'delete', 'archive',
	'priority-high', 'priority-medium', 'priority-low'
]);

const MAX_BATCH_SIZE = 100;

export const POST: RequestHandler = async ({ locals, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error!;

	const body = await request.json() as { ids?: string[]; action?: string };

	if (!Array.isArray(body.ids) || body.ids.length === 0) {
		return json({ error: 'ids[] is required' }, { status: 400 });
	}
	if (body.ids.length > MAX_BATCH_SIZE) {
		return json({ error: `Batch limited to ${MAX_BATCH_SIZE} items` }, { status: 400 });
	}
	if (!body.action || !VALID_ACTIONS.has(body.action)) {
		return json({ error: `action must be one of: ${Array.from(VALID_ACTIONS).join(', ')}` }, { status: 400 });
	}

	const now = new Date();
	let affected = 0;

	switch (body.action) {
		case 'approve': {
			const rows = await db.update(mediaLibrary)
				.set({
					status: 'published',
					isActive: true,
					reviewedAt: now,
					reviewedBy: session.user.id,
					updatedAt: now
				})
				.where(inArray(mediaLibrary.id, body.ids))
				.returning({ id: mediaLibrary.id });
			affected = rows.length;
			break;
		}

		case 'reject': {
			const rows = await db.update(mediaLibrary)
				.set({
					status: 'rejected',
					isActive: false,
					reviewedAt: now,
					reviewedBy: session.user.id,
					updatedAt: now
				})
				.where(inArray(mediaLibrary.id, body.ids))
				.returning({ id: mediaLibrary.id });
			affected = rows.length;
			break;
		}

		case 'archive': {
			const rows = await db.update(mediaLibrary)
				.set({
					status: 'archived',
					isActive: false,
					updatedAt: now
				})
				.where(inArray(mediaLibrary.id, body.ids))
				.returning({ id: mediaLibrary.id });
			affected = rows.length;
			break;
		}

		case 'delete': {
			// Hard delete — keep this admin-only and gated by the requireAdmin check
			// above. Schema cascades take care of episodes/playlist_items.
			const rows = await db.delete(mediaLibrary)
				.where(inArray(mediaLibrary.id, body.ids))
				.returning({ id: mediaLibrary.id });
			affected = rows.length;
			break;
		}

		case 'priority-high':
		case 'priority-medium':
		case 'priority-low': {
			// `featured` is the closest existing column for priority elevation.
			// Mark high-priority items as featured; lower priorities as not.
			const featured = body.action === 'priority-high';
			const rows = await db.update(mediaLibrary)
				.set({ featured, updatedAt: now })
				.where(inArray(mediaLibrary.id, body.ids))
				.returning({ id: mediaLibrary.id });
			affected = rows.length;
			break;
		}
	}

	return json({ success: true, action: body.action, affected });
};
