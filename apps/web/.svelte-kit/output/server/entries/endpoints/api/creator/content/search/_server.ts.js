import { K as mediaLibrary, t as db } from "../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, ilike, or } from "drizzle-orm";
//#region src/routes/api/creator/content/search/+server.ts
/**
* GET /api/creator/content/search?q=...&limit=8
*
* Lightweight title/description search restricted to the signed-in
* creator's own catalog. Used by the curated-next-up picker on the
* content detail page — keeps the query private to their library so
* they can build coherent video sequences without scrolling the full
* platform catalog.
*/
var GET = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const q = url.searchParams.get("q")?.trim() ?? "";
	const limit = Math.min(20, Math.max(1, parseInt(url.searchParams.get("limit") ?? "8", 10)));
	if (!q) return json({ results: [] });
	const term = `%${q.replace(/[%_]/g, (m) => `\\${m}`)}%`;
	return json({ results: await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		thumbnail: mediaLibrary.thumbnail
	}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, session.user.id), eq(mediaLibrary.isActive, true), or(ilike(mediaLibrary.title, term), ilike(mediaLibrary.description, term)))).orderBy(desc(mediaLibrary.viewCount)).limit(limit) });
};
//#endregion
export { GET };
