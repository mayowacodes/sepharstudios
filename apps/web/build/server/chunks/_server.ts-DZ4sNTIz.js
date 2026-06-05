import { p as private_env } from './shared-server-DUDL94jl.js';
import { d as deleteFileById, l as listObjects, g as getDirectObjectUrl, u as uploadAndSaveFile, b as uploadFile } from './minio2-CjcJBaLF.js';
import { j as json } from './index-Cv5VcsYq.js';
import './drizzle-CKUH7ukq.js';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import 'minio';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

export { DELETE, GET, POST, PUT };
//# sourceMappingURL=_server.ts-DZ4sNTIz.js.map
