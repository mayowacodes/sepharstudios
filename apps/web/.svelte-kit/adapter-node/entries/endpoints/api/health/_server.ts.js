import { t as private_env } from "../../../../chunks/shared-server.js";
import { t as db } from "../../../../chunks/drizzle.js";
import { t as getRedis } from "../../../../chunks/redis.js";
import { json } from "@sveltejs/kit";
import { sql } from "drizzle-orm";
//#region src/routes/api/health/+server.ts
var startedAt = Date.now();
async function timed(fn) {
	const t0 = Date.now();
	try {
		await fn();
		return {
			ok: true,
			latencyMs: Date.now() - t0
		};
	} catch (err) {
		return {
			ok: false,
			latencyMs: Date.now() - t0,
			error: err instanceof Error ? err.message : String(err)
		};
	}
}
async function checkDb() {
	return timed(async () => {
		await db.execute(sql`select 1`);
	});
}
async function checkRedis() {
	return timed(async () => {
		const result = await getRedis().ping();
		if (result !== "PONG") throw new Error(`Unexpected PING reply: ${result}`);
	});
}
async function checkMinio() {
	const endpoint = private_env.MINIO_ENDPOINT || "s3.sepharstudios.com";
	const port = Number(private_env.MINIO_PORT) || 443;
	const url = `${private_env.MINIO_USE_SSL === "true" || port === 443 ? "https" : "http"}://${endpoint}:${port}/minio/health/ready`;
	return timed(async () => {
		const controller = new AbortController();
		const tid = setTimeout(() => controller.abort(), 2e3);
		try {
			const res = await fetch(url, {
				method: "GET",
				signal: controller.signal
			});
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
var GET = async () => {
	const [dbResult, redisResult, minioResult] = await Promise.all([
		checkDb(),
		checkRedis(),
		checkMinio()
	]);
	const healthy = dbResult.ok && redisResult.ok && minioResult.ok;
	return json({
		status: healthy ? "ok" : "degraded",
		uptimeSec: Math.round((Date.now() - startedAt) / 1e3),
		db: dbResult,
		redis: redisResult,
		minio: minioResult
	}, { status: healthy ? 200 : 503 });
};
//#endregion
export { GET };
