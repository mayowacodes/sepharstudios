import { json } from "@sveltejs/kit";
import { l as listObjects, a as getDirectObjectUrl, u as uploadAndSaveFile, b as uploadFile, d as deleteFileById } from "../../../../chunks/minio.js";
import { p as private_env } from "../../../../chunks/shared-server.js";
const BUCKET_NAME = private_env.MINIO_BUCKET || "uploads";
const GET = async () => {
  try {
    const objects = await listObjects(BUCKET_NAME);
    const files = objects.map((obj) => ({
      id: obj.name,
      url: getDirectObjectUrl(BUCKET_NAME, obj.name),
      filename: obj.name.split("-").slice(1).join("-") || obj.name,
      size: obj.size,
      etag: obj.etag,
      uploadedAt: obj.lastModified
    }));
    return json({ success: true, files });
  } catch (error) {
    return json({ error: "Failed to list files" }, { status: 500 });
  }
};
const POST = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const bucket = formData.get("bucket") || BUCKET_NAME;
  if (!file) return json({ error: "No file uploaded" }, { status: 400 });
  try {
    const result = await uploadAndSaveFile(file, bucket);
    return json({ success: true, ...result });
  } catch (error) {
    console.error("API Upload error:", error);
    return json({ error: "Upload failed" }, { status: 500 });
  }
};
const PUT = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const objectId = formData.get("id");
  const bucket = formData.get("bucket") || BUCKET_NAME;
  if (!file || !objectId) return json({ error: "File and ID required" }, { status: 400 });
  try {
    const result = await uploadFile(bucket, objectId, file);
    return json({ success: true, ...result });
  } catch (error) {
    return json({ error: "Update failed" }, { status: 500 });
  }
};
const DELETE = async ({ request }) => {
  const { id, bucket } = await request.json();
  const targetBucket = bucket || BUCKET_NAME;
  if (!id) return json({ error: "ID required" }, { status: 400 });
  try {
    await deleteFileById(targetBucket, id);
    return json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    return json({ error: "Delete failed" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
