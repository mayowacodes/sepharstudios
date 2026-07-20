import { t as private_env } from "../../../../../../../chunks/shared-server.js";
import { K as mediaLibrary, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as startEncoderWorkflow } from "../../../../../../../chunks/temporal-client.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/encoder/jobs/[jobId]/commit/+server.ts
/**
* POST /api/encoder/jobs/[jobId]/commit
*
* Stage-2 of the upload flow: the browser has finished uploading to the
* presigned URL from /api/encoder/jobs, so we now start the encoder
* workflow in Temporal.
*
* Idempotent — re-posting the same commit raises
* `WorkflowExecutionAlreadyStartedError` inside Temporal. We surface that
* as a 200; the workflow is already in flight.
*
* No body required from the client. The inputObject is reconstructed from
* the jobId (`${jobId}/source`) per the convention set at /jobs.
*/
var INPUT_BUCKET = private_env.ENCODER_INPUT_BUCKET || private_env.MINIO_INPUT_BUCKET || "encoder-input";
var OUTPUT_BUCKET = private_env.ENCODER_OUTPUT_BUCKET || private_env.MINIO_OUTPUT_BUCKET || "encoder-output";
var POST = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const jobId = params.jobId;
	if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
	const body = await request.json().catch(() => ({}));
	const profile = body.profile ?? "vod-multi";
	const durationHintSec = typeof body.durationHint === "number" ? body.durationHint : void 0;
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, jobId)).limit(1);
	if (!content) return json({ error: "Content not found for job" }, { status: 404 });
	if (content.creatorId && content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	try {
		const { workflowId, runId } = await startEncoderWorkflow({
			jobId,
			mediaId: content.id,
			inputBucket: INPUT_BUCKET,
			inputObject: `${jobId}/source`,
			outputBucket: OUTPUT_BUCKET,
			outputPrefix: jobId,
			profile,
			durationHintSec
		});
		await db.update(mediaLibrary).set({
			processingStatus: "queued",
			processingError: null,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.id, content.id));
		return json({
			contentId: content.id,
			jobId,
			workflowId,
			runId,
			status: "queued"
		});
	} catch (error) {
		const msg = error instanceof Error ? error.message : String(error);
		if (msg.includes("WorkflowExecutionAlreadyStarted") || msg.includes("AlreadyStarted")) return json({
			contentId: content.id,
			jobId,
			status: "already-running"
		});
		console.error(`Failed to start encoder workflow ${jobId}:`, error);
		return json({ error: "Failed to start encoder workflow" }, { status: 500 });
	}
};
//#endregion
export { POST };
