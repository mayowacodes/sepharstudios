import { j as mediaLibrary, t as db } from "../../../chunks/drizzle.js";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/(app)/+page.server.ts
var load = async () => {
	try {
		return {
			shows: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "show"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			movies: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "movie"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			documentaries: []
		};
	} catch (error) {
		console.error("Homepage load failed, using fallback data:", error);
		return {
			shows: [],
			movies: [],
			documentaries: []
		};
	}
};
//#endregion
export { load };
