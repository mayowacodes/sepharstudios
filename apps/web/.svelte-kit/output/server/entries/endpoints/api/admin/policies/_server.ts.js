import { t as db, u as adminPolicies } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/routes/api/admin/policies/+server.ts
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	return json(await db.select().from(adminPolicies).orderBy(desc(adminPolicies.updatedAt)));
};
var POST = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const payload = await request.json();
	const [row] = await db.insert(adminPolicies).values({
		title: payload.title,
		category: payload.category,
		description: payload.description,
		requirements: payload.requirements ?? [],
		violations: payload.violations ?? [],
		severity: payload.severity ?? "medium",
		isActive: payload.isActive ?? true
	}).returning();
	return json(row);
};
var PATCH = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const payload = await request.json();
	if (!payload.id) return json({ error: "Missing id" }, { status: 400 });
	await db.update(adminPolicies).set({
		title: payload.title,
		category: payload.category,
		description: payload.description,
		requirements: payload.requirements,
		violations: payload.violations,
		severity: payload.severity,
		isActive: payload.isActive,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(adminPolicies.id, payload.id));
	return json({ success: true });
};
//#endregion
export { GET, PATCH, POST };
