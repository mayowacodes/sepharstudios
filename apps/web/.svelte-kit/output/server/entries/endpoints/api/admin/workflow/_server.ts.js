import { json } from "@sveltejs/kit";
import { d as db, v as adminWorkflowRules, b as user } from "../../../../../chunks/drizzle.js";
import { asc, eq } from "drizzle-orm";
async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { session: null, error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { session: null, error: json({ error: "Forbidden" }, { status: 403 }) };
  return { session, error: null };
}
const GET = async ({ locals }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const rules = await db.select().from(adminWorkflowRules).orderBy(asc(adminWorkflowRules.priority));
  return json(rules);
};
const POST = async ({ locals, request }) => {
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
const PATCH = async ({ locals, request }) => {
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
const DELETE = async ({ locals, request }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const payload = await request.json();
  if (!payload.id) return json({ error: "Missing id" }, { status: 400 });
  await db.delete(adminWorkflowRules).where(eq(adminWorkflowRules.id, payload.id));
  return json({ success: true });
};
export {
  DELETE,
  GET,
  PATCH,
  POST
};
