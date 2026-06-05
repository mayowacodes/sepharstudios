import { H as mediaLibrary, t as db } from "../../../../../../../../chunks/drizzle.js";
import { n as commitEncoderJob } from "../../../../../../../../chunks/encoder-orchestrator.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/encoder/jobs/[mediaId]/retry/+server.ts
/**
* POST /api/admin/encoder/jobs/[mediaId]/retry
*
* Re-commits an existing orchestrator job (the source video is already
* uploaded). If the row has no encoderJobId — i.e. the upload never
* actually got off the ground — returns 400 with a hint.
*/
var POST = async ({ params, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const [row] = await db.select({
		id: mediaLibrary.id,
		encoderJobId: mediaLibrary.encoderJobId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.mediaId)).limit(1);
	if (!row) return json({ error: "Not found" }, { status: 404 });
	if (!row.encoderJobId) return json({ error: "No encoder job to retry — content needs a fresh upload." }, { status: 400 });
	try {
		await commitEncoderJob(row.encoderJobId);
	} catch (err) {
		console.error(`[admin/encoder/retry] orchestrator commit failed for ${row.encoderJobId}:`, err);
		return json({
			error: "Orchestrator commit failed",
			detail: err.message
		}, { status: 502 });
	}
	await db.update(mediaLibrary).set({
		processingStatus: "created",
		processingError: null,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, row.id));
	return json({ success: true });
};
//#endregion
export { POST };
