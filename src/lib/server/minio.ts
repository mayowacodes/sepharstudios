import { Client, type BucketItemFromList } from 'minio';
import * as stream from 'stream';
import { env } from '$env/dynamic/private';

// Initialize MinIO Client
const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: 9000,
  useSSL: false,
  accessKey: env.MINIO_ROOT_USER,
  secretKey: env.MINIO_ROOT_PASSWORD,
});

const BUCKET_NAME = env.MINIO_BUCKET;
 
/**
 * Get direct HTTPS object URL (via Traefik)
 */
export function getDirectObjectUrl(bucketName: string, objectName: string): string {
  return `https://api.minio.toolsntuts.com/${bucketName}/${objectName}`;
}

/**
 * Get permanent MinIO Console API URL
 */
export function getObjectUrl(bucketName: string, objectName: string): string {
  return `https://minio.toolsntuts.com/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${encodeURIComponent(objectName)}&version_id=null`;
}

/**
 * Generate a presigned HTTPS URL
 */
export async function getPresignedUrl(
  bucketName: string,
  objectName: string,
  expirySeconds: number = 3600
): Promise<string> {
  try {
    const url = await minioClient.presignedGetObject(bucketName, objectName, expirySeconds);
    console.log(`Presigned URL: ${url}`);
    return url; // Will now be HTTPS automatically
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

/**
 * Generate a presigned URL and convert it to HTTPS
 */
export async function getPresignedUrlHttps(
  bucketName: string,
  objectName: string,
  expirySeconds: number = 3600
): Promise<string> {
  try {
    // Get the HTTP presigned URL
    const httpUrl = await minioClient.presignedGetObject(bucketName, objectName, expirySeconds);
    
    // Convert HTTP to HTTPS and remove port
    const httpsUrl = httpUrl
      .replace('http://', 'https://')
      .replace(':9000', '');
    
    console.log(`Presigned HTTPS URL: ${httpsUrl}`);
    return httpsUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}

/**
 * Get direct HTTPS object URL (for public buckets)
 */
export function getDirectObjectUrlHttps(bucketName: string, objectName: string): string {
  const host = env.MINIO_ENDPOINT;
  return `https://${host}/${bucketName}/${objectName}`;
}
// ============================================
// URL GENERATION (UPDATED)
// ============================================

/**
 * Generate a presigned URL for uploading
 */
export async function getPresignedUploadUrl(
  bucketName: string,
  objectName: string,
  expirySeconds: number = 3600
): Promise<string> {
  try {
    const url = await minioClient.presignedPutObject(bucketName, objectName, expirySeconds);
    console.log(`Presigned upload URL: ${url}`);
    return url;
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    throw error;
  }
}

// ============================================
// OBJECT OPERATIONS (CREATE/UPLOAD) - UPDATED
// ============================================

export interface UploadResult {
  id: string;           // Object name (file identifier for editing/deleting)
  url: string;          // Permanent MinIO Console API URL
  directUrl: string;    // Direct S3-style URL
  filename: string;     // Original filename
  size: number;         // File size in bytes
  contentType: string;  // MIME type
  etag: string;         // ETag from MinIO
}

/**
 * Upload a file and return complete metadata including permanent URL
 */
export async function uploadFile(
  bucketName: string,
  objectName: string,
  file: File,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Add file metadata
    const fileMetadata = {
      'Content-Type': file.type || 'application/octet-stream',
      ...metadata
    };
    
    const result = await minioClient.putObject(
      bucketName, 
      objectName, 
      buffer, 
      buffer.length, 
      fileMetadata
    );
    
    console.log('Upload result:', result);
    
    return {
      id: objectName,
      url: getObjectUrl(bucketName, objectName),
      directUrl: getDirectObjectUrl(bucketName, objectName),
      filename: file.name,
      size: file.size,
      contentType: file.type || 'application/octet-stream',
      etag: result.etag
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload from buffer with complete metadata
 */
export async function uploadFromBuffer(
  bucketName: string,
  objectName: string,
  buffer: Buffer,
  contentType?: string,
  originalFilename?: string
): Promise<UploadResult> {
  try {
    const metadata = contentType ? { 'Content-Type': contentType } : {};
    const result = await minioClient.putObject(
      bucketName, 
      objectName, 
      buffer, 
      buffer.length, 
      metadata
    );
    
    return {
      id: objectName,
      url: getObjectUrl(bucketName, objectName),
      directUrl: getDirectObjectUrl(bucketName, objectName),
      filename: originalFilename || objectName,
      size: buffer.length,
      contentType: contentType || 'application/octet-stream',
      etag: result.etag
    };
  } catch (error) {
    console.error('Error uploading buffer:', error);
    throw error;
  }
}

// ============================================
// SVELTEKIT INTEGRATION (UPDATED)
// ============================================

/**
 * Upload file from SvelteKit form action with complete metadata
 */
export async function handleFileUpload(
  file: File,
  bucketName: string = BUCKET_NAME,
  customObjectName?: string
): Promise<UploadResult> {
  try {
    // Ensure bucket exists
    await createBucket(bucketName);
    
    // Generate unique filename if not provided
    const objectName = customObjectName || `${Date.now()}-${file.name}`;
    
    // Upload file and get complete metadata
    const result = await uploadFile(bucketName, objectName, file);
    
    console.log('File uploaded successfully:', result);
    
    return result;
  } catch (error) {
    console.error('Error handling file upload:', error);
    throw error;
  }
}

/**
 * Upload multiple files with complete metadata
 */
export async function handleMultipleFileUploads(
  files: File[],
  bucketName: string = BUCKET_NAME
): Promise<UploadResult[]> {
  try {
    await createBucket(bucketName);
    
    const uploadPromises = files.map(async (file) => {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const objectName = `${timestamp}-${randomSuffix}-${file.name}`;
      
      return await uploadFile(bucketName, objectName, file);
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error handling multiple file uploads:', error);
    throw error;
  }
}

// ============================================
// EDIT/UPDATE OPERATIONS
// ============================================

/**
 * Update/Replace an existing file (using the id/objectName)
 */
export async function updateFile(
  bucketName: string,
  objectId: string,
  newFile: File,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  try {
    // MinIO doesn't have direct update, so we overwrite the object
    return await uploadFile(bucketName, objectId, newFile, metadata);
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
}

// ============================================
// DELETE OPERATIONS (USING ID)
// ============================================

/**
 * Delete a file using its id (objectName)
 */
export async function deleteFileById(
  bucketName: string,
  objectId: string
): Promise<void> {
  try {
    await minioClient.removeObject(bucketName, objectId);
    console.log(`File with id "${objectId}" deleted successfully`);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Delete multiple files using their ids
 */
export async function deleteFilesByIds(
  bucketName: string,
  objectIds: string[]
): Promise<void> {
  try {
    await minioClient.removeObjects(bucketName, objectIds);
    console.log(`${objectIds.length} files deleted successfully`);
  } catch (error) {
    console.error('Error deleting files:', error);
    throw error;
  }
}

// ============================================
// BUCKET OPERATIONS
// ============================================

export async function createBucket(bucketName: string): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket "${bucketName}" created successfully`);
    }
  } catch (error) {
    console.error('Error creating bucket:', error);
    throw error;
  }
}

export async function listBuckets(): Promise<BucketItemFromList[]> {
  try {
    return await minioClient.listBuckets();
  } catch (error) {
    console.error('Error listing buckets:', error);
    throw error;
  }
}

export async function deleteBucket(bucketName: string): Promise<void> {
  try {
    await minioClient.removeBucket(bucketName);
    console.log(`Bucket "${bucketName}" deleted successfully`);
  } catch (error) {
    console.error('Error deleting bucket:', error);
    throw error;
  }
}

// ============================================
// READ OPERATIONS
// ============================================

export async function downloadFile(
  bucketName: string,
  objectName: string,
  downloadPath: string
): Promise<void> {
  try {
    await minioClient.fGetObject(bucketName, objectName, downloadPath);
    console.log(`File downloaded successfully to: ${downloadPath}`);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

export async function getObjectStream(
  bucketName: string,
  objectName: string
): Promise<stream.Readable> {
  try {
    return await minioClient.getObject(bucketName, objectName);
  } catch (error) {
    console.error('Error getting object stream:', error);
    throw error;
  }
}

export async function getObjectBuffer(
  bucketName: string,
  objectName: string
): Promise<Buffer> {
  try {
    const dataStream = await minioClient.getObject(bucketName, objectName);
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      dataStream.on('data', (chunk) => chunks.push(chunk));
      dataStream.on('end', () => resolve(Buffer.concat(chunks)));
      dataStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error getting object buffer:', error);
    throw error;
  }
}

export async function getObjectStats(
  bucketName: string,
  objectName: string
): Promise<any> {
  try {
    return await minioClient.statObject(bucketName, objectName);
  } catch (error) {
    console.error('Error getting object stats:', error);
    throw error;
  }
}

export async function listObjects(
  bucketName: string,
  prefix?: string,
  recursive: boolean = true
): Promise<any[]> {
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

export async function copyObject(
  sourceBucket: string,
  sourceObject: string,
  destBucket: string,
  destObject: string
): Promise<void> {
  try {
    await minioClient.copyObject(
      destBucket,
      destObject,
      `/${sourceBucket}/${sourceObject}`,
      undefined
    );
    console.log(`Object copied from ${sourceObject} to ${destObject}`);
  } catch (error) {
    console.error('Error copying object:', error);
    throw error;
  }
}

export async function makeBucketPublic(bucketName: string): Promise<void> {
  try {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    console.log(`Bucket "${bucketName}" is now public`);
  } catch (error) {
    console.error('Error making bucket public:', error);
    throw error;
  }
}
