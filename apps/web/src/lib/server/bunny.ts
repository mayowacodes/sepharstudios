import { env } from '$env/dynamic/private';
import crypto from 'crypto';

/**
 * Bunny CDN Utility
 * 
 * Handles URL transformations and SHA256 token signing for secure streaming.
 * Secure URLs prevent unauthorized hotlinking and ensure content expiry.
 */

const CDN_HOST = env.BUNNY_CDN_HOST || 'cdn.sepharstudios.com';
const SECRET_KEY = env.BUNNY_SECRET_KEY;

/**
 * Generates a signed Bunny CDN URL using SHA256
 * 
 * @param path The object path (e.g., /encoder-output/jobs/abc123/hls/master.m3u8)
 * @param expires Unix timestamp (seconds) when the link expires
 * @returns Fully qualified signed URL
 */
export function generateBunnySignedUrl(path: string, expires: number): string {
  if (!SECRET_KEY) {
    console.warn('BUNNY_SECRET_KEY is not defined. Returning unsigned URL.');
    return `https://${CDN_HOST}${path}`;
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Bunny Expected Logic: hash(path + expires + secret)
  const tokenInput = `${normalizedPath}${expires}${SECRET_KEY}`;
  const token = crypto
    .createHash('sha256')
    .update(tokenInput)
    .digest('hex');

  return `https://${CDN_HOST}${normalizedPath}?token=${token}&expires=${expires}`;
}

/**
 * Utility for easy HLS master playlist signing
 * @param jobId The encoder job ID
 * @param expirySeconds Expiry time in seconds (default 1 hour)
 */
export function getSignedMasterPlaylistUrl(jobId: string, expirySeconds: number = 3600): string {
  const expires = Math.floor(Date.now() / 1000) + expirySeconds;
  const path = `/encoder-output/jobs/${jobId}/hls/master.m3u8`;
  return generateBunnySignedUrl(path, expires);
}