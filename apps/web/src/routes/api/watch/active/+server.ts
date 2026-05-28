import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { getRedis } from '$lib/server/redis';

/**
 * POST /api/watch/active  { contentId }
 *
 * Heartbeat from VideoPlayer while the video is playing. Updates a per-creator
 * Redis ZSET keyed by viewer (userId or anonymous session id) with the current
 * timestamp. The creator's analytics endpoint trims entries older than 60s and
 * reports the cardinality as `activeViewers`.
 *
 * No auth required — anonymous viewers count too. We fall through silently if
 * Redis isn't reachable: the counter is a "nice to have", not load-bearing.
 */

const TTL_SECONDS = 70; // a bit beyond the 60s trim window so a single dropped ping doesn't drop the viewer

export const POST: RequestHandler = async ({ request, locals, cookies, getClientAddress }) => {
	const body = await request.json().catch(() => ({})) as { contentId?: string };
	if (!body.contentId) {
		return json({ error: 'contentId is required' }, { status: 400 });
	}

	const [content] = await db
		.select({ creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, body.contentId))
		.limit(1);
	if (!content?.creatorId) {
		// Content not found — still 200 so we don't spam the client with errors.
		return json({ ok: true, skipped: true });
	}

	const session = await locals.auth.getSession();
	const viewerKey = session?.user.id
		?? cookies.get('anon_viewer')
		?? `${getClientAddress()}:${Math.floor(Math.random() * 1_000_000)}`;
	if (!session && !cookies.get('anon_viewer')) {
		cookies.set('anon_viewer', viewerKey, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 // 1 day is plenty for the rolling-counter use case
		});
	}

	try {
		const redis = getRedis();
		const key = `creator:active-viewers:${content.creatorId}`;
		const now = Date.now();
		await redis.zadd(key, now, viewerKey);
		await redis.expire(key, TTL_SECONDS);
	} catch {
		// best-effort
	}

	return json({ ok: true });
};
