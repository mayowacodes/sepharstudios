import { H as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/(app)/browse/+page.server.ts
var load = async () => {
	try {
		return {
			shows: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "show"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			movies: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "movie"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			documentaries: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "documentary"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10)
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
