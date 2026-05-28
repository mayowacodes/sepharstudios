import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { pushSubscriptions } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

/**
 * POST /api/push/subscribe
 *   body: PushSubscriptionJSON  ({ endpoint, keys: { p256dh, auth } })
 *
 * Upserts the subscription for the current user. Endpoint is the natural
 * key — re-registering from the same browser updates the timestamps but
 * doesn't create a duplicate row.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json().catch(() => null) as {
		endpoint?: string;
		keys?: { p256dh?: string; auth?: string };
	} | null;

	if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
		return json({ error: 'Missing endpoint or keys' }, { status: 400 });
	}

	const userAgent = request.headers.get('user-agent') ?? null;
	const now = new Date();

	const existing = await db.select()
		.from(pushSubscriptions)
		.where(and(
			eq(pushSubscriptions.userId, session.user.id),
			eq(pushSubscriptions.endpoint, body.endpoint)
		))
		.limit(1);

	if (existing[0]) {
		await db.update(pushSubscriptions)
			.set({
				p256dh: body.keys.p256dh,
				auth: body.keys.auth,
				userAgent,
				lastSeenAt: now
			})
			.where(eq(pushSubscriptions.id, existing[0].id));
		return json({ success: true, id: existing[0].id, updated: true });
	}

	const [inserted] = await db.insert(pushSubscriptions).values({
		userId: session.user.id,
		endpoint: body.endpoint,
		p256dh: body.keys.p256dh,
		auth: body.keys.auth,
		userAgent,
		lastSeenAt: now
	}).returning({ id: pushSubscriptions.id });

	return json({ success: true, id: inserted.id, updated: false });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const body = await request.json().catch(() => ({})) as { endpoint?: string };
	if (!body.endpoint) return json({ error: 'endpoint is required' }, { status: 400 });

	await db.delete(pushSubscriptions)
		.where(and(
			eq(pushSubscriptions.userId, session.user.id),
			eq(pushSubscriptions.endpoint, body.endpoint)
		));

	return json({ success: true });
};
