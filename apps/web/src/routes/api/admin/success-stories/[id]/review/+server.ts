import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { successStories } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import { notify } from '$lib/server/notify';

const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected']);

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const body = await request.json().catch(() => ({})) as {
		status?: string;
		moderationNote?: string;
	};

	if (!body.status || !ALLOWED_STATUSES.has(body.status)) {
		return json({ error: 'Invalid status.' }, { status: 400 });
	}

	const [updated] = await db.update(successStories)
		.set({
			status: body.status,
			moderationNote: body.moderationNote ?? null,
			reviewedAt: new Date()
		})
		.where(eq(successStories.id, params.id!))
		.returning();

	if (!updated) return json({ error: 'Story not found' }, { status: 404 });

	if (updated.userId && body.status !== 'pending') {
		await notify({
			userId: updated.userId,
			kind: 'system',
			title: body.status === 'approved' ? 'Your story was published' : 'Your story was not approved',
			message: body.status === 'approved'
				? 'Thanks for sharing — your testimony is now live for the community.'
				: (body.moderationNote ? `Reason: ${body.moderationNote}` : 'Please review the submission guidelines and try again.'),
			actionUrl: '/creator/success-stories'
		}).catch(() => undefined);
	}

	return json({ success: true, story: updated });
};
