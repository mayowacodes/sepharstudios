import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { json } from "@sveltejs/kit";
import { and, asc, eq } from "drizzle-orm";
//#region src/routes/api/coming-soon/+server.ts
/**
* GET /api/coming-soon?type=movie|show|documentary|all&limit=20
*
* Returns the list of Coming Soon rows (status='coming_soon'). Sorted
* by scheduledPublishAt ASC so the next-up titles come first. Used by:
*   - the dedicated /coming-soon page
*   - any client surface that wants to render a Coming Soon row
*
* Catalog/landing server loads inline-query the same shape directly
* (no HTTP hop) — this endpoint exists for client-side fetches +
* future native-app use.
*/
var GET = async ({ url }) => {
	const type = url.searchParams.get("type") ?? "all";
	const limit = Math.min(Number.parseInt(url.searchParams.get("limit") ?? "20", 10) || 20, 100);
	const filters = [eq(mediaLibrary.status, "coming_soon")];
	if (type !== "all") filters.push(eq(mediaLibrary.mediaType, type));
	return json({ items: await db.select(mediaCardColumns).from(mediaLibrary).where(and(...filters)).orderBy(asc(mediaLibrary.scheduledPublishAt)).limit(limit) });
};
//#endregion
export { GET };
