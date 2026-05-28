import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user } from '$lib/db/schema';
import { Role } from '$lib/constants';
import { eq } from 'drizzle-orm';

const requireAdmin = async (locals: App.Locals) => {
	const session = await locals.auth.getSession();
	if (!session) return { error: json({ status: 'error', message: 'Unauthorized' }, { status: 401 }), session: null };
	if (session.user.role !== Role.ADMIN) {
		return { error: json({ status: 'error', message: 'Forbidden' }, { status: 403 }), session: null };
	}
	return { error: null, session };
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error!;

	const { data } = await request.json() as { data?: Record<string, string> };
	if (!data) return json({ status: 'error', message: 'Missing payload' }, { status: 400 });

	const updatePayload: Record<string, any> = {};
	if (typeof data.name === 'string') updatePayload.name = data.name.trim();
	if (typeof data.role === 'string') {
		const allowedRoles = [Role.ADMIN, Role.EDITOR, Role.CREATOR, Role.USER];
		if (!allowedRoles.includes(data.role as Role)) {
			return json({ status: 'error', message: 'Invalid role' }, { status: 400 });
		}
		// Self-demotion guard: an admin cannot change their own role away from 'admin'.
		// Without this, a single click in the UI locks them out with no recovery path.
		if (params.id === session.user.id && data.role !== Role.ADMIN) {
			return json({
				status: 'error',
				message: 'You cannot change your own role. Ask another admin to do it.'
			}, { status: 400 });
		}
		updatePayload.role = data.role;
	}

	if (Object.keys(updatePayload).length === 0) {
		return json({ status: 'error', message: 'No changes provided' }, { status: 400 });
	}

	const [updated] = await db
		.update(user)
		.set({ ...updatePayload, updatedAt: new Date() })
		.where(eq(user.id, params.id))
		.returning();

	return json({ status: 'success', data: updated });
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error!;

	// Same principle: admins cannot delete their own account through this endpoint.
	if (params.id === session.user.id) {
		return json({
			status: 'error',
			message: 'You cannot delete your own account. Ask another admin to do it.'
		}, { status: 400 });
	}

	await db.delete(user).where(eq(user.id, params.id));
	return json({ status: 'success', message: 'User deleted' });
};
