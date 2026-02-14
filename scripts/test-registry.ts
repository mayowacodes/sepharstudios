import { Client } from 'minio';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env from root
dotenv.config({ path: resolve(process.cwd(), '.env') });

const {
    MINIO_ROOT_USER,
    MINIO_ROOT_PASSWORD,
    DATABASE_URL
} = process.env;

const REMOTE_ENDPOINT = 's3.sepharstudios.com';
const REMOTE_PORT = 443;
const USE_SSL = true;

const REMOTE_PASSWORD = process.env.MINIO_ROOT_PASSWORD === 'minioadmin123' 
    ? 'uxvltqbyb4mtlove' 
    : process.env.MINIO_ROOT_PASSWORD;

console.log('--- MinIO & Registry Final Verification ---');
console.log(`Endpoint: ${REMOTE_ENDPOINT}:${REMOTE_PORT}`);

const minioClient = new Client({
    endPoint: REMOTE_ENDPOINT,
    port: REMOTE_PORT,
    useSSL: USE_SSL,
    accessKey: MINIO_ROOT_USER || 'minioadmin',
    secretKey: REMOTE_PASSWORD || 'minioadmin123'
});

async function runTest() {
    try {
        console.log('1. Checking MinIO connectivity...');
        const buckets = await minioClient.listBuckets();
        console.log('   [✓] Connected! Buckets found:', buckets.map(b => b.name).join(', '));

        console.log('2. Testing Registry linkage...');
        if (!DATABASE_URL) throw new Error('DATABASE_URL missing');

        const sql = postgres(DATABASE_URL);
        const testBucket = 'uploads';
        const testFileName = `registry-db-level-test-${Date.now()}.txt`;
        const testBuffer = Buffer.from('Sephar Studios DB-Level Registry Test');

        console.log(`   Uploading to "${testBucket}"...`);
        await minioClient.putObject(testBucket, testFileName, testBuffer);

        const directUrl = `https://s3.sepharstudios.com/${testBucket}/${testFileName}`;
        
        console.log('   Registering in PostgreSQL (ID should be automatic)...');
        // Note: No 'id' column passed here. DB handles it.
        const result = await sql`
            INSERT INTO files (remote_id, url, bucket, size, type, name)
            VALUES (${testFileName}, ${directUrl}, ${testBucket}, ${testBuffer.length}, 'text/plain', ${testFileName})
            RETURNING id
        `;

        const dbId = result[0].id;
        console.log(`   [✓] Success! Registry ID: ${dbId}`);

        console.log('3. Cleaning up...');
        await minioClient.removeObject(testBucket, testFileName);
        await sql`DELETE FROM files WHERE id = ${dbId}`;
        console.log('   [✓] Cleanup complete.');

        console.log('\n--- SYSTEM INTEGRATED & VERIFIED ---');
    } catch (error) {
        console.error('\n--- VERIFICATION FAILED ---');
        console.error(error);
    } finally {
        process.exit();
    }
}

runTest();
