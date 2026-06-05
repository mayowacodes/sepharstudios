import { p as private_env } from './shared-server-DUDL94jl.js';
import { w as db } from './drizzle-CKUH7ukq.js';
import { g as getRedis } from './redis-B0W1dNO5.js';
import { c as isMeiliConfigured, g as getMeiliClient } from './meilisearch2-BE_fUGh7.js';
import { j as json } from './index-Cv5VcsYq.js';
import { sql } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'ioredis';
import 'meilisearch';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
async function checkOrchestrator() {
	const url = private_env.ORCHESTRATOR_BASE_URL || private_env.ENCODER_ORCHESTRATOR_URL;
	if (!url) return {
		ok: true,
		latencyMs: 0,
		error: "not_configured"
	};
	return timed(async () => {
		const controller = new AbortController();
		const tid = setTimeout(() => controller.abort(), 2500);
		try {
			const res = await fetch(`${url.replace(/\/+$/, "")}/health`, {
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
	const [dbResult, redisResult, minioResult, meiliResult, orchestratorResult] = await Promise.all([
		checkDb(),
		checkRedis(),
		checkMinio(),
		checkMeili(),
		checkOrchestrator()
	]);
	const healthy = dbResult.ok && redisResult.ok && minioResult.ok && meiliResult.ok && orchestratorResult.ok;
	return json({
		status: healthy ? "ok" : "degraded",
		uptimeSec: Math.round((Date.now() - startedAt) / 1e3),
		db: dbResult,
		redis: redisResult,
		minio: minioResult,
		meili: meiliResult,
		orchestrator: orchestratorResult
	}, { status: healthy ? 200 : 503 });
};

export { GET };
//# sourceMappingURL=_server.ts-DgTbpixG.js.map
