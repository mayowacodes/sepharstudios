import { H as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { t as faithTVShows } from "../../../../chunks/shows.js";
import { and, eq } from "drizzle-orm";
//#region src/routes/(app)/shows/+page.server.ts
var load = async () => {
	try {
		return { shows: await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "show"), eq(mediaLibrary.isActive, true))) };
	} catch (error) {
		console.error("Shows load failed, using fallback data:", error);
		return { shows: faithTVShows };
	}
};
//#endregion
export { load };
