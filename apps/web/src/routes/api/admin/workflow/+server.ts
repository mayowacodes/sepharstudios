import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminWorkflowRules } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { asc, eq } from 'drizzle-orm';

async function requireAdmin(locals: App.Locals) {
	const session = await locals.auth.getSession();
	if (!session) return { session: null, error: json({ error: 'Unauthorized' }, { status: 401 }) };
	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return { session: null, error: json({ error: 'Forbidden' }, { status: 403 }) };
	return { session, error: null };
}

export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const rules = await db.select().from(adminWorkflowRules).orderBy(asc(adminWorkflowRules.priority));
	return json(rules);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const payload = await request.json() as {
		name: string;
		description: string;
		conditions: { field: string; operator: string; value: string }[];
		actions: { type: string; target: string; value: string }[];
		isActive: boolean;
		priority: number;
	};

	const [row] = await db.insert(adminWorkflowRules).values({
		name: payload.name,
		description: payload.description,
		conditions: payload.conditions ?? [],
		actions: payload.actions ?? [],
		isActive: payload.isActive ?? true,
		priority: payload.priority ?? 5
	}).returning();

	return json(row);
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const payload = await request.json() as {
		id: string;
		name?: string;
		description?: string;
		conditions?: { field: string; operator: string; value: string }[];
		actions?: { type: string; target: string; value: string }[];
		isActive?: boolean;
		priority?: number;
	};

	if (!payload.id) return json({ error: 'Missing id' }, { status: 400 });

	await db.update(adminWorkflowRules).set({
		name: payload.name,
		description: payload.description,
		conditions: payload.conditions,
		actions: payload.actions,
		isActive: payload.isActive,
		priority: payload.priority,
		updatedAt: new Date()
	}).where(eq(adminWorkflowRules.id, payload.id));

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const payload = await request.json() as { id: string };
	if (!payload.id) return json({ error: 'Missing id' }, { status: 400 });

	await db.delete(adminWorkflowRules).where(eq(adminWorkflowRules.id, payload.id));
	return json({ success: true });
};
