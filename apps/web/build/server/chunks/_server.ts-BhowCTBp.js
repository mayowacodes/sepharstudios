import { w as db, x as episodes, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, and } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/creator/content/[id]/episodes/[episodeId]/+server.ts
var ALLOWED_FIELDS = new Set([
	"seasonNumber",
	"episodeNumber",
	"title",
	"description",
	"thumbnail",
	"videoUrl",
	"duration",
	"airDate"
]);
async function loadShowAndEpisode(contentId, episodeId, ownerId) {
	const [show] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!show || show.creatorId !== ownerId) return null;
	const [ep] = await db.select().from(episodes).where(and(eq(episodes.id, episodeId), eq(episodes.showId, contentId))).limit(1);
	if (!ep) return null;
	return ep;
}
var PATCH = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const ep = await loadShowAndEpisode(params.id, params.episodeId, session.user.id);
	if (!ep) return json({ error: "Episode not found" }, { status: 404 });
	const body = await request.json().catch(() => ({}));
	const updates = {};
	for (const [key, value] of Object.entries(body)) {
		if (!ALLOWED_FIELDS.has(key)) continue;
		if (key === "seasonNumber" || key === "episodeNumber") {
			const n = Number(value);
			if (!Number.isFinite(n) || n < 1) return json({ error: `${key} must be a positive integer` }, { status: 400 });
			updates[key] = n;
		} else if (key === "title") {
			const t = String(value ?? "").trim();
			if (!t) return json({ error: "title cannot be empty" }, { status: 400 });
			updates.title = t.slice(0, 255);
		} else updates[key] = value;
	}
	if (Object.keys(updates).length === 0) return json({ error: "No updatable fields supplied" }, { status: 400 });
	const [updated] = await db.update(episodes).set(updates).where(eq(episodes.id, ep.id)).returning();
	return json({
		success: true,
		episode: updated
	});
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const ep = await loadShowAndEpisode(params.id, params.episodeId, session.user.id);
	if (!ep) return json({ error: "Episode not found" }, { status: 404 });
	await db.delete(episodes).where(eq(episodes.id, ep.id));
	return json({ success: true });
};

export { DELETE, PATCH };
//# sourceMappingURL=_server.ts-BhowCTBp.js.map
