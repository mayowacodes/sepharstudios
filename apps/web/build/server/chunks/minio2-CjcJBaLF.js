import { p as private_env } from './shared-server-DUDL94jl.js';
import { w as db, B as files } from './drizzle-CKUH7ukq.js';
import 'drizzle-orm';
import { Client } from 'minio';

//#region src/lib/constants/minio.ts
var BUCKETS = {
	UPLOADS: "uploads"};

//#region src/lib/server/minio.ts
var ENDPOINT = private_env.MINIO_ENDPOINT || "s3.sepharstudios.com";
var PORT = Number(private_env.MINIO_PORT) || 443;
var USE_SSL = private_env.MINIO_USE_SSL === "true" || PORT === 443;
var PUBLIC_BASE_URL = "s3.sepharstudios.com";
var minioClient = new Client({
	endPoint: ENDPOINT,
	port: PORT,
	useSSL: USE_SSL,
	accessKey: private_env.MINIO_ROOT_USER,
	secretKey: private_env.MINIO_ROOT_PASSWORD
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

export { getEncoderPresignedUploadUrl as a, uploadFile as b, deleteFileById as d, getDirectObjectUrl as g, listObjects as l, uploadAndSaveFile as u };
//# sourceMappingURL=minio2-CjcJBaLF.js.map
