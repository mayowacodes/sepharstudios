import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { runAi, tryParseJson } from '$lib/server/ai';
import type { AgentDescriptor } from './runtime';

/**
 * Theology monitor agent (R+4).
 *
 * Daily. Re-evaluates recently published content against the platform's
 * core belief statement (passed via the `PLATFORM_BELIEF_STATEMENT` env
 * var). Flags any title whose AI-evaluated alignment score drops below a
 * threshold. Flags surface in the agent_run summary; no auto-action.
 *
 * Keeps the platform aligned to its statement of faith without an admin
 * needing to manually re-review existing content each time the statement
 * is updated.
 */

const DEFAULT_BELIEF_STATEMENT = `Sephar Studios platform standard: content should align with mainstream historical Christian doctrine — the divinity of Jesus Christ, the authority of Scripture, salvation through faith. Family-safe; reverent tone; no doctrinal contradiction.`;

import { env } from '$env/dynamic/private';

export const theologyMonitorAgent: AgentDescriptor = {
	name: 'theology-monitor',
	description: 'Daily. Re-evaluates recently published content against the platform belief statement. Flags doctrinal drift.',
	defaultMaxSteps: 60,
	defaultMaxCostCents: 100,
	async run(ctx) {
		ctx.step('load');
		const belief = env.PLATFORM_BELIEF_STATEMENT?.trim() || DEFAULT_BELIEF_STATEMENT;
		const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

		const recent = await db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			genres: mediaLibrary.genres,
			bibleReference: mediaLibrary.bibleReference
		})
			.from(mediaLibrary)
			.where(and(
				eq(mediaLibrary.status, 'published'),
				gte(mediaLibrary.updatedAt, since)
			))
			.orderBy(desc(mediaLibrary.updatedAt))
			.limit(50);

		const flags: Array<{ id: string; title: string; score: number; reason: string }> = [];

		for (const r of recent) {
			if (ctx.stepsRemaining() <= 1 || ctx.costRemaining() <= 1) break;
			ctx.step(`eval:${r.id.slice(0, 6)}`);

			const result = await runAi({
				userId: null,
				surface: 'agent:theology-monitor',
				modelType: 'agent',
				temperature: 0.1,
				maxTokens: 256,
				messages: [
					{
						role: 'system',
						content: 'You evaluate Christian-platform content for doctrinal alignment. Be charitable but precise.'
					},
					{
						role: 'user',
						content: `Belief statement:
"""${belief}"""

Content under review:
Title: "${r.title}"
Description: """${(r.description ?? '').slice(0, 800)}"""
Genres: ${Array.isArray(r.genres) ? r.genres.join(', ') : ''}
Bible reference: ${r.bibleReference ?? '—'}

Return ONLY this JSON:
{ "score": 0-10, "concern": "short reason or empty string" }

Score guide:
- 9-10: clearly aligned
- 6-8: aligned, minor questions
- 3-5: meaningful concerns (false teaching, sensationalism)
- 0-2: directly contradicts core doctrine

Only flag (score <= 6) when there is real doctrinal concern, not stylistic differences.`
					}
				]
			});

			if (!result.ok) continue;
			ctx.addCost(result.costCents);

			const parsed = tryParseJson<{ score?: number; concern?: string }>(result.content);
			const score = Number(parsed?.score ?? 10);
			const reason = parsed?.concern ?? '';
			if (score <= 6) {
				flags.push({ id: r.id, title: r.title, score, reason });
			}
		}

		const summary = flags.length > 0
			? `Flagged ${flags.length}/${recent.length} recent titles: ${flags.slice(0, 5).map((f) => `"${f.title}" (${f.score}/10)`).join('; ')}${flags.length > 5 ? '…' : ''}`
			: `Scanned ${recent.length} recent titles. No doctrinal drift detected.`;

		return {
			itemsProcessed: recent.length,
			itemsActioned: flags.length,
			summary
		};
	}
};
