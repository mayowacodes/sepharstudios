import { t as db, tt as mediaLibrary } from "../../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../../chunks/projections.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, inArray } from "drizzle-orm";
//#region src/routes/api/catalog/browse/+server.ts
/**
* GET /api/catalog/browse  →  { shows, movies, documentaries }
*
* The three trending rows on /browse, ten each, newest first.
*
* Media-type lists are widened the same way the per-catalog endpoint widens
* them: the upload wizard writes 'series' and 'short' while legacy rows use
* 'show' and 'movie', and a catalog that accepts only one of each silently
* hides whatever creators most recently uploaded.
*/
var GET = async () => {
	const row = (mediaTypes) => db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, mediaTypes), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10);
	const [shows, movies, documentaries] = await Promise.all([
		row(["show", "series"]),
		row(["movie", "short"]),
		row(["documentary"])
	]);
	return json({
		shows,
		movies,
		documentaries
	});
};
//#endregion
export { GET };
