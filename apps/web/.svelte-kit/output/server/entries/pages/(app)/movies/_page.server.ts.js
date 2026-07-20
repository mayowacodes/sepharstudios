import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { t as attachCatalogProgress } from "../../../../chunks/catalog-progress.js";
import { and, asc, eq, inArray, isNull, notInArray, or } from "drizzle-orm";
//#region src/routes/(app)/movies/+page.server.ts
var load = async ({ locals }) => {
	const session = await locals.auth.getSession();
	try {
		const [movies, comingSoon] = await Promise.all([db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, ["movie", "short"]), eq(mediaLibrary.isActive, true), or(isNull(mediaLibrary.category), notInArray(mediaLibrary.category, ["kids", "teens"])))), db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, ["movie", "short"]), eq(mediaLibrary.status, "coming_soon"))).orderBy(asc(mediaLibrary.scheduledPublishAt)).limit(20)]);
		return {
			movies: await attachCatalogProgress(movies, session?.user.id),
			comingSoon
		};
	} catch (e) {
		const err = e instanceof Error ? e : null;
		console.error("Failed to load movies:", err?.message || e);
		if (err?.cause) console.error("Cause:", err.cause);
		if (err?.stack) console.error("Stack:", err.stack.split("\n").slice(0, 5).join("\n"));
		return {
			movies: [],
			comingSoon: []
		};
	}
};
//#endregion
export { load };
