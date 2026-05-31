import { db } from '$lib/db/drizzle';
import { mediaLibrary, mediaWatchProgress, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { runAi } from '$lib/server/ai';
import { notify } from '$lib/server/notify';
import { sendEmailAction } from '$lib/authentication/server';
import { SiteMeta } from '$lib/constants';
import type { AgentDescriptor } from './runtime';

/**
 * Content-quality auditor agent (R+4).
 *
 * Quarterly (or on-demand). Picks a handful of creators with significant
 * libraries and looks at their underperforming content. Drafts a short,
 * encouraging coaching note per creator with concrete suggestions and
 * fires it as an in-app notification — the creator opens their inbox and
 * sees a personalized memo.
 *
 * Bounded: at most 10 creators per run. The agent NEVER edits a creator's
 * content directly; it only sends notes.
 */

interface ContentAggregate {
	id: string;
	title: string;
	views: number;
	avgCompletion: number;
}

async function topCreators(limit: number): Promise<Array<{ id: string; userId: string; displayName: string | null; email: string | null; name: string | null }>> {
	const rows = await db.select({
		id: creators.id,
		userId: creators.userId,
		displayName: creators.displayName,
		email: user.email,
		name: user.name,
		count: sql<number>`count(${mediaLibrary.id})::int`
	})
		.from(creators)
		.innerJoin(mediaLibrary, eq(mediaLibrary.creatorId, creators.userId))
		.innerJoin(user, eq(user.id, creators.userId))
		.where(eq(mediaLibrary.isActive, true))
		.groupBy(creators.id, creators.userId, creators.displayName, user.email, user.name)
		.orderBy(desc(sql`count(${mediaLibrary.id})`))
		.limit(limit);
	return rows.map((r) => ({ id: r.id, userId: r.userId, displayName: r.displayName, email: r.email, name: r.name }));
}

async function libraryAggregate(userId: string): Promise<ContentAggregate[]> {
	const rows = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		views: mediaLibrary.viewCount,
		avgCompletion: sql<number>`coalesce(avg(${mediaWatchProgress.completionPercent}), 0)::numeric`
	})
		.from(mediaLibrary)
		.leftJoin(mediaWatchProgress, eq(mediaWatchProgress.contentId, mediaLibrary.id))
		.where(and(eq(mediaLibrary.creatorId, userId), eq(mediaLibrary.isActive, true)))
		.groupBy(mediaLibrary.id, mediaLibrary.title, mediaLibrary.viewCount)
		.orderBy(desc(mediaLibrary.viewCount))
		.limit(50);
	return rows.map((r) => ({
		id: r.id,
		title: r.title,
		views: Number(r.views ?? 0),
		avgCompletion: Number(r.avgCompletion ?? 0)
	}));
}

export const contentQualityAuditorAgent: AgentDescriptor = {
	name: 'content-quality-auditor',
	description: 'Picks ~10 active creators and drafts personalized coaching notes for their underperforming content.',
	defaultMaxSteps: 30,
	defaultMaxCostCents: 200,
	async run(ctx) {
		ctx.step('select-creators');
		const targets = await topCreators(10);
		let actioned = 0;

		for (const c of targets) {
			if (ctx.stepsRemaining() <= 1 || ctx.costRemaining() <= 1) break;
			ctx.step(`audit:${c.displayName ?? c.userId.slice(0, 6)}`);

			const lib = await libraryAggregate(c.userId);
			if (lib.length === 0) continue;

			// Lowest-performing content = 3 with worst views OR completion.
			const worst = [...lib]
				.sort((a, b) => (a.views * (a.avgCompletion + 1)) - (b.views * (b.avgCompletion + 1)))
				.slice(0, 3);

			const result = await runAi({
				userId: null,
				surface: 'agent:content-quality-auditor',
				modelType: 'chat',
				temperature: 0.4,
				maxTokens: 400,
				messages: [
					{
						role: 'system',
						content: 'You write encouraging coaching notes to creators on a Christian streaming platform. Be warm, specific, and actionable.'
					},
					{
						role: 'user',
						content: `Draft a short (3-4 sentence) coaching note to creator "${c.displayName ?? 'creator'}" about these underperforming videos. Mention specific titles. Suggest one or two concrete things they could try.

Underperformers:
${worst.map((w, i) => `${i + 1}. "${w.title}" — ${w.views} views, ${Math.round(w.avgCompletion)}% avg completion`).join('\n')}

Library size: ${lib.length} active videos.
Top performer: "${lib[0]?.title}" with ${lib[0]?.views ?? 0} views.

Plain text. No JSON. No greeting. Direct + warm.`
					}
				]
			});

			if (!result.ok) continue;
			ctx.addCost(result.costCents);

			// Send both an in-app notification (so the creator sees it in
			// their inbox / bell badge) AND an actual email (so it lands in
			// their inbox even if they're not active). Email is best-effort.
			const note = result.content.trim().slice(0, 2000);
			await notify({
				userId: c.userId,
				kind: 'system',
				title: 'Quarterly content review',
				message: note.slice(0, 1000),
				actionUrl: '/creator/analytics'
			}).catch(() => undefined);

			if (c.email) {
				try {
					await sendEmailAction({
						to: c.email,
						subject: `Your quarterly content review on ${SiteMeta.name}`,
						meta: {
							description: `Hi ${c.name ?? c.displayName ?? 'there'},\n\n${note}\n\nReply or open your analytics page for more details.`,
							link: `${SiteMeta.link}/creator/analytics`
						}
					});
				} catch (err) {
					console.warn('[content-quality-auditor] email send failed:', c.email, err);
				}
			}
			actioned += 1;
		}

		return {
			itemsProcessed: targets.length,
			itemsActioned: actioned,
			summary: `Reviewed ${targets.length} creators, sent ${actioned} coaching notes.`
		};
	}
};
