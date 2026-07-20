import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as getRecommendations } from "../../../../chunks/recommendations.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, ne, sql } from "drizzle-orm";
//#region src/routes/api/recommendations/+server.ts
/**
* GET /api/recommendations
*
* Default: personalized recs for the signed-in user.
*
* When `?contextContentId=X` is set, returns "next-up" candidates for the
* end-screen overlay: same-creator content first, then same-genre fillers,
* excluding the current row.
*
* Public path (no auth required) so the watch page works for guests too;
* personalized path still requires auth.
*/
var GET = async ({ url, locals }) => {
	const contextId = url.searchParams.get("contextContentId");
	const limit = Math.min(Number(url.searchParams.get("limit") ?? "12"), 24);
	if (contextId) try {
		return json(await nextUp(contextId, limit));
	} catch (e) {
		console.error("GET /api/recommendations (context) failed", e);
		return json([], { status: 200 });
	}
	try {
		const user = locals.user;
		if (!user) return json({ error: "Unauthorized" }, { status: 401 });
		const profileId = url.searchParams.get("profileId");
		return json(await getRecommendations(user.id, profileId, limit));
	} catch (e) {
		console.error("GET /api/recommendations failed", e);
		return json({ error: "Failed to load recommendations" }, { status: 500 });
	}
};
async function nextUp(contextId, limit) {
	const [current] = await db.select({
		id: mediaLibrary.id,
		mediaType: mediaLibrary.mediaType,
		creatorId: mediaLibrary.creatorId,
		genres: mediaLibrary.genres
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contextId)).limit(1);
	if (!current) return [];
	const results = [];
	if (results.length < limit && current.creatorId) {
		const sameCreator = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, current.creatorId), ne(mediaLibrary.id, contextId), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"))).orderBy(desc(mediaLibrary.viewCount)).limit(limit - results.length);
		for (const r of sameCreator) if (!results.find((x) => x.id === r.id)) results.push({
			id: r.id,
			title: r.title,
			thumbnail: r.thumbnail ?? null,
			duration: r.duration ?? null
		});
	}
	if (results.length < limit && Array.isArray(current.genres) && current.genres.length > 0) {
		const sameGenre = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			duration: mediaLibrary.duration
		}).from(mediaLibrary).where(and(ne(mediaLibrary.id, contextId), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"), sql`${mediaLibrary.genres} ?| array[${sql.join(current.genres.map((g) => sql`${g}`), sql`, `)}]`)).orderBy(desc(mediaLibrary.viewCount)).limit(limit - results.length);
		for (const r of sameGenre) if (!results.find((x) => x.id === r.id)) results.push({
			id: r.id,
			title: r.title,
			thumbnail: r.thumbnail ?? null,
			duration: r.duration ?? null
		});
	}
	return results.slice(0, limit);
}
//#endregion
export { GET };
