import { json, type RequestHandler } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/admin-auth';

export const POST: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	return json({ success: true, message: 'Test email queued' });
};
