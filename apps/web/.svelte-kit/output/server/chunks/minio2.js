import { t as private_env } from "./shared-server.js";
import { P as files, t as db } from "./drizzle.js";
import { t as BUCKETS } from "./minio.js";
import "drizzle-orm";
import { Client } from "minio";
//#region src/lib/server/minio.ts
var ENDPOINT = private_env.MINIO_ENDPOINT || "s3.sepharstudios.com";
var PORT = Number(private_env.MINIO_PORT) || 443;
var USE_SSL = private_env.MINIO_USE_SSL === "true" || PORT === 443;
var PUBLIC_BASE_URL = private_env.MINIO_PUBLIC_ENDPOINT || "s3.sepharstudios.com";
var PUBLIC_PORT = Number(private_env.MINIO_PUBLIC_PORT) || 443;
var PUBLIC_USE_SSL = private_env.MINIO_PUBLIC_USE_SSL !== "false";
var ACCESS_KEY = private_env.MINIO_ACCESS_KEY || private_env.MINIO_ROOT_USER || "";
var SECRET_KEY = private_env.MINIO_SECRET_KEY || private_env.MINIO_ROOT_PASSWORD || "";
var ACCESS_KEY_PREVIEW = ACCESS_KEY ? `${ACCESS_KEY.slice(0, 4)}…(${ACCESS_KEY.length} chars)` : "(empty — env var not set)";
var SECRET_KEY_PREVIEW = SECRET_KEY ? `***(${SECRET_KEY.length} chars)` : "(empty — env var not set)";
console.log(`[minio] internal=${USE_SSL ? "https" : "http"}://${ENDPOINT}:${PORT} public=${PUBLIC_USE_SSL ? "https" : "http"}://${PUBLIC_BASE_URL}:${PUBLIC_PORT} accessKey=${ACCESS_KEY_PREVIEW} secretKey=${SECRET_KEY_PREVIEW}`);
if (!ACCESS_KEY || !SECRET_KEY) console.error("[minio] MISSING CREDENTIALS — set MINIO_ACCESS_KEY and MINIO_SECRET_KEY (or legacy MINIO_ROOT_USER / MINIO_ROOT_PASSWORD) on the SvelteKit container. All bucketExists/makeBucket/putObject calls will fail with InvalidAccessKeyId until these are present.");
var minioClient = new Client({
	endPoint: ENDPOINT,
	port: PORT,
	useSSL: USE_SSL,
	accessKey: ACCESS_KEY,
	secretKey: SECRET_KEY
});
var minioPublicClient = new Client({
	endPoint: PUBLIC_BASE_URL,
	port: PUBLIC_PORT,
	useSSL: PUBLIC_USE_SSL,
	accessKey: ACCESS_KEY,
	secretKey: SECRET_KEY
});
var encoderMinioClient = new Client({
	endPoint: private_env.ENCODER_MINIO_ENDPOINT || "encoder-s3.sepharstudios.com",
	port: Number(private_env.ENCODER_MINIO_PORT) || 443,
	useSSL: private_env.ENCODER_MINIO_USE_SSL === "true" || (Number(private_env.ENCODER_MINIO_PORT) || 443) === 443,
	accessKey: private_env.ENCODER_MINIO_ACCESS_KEY,
	secretKey: private_env.ENCODER_MINIO_SECRET_KEY
});
var DEFAULT_BUCKET = private_env.MINIO_BUCKET || BUCKETS.UPLOADS;
/**
* Get direct HTTPS object URL (Public Facing)
*/
function getDirectObjectUrl(bucketName, objectName) {
	return `https://${PUBLIC_BASE_URL}/${bucketName}/${objectName}`;
}
/**
* Get permanent MinIO Console API URL
*/
function getObjectUrl(bucketName, objectName) {
	return `https://minio.sepharstudios.com/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${encodeURIComponent(objectName)}&version_id=null`;
}
/**
* Generate a presigned PUT URL for the ENCODER MinIO
*/
async function getEncoderPresignedUploadUrl(bucketName, objectName, expirySeconds = 3600) {
	try {
		return await encoderMinioClient.presignedPutObject(bucketName, objectName, expirySeconds);
	} catch (error) {
		console.error("Error generating encoder presigned PUT URL:", error);
		throw error;
	}
}
/**
* Generate a presigned PUT URL for the MAIN MinIO.
*
* Lets the browser upload directly to MinIO without round-tripping the file
* through SvelteKit. Used for creator-wizard image assets (posters,
* backdrops, thumbnails, logos) so a 5 MB hero background never has to fit
* inside the adapter's BODY_SIZE_LIMIT and never gets caught by an
* upstream reverse-proxy body cap.
*
* Caller flow:
*   1. POST /api/files/sign → returns { uploadUrl, objectName }
*   2. Browser PUTs the file bytes directly to `uploadUrl` (XHR with
*      `upload.onprogress` for the progress bar; bytes go straight to
*      MinIO, not through us).
*   3. POST /api/files/commit { objectName, ... } → records the row in
*      filesTable and returns the durable directUrl.
*
* The 15-minute expiry is comfortably longer than any real upload but
* short enough that a leaked URL can't be reused indefinitely.
*/
async function getMainPresignedUploadUrl(bucketName, objectName, expirySeconds = 900) {
	try {
		await createBucket(bucketName);
		return await minioPublicClient.presignedPutObject(bucketName, objectName, expirySeconds);
	} catch (error) {
		console.error("Error generating main presigned PUT URL:", error);
		throw error;
	}
}
/**
* Upload a file and return complete metadata
*/
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
/**
* Upload file from SvelteKit form action
*/
async function handleFileUpload(file, bucketName = DEFAULT_BUCKET, customObjectName) {
	try {
		await createBucket(bucketName);
		const filename = file.name || "blob";
		return await uploadFile(bucketName, customObjectName || `${Date.now()}-${filename}`, file);
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
		if (!await minioClient.bucketExists(bucketName)) await minioClient.makeBucket(bucketName, "us-east-1");
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
		const stream = minioClient.listObjects(bucketName, prefix, recursive);
		return new Promise((resolve, reject) => {
			stream.on("data", (obj) => objects.push(obj));
			stream.on("end", () => resolve(objects));
			stream.on("error", reject);
		});
	} catch (error) {
		console.error("Error listing objects:", error);
		throw error;
	}
}
//#endregion
export { getMainPresignedUploadUrl as a, uploadFile as c, getEncoderPresignedUploadUrl as i, encoderMinioClient as n, listObjects as o, getDirectObjectUrl as r, uploadAndSaveFile as s, deleteFileById as t };
