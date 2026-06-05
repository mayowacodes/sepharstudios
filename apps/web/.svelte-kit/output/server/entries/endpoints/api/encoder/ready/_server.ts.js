import { H as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { t as isValidInternalRequest } from "../../../../../chunks/internal-auth.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/encoder/ready/+server.ts
var POST = async ({ request }) => {
	if (!isValidInternalRequest(request)) return json({ error: "Unauthorized" }, { status: 401 });
	const { contentId, jobId, playback, errorMessage } = await request.json();
	if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
	if (errorMessage) {
		await db.update(mediaLibrary).set({
			processingStatus: "failed",
			processingError: String(errorMessage),
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.encoderJobId, jobId));
		return json({
			success: true,
			jobId,
			status: "failed"
		});
	}
	const where = contentId ? eq(mediaLibrary.id, contentId) : eq(mediaLibrary.encoderJobId, jobId);
	await db.update(mediaLibrary).set({
		processingStatus: "ready",
		processingError: null,
		processedAt: /* @__PURE__ */ new Date(),
		updatedAt: /* @__PURE__ */ new Date()
	}).where(where);
	return json({
		success: true,
		contentId,
		jobId,
		status: "ready"
	});
};
//#endregion
export { POST };
