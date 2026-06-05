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
  // Read the URL through `$env/dynamic/private` so it picks up runtime
  // env changes (Dokploy / Docker re-deploys). If the resolved URL still
  // ends up as localhost, the deploy almost certainly did NOT plumb
  // REDIS_URL through to the container — `env.REDIS_URL` returns
  // undefined and we fall back to the dev default. Log the resolved URL
  // on first build so the boot log shows exactly what was used.
  const explicit = env.REDIS_URL;
  const url = explicit || 'redis://localhost:6379';
  // Redact the password (anything between `:` and `@` in the auth segment)
  // so we don't echo credentials into stdout.
  const safeUrl = url.replace(/(:\/\/[^:@/]+:)([^@]+)(@)/, '$1***$3');
  if (!explicit) {
    console.warn(`[redis] REDIS_URL is not set; falling back to ${safeUrl}. Set REDIS_URL in the runtime environment (Dokploy → app → env) to point at your Redis service.`);
  } else {
    console.log(`[redis] connecting to ${safeUrl}`);
  }
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

  // Log-spam throttle: when Redis is unreachable the reconnect loop fires
  // ECONNREFUSED every ~2s indefinitely, which floods stdout and buries
  // every other log line in production. Coalesce identical error messages
  // into one log per 60s while still surfacing the *count* of suppressed
  // events so operators can see the actual blast radius.
  let lastLogged = new Map<string, { at: number; suppressed: number }>();
  const THROTTLE_MS = 60_000;
  c.on('error', (err) => {
    const key = err.message ?? 'unknown';
    const now = Date.now();
    const prior = lastLogged.get(key);
    if (!prior || now - prior.at > THROTTLE_MS) {
      const suppressed = prior?.suppressed ?? 0;
      const suffix = suppressed > 0 ? ` (${suppressed} suppressed in the last ${Math.round(THROTTLE_MS / 1000)}s)` : '';
      console.warn(`[redis] error: ${key}${suffix}`);
      lastLogged.set(key, { at: now, suppressed: 0 });
    } else {
      prior.suppressed += 1;
    }
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
