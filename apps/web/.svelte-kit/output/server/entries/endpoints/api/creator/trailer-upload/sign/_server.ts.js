import { t as private_env } from "../../../../../../chunks/shared-server.js";
import { K as mediaLibrary, t as db } from "../../../../../../chunks/drizzle.js";
import { i as getEncoderPresignedUploadUrl } from "../../../../../../chunks/minio2.js";
import { r as Role } from "../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/creator/trailer-upload/sign/+server.ts
/**
* POST /api/creator/trailer-upload/sign
*
* Returns a short-lived presigned PUT URL for direct browser upload of a
* trailer file to the encoder MinIO. Used by the creator upload wizard's
* submit flow AFTER the main video commit succeeds.
*
* The trailer is uploaded as-is (no transcoding). This is a deliberate
* trade-off: most creators upload MP4/h264 which every browser plays
* natively in a `<video src>` tag, so the encoder-job complexity isn't
* worth it today. Documented as TECHDEBT (the robust path is a single
* 720p MP4 transcode via a dedicated orchestrator profile).
*
* The ownership check ensures only the creator (or an admin) can stage a
* trailer for their own content row. The object key is namespaced under
* `trailers/<contentId>/` so it can't collide with the encoder's HLS
* output that lives at `<jobId>/...` in the same bucket.
*
* Request:  { contentId, filename, contentType }
* Response: { uploadUrl, objectKey, bucket, expiresInSeconds }
*/
var NATIVE_BROWSER_VIDEO = new Set([
	"video/mp4",
	"video/quicktime",
	"video/webm",
	"video/x-m4v"
]);
var SAFE_FILENAME = /^[A-Za-z0-9._\-() ]+$/;
var MAX_FILENAME_LEN = 200;
var BUCKET = private_env.ENCODER_OUTPUT_BUCKET || private_env.MINIO_OUTPUT_BUCKET || "encoder-output";
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({
		error: "unauthorized",
		detail: "Sign in required."
	}, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({
		error: "forbidden",
		detail: "Only creators (or admins) can stage a trailer."
	}, { status: 403 });
	let body;
	try {
		body = await request.json();
	} catch {
		return json({
			error: "invalid_body",
			detail: "Request body must be JSON."
		}, { status: 400 });
	}
	const contentId = typeof body.contentId === "string" ? body.contentId : "";
	const filename = typeof body.filename === "string" ? body.filename.trim() : "";
	const contentType = typeof body.contentType === "string" ? body.contentType : "video/mp4";
	if (!contentId) return json({
		error: "missing_content_id",
		detail: "contentId is required."
	}, { status: 400 });
	if (!filename) return json({
		error: "missing_filename",
		detail: "filename is required."
	}, { status: 400 });
	if (filename.length > MAX_FILENAME_LEN || !SAFE_FILENAME.test(filename)) return json({
		error: "invalid_filename",
		detail: `filename must be ${MAX_FILENAME_LEN} characters or fewer and use only letters, digits, and ._-() .`
	}, { status: 400 });
	if (!NATIVE_BROWSER_VIDEO.has(contentType)) return json({
		error: "unsupported_format",
		detail: "Trailers must be MP4, MOV, M4V, or WebM. Other formats need re-mux first (TODO: robust trailer pipeline)."
	}, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!content) return json({
		error: "not_found",
		detail: "Content not found."
	}, { status: 404 });
	if (content.creatorId !== session.user.id && session.user.role !== "admin") return json({
		error: "forbidden",
		detail: "You do not own this content."
	}, { status: 403 });
	const ext = {
		"video/mp4": ".mp4",
		"video/quicktime": ".mov",
		"video/webm": ".webm",
		"video/x-m4v": ".m4v"
	}[contentType] ?? ".mp4";
	const objectKey = `trailers/${contentId}/trailer-${Date.now()}${ext}`;
	const expiresInSeconds = 900;
	try {
		return json({
			uploadUrl: await getEncoderPresignedUploadUrl(BUCKET, objectKey, expiresInSeconds),
			objectKey,
			bucket: BUCKET,
			expiresInSeconds
		});
	} catch (err) {
		console.error("[trailer-upload/sign] presign failed:", err);
		const lower = (err instanceof Error ? err.message : String(err)).toLowerCase();
		if (lower.includes("access denied") || lower.includes("invalidaccesskey")) return json({
			error: "storage_auth",
			detail: "Storage credentials rejected. Please contact support."
		}, { status: 500 });
		if (lower.includes("nosuchbucket")) return json({
			error: "storage_bucket_missing",
			detail: "Trailer storage bucket missing. Please contact support."
		}, { status: 500 });
		return json({
			error: "sign_failed",
			detail: "Could not prepare trailer upload. Try again or contact support."
		}, { status: 500 });
	}
};
//#endregion
export { POST };
