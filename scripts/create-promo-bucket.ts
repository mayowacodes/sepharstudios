#!/usr/bin/env bun
/**
 * Creates the private MinIO bucket that holds ad creatives.
 *
 * Run once per environment, before enabling ads:
 *   bun run scripts/create-promo-bucket.ts
 *
 * The bucket MUST stay private. Creatives are handed to the player only as
 * 15-minute presigned URLs (see /api/promo/decision), and a public-read bucket
 * would make that pointless — anyone could enumerate and hotlink every
 * advertiser's creative directly. MinIO's `makeBucket` creates a private bucket
 * by default, so this script deliberately does NOT set any bucket policy; if
 * you later find objects are publicly readable, something else set a policy and
 * that is the bug.
 */
import * as Minio from 'minio';

const endPoint = process.env.MINIO_ENDPOINT;
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;

if (!endPoint || !accessKey || !secretKey) {
  console.error(
    'MINIO_ENDPOINT, MINIO_ACCESS_KEY and MINIO_SECRET_KEY must all be set.\n' +
      'Load the same environment the web app uses.'
  );
  process.exit(1);
}

const port = Number(process.env.MINIO_PORT) || 443;
const useSSL = process.env.MINIO_USE_SSL === 'true' || port === 443;
const bucket = process.env.ADS_CREATIVE_BUCKET || 'sephar-promo';

// `minio` is a Docker-internal service name — it resolves inside the compose
// network and nowhere else. Running this from a workstation with the app's
// own .env therefore fails with an opaque connection stack, so say so plainly.
if (endPoint === 'minio' || endPoint === 'localhost' || endPoint === '127.0.0.1') {
  console.error(
    [
      `MINIO_ENDPOINT is "${endPoint}", which only resolves inside the Docker network.`,
      '',
      'Run this on the server, or point it at the public host for a one-off:',
      '',
      '  $env:MINIO_ENDPOINT = "s3.sepharstudios.com"',
      '  $env:MINIO_PORT = "443"',
      '  $env:MINIO_USE_SSL = "true"',
      '  bun run scripts/create-promo-bucket.ts'
    ].join('\n')
  );
  process.exit(1);
}

// `endPoint` must be a bare host. A URL with a scheme is a common mistake and
// Minio.Client's own error for it is unhelpful.
if (/^https?:\/\//i.test(endPoint)) {
  console.error(
    `MINIO_ENDPOINT must be a bare hostname, not a URL. ` +
      `Use "s3.sepharstudios.com", not "${endPoint}".`
  );
  process.exit(1);
}

const client = new Minio.Client({ endPoint, port, useSSL, accessKey, secretKey });

try {
  const exists = await client.bucketExists(bucket);
  if (exists) {
    console.log(`✓ Bucket "${bucket}" already exists — nothing to do.`);
  } else {
    await client.makeBucket(bucket, 'us-east-1');
    console.log(`✓ Created private bucket "${bucket}".`);
  }

  // Report the effective policy rather than assuming. A bucket that is
  // unexpectedly public is the one failure mode worth catching here, and
  // `getBucketPolicy` throws when no policy is set — which is the good case.
  try {
    const policy = await client.getBucketPolicy(bucket);
    console.warn(
      `\n⚠  A bucket policy IS set on "${bucket}". Creatives are served via ` +
        `presigned URLs and this bucket should have no public policy:\n${policy}`
    );
    process.exitCode = 1;
  } catch {
    console.log(`✓ No bucket policy set — "${bucket}" is private, as required.`);
  }

  console.log(`\nNext: set ADS_CREATIVE_BUCKET=${bucket} in the app environment.`);
} catch (err) {
  console.error('Failed:', err);
  process.exitCode = 1;
}
