import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminTokenomicsSettings } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

async function requireAdmin(locals: App.Locals) {
	const session = await locals.auth.getSession();
	if (!session) return { error: json({ error: 'Unauthorized' }, { status: 401 }) };
	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return { error: json({ error: 'Forbidden' }, { status: 403 }) };
	return { error: null };
}

export const PATCH: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const payload = await request.json() as { revenueDistribution: Record<string, number> };
	if (!payload?.revenueDistribution) return json({ error: 'Missing distribution' }, { status: 400 });

	const existing = await db.select({ id: adminTokenomicsSettings.id }).from(adminTokenomicsSettings).then(r => r[0]);
	if (existing) {
		await db.update(adminTokenomicsSettings)
			.set({ revenueDistribution: payload.revenueDistribution, updatedAt: new Date() })
			.where(eq(adminTokenomicsSettings.id, existing.id));
	} else {
		await db.insert(adminTokenomicsSettings).values({ revenueDistribution: payload.revenueDistribution });
	}

	return json({ success: true });
};
