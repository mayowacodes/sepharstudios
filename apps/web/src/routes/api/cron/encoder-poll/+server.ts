import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq, inArray, isNotNull, ne } from 'drizzle-orm';
import { getEncoderJob } from '$lib/server/encoder-orchestrator';
import { publish } from '$lib/server/sse';
import { notify } from '$lib/server/notify';

/**
 * POST /api/cron/encoder-poll
 *
 * Pull-only fallback for environments where the orchestrator can't push
 * webhooks yet. Iterates active jobs (status in created/queued/running)
 * and asks the orchestrator for current state. Writes deltas to the row,
 * broadcasts via SSE, and notifies the creator on ready / failed.
 *
 * Auth: CRON_SECRET bearer (same pattern as scheduled-publish + payouts).
 * Schedule: every 30s in the absence of webhooks.
 */

const ACTIVE = ['created', 'queued', 'running', 'not_started'];
const BATCH = 50;

interface OrchestratorStatus {
	status?: string;
	progressPct?: number;
	stage?: string;
	errorMessage?: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: 'Unauthorized' }, { status: 401 });

	const active = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		creatorId: mediaLibrary.creatorId,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		processingProgress: mediaLibrary.processingProgress,
		processingStage: mediaLibrary.processingStage
	})
		.from(mediaLibrary)
		.where(and(
			isNotNull(mediaLibrary.encoderJobId),
			inArray(mediaLibrary.processingStatus, ACTIVE)
		))
		.limit(BATCH);

	const result = { polled: 0, updated: 0, notified: 0, errors: [] as string[] };

	await Promise.all(active.map(async (row) => {
		result.polled += 1;
		if (!row.encoderJobId) return;
		try {
			const orchResp = await getEncoderJob(row.encoderJobId) as OrchestratorStatus;
			const updates: Record<string, unknown> = { updatedAt: new Date() };
			const newStatus = orchResp.status;
			const newProgress = typeof orchResp.progressPct === 'number'
				? Math.max(0, Math.min(100, Math.round(orchResp.progressPct)))
				: undefined;
			const newStage = orchResp.stage;

			let changed = false;
			if (newStatus && newStatus !== row.processingStatus) {
				updates.processingStatus = newStatus;
				changed = true;
			}
			if (newProgress !== undefined && newProgress !== row.processingProgress) {
				updates.processingProgress = newProgress;
				changed = true;
			}
			if (newStage && newStage !== row.processingStage) {
				updates.processingStage = newStage;
				changed = true;
			}
			if (newStatus === 'failed' && orchResp.errorMessage) {
				updates.processingError = orchResp.errorMessage.slice(0, 2000);
				changed = true;
			}
			if (newStatus === 'ready') {
				updates.processingProgress = 100;
				updates.processingError = null;
				changed = true;
			}
			if (!changed) return;

			await db.update(mediaLibrary)
				.set(updates)
				.where(eq(mediaLibrary.id, row.id));
			result.updated += 1;

			const event = {
				jobId: row.encoderJobId,
				mediaId: row.id,
				creatorId: row.creatorId,
				status: updates.processingStatus ?? row.processingStatus,
				progress: updates.processingProgress ?? row.processingProgress ?? 0,
				stage: updates.processingStage ?? row.processingStage,
				error: updates.processingError ?? null
			};
			publish('encoder:all', event);
			if (row.creatorId) publish(`encoder:creator:${row.creatorId}`, event);

			if (row.creatorId && (newStatus === 'ready' || newStatus === 'failed')) {
				notify({
					userId: row.creatorId,
					kind: 'system',
					title: newStatus === 'ready'
						? `"${row.title.slice(0, 60)}" is ready to publish`
						: `Encoding failed for "${row.title.slice(0, 60)}"`,
					message: newStatus === 'failed' && orchResp.errorMessage
						? orchResp.errorMessage.slice(0, 200)
						: 'Open the content detail page to continue.',
					actionUrl: `/creator/content/${row.id}`
				}).catch(() => undefined);
				result.notified += 1;
			}
		} catch (err) {
			result.errors.push(`${row.id}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}));

	return json({ ok: true, ...result });
};
