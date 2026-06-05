import { H as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { t as faithDocumentaries } from "../../../../chunks/documentaries.js";
import { and, eq } from "drizzle-orm";
//#region src/routes/(app)/documentaries/+page.server.ts
var load = async () => {
	try {
		return { documentaries: await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "documentary"), eq(mediaLibrary.isActive, true))) };
	} catch (error) {
		console.error("Documentaries load failed, using fallback data:", error);
		return { documentaries: faithDocumentaries };
	}
};
//#endregion
export { load };
