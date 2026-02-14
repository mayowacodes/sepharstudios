import { j as json } from './index-BcOZ6EV9.js';
import { Client } from 'minio';
import { p as private_env } from './shared-server-BeisX7n9.js';
import './utils-FiC4zhrQ.js';

const minioClient = new Client({
  endPoint: private_env.MINIO_ENDPOINT,
  port: 9e3,
  useSSL: false,
  accessKey: private_env.MINIO_ROOT_USER,
  secretKey: private_env.MINIO_ROOT_PASSWORD
});
const BUCKET_NAME$1 = private_env.MINIO_BUCKET;
function getDirectObjectUrl(bucketName, objectName) {
  return `https://api.minio.toolsntuts.com/${bucketName}/${objectName}`;
}
function getObjectUrl(bucketName, objectName) {
  return `https://minio.toolsntuts.com/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${encodeURIComponent(objectName)}&version_id=null`;
}
async function uploadFile(bucketName, objectName, file, metadata) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileMetadata = {
      "Content-Type": file.type || "application/octet-stream",
      ...metadata
    };
    const result = await minioClient.putObject(
      bucketName,
      objectName,
      buffer,
      buffer.length,
      fileMetadata
    );
    console.log("Upload result:", result);
    return {
      id: objectName,
      url: getObjectUrl(bucketName, objectName),
      directUrl: getDirectObjectUrl(bucketName, objectName),
      filename: file.name,
      size: file.size,
      contentType: file.type || "application/octet-stream",
      etag: result.etag
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
async function handleFileUpload(file, bucketName = BUCKET_NAME$1, customObjectName) {
  try {
    await createBucket(bucketName);
    const objectName = customObjectName || `${Date.now()}-${file.name}`;
    const result = await uploadFile(bucketName, objectName, file);
    console.log("File uploaded successfully:", result);
    return result;
  } catch (error) {
    console.error("Error handling file upload:", error);
    throw error;
  }
}
async function updateFile(bucketName, objectId, newFile, metadata) {
  try {
    return await uploadFile(bucketName, objectId, newFile, metadata);
  } catch (error) {
    console.error("Error updating file:", error);
    throw error;
  }
}
async function deleteFileById(bucketName, objectId) {
  try {
    await minioClient.removeObject(bucketName, objectId);
    console.log(`File with id "${objectId}" deleted successfully`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
async function createBucket(bucketName) {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`Bucket "${bucketName}" created successfully`);
    }
  } catch (error) {
    console.error("Error creating bucket:", error);
    throw error;
  }
}
async function listObjects(bucketName, prefix, recursive = true) {
  try {
    const objects = [];
    const stream2 = minioClient.listObjects(bucketName, prefix, recursive);
    return new Promise((resolve, reject) => {
      stream2.on("data", (obj) => objects.push(obj));
      stream2.on("end", () => resolve(objects));
      stream2.on("error", reject);
    });
  } catch (error) {
    console.error("Error listing objects:", error);
    throw error;
  }
}
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
  if (!file) return json({ error: "No file uploaded" }, { status: 400 });
  try {
    const result = await handleFileUpload(file, BUCKET_NAME);
    return json({ success: true, ...result });
  } catch (error) {
    return json({ error: "Upload failed" }, { status: 500 });
  }
};
const PUT = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file");
  const objectId = formData.get("id");
  if (!file || !objectId) return json({ error: "File and ID required" }, { status: 400 });
  try {
    const result = await updateFile(BUCKET_NAME, objectId, file);
    return json({ success: true, ...result });
  } catch (error) {
    return json({ error: "Update failed" }, { status: 500 });
  }
};
const DELETE = async ({ request }) => {
  const { id } = await request.json();
  if (!id) return json({ error: "ID required" }, { status: 400 });
  try {
    await deleteFileById(BUCKET_NAME, id);
    return json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    return json({ error: "Delete failed" }, { status: 500 });
  }
};

export { DELETE, GET, POST, PUT };
//# sourceMappingURL=_server.ts-BQECYAZl.js.map
