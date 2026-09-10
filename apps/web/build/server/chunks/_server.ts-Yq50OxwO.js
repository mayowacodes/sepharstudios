import { d as db, m as mediaLibrary } from './drizzle-DlGuU73K.js';
import { m as mediaCardColumns } from './projections-DKC0kH5G.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { and, inArray, eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

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

export { GET };
//# sourceMappingURL=_server.ts-Yq50OxwO.js.map
