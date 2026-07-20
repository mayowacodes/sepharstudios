import { t as private_env } from "../../../../../chunks/shared-server.js";
import { K as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { i as getEncoderPresignedUploadUrl } from "../../../../../chunks/minio2.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
//#region src/routes/api/encoder/jobs/+server.ts
/**
* POST /api/encoder/jobs
*
* Stage-1 of the upload flow: mint a jobId and return a presigned PUT URL
* the browser can use to push the source video straight into the encoder
* MinIO. No orchestrator call — we own presign now.
*
* Object key convention: `${jobId}/source`. The Temporal workflow + worker
* read from `inputBucket=encoder-input` / `inputObject=${jobId}/source`.
* Extension is omitted; ffmpeg sniffs the container.
*
* jobId format: `job_${YYYYMMDD}_${10 hex}` — same shape the legacy
* orchestrator emitted, so downstream tooling (Temporal Web UI, logs,
* webhook handler) doesn't need to learn a new pattern.
*
* The actual encode is kicked off at /commit (stage-2) once the browser
* has finished the PUT.
*/
var INPUT_BUCKET = private_env.ENCODER_INPUT_BUCKET || private_env.MINIO_INPUT_BUCKET || "encoder-input";
var PRESIGN_TTL_SECONDS = 3600;
function newJobId() {
	const d = /* @__PURE__ */ new Date();
	return `job_${`${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`}_${randomBytes(5).toString("hex")}`;
}
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { contentId, filename } = await request.json();
	if (!contentId || !filename) return json({ error: "contentId and filename are required" }, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!content) return json({ error: "Content not found" }, { status: 404 });
	if (content.creatorId && content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	const jobId = newJobId();
	const objectKey = `${jobId}/source`;
	try {
		const uploadUrl = await getEncoderPresignedUploadUrl(INPUT_BUCKET, objectKey, PRESIGN_TTL_SECONDS);
		await db.update(mediaLibrary).set({
			encoderJobId: jobId,
			processingStatus: "created",
			processingError: null,
			videoUrl: null,
			processingProgress: 0,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.id, contentId));
		return json({
			contentId,
			jobId,
			upload: {
				url: uploadUrl,
				method: "PUT",
				expiresAt: new Date(Date.now() + PRESIGN_TTL_SECONDS * 1e3).toISOString()
			}
		}, { status: 201 });
	} catch (error) {
		console.error("Failed to create encoder job:", error);
		return json({ error: "Failed to create encoder job" }, { status: 500 });
	}
};
//#endregion
export { POST };
