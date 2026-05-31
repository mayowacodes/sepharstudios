import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq, inArray } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * POST /api/creator/content/bulk
 *
 * Body: { ids: string[], action: 'publish'|'unlist'|'private'|'archive'|'delete' }
 *
 * Applies a single action across many content rows in one go. Every id must
 * belong to the signed-in creator — if any fails the ownership check we
 * return 403 and skip the whole batch (no partial writes).
 *
 * Cap: 100 ids per call (matches the admin bulk endpoint).
 */

const VALID_ACTIONS = new Set(['publish', 'unlist', 'private', 'archive', 'delete']);
const BATCH_MAX = 100;

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({})) as {
		ids?: string[];
		action?: string;
	};

	if (!Array.isArray(body.ids) || body.ids.length === 0) {
		return json({ error: 'ids is required' }, { status: 400 });
	}
	if (body.ids.length > BATCH_MAX) {
		return json({ error: `Maximum batch size is ${BATCH_MAX}` }, { status: 400 });
	}
	if (!body.action || !VALID_ACTIONS.has(body.action)) {
		return json({ error: 'Invalid action' }, { status: 400 });
	}

	const ids = [...new Set(body.ids.filter((id): id is string => typeof id === 'string' && id.length > 0))];

	// Ownership check — pull only the rows that match BOTH the id list AND
	// the creator id. If the count doesn't match, someone tried to bulk-touch
	// content they don't own.
	const owned = await db.select({ id: mediaLibrary.id })
		.from(mediaLibrary)
		.where(and(
			inArray(mediaLibrary.id, ids),
			eq(mediaLibrary.creatorId, session.user.id)
		));
	if (owned.length !== ids.length) {
		return json({ error: 'One or more content items are not yours' }, { status: 403 });
	}

	const now = new Date();
	let updates: Record<string, unknown>;
	switch (body.action) {
		case 'publish':
			updates = { visibility: 'public', isActive: true, updatedAt: now };
			break;
		case 'unlist':
			updates = { visibility: 'unlisted', updatedAt: now };
			break;
		case 'private':
			updates = { visibility: 'private', updatedAt: now };
			break;
		case 'archive':
			updates = { status: 'archived', isActive: false, updatedAt: now };
			break;
		case 'delete':
			updates = { status: 'archived', isActive: false, visibility: 'private', updatedAt: now };
			break;
		default:
			return json({ error: 'Invalid action' }, { status: 400 });
	}

	await db.update(mediaLibrary).set(updates).where(inArray(mediaLibrary.id, ids));

	return json({ success: true, affected: ids.length, action: body.action });
};
