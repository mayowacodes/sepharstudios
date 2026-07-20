import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/kids/kiddies/+page.server.ts
var load = async () => {
	try {
		return { content: await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.category, "kids"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(60) };
	} catch (e) {
		console.error("Failed to load kiddies content", e);
		return { content: [] };
	}
};
//#endregion
export { load };
