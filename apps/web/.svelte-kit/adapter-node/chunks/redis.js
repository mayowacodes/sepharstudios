import { t as private_env } from "./shared-server.js";
import Redis from "ioredis";
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
	c.on("error", (err) => {
		console.warn("[redis] error:", err.message);
	});
	return c;
}
function getRedis() {
	if (!client) client = buildClient();
	return client;
}
//#endregion
export { getRedis as t };
