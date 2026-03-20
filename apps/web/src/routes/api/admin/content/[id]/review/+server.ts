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
		result: 'approved' | 'rejected' | 'needs_revision';
		feedback?: string;
		rejectionReason?: string;
		publishNow?: boolean;
	};

	let status = 'submitted';
	if (payload.result === 'approved') status = payload.publishNow ? 'published' : 'approved';
	if (payload.result === 'rejected') status = 'rejected';

	const existing = await db
		.select({ id: mediaLibrary.id })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.then(r => r[0]);
	if (!existing) return json({ error: 'Content not found' }, { status: 404 });

	const updatePayload: Record<string, unknown> = {
		status,
		reviewNotes: payload.feedback ?? null,
		rejectionReason: payload.rejectionReason ?? null,
		reviewedAt: new Date(),
		reviewedBy: session.user.id
	};

	if (payload.result === 'approved' && payload.publishNow) updatePayload.isActive = true;
	if (payload.result === 'rejected') updatePayload.isActive = false;

	await db.update(mediaLibrary).set(updatePayload).where(eq(mediaLibrary.id, contentId));

	return json({ success: true, contentId, status });
};
