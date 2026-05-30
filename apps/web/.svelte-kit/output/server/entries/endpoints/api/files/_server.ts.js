import { t as private_env } from "../../../../chunks/shared-server.js";
import { a as uploadAndSaveFile, i as listObjects, n as getDirectObjectUrl, o as uploadFile, t as deleteFileById } from "../../../../chunks/minio2.js";
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
var POST = async ({ request, locals }) => {
	if (!await locals.auth.getSession()) return json({ error: "Unauthorized" }, { status: 401 });
	const formData = await request.formData();
	const file = formData.get("file");
	const bucket = formData.get("bucket") || BUCKET_NAME;
	if (!file) return json({ error: "No file uploaded" }, { status: 400 });
	try {
		return json({
			success: true,
			...await uploadAndSaveFile(file, bucket)
		});
	} catch (error) {
		console.error("API Upload error:", error);
		return json({ error: "Upload failed" }, { status: 500 });
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
