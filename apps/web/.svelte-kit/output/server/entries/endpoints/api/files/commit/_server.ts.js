import { P as files, t as db } from "../../../../../chunks/drizzle.js";
import { r as getDirectObjectUrl } from "../../../../../chunks/minio2.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/files/commit/+server.ts
var ALLOWED_BUCKETS = new Set([
	"thumbnails",
	"avatars",
	"uploads"
]);
var MAX_RECORDED_SIZE = 5 * 1024 * 1024 * 1024;
/**
* POST /api/files/commit
*
* Records a file uploaded via the presigned-PUT flow into the `files`
* table and returns the durable public URL. The bytes are already in
* MinIO at this point — the browser PUT them directly using the URL
* from /api/files/sign. This endpoint just makes the storage row
* discoverable through the same Drizzle table the rest of the app
* queries.
*
* Request:  { objectName: string, bucket: string, size: number, contentType: string, filename: string }
* Response: { success: true, directUrl: string, dbId: string }
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
	const objectName = typeof body.objectName === "string" ? body.objectName : "";
	const bucket = typeof body.bucket === "string" ? body.bucket : "";
	const size = typeof body.size === "number" && Number.isFinite(body.size) ? Math.floor(body.size) : -1;
	const contentType = typeof body.contentType === "string" ? body.contentType : "application/octet-stream";
	const filename = typeof body.filename === "string" ? body.filename : objectName;
	if (!objectName) return json({
		error: "missing_object",
		detail: "objectName is required."
	}, { status: 400 });
	if (!ALLOWED_BUCKETS.has(bucket)) return json({
		error: "invalid_bucket",
		detail: "That bucket is not allowed."
	}, { status: 400 });
	if (size < 0 || size > MAX_RECORDED_SIZE) return json({
		error: "invalid_size",
		detail: "Reported size is out of range."
	}, { status: 400 });
	const directUrl = getDirectObjectUrl(bucket, objectName);
	try {
		const [fileRecord] = await db.insert(files).values({
			remoteId: objectName,
			url: directUrl,
			bucket,
			size,
			type: contentType,
			name: filename
		}).returning();
		return json({
			success: true,
			directUrl,
			dbId: fileRecord.id
		});
	} catch (error) {
		console.error("[api/files/commit] insert failed:", error);
		return json({
			success: true,
			directUrl,
			dbId: null,
			warning: "commit_db_failed",
			detail: "File is stored but the registry row could not be written. The asset will still display."
		});
	}
};
//#endregion
export { POST };
