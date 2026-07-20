import { K as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
//#region src/routes/(creator)/creator/+page.server.ts
/**
* Creator dashboard load. Surfaces every in-flight encode for the current
* creator so the dashboard can show "Video 1 is at 47% — start Video 2"
* instead of leaving the creator to guess whether the previous upload is
* still alive. The SSE wired into the dashboard component streams live
* progress without a page reload.
*/
var load = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return { inFlightEncodes: [] };
	try {
		return { inFlightEncodes: await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			slug: mediaLibrary.slug,
			thumbnail: mediaLibrary.thumbnail,
			processingStatus: mediaLibrary.processingStatus,
			processingProgress: mediaLibrary.processingProgress,
			processingStage: mediaLibrary.processingStage,
			processingError: mediaLibrary.processingError,
			encoderJobId: mediaLibrary.encoderJobId,
			createdAt: mediaLibrary.createdAt
		}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, session.user.id), inArray(mediaLibrary.processingStatus, [
			"created",
			"in_progress",
			"failed"
		]), ne(mediaLibrary.status, "archived"))).orderBy(desc(mediaLibrary.createdAt)).limit(10) };
	} catch (err) {
		console.error("[creator dashboard] inFlightEncodes query failed", err);
		return { inFlightEncodes: [] };
	}
};
//#endregion
export { load };
