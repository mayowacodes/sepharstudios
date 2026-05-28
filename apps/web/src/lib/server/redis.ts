import Redis from 'ioredis';
import { env } from '$env/dynamic/private';

/**
 * Shared Redis client. Lazy singleton — connects on first use, reuses thereafter.
 *
 * Reads `REDIS_URL` from env. In production this is the Dokploy-managed Redis
 * instance; in dev it's the local compose service. Connection failures don't
 * crash the process — ioredis retries on its own backoff, and our two callers
 * (OTP, rate-limit) both have sensible fallbacks if Redis is unavailable.
 *
 * One client per Node process is the right number — ioredis handles pipelining
 * and multiplexing internally. Do not call `new Redis()` elsewhere.
 */

let client: Redis | null = null;

function buildClient(): Redis {
  const url = env.REDIS_URL || 'redis://localhost:6379';
  const c = new Redis(url, {
    // Don't retry forever on a hard failure — fall back to whatever the caller
    // does on error after ~6 attempts (~6s total with default backoff).
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    // ioredis tries to reconnect indefinitely by default. Keep that, but cap
    // the per-request retry above so a single Redis outage doesn't pile up
    // pending requests in memory.
    retryStrategy: (times) => Math.min(times * 200, 2000),
    lazyConnect: false,
  });

  c.on('error', (err) => {
    // Quietly log — Redis errors are common during startup races and we don't
    // want to spam stdout with stack traces.
    console.warn('[redis] error:', err.message);
  });

  return c;
}

export function getRedis(): Redis {
  if (!client) {
    client = buildClient();
  }
  return client;
}

/** Convenience: close the client (for tests / graceful shutdown). */
export async function closeRedis(): Promise<void> {
  if (client) {
    await client.quit().catch(() => {});
    client = null;
  }
}
