import { H as mediaLibrary, t as db } from "../../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../../chunks/constants.js";
import { t as cancelEncoderJob } from "../../../../../../../chunks/encoder-orchestrator.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/content/[id]/cancel-encode/+server.ts
/**
* POST /api/admin/content/[id]/cancel-encode
*
* Admin cancels an in-flight encode. We call the orchestrator's cancel
* endpoint (gateway model — only the platform talks to the orchestrator);
* it flips state to CANCELLED and the worker tears down FFmpeg on its next
* /control poll. A `cancelled` progress webhook then arrives here and
* settles the row.
*
* We optimistically mark `processingStatus='cancelled'` immediately so
* the UI doesn't spin while the worker poll round-trip plays out, BUT we
* preserve the existing encoderJobId so the webhook can still match.
*/
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (session.user.role !== Role.ADMIN) return json({ error: "Forbidden" }, { status: 403 });
	const contentId = params.id;
	if (!contentId) return json({ error: "contentId is required" }, { status: 400 });
	const [row] = await db.select({
		id: mediaLibrary.id,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!row) return json({ error: "Content not found" }, { status: 404 });
	if (!row.encoderJobId) return json({ error: "No active encoder job for this content" }, { status: 409 });
	if (["ready", "cancelled"].includes(row.processingStatus ?? "")) return json({ error: `Job is already ${row.processingStatus}` }, { status: 409 });
	try {
		await cancelEncoderJob(row.encoderJobId);
	} catch (err) {
		console.error(`[admin cancel-encode] orchestrator cancel failed for ${contentId}:`, err);
		return json({
			error: "Orchestrator cancel failed",
			detail: err instanceof Error ? err.message : "unknown"
		}, { status: 502 });
	}
	await db.update(mediaLibrary).set({
		processingStatus: "cancelled",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, contentId));
	return json({
		ok: true,
		jobId: row.encoderJobId,
		status: "cancelling"
	});
};
//#endregion
export { POST };
