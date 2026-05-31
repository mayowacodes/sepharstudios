import { db } from '$lib/db/drizzle';
import { mediaLibrary, abuseReports, payouts } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';
import type { AgentDescriptor } from './runtime';

/**
 * Anomaly watch agent (R+4).
 *
 * Hourly. Compares last-hour platform metrics to a 24-hour rolling
 * baseline. Opens admin-facing flags when anything looks off:
 *   - new user signups 3× the baseline
 *   - encoder failure rate >25%
 *   - payout failure count > 0
 *   - abuse-report spike (>3× baseline)
 *
 * Flags become `summary` lines on the agent_run — admins read them via the
 * /admin/ai-runs page. No autonomous action; surfacing only.
 */

interface Window {
	hourly: number;
	dailyAvgHourly: number;
}

async function userSignupWindow(): Promise<Window> {
	const hourStart = new Date(Date.now() - 60 * 60 * 1000);
	const dayStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const [hourly] = await db.select({ c: sql<number>`count(*)::int` })
		.from(user)
		.where(gte(user.createdAt, hourStart));
	const [daily] = await db.select({ c: sql<number>`count(*)::int` })
		.from(user)
		.where(gte(user.createdAt, dayStart));
	return { hourly: Number(hourly?.c ?? 0), dailyAvgHourly: Number(daily?.c ?? 0) / 24 };
}

async function encoderFailureRate(): Promise<{ failed: number; total: number; rate: number }> {
	const hourStart = new Date(Date.now() - 60 * 60 * 1000);
	const [totals] = await db.select({
		total: sql<number>`count(*)::int`,
		failed: sql<number>`sum(case when ${mediaLibrary.processingStatus} = 'failed' then 1 else 0 end)::int`
	})
		.from(mediaLibrary)
		.where(gte(mediaLibrary.updatedAt, hourStart));
	const total = Number(totals?.total ?? 0);
	const failed = Number(totals?.failed ?? 0);
	return { failed, total, rate: total > 0 ? failed / total : 0 };
}

async function payoutFailureCount(): Promise<number> {
	const hourStart = new Date(Date.now() - 60 * 60 * 1000);
	const [row] = await db.select({ c: sql<number>`count(*)::int` })
		.from(payouts)
		.where(and(eq(payouts.status, 'failed'), gte(payouts.createdAt, hourStart)));
	return Number(row?.c ?? 0);
}

async function abuseReportWindow(): Promise<Window> {
	const hourStart = new Date(Date.now() - 60 * 60 * 1000);
	const dayStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
	const [hourly] = await db.select({ c: sql<number>`count(*)::int` })
		.from(abuseReports)
		.where(gte(abuseReports.createdAt, hourStart));
	const [daily] = await db.select({ c: sql<number>`count(*)::int` })
		.from(abuseReports)
		.where(gte(abuseReports.createdAt, dayStart));
	return { hourly: Number(hourly?.c ?? 0), dailyAvgHourly: Number(daily?.c ?? 0) / 24 };
}

export const anomalyWatchAgent: AgentDescriptor = {
	name: 'anomaly-watch',
	description: 'Hourly anomaly scan. Surfaces traffic spikes, encoder failure clusters, payout failures, abuse spikes.',
	defaultMaxSteps: 20,
	defaultMaxCostCents: 5,
	async run(ctx) {
		const flags: string[] = [];
		let processed = 0;

		// 1. user signups
		ctx.step('users');
		const signups = await userSignupWindow();
		processed += 1;
		if (signups.hourly > 5 && signups.hourly > signups.dailyAvgHourly * 3) {
			flags.push(`🚀 user signup spike: ${signups.hourly} this hour vs ~${signups.dailyAvgHourly.toFixed(1)}/h baseline`);
		}

		// 2. encoder failures
		ctx.step('encoder');
		const enc = await encoderFailureRate();
		processed += 1;
		if (enc.total >= 5 && enc.rate > 0.25) {
			flags.push(`🎬 encoder failure rate ${(enc.rate * 100).toFixed(0)}% (${enc.failed}/${enc.total}) this hour`);
		}

		// 3. payout failures
		ctx.step('payouts');
		const payFails = await payoutFailureCount();
		processed += 1;
		if (payFails > 0) {
			flags.push(`💸 payout failures: ${payFails} this hour`);
		}

		// 4. abuse spike
		ctx.step('abuse');
		const ab = await abuseReportWindow();
		processed += 1;
		if (ab.hourly > 3 && ab.hourly > ab.dailyAvgHourly * 3) {
			flags.push(`🚨 abuse report spike: ${ab.hourly} this hour vs ~${ab.dailyAvgHourly.toFixed(1)}/h baseline`);
		}

		const summary = flags.length > 0
			? flags.join(' | ')
			: 'All clear. No anomalies detected.';

		return {
			itemsProcessed: processed,
			itemsActioned: flags.length,
			summary
		};
	}
};
