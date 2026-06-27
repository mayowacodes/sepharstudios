import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const contentId = params.id;
	if (!contentId) return json({ error: 'Missing content ID' }, { status: 400 });

	const payload = await request.json() as {
		result: 'approved' | 'rejected' | 'needs_revision' | 'approve_coming_soon';
		feedback?: string;
		rejectionReason?: string;
		publishNow?: boolean;
		// Coming Soon path — admin can edit the release date before
		// approving. Falls back to whatever the creator submitted in
		// scheduledPublishAt when not provided.
		comingSoonReleaseDate?: string;
	};

	let status = 'submitted';
	if (payload.result === 'approved') status = payload.publishNow ? 'published' : 'approved';
	if (payload.result === 'rejected') status = 'rejected';
	if (payload.result === 'approve_coming_soon') status = 'coming_soon';

	const existing = await db
		.select({
			id: mediaLibrary.id,
			videoUrl: mediaLibrary.videoUrl,
			encoderJobId: mediaLibrary.encoderJobId,
			processingStatus: mediaLibrary.processingStatus,
			processingProgress: mediaLibrary.processingProgress,
			processingStage: mediaLibrary.processingStage
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.then(r => r[0]);
	if (!existing) return json({ error: 'Content not found' }, { status: 404 });
	if (payload.result === 'approved' && payload.publishNow && !existing.videoUrl && existing.encoderJobId && existing.processingStatus !== 'ready') {
		// Surface the live encoder state in the error toast so the admin knows
		// roughly how much longer to wait instead of seeing a generic "still
		// processing" message. The client renders the `error` field verbatim.
		const pct = typeof existing.processingProgress === 'number' ? existing.processingProgress : null;
		const stage = existing.processingStage || null;
		const detail =
			pct !== null && stage
				? ` (${stage}, ${pct}%)`
				: pct !== null
					? ` (${pct}%)`
					: stage
						? ` (${stage})`
						: '';
		return json({
			error: `Video is still processing${detail}. Try again in a couple of minutes.`,
			processingStatus: existing.processingStatus,
			processingProgress: pct,
			processingStage: stage
		}, { status: 409 });
	}

	const updatePayload: Record<string, unknown> = {
		status,
		reviewNotes: payload.feedback ?? null,
		rejectionReason: payload.rejectionReason ?? null,
		reviewedAt: new Date(),
		reviewedBy: session.user.id
	};

	if (payload.result === 'approved' && payload.publishNow) updatePayload.isActive = true;
	if (payload.result === 'rejected') updatePayload.isActive = false;
	if (payload.result === 'approve_coming_soon') {
		// Coming Soon rows are publicly visible but not yet playable —
		// isActive stays false so the standard catalog grids filter
		// them out, and a separate Coming-Soon read path picks them up
		// by status='coming_soon'. The scheduled-publish cron flips
		// the row to live when scheduledPublishAt elapses.
		updatePayload.isActive = false;
		if (payload.comingSoonReleaseDate) {
			const ts = Date.parse(payload.comingSoonReleaseDate);
			if (!Number.isNaN(ts)) updatePayload.scheduledPublishAt = new Date(ts);
		}
	}

	await db.update(mediaLibrary).set(updatePayload).where(eq(mediaLibrary.id, contentId));

	return json({ success: true, contentId, status });
};
