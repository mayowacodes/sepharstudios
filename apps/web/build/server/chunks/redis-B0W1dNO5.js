import { p as private_env } from './shared-server-DUDL94jl.js';
import Redis from 'ioredis';

//#region src/lib/server/redis.ts
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
var client = null;
function buildClient() {
	const c = new Redis(private_env.REDIS_URL || "redis://localhost:6379", {
		maxRetriesPerRequest: 3,
		enableReadyCheck: true,
		retryStrategy: (times) => Math.min(times * 200, 2e3),
		lazyConnect: false
	});
	let lastLogged = /* @__PURE__ */ new Map();
	const THROTTLE_MS = 6e4;
	c.on("error", (err) => {
		const key = err.message ?? "unknown";
		const now = Date.now();
		const prior = lastLogged.get(key);
		if (!prior || now - prior.at > THROTTLE_MS) {
			const suppressed = prior?.suppressed ?? 0;
			const suffix = suppressed > 0 ? ` (${suppressed} suppressed in the last ${Math.round(THROTTLE_MS / 1e3)}s)` : "";
			console.warn(`[redis] error: ${key}${suffix}`);
			lastLogged.set(key, {
				at: now,
				suppressed: 0
			});
		} else prior.suppressed += 1;
	});
	return c;
}
function getRedis() {
	if (!client) client = buildClient();
	return client;
}

export { getRedis as g };
//# sourceMappingURL=redis-B0W1dNO5.js.map
