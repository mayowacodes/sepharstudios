import { $ as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
//#region src/routes/api/creator/in-flight-encodes/+server.ts
/**
* GET /api/creator/in-flight-encodes  →  { inFlightEncodes }
*
* Every in-flight encode for the signed-in creator, so the dashboard can say
* "Video 1 is at 47% — start Video 2" instead of leaving them to guess whether
* the previous upload is still alive. The dashboard's SSE stream then updates
* progress without a reload.
*
* Anonymous callers get an empty list rather than a 401: the dashboard route is
* already guarded, and returning empty keeps this endpoint safe to call
* unconditionally during hydration.
*/
function queryEncodes(userId) {
	return db.select({
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
	}).from(mediaLibrary).where(and(eq(mediaLibrary.creatorId, userId), inArray(mediaLibrary.processingStatus, [
		"created",
		"in_progress",
		"failed"
	]), ne(mediaLibrary.status, "archived"))).orderBy(desc(mediaLibrary.createdAt)).limit(10);
}
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	return json(session ? { inFlightEncodes: await queryEncodes(session.user.id) } : { inFlightEncodes: [] });
};
//#endregion
export { GET };
