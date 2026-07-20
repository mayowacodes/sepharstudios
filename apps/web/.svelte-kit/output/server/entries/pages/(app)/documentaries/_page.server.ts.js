import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { t as mediaCardColumns } from "../../../../chunks/projections.js";
import { t as attachCatalogProgress } from "../../../../chunks/catalog-progress.js";
import { t as faithDocumentaries } from "../../../../chunks/documentaries.js";
import { and, asc, eq } from "drizzle-orm";
//#region src/routes/(app)/documentaries/+page.server.ts
var load = async ({ locals }) => {
	const session = await locals.auth.getSession();
	try {
		const [documentaries, comingSoon] = await Promise.all([db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "documentary"), eq(mediaLibrary.isActive, true))), db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "documentary"), eq(mediaLibrary.status, "coming_soon"))).orderBy(asc(mediaLibrary.scheduledPublishAt)).limit(20)]);
		return {
			documentaries: await attachCatalogProgress(documentaries, session?.user.id),
			comingSoon
		};
	} catch (error) {
		console.error("Documentaries load failed, using fallback data:", error);
		return {
			documentaries: faithDocumentaries,
			comingSoon: []
		};
	}
};
//#endregion
export { load };
