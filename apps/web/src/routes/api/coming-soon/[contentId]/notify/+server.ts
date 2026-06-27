import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { comingSoonSubscriptions, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

/**
 * Notify-me toggle for a Coming Soon title.
 *
 * GET    /api/coming-soon/<contentId>/notify  → { subscribed: boolean }
 * POST   /api/coming-soon/<contentId>/notify  → toggle, returns { subscribed }
 *
 * Sign-in required. The detail page hydrates the bell-icon state from
 * GET, then flips with POST. The cron at /api/cron/scheduled-publish
 * reads this table on flip-to-live and dispatches the notification.
 */

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ subscribed: false, signedIn: false });

	const contentId = params.contentId;
	if (!contentId) return json({ error: 'contentId required' }, { status: 400 });

	const [row] = await db
		.select({ id: comingSoonSubscriptions.id })
		.from(comingSoonSubscriptions)
		.where(and(
			eq(comingSoonSubscriptions.userId, session.user.id),
			eq(comingSoonSubscriptions.contentId, contentId)
		))
		.limit(1);

	return json({ subscribed: !!row, signedIn: true });
};

export const POST: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'unauthorized' }, { status: 401 });

	const contentId = params.contentId;
	if (!contentId) return json({ error: 'contentId required' }, { status: 400 });

	// Verify the content actually exists + is still in coming_soon state.
	// A subscription on a non-coming-soon row would either never fire or
	// be moot — fail fast.
	const [content] = await db
		.select({ id: mediaLibrary.id, status: mediaLibrary.status })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);
	if (!content) return json({ error: 'content not found' }, { status: 404 });
	if (content.status !== 'coming_soon') {
		return json({ error: 'content is not in coming_soon state' }, { status: 409 });
	}

	const [existing] = await db
		.select({ id: comingSoonSubscriptions.id })
		.from(comingSoonSubscriptions)
		.where(and(
			eq(comingSoonSubscriptions.userId, session.user.id),
			eq(comingSoonSubscriptions.contentId, contentId)
		))
		.limit(1);

	if (existing) {
		await db.delete(comingSoonSubscriptions).where(eq(comingSoonSubscriptions.id, existing.id));
		return json({ subscribed: false });
	}

	await db.insert(comingSoonSubscriptions).values({
		userId: session.user.id,
		contentId
	});
	return json({ subscribed: true });
};
