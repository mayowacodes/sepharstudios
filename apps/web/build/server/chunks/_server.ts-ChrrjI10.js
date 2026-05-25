import { j as json } from './index-BcOZ6EV9.js';
import { d as db, x as adminPolicies, c as user } from './drizzle-CW7hPjGG.js';
import { desc, eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}
const GET = async ({ locals }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const policies = await db.select().from(adminPolicies).orderBy(desc(adminPolicies.updatedAt));
  return json(policies);
};
const POST = async ({ locals, request }) => {
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
const PATCH = async ({ locals, request }) => {
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

export { GET, PATCH, POST };
//# sourceMappingURL=_server.ts-ChrrjI10.js.map
