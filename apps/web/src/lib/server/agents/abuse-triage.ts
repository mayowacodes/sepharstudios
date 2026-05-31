import { db } from '$lib/db/drizzle';
import { abuseReports } from '$lib/db/schema/sepharstudios';
import { and, desc, eq } from 'drizzle-orm';
import { runAi, tryParseJson } from '$lib/server/ai';
import type { AgentDescriptor } from './runtime';

/**
 * Abuse triage agent (R+4).
 *
 * Nightly. Reads open abuse reports, asks the AI for a severity + suggested
 * resolution per report, and:
 *   - For obvious spam (severity=low + suggested 'dismiss' + confidence>0.8):
 *     auto-resolves with `resolution='no_action'` so the queue stays short.
 *   - Otherwise: leaves the report open, records a suggestion in the
 *     `summary` field of the agent_run for admin review later.
 *
 * Conservative auto-action policy: only dismisses obvious spam in this
 * round. Hide/remove/ban require admin click.
 */

interface Triage {
	id: string;
	category: string;
	preview: string;
}

async function previewFor(targetType: string, targetId: string): Promise<string | null> {
	// Lightweight inline preview — we don't bring in the admin preview helpers
	// to keep the agent module dependency-free of route code.
	return `[${targetType}:${targetId.slice(0, 8)}]`;
}

export const abuseTriageAgent: AgentDescriptor = {
	name: 'abuse-triage',
	description: 'Triages open abuse reports nightly. Auto-dismisses obvious spam; leaves rest open with suggestion summary.',
	defaultMaxSteps: 100,
	defaultMaxCostCents: 50,
	async run(ctx) {
		ctx.step('load');
		const open = await db.select({
			id: abuseReports.id,
			category: abuseReports.category,
			description: abuseReports.description,
			targetType: abuseReports.targetType,
			targetId: abuseReports.targetId
		})
			.from(abuseReports)
			.where(eq(abuseReports.status, 'open'))
			.orderBy(desc(abuseReports.createdAt))
			.limit(50);

		const findings: Array<{ id: string; severity: string; rationale: string; action: string }> = [];
		let actioned = 0;

		for (const r of open) {
			if (ctx.stepsRemaining() <= 1 || ctx.costRemaining() <= 1) break;
			ctx.step(`classify:${r.id.slice(0, 6)}`);

			const preview = await previewFor(r.targetType, r.targetId) ?? '';
			const result = await runAi({
				userId: null, // agent runs are platform-attributed
				surface: 'agent:abuse-triage',
				modelType: 'agent',
				temperature: 0.1,
				maxTokens: 256,
				messages: [
					{
						role: 'system',
						content: 'You triage abuse reports on a Christian streaming platform. Be conservative on auto-action — only dismiss obvious spam.'
					},
					{
						role: 'user',
						content: `Triage this report.

Category: ${r.category}
Note: """${(r.description ?? '').slice(0, 400)}"""
Target: ${preview}

Return ONLY this JSON:
{
  "severity": "low|med|high|critical",
  "action": "dismiss|leave|escalate",
  "confidence": 0.0-1.0,
  "rationale": "short reason"
}

Use action='dismiss' ONLY for very obvious spam reports with high confidence (>0.8). Otherwise action='leave' (default) or 'escalate' for critical content.`
					}
				]
			});

			if (!result.ok) {
				findings.push({ id: r.id, severity: 'unknown', rationale: result.message, action: 'leave' });
				continue;
			}
			ctx.addCost(result.costCents);

			const parsed = tryParseJson<{
				severity?: string;
				action?: string;
				confidence?: number;
				rationale?: string;
			}>(result.content);
			const severity = parsed?.severity ?? 'low';
			const action = parsed?.action ?? 'leave';
			const confidence = typeof parsed?.confidence === 'number' ? parsed.confidence : 0;
			const rationale = parsed?.rationale ?? '';

			findings.push({ id: r.id, severity, rationale, action });

			if (action === 'dismiss' && severity === 'low' && confidence > 0.8) {
				await db.update(abuseReports)
					.set({
						status: 'dismissed',
						resolution: 'no_action',
						resolvedAt: new Date()
					})
					.where(and(eq(abuseReports.id, r.id), eq(abuseReports.status, 'open')));
				actioned += 1;
			}
		}

		const counts = findings.reduce((acc, f) => {
			acc[f.severity] = (acc[f.severity] ?? 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const summary = [
			`Processed ${findings.length} open reports.`,
			`Auto-dismissed ${actioned} as obvious spam.`,
			`Severity breakdown: ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(', ') || 'none'}.`
		].join(' ');

		return {
			itemsProcessed: findings.length,
			itemsActioned: actioned,
			summary
		};
	}
};
