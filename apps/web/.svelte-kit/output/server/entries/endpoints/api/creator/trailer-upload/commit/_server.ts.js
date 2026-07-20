import { t as private_env } from "../../../../../../chunks/shared-server.js";
import { K as mediaLibrary, t as db } from "../../../../../../chunks/drizzle.js";
import { r as startTrailerWorkflow } from "../../../../../../chunks/temporal-client.js";
import { r as Role } from "../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/creator/trailer-upload/commit/+server.ts
/**
* POST /api/creator/trailer-upload/commit
*
* Records a successfully-uploaded trailer in the media row. The bytes are
* already in the encoder MinIO at this point (the browser PUT them via the
* presigned URL from /sign). This endpoint just composes the public URL
* and writes it to `media_library.trailerUrl`, replacing the
* "staged-for-encoding" sentinel the wizard previously left there.
*
* Request:  { contentId, objectKey }
* Response: { success: true, trailerUrl }
*/
var BUCKET = private_env.ENCODER_OUTPUT_BUCKET || private_env.MINIO_OUTPUT_BUCKET || "encoder-output";
var ENCODER_MINIO_HOST = (private_env.PUBLIC_ENCODER_MINIO_URL ?? "").trim();
var PUBLIC_BASE = ENCODER_MINIO_HOST ? `https://${ENCODER_MINIO_HOST.replace(/^https?:\/\//, "").replace(/\/+$/, "")}` : "https://encoder-s3.sepharstudios.com";
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({
		error: "unauthorized",
		detail: "Sign in required."
	}, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({
		error: "forbidden",
		detail: "Only creators (or admins) can commit a trailer."
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
	const objectKey = typeof body.objectKey === "string" ? body.objectKey : "";
	if (!contentId) return json({
		error: "missing_content_id",
		detail: "contentId is required."
	}, { status: 400 });
	if (!objectKey) return json({
		error: "missing_object",
		detail: "objectKey is required."
	}, { status: 400 });
	if (!objectKey.startsWith(`trailers/${contentId}/`)) return json({
		error: "invalid_object",
		detail: "objectKey is not within the expected trailer prefix."
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
	const trailerUrl = `${PUBLIC_BASE}/${BUCKET}/${objectKey}`;
	try {
		await db.update(mediaLibrary).set({
			trailerUrl,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.id, contentId));
		startTrailerWorkflow({
			contentId,
			bucket: BUCKET,
			objectKey
		}).catch((err) => {
			console.error("[trailer-upload/commit] Temporal start failed (non-blocking):", err);
		});
		return json({
			success: true,
			trailerUrl
		});
	} catch (err) {
		console.error("[trailer-upload/commit] DB update failed:", err);
		return json({
			error: "commit_failed",
			detail: "Trailer is stored but the registry update failed."
		}, { status: 500 });
	}
};
//#endregion
export { POST };
