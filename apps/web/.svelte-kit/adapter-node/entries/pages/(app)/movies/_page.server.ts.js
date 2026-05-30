import { j as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { and, eq, ne } from "drizzle-orm";
//#region src/routes/(app)/movies/+page.server.ts
var load = async () => {
	try {
		return { movies: await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "movie"), eq(mediaLibrary.isActive, true), ne(mediaLibrary.category, "kids"), ne(mediaLibrary.category, "teens"))) };
	} catch (e) {
		console.error("Failed to load movies:", e?.message || e);
		if (e?.cause) console.error("Cause:", e.cause);
		if (e?.stack) console.error("Stack:", e.stack?.split("\n").slice(0, 5).join("\n"));
		return { movies: [] };
	}
};
//#endregion
export { load };
