import { Client, type BucketItemFromList } from 'minio';
import * as stream from 'stream';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { files as filesTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

// Specialized Buckets Mapping
export const BUCKETS = {
	COMPLIANCE: 'compliance', // NFT/Royalty/Audit
	MASTERS: 'masters',       // Versioning: ON, Locking: ON
	STREAMS: 'streams',       // Versioning: ON
	SEGMENTS: 'segments',     // Locking: ON
	METADATA: 'metadata',     // Versioning: ON, Locking: ON
	UPLOADS: 'uploads',       // No special config
	THUMBNAILS: 'thumbnails', // No special config
	DRM: 'drm',               // No special config
	VIDEOS: 'videos'          // Versioning: ON, Locking: ON
} as const;

// Configuration from environment
const ENDPOINT = env.MINIO_ENDPOINT || 's3.sepharstudios.com'; // Use internal service name in production, or external in dev
const PORT = Number(env.MINIO_PORT) || 443;
const USE_SSL = env.MINIO_USE_SSL === 'true' || PORT === 443;
const PUBLIC_BASE_URL = 's3.sepharstudios.com';

// Initialize MinIO Client
const minioClient = new Client({
	endPoint: ENDPOINT,
	port: PORT,
	useSSL: USE_SSL,
	accessKey: env.MINIO_ROOT_USER,
	secretKey: env.MINIO_ROOT_PASSWORD
});

const DEFAULT_BUCKET = env.MINIO_BUCKET || BUCKETS.UPLOADS;

/**
 * Get direct HTTPS object URL (Public Facing)
 */
export function getDirectObjectUrl(bucketName: string, objectName: string): string {
	return `https://${PUBLIC_BASE_URL}/${bucketName}/${objectName}`;
}

/**
 * Get permanent MinIO Console API URL
 */
export function getObjectUrl(bucketName: string, objectName: string): string {
	return `https://minio.sepharstudios.com/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${encodeURIComponent(objectName)}&version_id=null`;
}

/**
 * Generate a presigned URL
 */
export async function getPresignedUrl(
	bucketName: string,
	objectName: string,
	expirySeconds: number = 3600
): Promise<string> {
	try {
		return await minioClient.presignedGetObject(bucketName, objectName, expirySeconds);
	} catch (error) {
		console.error('Error generating presigned URL:', error);
		throw error;
	}
}

/**
 * Upload a file and return complete metadata
 */
export async function uploadFile(
	bucketName: string,
	objectName: string,
	file: File | Blob,
	metadata?: Record<string, string>
): Promise<UploadResult> {
	try {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const fileMetadata = {
			'Content-Type': file.type || 'application/octet-stream',
			...metadata
		};
		const result = await minioClient.putObject(bucketName, objectName, buffer, buffer.length, fileMetadata);
		
		const filename = (file as File).name || objectName;
		
		return {
			id: objectName,
			url: getObjectUrl(bucketName, objectName),
			directUrl: getDirectObjectUrl(bucketName, objectName),
			filename: filename,
			size: file.size,
			contentType: file.type || 'application/octet-stream',
			etag: result.etag
		};
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	}
}

export interface UploadResult {
	id: string;
	url: string;
	directUrl: string;
	filename: string;
	size: number;
	contentType: string;
	etag: string;
}

/**
 * Upload file from SvelteKit form action
 */
export async function handleFileUpload(
	file: File | Blob,
	bucketName: string = DEFAULT_BUCKET,
	customObjectName?: string
): Promise<UploadResult> {
	try {
		await createBucket(bucketName);
		const filename = (file as File).name || 'blob';
		const objectName = customObjectName || `${Date.now()}-${filename}`;
		return await uploadFile(bucketName, objectName, file);
	} catch (error) {
		console.error('Error handling file upload:', error);
		throw error;
	}
}

// Registry Operations
export async function uploadAndSaveFile(
	file: File | Blob,
	bucketName: string = DEFAULT_BUCKET,
	customObjectName?: string
): Promise<UploadResult & { dbId: string }> {
	const uploadResult = await handleFileUpload(file, bucketName, customObjectName);

	const [fileRecord] = await db.insert(filesTable).values({
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

export async function createBucket(bucketName: string): Promise<void> {
	try {
		const exists = await minioClient.bucketExists(bucketName);
		if (!exists) {
			await minioClient.makeBucket(bucketName, 'us-east-1');
		}
	} catch (error) {
		console.error('Error creating bucket:', error);
		throw error;
	}
}

export async function deleteFileById(bucketName: string, objectId: string): Promise<void> {
	await minioClient.removeObject(bucketName, objectId);
}

export async function listObjects(bucketName: string, prefix?: string, recursive: boolean = true): Promise<any[]> {
	try {
		const objects: any[] = [];
		const stream = minioClient.listObjects(bucketName, prefix, recursive);
		return new Promise((resolve, reject) => {
			stream.on('data', (obj) => objects.push(obj));
			stream.on('end', () => resolve(objects));
			stream.on('error', reject);
		});
	} catch (error) {
		console.error('Error listing objects:', error);
		throw error;
	}
}
