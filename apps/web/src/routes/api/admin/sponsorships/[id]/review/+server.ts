import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { sponsorshipApplications } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import { notify } from '$lib/server/notify';

const ALLOWED_STATUSES = new Set(['pending', 'reviewing', 'approved', 'rejected']);

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const body = await request.json().catch(() => ({})) as {
		status?: string;
		adminNote?: string;
	};

	if (!body.status || !ALLOWED_STATUSES.has(body.status)) {
		return json({ error: 'Invalid status.' }, { status: 400 });
	}

	const [updated] = await db.update(sponsorshipApplications)
		.set({
			status: body.status,
			adminNote: body.adminNote ?? null,
			reviewedAt: new Date()
		})
		.where(eq(sponsorshipApplications.id, params.id!))
		.returning();

	if (!updated) return json({ error: 'Application not found' }, { status: 404 });

	if (updated.userId && body.status !== 'pending') {
		const title = body.status === 'approved'
			? `Your sponsorship pitch was approved`
			: body.status === 'rejected'
				? `Your sponsorship pitch was declined`
				: `Your sponsorship pitch is under review`;
		await notify({
			userId: updated.userId,
			kind: 'system',
			title,
			message: body.adminNote ?? `We'll follow up via email at ${updated.contactEmail ?? 'your account email'}.`,
			actionUrl: '/sponsorships'
		}).catch(() => undefined);
	}

	return json({ success: true, application: updated });
};
