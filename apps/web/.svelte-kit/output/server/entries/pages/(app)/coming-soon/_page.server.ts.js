import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { asc, eq } from "drizzle-orm";
//#region src/routes/(app)/coming-soon/+page.server.ts
/**
* Dedicated Coming Soon listing. Returns every row in the
* coming_soon state sorted by next-up. The page groups them by
* month client-side using scheduledPublishAt.
*/
var load = async () => {
	try {
		return { items: await db.select(mediaCardColumns).from(mediaLibrary).where(eq(mediaLibrary.status, "coming_soon")).orderBy(asc(mediaLibrary.scheduledPublishAt)) };
	} catch (err) {
		console.error("[coming-soon] load failed:", err);
		return { items: [] };
	}
};
//#endregion
export { load };
