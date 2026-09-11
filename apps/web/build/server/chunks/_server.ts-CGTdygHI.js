import { j as json, p as private_env } from './index.js-BP8aAXBX.js';
import { d as db } from './drizzle-CsnNxG5m.js';
import { g as getRedis } from './redis-8sKVJ4Iw.js';
import { a as isMeiliConfigured, g as getMeiliClient } from './meilisearch2-C9RbbsNN.js';
import { sql } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'ioredis';
import 'meilisearch';

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
async function checkMeili() {
	if (!isMeiliConfigured()) return {
		ok: true,
		latencyMs: 0,
		error: "not_configured"
	};
	return timed(async () => {
		const client = getMeiliClient();
		if (!client) throw new Error("Meili client unavailable");
		const health = await client.health();
		if (health.status !== "available") throw new Error(`status=${health.status}`);
	});
}
/**
* Encoder reachability.
*
* Was `checkOrchestrator`, probing the legacy encoder-orchestrator service.
* That service was retired once the Temporal pipeline reached 100% of traffic
* (see TECHDEBT), so the probe was reporting on something that no longer
* exists — and reporting it as HEALTHY, because an unset URL returns ok. A
* readiness check that cannot fail is worse than no check: it occupies the slot
* where a real signal should be.
*
* Now probes the Temporal frontend, which is what actually runs encoding.
* Still soft-fails when unconfigured: encoding being down should not take the
* whole site's readiness with it, since browsing and playback of already-
* encoded titles are unaffected.
*/
async function checkEncoder() {
	const url = private_env.TEMPORAL_ADDRESS || private_env.TEMPORAL_UI_URL;
	if (!url) return {
		ok: true,
		latencyMs: 0,
		error: "not_configured"
	};
	return timed(async () => {
		const controller = new AbortController();
		const tid = setTimeout(() => controller.abort(), 2500);
		try {
			const base = url.replace(/\/+$/, "");
			const probe = base.startsWith("http") ? `${base}/` : `http://${base}/`;
			const res = await fetch(probe, {
				method: "GET",
				signal: controller.signal
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
		} finally {
			clearTimeout(tid);
		}
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
	const [dbResult, redisResult, minioResult, meiliResult, encoderResult] = await Promise.all([
		checkDb(),
		checkRedis(),
		checkMinio(),
		checkMeili(),
		checkEncoder()
	]);
	const healthy = dbResult.ok && redisResult.ok && minioResult.ok && meiliResult.ok && encoderResult.ok;
	return json({
		status: healthy ? "ok" : "degraded",
		uptimeSec: Math.round((Date.now() - startedAt) / 1e3),
		db: dbResult,
		redis: redisResult,
		minio: minioResult,
		meili: meiliResult,
		encoder: encoderResult
	}, { status: healthy ? 200 : 503 });
};

export { GET };
//# sourceMappingURL=_server.ts-CGTdygHI.js.map
