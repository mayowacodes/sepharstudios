import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { supportTickets } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import { notify } from '$lib/server/notify';

const ALLOWED_STATUSES = new Set(['open', 'in_progress', 'resolved', 'closed']);

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const body = await request.json().catch(() => ({})) as {
		status?: string;
		adminResponse?: string;
	};

	if (!body.status || !ALLOWED_STATUSES.has(body.status)) {
		return json({ error: 'Invalid status.' }, { status: 400 });
	}

	const updates: Record<string, unknown> = {
		status: body.status,
		updatedAt: new Date()
	};
	if (typeof body.adminResponse === 'string') updates.adminResponse = body.adminResponse;
	if (body.status === 'resolved') updates.resolvedAt = new Date();

	const [updated] = await db.update(supportTickets)
		.set(updates)
		.where(eq(supportTickets.id, params.id!))
		.returning();

	if (!updated) return json({ error: 'Ticket not found' }, { status: 404 });

	if (updated.userId) {
		const responsePart = body.adminResponse ? `\n\nResponse: ${body.adminResponse}` : '';
		await notify({
			userId: updated.userId,
			kind: 'system',
			title: `Support ticket ${body.status === 'resolved' ? 'resolved' : `marked ${body.status}`}`,
			message: `Your ticket "${updated.subject.slice(0, 80)}" is now ${body.status}.${responsePart}`,
			actionUrl: '/creator/tech-support'
		}).catch(() => undefined);
	}

	return json({ success: true, ticket: updated });
};
