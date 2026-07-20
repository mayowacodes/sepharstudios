import { t as private_env } from "../../../../chunks/shared-server.js";
import { c as uploadFile, o as listObjects, r as getDirectObjectUrl, s as uploadAndSaveFile, t as deleteFileById } from "../../../../chunks/minio2.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/files/+server.ts
var BUCKET_NAME = private_env.MINIO_BUCKET || "uploads";
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (session.user.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	try {
		return json({
			success: true,
			files: (await listObjects(BUCKET_NAME)).map((obj) => ({
				id: obj.name,
				url: getDirectObjectUrl(BUCKET_NAME, obj.name),
				filename: obj.name.split("-").slice(1).join("-") || obj.name,
				size: obj.size,
				etag: obj.etag,
				uploadedAt: obj.lastModified
			}))
		});
	} catch (error) {
		console.error("Files list failed:", error);
		return json({ error: "Failed to list files" }, { status: 500 });
	}
};
var MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
function classifyUploadError(err) {
	const lower = (err instanceof Error ? err.message : String(err)).toLowerCase();
	if (lower.includes("access denied") || lower.includes("signaturedoesnotmatch") || lower.includes("invalidaccesskey")) return {
		category: "storage_auth",
		detail: "Storage credentials rejected. Please contact support."
	};
	if (lower.includes("nosuchbucket") || lower.includes("bucket") && lower.includes("not")) return {
		category: "storage_bucket_missing",
		detail: "Storage bucket unavailable. Please contact support."
	};
	if (lower.includes("entitytoolarge") || lower.includes("too large")) return {
		category: "storage_size_limit",
		detail: "File exceeds the storage size limit."
	};
	if (lower.includes("econnrefused") || lower.includes("econnreset") || lower.includes("etimedout")) return {
		category: "storage_unreachable",
		detail: "Storage service is unreachable. Try again in a moment."
	};
	return {
		category: "upload_failed",
		detail: "Upload failed unexpectedly. Try again or contact support."
	};
}
var POST = async ({ request, locals }) => {
	if (!await locals.auth.getSession()) return json({
		error: "unauthorized",
		detail: "Sign in required."
	}, { status: 401 });
	const formData = await request.formData();
	const file = formData.get("file");
	const bucket = formData.get("bucket") || BUCKET_NAME;
	if (!file) return json({
		error: "missing_file",
		detail: "No file was attached to the request."
	}, { status: 400 });
	if (file.size > MAX_UPLOAD_BYTES) return json({
		error: "file_too_large",
		detail: `File is ${(file.size / (1024 * 1024)).toFixed(1)} MB; the limit for image uploads is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`
	}, { status: 413 });
	try {
		return json({
			success: true,
			...await uploadAndSaveFile(file, bucket)
		});
	} catch (error) {
		console.error("API Upload error:", error);
		const { category, detail } = classifyUploadError(error);
		return json({
			error: category,
			detail
		}, { status: 500 });
	}
};
var PUT = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (session.user.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const formData = await request.formData();
	const file = formData.get("file");
	const objectId = formData.get("id");
	const bucket = formData.get("bucket") || BUCKET_NAME;
	if (!file || !objectId) return json({ error: "File and ID required" }, { status: 400 });
	try {
		return json({
			success: true,
			...await uploadFile(bucket, objectId, file)
		});
	} catch (error) {
		console.error("API Update error:", error);
		return json({ error: "Update failed" }, { status: 500 });
	}
};
var DELETE = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (session.user.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const { id, bucket } = await request.json();
	const targetBucket = bucket || BUCKET_NAME;
	if (!id) return json({ error: "ID required" }, { status: 400 });
	try {
		await deleteFileById(targetBucket, id);
		return json({
			success: true,
			message: "File deleted successfully"
		});
	} catch (error) {
		console.error("API Delete error:", error);
		return json({ error: "Delete failed" }, { status: 500 });
	}
};
//#endregion
export { DELETE, GET, POST, PUT };
