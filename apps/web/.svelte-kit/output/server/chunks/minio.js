import { Client } from "minio";
import { p as private_env } from "./shared-server.js";
import { d as db, F as files } from "./drizzle.js";
const BUCKETS = {
  // Versioning: ON, Locking: ON
  UPLOADS: "uploads"
};
const ENDPOINT = private_env.MINIO_ENDPOINT || "s3.sepharstudios.com";
const PORT = Number(private_env.MINIO_PORT) || 443;
const USE_SSL = private_env.MINIO_USE_SSL === "true" || PORT === 443;
const PUBLIC_BASE_URL = "s3.sepharstudios.com";
const minioClient = new Client({
  endPoint: ENDPOINT,
  port: PORT,
  useSSL: USE_SSL,
  accessKey: private_env.MINIO_ROOT_USER,
  secretKey: private_env.MINIO_ROOT_PASSWORD
});
const encoderMinioClient = new Client({
  endPoint: private_env.ENCODER_MINIO_ENDPOINT || "encoder-s3.sepharstudios.com",
  port: Number(private_env.ENCODER_MINIO_PORT) || 443,
  useSSL: private_env.ENCODER_MINIO_USE_SSL === "true" || (Number(private_env.ENCODER_MINIO_PORT) || 443) === 443,
  accessKey: private_env.ENCODER_MINIO_ACCESS_KEY,
  secretKey: private_env.ENCODER_MINIO_SECRET_KEY
});
const DEFAULT_BUCKET = private_env.MINIO_BUCKET || BUCKETS.UPLOADS;
function getDirectObjectUrl(bucketName, objectName) {
  return `https://${PUBLIC_BASE_URL}/${bucketName}/${objectName}`;
}
function getObjectUrl(bucketName, objectName) {
  return `https://minio.sepharstudios.com/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${encodeURIComponent(objectName)}&version_id=null`;
}
async function getEncoderPresignedUploadUrl(bucketName, objectName, expirySeconds = 3600) {
  try {
    return await encoderMinioClient.presignedPutObject(bucketName, objectName, expirySeconds);
  } catch (error) {
    console.error("Error generating encoder presigned PUT URL:", error);
    throw error;
  }
}
async function uploadFile(bucketName, objectName, file, metadata) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileMetadata = {
      "Content-Type": file.type || "application/octet-stream",
      ...metadata
    };
    const result = await minioClient.putObject(bucketName, objectName, buffer, buffer.length, fileMetadata);
    const filename = file.name || objectName;
    return {
      id: objectName,
      url: getObjectUrl(bucketName, objectName),
      directUrl: getDirectObjectUrl(bucketName, objectName),
      filename,
      size: file.size,
      contentType: file.type || "application/octet-stream",
      etag: result.etag
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
async function handleFileUpload(file, bucketName = DEFAULT_BUCKET, customObjectName) {
  try {
    await createBucket(bucketName);
    const filename = file.name || "blob";
    const objectName = customObjectName || `${Date.now()}-${filename}`;
    return await uploadFile(bucketName, objectName, file);
  } catch (error) {
    console.error("Error handling file upload:", error);
    throw error;
  }
}
async function uploadAndSaveFile(file, bucketName = DEFAULT_BUCKET, customObjectName) {
  const uploadResult = await handleFileUpload(file, bucketName, customObjectName);
  const [fileRecord] = await db.insert(files).values({
    remoteId: uploadResult.id,
    url: uploadResult.directUrl,
    bucket: bucketName,
    size: uploadResult.size,
    type: uploadResult.contentType,
    name: uploadResult.filename
  }).returning();
  return {
    ...uploadResult,
    dbId: fileRecord.id
  };
}
async function createBucket(bucketName) {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
    }
  } catch (error) {
    console.error("Error creating bucket:", error);
    throw error;
  }
}
async function deleteFileById(bucketName, objectId) {
  await minioClient.removeObject(bucketName, objectId);
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
export {
  getDirectObjectUrl as a,
  uploadFile as b,
  deleteFileById as d,
  getEncoderPresignedUploadUrl as g,
  listObjects as l,
  uploadAndSaveFile as u
};
