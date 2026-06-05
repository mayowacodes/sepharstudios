import { w as db, x as episodes, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, asc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/creator/content/[id]/episodes/+server.ts
/**
* GET  /api/creator/content/[id]/episodes — list episodes for this show
* POST /api/creator/content/[id]/episodes — create a new episode
*
* Ownership: parent show (mediaLibrary row) must belong to the signed-in
* creator and have mediaType='show'.
*/
async function loadShow(contentId, ownerId) {
	const [row] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId,
		mediaType: mediaLibrary.mediaType
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!row) return {
		row: null,
		status: 404
	};
	if (row.creatorId !== ownerId) return {
		row: null,
		status: 403
	};
	if (row.mediaType !== "show") return {
		row: null,
		status: 400
	};
	return {
		row,
		status: 200
	};
}
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { row, status } = await loadShow(params.id, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? "Show not found" : status === 400 ? "Content is not a show" : "Forbidden" }, { status });
	return json({ episodes: await db.select().from(episodes).where(eq(episodes.showId, row.id)).orderBy(asc(episodes.seasonNumber), asc(episodes.episodeNumber)) });
};
var POST = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { row, status } = await loadShow(params.id, session.user.id);
	if (status !== 200) return json({ error: status === 404 ? "Show not found" : status === 400 ? "Content is not a show" : "Forbidden" }, { status });
	const body = await request.json().catch(() => ({}));
	const seasonNumber = Number.isFinite(body.seasonNumber) ? Number(body.seasonNumber) : NaN;
	const episodeNumber = Number.isFinite(body.episodeNumber) ? Number(body.episodeNumber) : NaN;
	const title = body.title?.trim() ?? "";
	if (!Number.isFinite(seasonNumber) || seasonNumber < 1) return json({ error: "seasonNumber must be a positive integer" }, { status: 400 });
	if (!Number.isFinite(episodeNumber) || episodeNumber < 1) return json({ error: "episodeNumber must be a positive integer" }, { status: 400 });
	if (!title) return json({ error: "title is required" }, { status: 400 });
	const id = crypto.randomUUID();
	await db.insert(episodes).values({
		id,
		showId: row.id,
		seasonNumber,
		episodeNumber,
		title: title.slice(0, 255),
		description: body.description ?? null,
		thumbnail: body.thumbnail ?? null,
		videoUrl: body.videoUrl ?? null,
		duration: body.duration ?? null,
		airDate: body.airDate ?? null
	});
	return json({
		success: true,
		id
	});
};

export { GET, POST };
//# sourceMappingURL=_server.ts-BU05qEdj.js.map
