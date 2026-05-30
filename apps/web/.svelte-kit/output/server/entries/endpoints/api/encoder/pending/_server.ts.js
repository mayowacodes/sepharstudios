import { j as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { t as isValidInternalRequest } from "../../../../../chunks/internal-auth.js";
import { json } from "@sveltejs/kit";
import { and, isNotNull, ne } from "drizzle-orm";
//#region src/routes/api/encoder/pending/+server.ts
var GET = async ({ request }) => {
	if (!isValidInternalRequest(request)) return json({ error: "Unauthorized" }, { status: 401 });
	return json({ jobs: (await db.select({
		contentId: mediaLibrary.id,
		jobId: mediaLibrary.encoderJobId,
		status: mediaLibrary.processingStatus
	}).from(mediaLibrary).where(and(isNotNull(mediaLibrary.encoderJobId), ne(mediaLibrary.processingStatus, "ready"), ne(mediaLibrary.processingStatus, "failed"))).limit(100)).filter((row) => Boolean(row.jobId)) });
};
//#endregion
export { GET };
