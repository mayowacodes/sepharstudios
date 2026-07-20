import { A as episodes, K as mediaLibrary, t as db } from "../../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, asc, eq } from "drizzle-orm";
//#region src/routes/api/creator/content/[id]/episodes/+server.ts
/**
* GET  /api/creator/content/[id]/episodes — list episodes for this show
* POST /api/creator/content/[id]/episodes — create a new episode
*
* Ownership: parent show (mediaLibrary row) must belong to the signed-in
* creator and have a series-shaped mediaType. The wizard writes the
* value 'series' (the canonical ContentType.SERIES enum); legacy rows
* may still carry 'show' or 'tv'. All three are accepted so the
* episodes manager works regardless of which value was written.
*/
var SERIES_LIKE_TYPES = new Set([
	"series",
	"show",
	"tv"
]);
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
	if (!SERIES_LIKE_TYPES.has(row.mediaType ?? "")) return {
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
	const seasonNumber = Number(body.seasonNumber);
	const episodeNumber = Number(body.episodeNumber);
	const title = body.title?.trim() ?? "";
	if (!Number.isInteger(seasonNumber) || seasonNumber < 1 || seasonNumber > 1e3) return json({ error: "seasonNumber must be a whole number between 1 and 1000" }, { status: 400 });
	if (!Number.isInteger(episodeNumber) || episodeNumber < 1 || episodeNumber > 1e3) return json({ error: "episodeNumber must be a whole number between 1 and 1000" }, { status: 400 });
	if (!title) return json({ error: "title is required" }, { status: 400 });
	const [dup] = await db.select({ id: episodes.id }).from(episodes).where(and(eq(episodes.showId, row.id), eq(episodes.seasonNumber, seasonNumber), eq(episodes.episodeNumber, episodeNumber))).limit(1);
	if (dup) return json({ error: `S${seasonNumber}E${episodeNumber} already exists for this show. Edit it instead, or pick a different number.` }, { status: 409 });
	const id = crypto.randomUUID();
	await db.insert(episodes).values({
		id,
		showId: row.id,
		seasonNumber,
		episodeNumber,
		title: title.slice(0, 255),
		description: typeof body.description === "string" ? body.description.slice(0, 5e3) : null,
		thumbnail: typeof body.thumbnail === "string" ? body.thumbnail.slice(0, 2048) : null,
		videoUrl: typeof body.videoUrl === "string" ? body.videoUrl.slice(0, 2048) : null,
		duration: typeof body.duration === "string" ? body.duration.slice(0, 50) : null,
		airDate: typeof body.airDate === "string" ? body.airDate.slice(0, 20) : null
	});
	return json({
		success: true,
		id
	});
};
//#endregion
export { GET, POST };
