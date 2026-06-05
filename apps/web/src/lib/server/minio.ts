import { Client, type BucketItemFromList } from 'minio';
import * as stream from 'stream';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { files as filesTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

import { BUCKETS } from '$lib/constants/minio';

// Configuration from environment.
//
// MinIO has TWO addresses in a typical deploy:
//   • INTERNAL — `minio:9000` (Docker service name, HTTP). Used by the
//     SvelteKit container for server-to-server operations: putObject,
//     listObjects, makeBucket, etc. Fast, doesn't leave the host.
//   • PUBLIC  — `s3.sepharstudios.com:443` (HTTPS via Traefik). Used by
//     the BROWSER. The browser cannot resolve `minio:9000`, and even if
//     it could, an HTTPS page cannot XHR to an http:// endpoint (mixed
//     content). Anything signed for browser use MUST point here.
//
// The MinIO SDK bakes the configured endpoint into every presigned URL,
// so we keep two clients: `minioClient` for server-side calls and
// `minioPublicClient` exclusively for generating presigned URLs that the
// browser will hit. The presign signature is independent of which
// client signs it — it's a function of (host header, path, headers,
// secret) — so as long as we sign with the public host and the browser
// hits the public host, the signature matches and MinIO accepts the PUT.
const ENDPOINT = env.MINIO_ENDPOINT || 's3.sepharstudios.com';
const PORT = Number(env.MINIO_PORT) || 443;
const USE_SSL = env.MINIO_USE_SSL === 'true' || PORT === 443;
const PUBLIC_BASE_URL = env.MINIO_PUBLIC_ENDPOINT || 's3.sepharstudios.com';
const PUBLIC_PORT = Number(env.MINIO_PUBLIC_PORT) || 443;
// Default to SSL for the public endpoint; only disable if explicitly
// set to 'false' (the public endpoint is browser-facing, and modern
// browsers refuse mixed-content even for development).
const PUBLIC_USE_SSL = env.MINIO_PUBLIC_USE_SSL !== 'false';

// Credentials. The conventional S3-compatible env-var names are
// MINIO_ACCESS_KEY and MINIO_SECRET_KEY (or AWS_ACCESS_KEY_ID /
// AWS_SECRET_ACCESS_KEY). This repo historically used MINIO_ROOT_USER /
// MINIO_ROOT_PASSWORD, which double as the access-key pair when MinIO
// is configured with default root credentials but are misnamed if a
// dedicated service account is used. Accept either; prefer the
// conventional names so operators can set them without thinking about
// our legacy naming.
const ACCESS_KEY = env.MINIO_ACCESS_KEY || env.MINIO_ROOT_USER || '';
const SECRET_KEY = env.MINIO_SECRET_KEY || env.MINIO_ROOT_PASSWORD || '';

// Boot diagnostic — print which endpoints + access key (first 4 chars
// only) are being used on container start. This makes it trivial to
// confirm at a glance whether Dokploy actually plumbed the env vars
// into the SvelteKit container. Without it, debugging "InvalidAccessKeyId"
// errors requires guessing whether the key is wrong or unset. Never log
// the secret itself.
const ACCESS_KEY_PREVIEW = ACCESS_KEY
	? `${ACCESS_KEY.slice(0, 4)}…(${ACCESS_KEY.length} chars)`
	: '(empty — env var not set)';
const SECRET_KEY_PREVIEW = SECRET_KEY
	? `***(${SECRET_KEY.length} chars)`
	: '(empty — env var not set)';
console.log(
	`[minio] internal=${USE_SSL ? 'https' : 'http'}://${ENDPOINT}:${PORT} ` +
	`public=${PUBLIC_USE_SSL ? 'https' : 'http'}://${PUBLIC_BASE_URL}:${PUBLIC_PORT} ` +
	`accessKey=${ACCESS_KEY_PREVIEW} secretKey=${SECRET_KEY_PREVIEW}`
);
if (!ACCESS_KEY || !SECRET_KEY) {
	console.error(
		'[minio] MISSING CREDENTIALS — set MINIO_ACCESS_KEY and MINIO_SECRET_KEY ' +
		'(or legacy MINIO_ROOT_USER / MINIO_ROOT_PASSWORD) on the SvelteKit container. ' +
		'All bucketExists/makeBucket/putObject calls will fail with InvalidAccessKeyId until these are present.'
	);
}

// Initialize Main MinIO Client (internal, server-to-server).
const minioClient = new Client({
	endPoint: ENDPOINT,
	port: PORT,
	useSSL: USE_SSL,
	accessKey: ACCESS_KEY,
	secretKey: SECRET_KEY
});

// Initialize Public-facing MinIO Client. Used ONLY to generate presigned
// URLs that the browser will hit directly. Never use it for server-side
// putObject etc — that would route writes back out through the public
// network, which is slower and pointless when the container can reach
// MinIO over the Docker network.
const minioPublicClient = new Client({
	endPoint: PUBLIC_BASE_URL,
	port: PUBLIC_PORT,
	useSSL: PUBLIC_USE_SSL,
	accessKey: ACCESS_KEY,
	secretKey: SECRET_KEY
});

// Initialize Encoder MinIO Client (for Direct Upload)
export const encoderMinioClient = new Client({
	endPoint: env.ENCODER_MINIO_ENDPOINT || 'encoder-s3.sepharstudios.com',
	port: Number(env.ENCODER_MINIO_PORT) || 443,
	useSSL: env.ENCODER_MINIO_USE_SSL === 'true' || (Number(env.ENCODER_MINIO_PORT) || 443) === 443,
	accessKey: env.ENCODER_MINIO_ACCESS_KEY,
	secretKey: env.ENCODER_MINIO_SECRET_KEY
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
 * Generate a presigned PUT URL for the ENCODER MinIO
 */
export async function getEncoderPresignedUploadUrl(
	bucketName: string,
	objectName: string,
	expirySeconds: number = 3600
): Promise<string> {
	try {
		return await encoderMinioClient.presignedPutObject(bucketName, objectName, expirySeconds);
	} catch (error) {
		console.error('Error generating encoder presigned PUT URL:', error);
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
export async function getMainPresignedUploadUrl(
	bucketName: string,
	objectName: string,
	expirySeconds: number = 900
): Promise<string> {
	try {
		// `createBucket` uses the internal client (cheap + reliable inside
		// Docker), so we don't pay any public-network round-trip just to
		// ensure the bucket exists.
		await createBucket(bucketName);
		// The presign itself must come from the PUBLIC client. If we
		// signed with the internal `minio:9000` endpoint, the URL would
		// be `http://minio:9000/...` — unreachable from the browser AND
		// blocked by mixed-content on an HTTPS page. The public client
		// signs against `https://s3.sepharstudios.com`, which the browser
		// can actually hit.
		return await minioPublicClient.presignedPutObject(bucketName, objectName, expirySeconds);
	} catch (error) {
		console.error('Error generating main presigned PUT URL:', error);
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
