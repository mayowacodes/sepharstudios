import { d as db, a7 as adminWorkflowRules } from './drizzle-CsnNxG5m.js';
import { r as requireAdmin } from './admin-auth-5N0bBtTQ.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq, asc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/workflow/+server.ts
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	return json(await db.select().from(adminWorkflowRules).orderBy(asc(adminWorkflowRules.priority)));
};
var POST = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const payload = await request.json();
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
var PATCH = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const payload = await request.json();
	if (!payload.id) return json({ error: "Missing id" }, { status: 400 });
	await db.update(adminWorkflowRules).set({
		name: payload.name,
		description: payload.description,
		conditions: payload.conditions,
		actions: payload.actions,
		isActive: payload.isActive,
		priority: payload.priority,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(adminWorkflowRules.id, payload.id));
	return json({ success: true });
};
var DELETE = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const payload = await request.json();
	if (!payload.id) return json({ error: "Missing id" }, { status: 400 });
	await db.delete(adminWorkflowRules).where(eq(adminWorkflowRules.id, payload.id));
	return json({ success: true });
};

export { DELETE, GET, PATCH, POST };
//# sourceMappingURL=_server.ts-BFLMZGU9.js.map
