import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { runContentScan } from '$lib/server/content-scan';

/**
 * POST /api/admin/content/[id]/rescan
 *
 * Manually re-fire the AI content scan. Useful when the AI verdict was
 * unparseable, the AI provider was down at scan time, or the belief
 * statement was updated and the admin wants a fresh take.
 *
 * Requires the row to already have transcript artifacts (either in the
 * new `subtitles[]` shape or the legacy `transcript` shape) — we don't
 * re-trigger the orchestrator from here.
 */

export const POST: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [row] = await db.select({
		id: mediaLibrary.id,
		contentScanReport: mediaLibrary.contentScanReport
	})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id!))
		.limit(1);

	if (!row) return json({ error: 'Not found' }, { status: 404 });
	const report = row.contentScanReport;
	const hasSubtitleTrack = Array.isArray(report?.subtitles) && report.subtitles.some((s) => s.txtUrl || s.vttUrl);
	const hasLegacyTranscript = !!(report?.transcript?.txtUrl || report?.transcript?.vttUrl);
	if (!hasSubtitleTrack && !hasLegacyTranscript) {
		return json({ error: 'No transcript artifact available — rescan requires the orchestrator to deliver scan artifacts first.' }, { status: 400 });
	}

	await db.update(mediaLibrary)
		.set({
			contentScanStatus: 'in_progress',
			updatedAt: new Date()
		})
		.where(eq(mediaLibrary.id, row.id));

	const id = row.id;
	queueMicrotask(() => {
		void runContentScan(id).catch((err) => {
			console.error(`[rescan] runContentScan failed for ${id}:`, err);
		});
	});

	return json({ ok: true });
};
