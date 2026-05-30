import { j as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { and, eq } from "drizzle-orm";
//#region src/routes/kids/teens/+page.server.ts
var load = async () => {
	try {
		return { content: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.category, "teens"), eq(mediaLibrary.isActive, true))) };
	} catch (e) {
		console.error("Failed to load teens content", e);
		return { content: [] };
	}
};
//#endregion
export { load };
