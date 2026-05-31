import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import { notify } from '$lib/server/notify';

/**
 * POST /api/admin/content/[id]/assign
 *
 * Assign a media item to a specific admin reviewer. Admin only.
 * Body: { adminId: string }  — must reference a user with role='admin'.
 *
 * DELETE /api/admin/content/[id]/assign — unassign (sets back to null).
 */

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const { error: authError, session } = await requireAdmin(locals);
	if (authError || !session) return authError!;

	const { adminId } = await request.json() as { adminId?: string };
	if (!adminId) return json({ error: 'adminId is required' }, { status: 400 });

	// Confirm the target is actually an admin
	const [target] = await db.select({ id: user.id, role: user.role, name: user.name })
		.from(user)
		.where(eq(user.id, adminId))
		.limit(1);
	if (!target) return json({ error: 'Admin not found' }, { status: 404 });
	if (target.role !== 'admin') {
		return json({ error: 'Target user is not an admin' }, { status: 400 });
	}

	const now = new Date();
	// Record both the assignee (assigned_to) AND the acting admin
	// (assigned_by). Without assigned_by the audit log can't distinguish
	// self-claims from one-admin-stealing-another-admin's-work — the
	// notify() call below sends the assigner's name to the assignee, but
	// nothing was persisting that link until now.
	const [updated] = await db.update(mediaLibrary)
		.set({ assignedTo: adminId, assignedBy: session.user.id, assignedAt: now, updatedAt: now })
		.where(eq(mediaLibrary.id, params.id!))
		.returning({ id: mediaLibrary.id, title: mediaLibrary.title });

	if (!updated) return json({ error: 'Content not found' }, { status: 404 });

	// Notify the assignee (best-effort)
	if (adminId !== session.user.id) {
		await notify({
			userId: adminId,
			kind: 'system',
			title: 'Review assigned to you',
			message: `"${updated.title}" has been assigned to you for review by ${session.user.name ?? 'an admin'}.`,
			actionUrl: `/admin/review/${updated.id}`
		});
	}

	return json({ success: true, assignedTo: adminId, assignedAt: now });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const [updated] = await db.update(mediaLibrary)
		.set({ assignedTo: null, assignedBy: null, assignedAt: null, updatedAt: new Date() })
		.where(eq(mediaLibrary.id, params.id!))
		.returning({ id: mediaLibrary.id });

	if (!updated) return json({ error: 'Content not found' }, { status: 404 });
	return json({ success: true });
};
