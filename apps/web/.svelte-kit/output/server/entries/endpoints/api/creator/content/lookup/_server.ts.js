import { K as mediaLibrary, t as db } from "../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, eq, inArray } from "drizzle-orm";
//#region src/routes/api/creator/content/lookup/+server.ts
/**
* GET /api/creator/content/lookup?ids=a,b,c
*
* Batch-resolves content rows to {id, title, thumbnail} for the curated-
* next-up picker. Scoped to the signed-in creator's own catalog (admins
* can resolve any) so we don't leak titles across creators.
*/
var GET = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const raw = url.searchParams.get("ids")?.trim() ?? "";
	const ids = Array.from(new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))).slice(0, 30);
	if (ids.length === 0) return json({ results: [] });
	const conditions = [inArray(mediaLibrary.id, ids)];
	if (session.user.role !== Role.ADMIN) conditions.push(eq(mediaLibrary.creatorId, session.user.id));
	return json({ results: await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		thumbnail: mediaLibrary.thumbnail
	}).from(mediaLibrary).where(and(...conditions)) });
};
//#endregion
export { GET };
