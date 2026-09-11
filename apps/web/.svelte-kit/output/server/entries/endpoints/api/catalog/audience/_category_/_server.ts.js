import { t as db, tt as mediaLibrary } from "../../../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../../../chunks/projections.js";
import { error, json } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/api/catalog/audience/[category]/+server.ts
/**
* GET /api/catalog/audience/:category  →  { content }
*
* Backs the /kids/kiddies and /kids/teens portal feeds, which selected on
* `category` rather than `mediaType` and were otherwise identical.
*
* The card projection and the LIMIT are load-bearing, not cosmetic: these
* queries once selected full rows with no cap, serialising every chapters /
* cast / crew JSON blob for the whole kids library into the page payload on
* every single load.
*/
var AUDIENCES = ["kids", "teens"];
var GET = async ({ params }) => {
	const category = params.category ?? "";
	if (!AUDIENCES.includes(category)) throw error(404, "Unknown audience");
	return json({ content: await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.category, category), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(60) });
};
//#endregion
export { GET };
