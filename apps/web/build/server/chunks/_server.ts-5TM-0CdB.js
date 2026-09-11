import { d as db, Q as playbackTelemetry, m as mediaLibrary, h as aiCostLedger, R as adCampaignDaily } from './drizzle-C3SH12nS.js';
import { r as requireAdmin } from './admin-auth-C5lShqv4.js';
import { j as json } from './index.js-CxPEndTa.js';
import { sql, gte, and, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/observability/+server.ts
/**
* GET /api/admin/observability?days=7 → the operational dashboard payload.
*
* The Xepho §34 metric table, minus the rows that only apply to generated
* video. What is left is the set that says whether THIS platform is healthy:
* did playback work, what did AI cost, and are ads rendering.
*
* Everything here is an aggregate over a bounded window. None of these queries
* should ever return per-row data to the browser — the tables behind them grow
* without limit and a dashboard that streams raw rows becomes the outage.
*/
var GET = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;
	const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days") ?? 7)));
	const since = /* @__PURE__ */ new Date(Date.now() - days * 864e5);
	const [playback] = await db.select({
		sessions: sql`count(*)::int`,
		erroredSessions: sql`sum(CASE WHEN ${playbackTelemetry.errorCount} > 0 THEN 1 ELSE 0 END)::int`,
		fatalSessions: sql`sum(CASE WHEN ${playbackTelemetry.fatalError} IS NOT NULL THEN 1 ELSE 0 END)::int`,
		stalledSessions: sql`sum(CASE WHEN ${playbackTelemetry.stallCount} > 0 THEN 1 ELSE 0 END)::int`,
		avgStartupMs: sql`coalesce(avg(nullif(${playbackTelemetry.startupMs}, 0)), 0)::int`,
		avgBitrateKbps: sql`coalesce(avg(nullif(${playbackTelemetry.effectiveBitrateKbps}, 0)), 0)::int`,
		audioOnlySessions: sql`sum(CASE WHEN ${playbackTelemetry.finalQuality} = 'audio' THEN 1 ELSE 0 END)::int`
	}).from(playbackTelemetry).where(gte(playbackTelemetry.createdAt, since));
	const byGeo = await db.select({
		country: playbackTelemetry.country,
		deviceType: playbackTelemetry.deviceType,
		sessions: sql`count(*)::int`,
		avgBitrateKbps: sql`coalesce(avg(nullif(${playbackTelemetry.effectiveBitrateKbps}, 0)), 0)::int`,
		erroredSessions: sql`sum(CASE WHEN ${playbackTelemetry.errorCount} > 0 THEN 1 ELSE 0 END)::int`
	}).from(playbackTelemetry).where(gte(playbackTelemetry.createdAt, since)).groupBy(playbackTelemetry.country, playbackTelemetry.deviceType).orderBy(sql`3 desc`).limit(50);
	const encodeStatus = await db.select({
		status: mediaLibrary.processingStatus,
		count: sql`count(*)::int`
	}).from(mediaLibrary).where(gte(mediaLibrary.updatedAt, since)).groupBy(mediaLibrary.processingStatus);
	const encodeFailures = await db.select({
		reason: sql`left(coalesce(${mediaLibrary.processingError}, 'unknown'), 120)`,
		count: sql`count(*)::int`
	}).from(mediaLibrary).where(and(gte(mediaLibrary.updatedAt, since), eq(mediaLibrary.processingStatus, "failed"))).groupBy(sql`1`).orderBy(sql`2 desc`).limit(20);
	const [aiCost] = await db.select({
		calls: sql`count(*)::int`,
		microUsd: sql`coalesce(sum(coalesce(${aiCostLedger.actualMicroUsd}, ${aiCostLedger.estimatedMicroUsd})), 0)::bigint`,
		refused: sql`sum(CASE WHEN ${aiCostLedger.status} = 'refused' THEN 1 ELSE 0 END)::int`,
		failed: sql`sum(CASE WHEN ${aiCostLedger.status} = 'failed' THEN 1 ELSE 0 END)::int`
	}).from(aiCostLedger).where(gte(aiCostLedger.createdAt, since));
	const [ads] = await db.select({
		served: sql`coalesce(sum(${adCampaignDaily.served}), 0)::int`,
		started: sql`coalesce(sum(${adCampaignDaily.started}), 0)::int`,
		completed: sql`coalesce(sum(${adCampaignDaily.completed}), 0)::int`
	}).from(adCampaignDaily).where(gte(adCampaignDaily.day, since.toISOString().slice(0, 10)));
	const sessions = playback?.sessions ?? 0;
	const rate = (n) => sessions ? (n ?? 0) / sessions : 0;
	return json({
		days,
		playback: {
			sessions,
			errorRate: rate(playback?.erroredSessions),
			fatalRate: rate(playback?.fatalSessions),
			stallRate: rate(playback?.stalledSessions),
			avgStartupMs: playback?.avgStartupMs ?? 0,
			avgBitrateKbps: playback?.avgBitrateKbps ?? 0,
			audioOnlyRate: rate(playback?.audioOnlySessions)
		},
		byGeo,
		encode: {
			byStatus: encodeStatus,
			topFailures: encodeFailures
		},
		ai: {
			calls: aiCost?.calls ?? 0,
			usd: Number(aiCost?.microUsd ?? 0) / 1e6,
			refusedCalls: aiCost?.refused ?? 0,
			failedCalls: aiCost?.failed ?? 0
		},
		ads: {
			served: ads?.served ?? 0,
			started: ads?.started ?? 0,
			completed: ads?.completed ?? 0,
			renderRate: ads?.served ? (ads.started ?? 0) / ads.served : 0
		}
	});
};

export { GET };
//# sourceMappingURL=_server.ts-5TM-0CdB.js.map
