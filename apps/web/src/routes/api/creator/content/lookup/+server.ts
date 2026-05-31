import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, inArray, eq } from 'drizzle-orm';
import { Role } from '$lib/constants';

/**
 * GET /api/creator/content/lookup?ids=a,b,c
 *
 * Batch-resolves content rows to {id, title, thumbnail} for the curated-
 * next-up picker. Scoped to the signed-in creator's own catalog (admins
 * can resolve any) so we don't leak titles across creators.
 */

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const raw = url.searchParams.get('ids')?.trim() ?? '';
	const ids = Array.from(new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))).slice(0, 30);
	if (ids.length === 0) return json({ results: [] });

	const conditions = [inArray(mediaLibrary.id, ids)];
	if (session.user.role !== Role.ADMIN) {
		conditions.push(eq(mediaLibrary.creatorId, session.user.id));
	}

	const rows = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail
		})
		.from(mediaLibrary)
		.where(and(...conditions));

	return json({ results: rows });
};
