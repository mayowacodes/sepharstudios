import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { getRedis } from '$lib/server/redis';
import { getMeiliClient, isMeiliConfigured } from '$lib/server/meilisearch';

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

async function checkMeili(): Promise<CheckResult> {
  if (!isMeiliConfigured()) {
    return { ok: true, latencyMs: 0, error: 'not_configured' };
  }
  return timed(async () => {
    const client = getMeiliClient();
    if (!client) throw new Error('Meili client unavailable');
    const health = await client.health();
    if (health.status !== 'available') throw new Error(`status=${health.status}`);
  });
}

async function checkOrchestrator(): Promise<CheckResult> {
  const url = env.ORCHESTRATOR_BASE_URL || env.ENCODER_ORCHESTRATOR_URL;
  if (!url) return { ok: true, latencyMs: 0, error: 'not_configured' };
  return timed(async () => {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch(`${url.replace(/\/+$/, '')}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } finally {
      clearTimeout(tid);
    }
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
  const [dbResult, redisResult, minioResult, meiliResult, orchestratorResult] = await Promise.all([
    checkDb(),
    checkRedis(),
    checkMinio(),
    checkMeili(),
    checkOrchestrator()
  ]);

  // Meili + Orchestrator are optional infra — when not configured, they're
  // returned ok=true with error='not_configured' so the readiness probe
  // doesn't fail in dev or in deployments that skip them.
  const healthy = dbResult.ok && redisResult.ok && minioResult.ok && meiliResult.ok && orchestratorResult.ok;
  const body = {
    status: healthy ? 'ok' : 'degraded',
    uptimeSec: Math.round((Date.now() - startedAt) / 1000),
    db: dbResult,
    redis: redisResult,
    minio: minioResult,
    meili: meiliResult,
    orchestrator: orchestratorResult
  };

  return json(body, { status: healthy ? 200 : 503 });
};
