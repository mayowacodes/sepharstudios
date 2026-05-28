import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { getRedis } from '$lib/server/redis';

const startedAt = Date.now();

interface CheckResult {
  ok: boolean;
  latencyMs: number;
  error?: string;
}

async function timed<T>(fn: () => Promise<T>): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const t0 = Date.now();
  try {
    await fn();
    return { ok: true, latencyMs: Date.now() - t0 };
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - t0,
      error: err instanceof Error ? err.message : String(err)
    };
  }
}

async function checkDb(): Promise<CheckResult> {
  return timed(async () => {
    await db.execute(sql`select 1`);
  });
}

async function checkRedis(): Promise<CheckResult> {
  return timed(async () => {
    const redis = getRedis();
    const result = await redis.ping();
    if (result !== 'PONG') throw new Error(`Unexpected PING reply: ${result}`);
  });
}

async function checkMinio(): Promise<CheckResult> {
  // Quick TCP/HTTPS reach test against the MinIO health endpoint. We avoid
  // pulling in the minio client just to verify reachability — a HEAD on the
  // public bucket URL is enough and stays cheap.
  const endpoint = env.MINIO_ENDPOINT || 's3.sepharstudios.com';
  const port = Number(env.MINIO_PORT) || 443;
  const useSSL = env.MINIO_USE_SSL === 'true' || port === 443;
  const url = `${useSSL ? 'https' : 'http'}://${endpoint}:${port}/minio/health/ready`;

  return timed(async () => {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 2000);
    try {
      const res = await fetch(url, { method: 'GET', signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } finally {
      clearTimeout(tid);
    }
  });
}

/**
 * GET /api/health
 *
 * Returns 200 only when Postgres and MinIO are both reachable. Designed for
 * load balancer / Dokploy readiness probes — distinguishes "process is up" from
 * "process can actually serve requests".
 *
 * Response shape:
 *   { status: "ok" | "degraded", uptimeSec, db: CheckResult, minio: CheckResult }
 */
export const GET: RequestHandler = async () => {
  const [dbResult, redisResult, minioResult] = await Promise.all([
    checkDb(),
    checkRedis(),
    checkMinio()
  ]);

  const healthy = dbResult.ok && redisResult.ok && minioResult.ok;
  const body = {
    status: healthy ? 'ok' : 'degraded',
    uptimeSec: Math.round((Date.now() - startedAt) / 1000),
    db: dbResult,
    redis: redisResult,
    minio: minioResult
  };

  return json(body, { status: healthy ? 200 : 503 });
};
