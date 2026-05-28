import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminTokenomicsSettings } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

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
