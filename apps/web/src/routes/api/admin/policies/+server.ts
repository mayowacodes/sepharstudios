import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminPolicies } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const policies = await db.select().from(adminPolicies).orderBy(desc(adminPolicies.updatedAt));
	return json(policies);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const payload = await request.json() as {
		title: string;
		category: string;
		description: string;
		requirements: string[];
		violations: string[];
		severity: string;
		isActive: boolean;
	};

	const [row] = await db.insert(adminPolicies).values({
		title: payload.title,
		category: payload.category,
		description: payload.description,
		requirements: payload.requirements ?? [],
		violations: payload.violations ?? [],
		severity: payload.severity ?? 'medium',
		isActive: payload.isActive ?? true
	}).returning();

	return json(row);
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const payload = await request.json() as {
		id: string;
		title?: string;
		category?: string;
		description?: string;
		requirements?: string[];
		violations?: string[];
		severity?: string;
		isActive?: boolean;
	};
	if (!payload.id) return json({ error: 'Missing id' }, { status: 400 });

	await db.update(adminPolicies).set({
		title: payload.title,
		category: payload.category,
		description: payload.description,
		requirements: payload.requirements,
		violations: payload.violations,
		severity: payload.severity,
		isActive: payload.isActive,
		updatedAt: new Date()
	}).where(eq(adminPolicies.id, payload.id));

	return json({ success: true });
};
