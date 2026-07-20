import { t as private_env } from "../../../../../chunks/shared-server.js";
import { a as getMainPresignedUploadUrl } from "../../../../../chunks/minio2.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/files/sign/+server.ts
var DEFAULT_BUCKET = private_env.MINIO_BUCKET || "uploads";
var ALLOWED_BUCKETS = new Set([
	"thumbnails",
	"avatars",
	"uploads"
]);
var MAX_FILENAME_LEN = 200;
var SAFE_FILENAME = /^[A-Za-z0-9._\-() ]+$/;
/**
* POST /api/files/sign
*
* Returns a short-lived presigned PUT URL the browser can use to upload
* a file directly to MinIO. The actual file bytes never pass through
* this server — that's the whole point. We just sign + return the URL.
*
* Request:  { filename: string, bucket?: 'thumbnails' | 'avatars' | 'uploads', contentType?: string }
* Response: { uploadUrl: string, objectName: string, bucket: string, expiresInSeconds: number }
*/
var POST = async ({ request, locals }) => {
	if (!await locals.auth.getSession()) return json({
		error: "unauthorized",
		detail: "Sign in required."
	}, { status: 401 });
	let body;
	try {
		body = await request.json();
	} catch {
		return json({
			error: "invalid_body",
			detail: "Request body must be JSON."
		}, { status: 400 });
	}
	const filenameRaw = typeof body.filename === "string" ? body.filename.trim() : "";
	const bucketRaw = typeof body.bucket === "string" ? body.bucket : DEFAULT_BUCKET;
	if (!filenameRaw) return json({
		error: "missing_filename",
		detail: "A filename is required."
	}, { status: 400 });
	if (filenameRaw.length > MAX_FILENAME_LEN) return json({
		error: "filename_too_long",
		detail: `Filename must be ${MAX_FILENAME_LEN} characters or fewer.`
	}, { status: 400 });
	if (!SAFE_FILENAME.test(filenameRaw)) return json({
		error: "invalid_filename",
		detail: "Filename contains characters that are not allowed."
	}, { status: 400 });
	if (!ALLOWED_BUCKETS.has(bucketRaw)) return json({
		error: "invalid_bucket",
		detail: "That bucket is not allowed for direct uploads."
	}, { status: 400 });
	const objectName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${filenameRaw}`;
	const expiresInSeconds = 900;
	try {
		return json({
			uploadUrl: await getMainPresignedUploadUrl(bucketRaw, objectName, expiresInSeconds),
			objectName,
			bucket: bucketRaw,
			expiresInSeconds
		});
	} catch (error) {
		console.error("[api/files/sign] presign failed:", error);
		const lower = (error instanceof Error ? error.message : String(error)).toLowerCase();
		if (lower.includes("access denied") || lower.includes("signaturedoesnotmatch") || lower.includes("invalidaccesskey")) return json({
			error: "storage_auth",
			detail: "Storage credentials rejected. Please contact support."
		}, { status: 500 });
		if (lower.includes("nosuchbucket") || lower.includes("bucket") && lower.includes("not")) return json({
			error: "storage_bucket_missing",
			detail: "Storage bucket unavailable. Please contact support."
		}, { status: 500 });
		if (lower.includes("econnrefused") || lower.includes("etimedout") || lower.includes("econnreset")) return json({
			error: "storage_unreachable",
			detail: "Storage service is unreachable. Try again in a moment."
		}, { status: 500 });
		return json({
			error: "sign_failed",
			detail: "Could not prepare upload. Try again or contact support."
		}, { status: 500 });
	}
};
//#endregion
export { POST };
