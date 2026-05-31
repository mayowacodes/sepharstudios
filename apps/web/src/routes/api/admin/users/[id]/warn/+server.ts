import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminMessages } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { notify } from '$lib/server/notify';

/**
 * POST /api/admin/users/[id]/warn
 *
 * Issues a formal warning to the user. Implementation: write an
 * `admin_messages` row with `type='warning'`. Surfaces in the creator
 * inbox + as an in-app notification.
 *
 * Body: { subject?, message }
 */

export const POST: RequestHandler = async ({ params, locals, request }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const body = await request.json().catch(() => ({})) as { subject?: string; message?: string };
	const message = body.message?.trim();
	if (!message) return json({ error: 'message is required' }, { status: 400 });

	const [target] = await db.select({ id: user.id, name: user.name }).from(user).where(eq(user.id, params.id!)).limit(1);
	if (!target) return json({ error: 'User not found' }, { status: 404 });

	const subject = body.subject?.trim() || 'Warning from Sephar Studios';

	await db.insert(adminMessages).values({
		creatorId: target.id,
		adminId: locals.user!.id,
		subject,
		message,
		type: 'warning',
		status: 'sent',
		isFromAdmin: true
	});

	notify({
		userId: target.id,
		kind: 'system',
		title: 'You received a warning',
		message: subject,
		actionUrl: '/creator/inbox'
	}).catch(() => undefined);

	return json({ success: true });
};
