import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { playbackTelemetry, aiCostLedger, adCampaignDaily, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, gte, sql, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

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
export const GET: RequestHandler = async ({ locals, url }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const days = Math.min(90, Math.max(1, Number(url.searchParams.get('days') ?? 7)));
	const since = new Date(Date.now() - days * 86400_000);

	// ── Playback health ───────────────────────────────────────────────────
	//
	// Error RATE, not error count: a raw count rises with traffic and looks
	// like a regression during a successful launch. The rate is what tells you
	// whether the experience changed.
	const [playback] = await db
		.select({
			sessions: sql<number>`count(*)::int`,
			erroredSessions: sql<number>`sum(CASE WHEN ${playbackTelemetry.errorCount} > 0 THEN 1 ELSE 0 END)::int`,
			fatalSessions: sql<number>`sum(CASE WHEN ${playbackTelemetry.fatalError} IS NOT NULL THEN 1 ELSE 0 END)::int`,
			stalledSessions: sql<number>`sum(CASE WHEN ${playbackTelemetry.stallCount} > 0 THEN 1 ELSE 0 END)::int`,
			avgStartupMs: sql<number>`coalesce(avg(nullif(${playbackTelemetry.startupMs}, 0)), 0)::int`,
			avgBitrateKbps: sql<number>`coalesce(avg(nullif(${playbackTelemetry.effectiveBitrateKbps}, 0)), 0)::int`,
			audioOnlySessions: sql<number>`sum(CASE WHEN ${playbackTelemetry.finalQuality} = 'audio' THEN 1 ELSE 0 END)::int`
		})
		.from(playbackTelemetry)
		.where(gte(playbackTelemetry.createdAt, since));

	// By geography and device — the dimension that turns "playback is worse"
	// into "playback is worse in this country, on this device class".
	const byGeo = await db
		.select({
			country: playbackTelemetry.country,
			deviceType: playbackTelemetry.deviceType,
			sessions: sql<number>`count(*)::int`,
			avgBitrateKbps: sql<number>`coalesce(avg(nullif(${playbackTelemetry.effectiveBitrateKbps}, 0)), 0)::int`,
			erroredSessions: sql<number>`sum(CASE WHEN ${playbackTelemetry.errorCount} > 0 THEN 1 ELSE 0 END)::int`
		})
		.from(playbackTelemetry)
		.where(gte(playbackTelemetry.createdAt, since))
		.groupBy(playbackTelemetry.country, playbackTelemetry.deviceType)
		.orderBy(sql`3 desc`)
		.limit(50);

	// ── Encode health ─────────────────────────────────────────────────────
	const encodeStatus = await db
		.select({
			status: mediaLibrary.processingStatus,
			count: sql<number>`count(*)::int`
		})
		.from(mediaLibrary)
		.where(gte(mediaLibrary.updatedAt, since))
		.groupBy(mediaLibrary.processingStatus);

	// Failure reasons, so a recurring encode fault is visible as a pattern
	// rather than as a number that went up.
	const encodeFailures = await db
		.select({
			reason: sql<string>`left(coalesce(${mediaLibrary.processingError}, 'unknown'), 120)`,
			count: sql<number>`count(*)::int`
		})
		.from(mediaLibrary)
		.where(and(gte(mediaLibrary.updatedAt, since), eq(mediaLibrary.processingStatus, 'failed')))
		.groupBy(sql`1`)
		.orderBy(sql`2 desc`)
		.limit(20);

	// ── AI cost ───────────────────────────────────────────────────────────
	const [aiCost] = await db
		.select({
			calls: sql<number>`count(*)::int`,
			microUsd: sql<number>`coalesce(sum(coalesce(${aiCostLedger.actualMicroUsd}, ${aiCostLedger.estimatedMicroUsd})), 0)::bigint`,
			refused: sql<number>`sum(CASE WHEN ${aiCostLedger.status} = 'refused' THEN 1 ELSE 0 END)::int`,
			failed: sql<number>`sum(CASE WHEN ${aiCostLedger.status} = 'failed' THEN 1 ELSE 0 END)::int`
		})
		.from(aiCostLedger)
		.where(gte(aiCostLedger.createdAt, since));

	// ── Ad delivery ───────────────────────────────────────────────────────
	const [ads] = await db
		.select({
			served: sql<number>`coalesce(sum(${adCampaignDaily.served}), 0)::int`,
			started: sql<number>`coalesce(sum(${adCampaignDaily.started}), 0)::int`,
			completed: sql<number>`coalesce(sum(${adCampaignDaily.completed}), 0)::int`
		})
		.from(adCampaignDaily)
		.where(gte(adCampaignDaily.day, since.toISOString().slice(0, 10)));

	const sessions = playback?.sessions ?? 0;
	const rate = (n: number | undefined) => (sessions ? (n ?? 0) / sessions : 0);

	return json({
		days,
		playback: {
			sessions,
			errorRate: rate(playback?.erroredSessions),
			fatalRate: rate(playback?.fatalSessions),
			stallRate: rate(playback?.stalledSessions),
			avgStartupMs: playback?.avgStartupMs ?? 0,
			avgBitrateKbps: playback?.avgBitrateKbps ?? 0,
			// Share of sessions that ended on the audio-only rung: the measure
			// of whether the low-bandwidth lever is actually being used, not
			// merely present.
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
			// A rising refusal count means a ceiling is too low. Charted apart
			// from spend, because on a spend chart alone it looks like usage
			// simply fell.
			refusedCalls: aiCost?.refused ?? 0,
			failedCalls: aiCost?.failed ?? 0
		},
		ads: {
			served: ads?.served ?? 0,
			started: ads?.started ?? 0,
			completed: ads?.completed ?? 0,
			// served → started is predominantly ad-blocking.
			renderRate: ads?.served ? (ads.started ?? 0) / ads.served : 0
		}
	});
};
