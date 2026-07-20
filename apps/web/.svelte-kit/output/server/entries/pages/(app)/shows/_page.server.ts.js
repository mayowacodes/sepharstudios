import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { t as attachCatalogProgress } from "../../../../chunks/catalog-progress.js";
import { t as faithTVShows } from "../../../../chunks/shows.js";
import { and, asc, eq, inArray, isNull, notInArray, or } from "drizzle-orm";
//#region src/routes/(app)/shows/+page.server.ts
var load = async ({ locals }) => {
	const session = await locals.auth.getSession();
	try {
		const [shows, comingSoon] = await Promise.all([db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, ["show", "series"]), eq(mediaLibrary.isActive, true), or(isNull(mediaLibrary.category), notInArray(mediaLibrary.category, ["kids", "teens"])))), db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, ["show", "series"]), eq(mediaLibrary.status, "coming_soon"))).orderBy(asc(mediaLibrary.scheduledPublishAt)).limit(20)]);
		return {
			shows: await attachCatalogProgress(shows, session?.user.id),
			comingSoon
		};
	} catch (error) {
		console.error("Shows load failed, using fallback data:", error);
		return {
			shows: faithTVShows,
			comingSoon: []
		};
	}
};
//#endregion
export { load };
