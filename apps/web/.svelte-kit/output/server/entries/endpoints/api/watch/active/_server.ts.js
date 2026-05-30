import { j as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { t as getRedis } from "../../../../../chunks/redis.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/watch/active/+server.ts
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
var TTL_SECONDS = 70;
var POST = async ({ request, locals, cookies, getClientAddress }) => {
	const body = await request.json().catch(() => ({}));
	if (!body.contentId) return json({ error: "contentId is required" }, { status: 400 });
	const [content] = await db.select({ creatorId: mediaLibrary.creatorId }).from(mediaLibrary).where(eq(mediaLibrary.id, body.contentId)).limit(1);
	if (!content?.creatorId) return json({
		ok: true,
		skipped: true
	});
	const session = await locals.auth.getSession();
	const viewerKey = session?.user.id ?? cookies.get("anon_viewer") ?? `${getClientAddress()}:${Math.floor(Math.random() * 1e6)}`;
	if (!session && !cookies.get("anon_viewer")) cookies.set("anon_viewer", viewerKey, {
		path: "/",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		maxAge: 3600 * 24
	});
	try {
		const redis = getRedis();
		const key = `creator:active-viewers:${content.creatorId}`;
		const now = Date.now();
		await redis.zadd(key, now, viewerKey);
		await redis.expire(key, TTL_SECONDS);
	} catch {}
	return json({ ok: true });
};
//#endregion
export { POST };
