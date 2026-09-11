import { t as db, tt as mediaLibrary } from "../../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../../chunks/projections.js";
import { json } from "@sveltejs/kit";
import { asc, eq } from "drizzle-orm";
//#region src/routes/api/catalog/coming-soon/+server.ts
/**
* GET /api/catalog/coming-soon  →  { items }
*
* Every row in the coming_soon state, sorted next-up. The page groups them by
* month client-side from `scheduledPublishAt`, so no limit is applied here —
* unlike the per-catalog carousels, this is the full listing.
*/
var GET = async () => {
	return json({ items: await db.select(mediaCardColumns).from(mediaLibrary).where(eq(mediaLibrary.status, "coming_soon")).orderBy(asc(mediaLibrary.scheduledPublishAt)) });
};
//#endregion
export { GET };
