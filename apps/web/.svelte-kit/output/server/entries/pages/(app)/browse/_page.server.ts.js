import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { and, desc, eq, inArray } from "drizzle-orm";
//#region src/routes/(app)/browse/+page.server.ts
var load = async () => {
	try {
		const [trendingShows, trendingMovies, documentaries] = await Promise.all([
			db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, ["show", "series"]), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			db.select(mediaCardColumns).from(mediaLibrary).where(and(inArray(mediaLibrary.mediaType, ["movie", "short"]), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "documentary"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10)
		]);
		return {
			shows: trendingShows,
			movies: trendingMovies,
			documentaries
		};
	} catch (error) {
		console.error("Browse page load failed:", error);
		return {
			shows: [],
			movies: [],
			documentaries: []
		};
	}
};
//#endregion
export { load };
