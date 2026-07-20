import { t as private_env } from "../../../../../../../../chunks/shared-server.js";
import { K as mediaLibrary, t as db } from "../../../../../../../../chunks/drizzle.js";
import { n as encoderMinioClient } from "../../../../../../../../chunks/minio2.js";
import { n as startEncoderWorkflow } from "../../../../../../../../chunks/temporal-client.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
//#region src/routes/api/admin/encoder/jobs/[mediaId]/retry/+server.ts
/**
* POST /api/admin/encoder/jobs/[mediaId]/retry
*
* Re-runs an existing encode against the SAME source video. The source
* file is still in encoder MinIO at `${oldJobId}/source` (the original
* /api/encoder/jobs upload). We don't re-upload — we just start a new
* workflow.
*
* Why a NEW jobId: Temporal workflowIds are unique. Starting a workflow
* with the same workflowId raises AlreadyStarted (even if the old one
* failed). So we mint a fresh jobId, point its `inputObject` back at the
* old upload, and update the media row to track the new id. The HLS
* output lands under the new jobId prefix; the encoder-playback helper
* keeps working because it derives videoUrl from `${encoderJobId}/master.m3u8`.
*/
var INPUT_BUCKET = private_env.ENCODER_INPUT_BUCKET || private_env.MINIO_INPUT_BUCKET || "encoder-input";
var OUTPUT_BUCKET = private_env.ENCODER_OUTPUT_BUCKET || private_env.MINIO_OUTPUT_BUCKET || "encoder-output";
function newJobId() {
	const d = /* @__PURE__ */ new Date();
	return `job_${`${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`}_${randomBytes(5).toString("hex")}`;
}
var POST = async ({ params, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const [row] = await db.select({
		id: mediaLibrary.id,
		encoderJobId: mediaLibrary.encoderJobId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.mediaId)).limit(1);
	if (!row) return json({ error: "Not found" }, { status: 404 });
	if (!row.encoderJobId) return json({ error: "No encoder job to retry — content needs a fresh upload." }, { status: 400 });
	const oldJobId = row.encoderJobId;
	const newJob = newJobId();
	const inputObject = `${oldJobId}/source`;
	try {
		await encoderMinioClient.statObject(INPUT_BUCKET, inputObject);
	} catch (err) {
		if (err?.code === "NotFound" || /not\s*found/i.test(err?.message ?? "")) {
			const detail = `Source video missing in MinIO (${INPUT_BUCKET}/${inputObject}). The original upload didn't land — Retry can't help here. Ask the creator to re-upload the video.`;
			await db.update(mediaLibrary).set({
				processingStatus: "failed",
				processingError: detail,
				updatedAt: /* @__PURE__ */ new Date()
			}).where(eq(mediaLibrary.id, row.id));
			return json({
				error: "Source missing",
				detail
			}, { status: 410 });
		}
		console.error(`[admin/encoder/retry] MinIO statObject failed for ${inputObject}:`, err);
		return json({
			error: "Could not verify source video",
			detail: err instanceof Error ? err.message : String(err)
		}, { status: 502 });
	}
	try {
		await startEncoderWorkflow({
			jobId: newJob,
			mediaId: row.id,
			inputBucket: INPUT_BUCKET,
			inputObject,
			outputBucket: OUTPUT_BUCKET,
			outputPrefix: newJob,
			profile: "vod-multi"
		});
	} catch (err) {
		const flattenCauses = (e) => {
			const messages = [];
			let cur = e;
			let depth = 0;
			while (cur && depth < 5) {
				if (cur instanceof Error) {
					messages.push(`${cur.name}: ${cur.message}`);
					cur = cur.cause;
				} else {
					messages.push(String(cur));
					break;
				}
				depth += 1;
			}
			return messages.join(" → ");
		};
		const detail = flattenCauses(err);
		console.error(`[admin/encoder/retry] Temporal start failed for new jobId=${newJob}: ${detail}`, err);
		return json({
			error: "Temporal start failed",
			detail
		}, { status: 502 });
	}
	await db.update(mediaLibrary).set({
		encoderJobId: newJob,
		processingStatus: "created",
		processingProgress: 0,
		processingStage: null,
		processingError: null,
		videoUrl: null,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, row.id));
	return json({
		success: true,
		oldJobId,
		jobId: newJob
	});
};
//#endregion
export { POST };
