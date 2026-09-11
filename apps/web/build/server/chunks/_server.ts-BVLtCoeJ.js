import { m as mediaLibrary, d as db } from './drizzle-CsnNxG5m.js';
import { m as mediaCardColumns } from './projections-BdYmgHWY.js';
import { a as attachCatalogProgress } from './catalog-progress-DukcjLC5.js';
import { e as error, j as json } from './index.js-BP8aAXBX.js';
import { or, isNull, notInArray, and, inArray, eq, asc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/catalog/[kind]/+server.ts
/**
* `mediaType` values per catalog, and whether the kids/teens portals own them.
*
* - movies: short films ride along, because /movies is the only public catalog
*   that makes sense for them.
* - shows: the upload wizard writes 'series' but legacy rows and the tv-aliased
*   detail loader use 'show'. Accept both or creators' uploads go missing.
* - documentaries: never excluded by category — there is no kids documentary
*   portal, so the general catalog is the only home for them.
*/
var CATALOGS = {
	movies: {
		mediaTypes: ["movie", "short"],
		excludeKids: true
	},
	shows: {
		mediaTypes: ["show", "series"],
		excludeKids: true
	},
	documentaries: {
		mediaTypes: ["documentary"],
		excludeKids: false
	}
};
function isCatalogKind(v) {
	return v === "movies" || v === "shows" || v === "documentaries";
}
var GET = async ({ params, locals }) => {
	const kind = params.kind ?? "";
	if (!isCatalogKind(kind)) throw error(404, "Unknown catalog");
	const { mediaTypes, excludeKids } = CATALOGS[kind];
	const session = await locals.auth.getSession();
	const audienceFilter = excludeKids ? or(isNull(mediaLibrary.category), notInArray(mediaLibrary.category, ["kids", "teens"])) : void 0;
	const [items, comingSoon] = await Promise.all([db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, mediaTypes), eq(mediaLibrary.isActive, true), audienceFilter)), db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, mediaTypes), eq(mediaLibrary.status, "coming_soon"))).orderBy(asc(mediaLibrary.scheduledPublishAt)).limit(20)]);
	return json({
		items: await attachCatalogProgress(items, session?.user.id),
		comingSoon
	});
};

export { GET };
//# sourceMappingURL=_server.ts-BVLtCoeJ.js.map
