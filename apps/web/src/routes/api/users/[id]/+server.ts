import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user } from '$lib/db/schema';
import { Role } from '$lib/constants';
import { eq } from 'drizzle-orm';

const requireAdmin = async (locals: App.Locals) => {
	const session = await locals.auth.getSession();
	if (!session) return { error: json({ status: 'error', message: 'Unauthorized' }, { status: 401 }) };
	if (session.user.role !== Role.ADMIN) {
		return { error: json({ status: 'error', message: 'Forbidden' }, { status: 403 }) };
	}
	return { error: null };
};

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const { data } = await request.json() as { data?: Record<string, string> };
	if (!data) return json({ status: 'error', message: 'Missing payload' }, { status: 400 });

	const updatePayload: Record<string, any> = {};
	if (typeof data.name === 'string') updatePayload.name = data.name.trim();
	if (typeof data.role === 'string') {
		const allowedRoles = [Role.ADMIN, Role.EDITOR, Role.CREATOR, Role.USER];
		if (!allowedRoles.includes(data.role as Role)) {
			return json({ status: 'error', message: 'Invalid role' }, { status: 400 });
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
	const { error } = await requireAdmin(locals);
	if (error) return error;

	await db.delete(user).where(eq(user.id, params.id));
	return json({ status: 'success', message: 'User deleted' });
};
