import { json } from "@sveltejs/kit";
import { d as db, q as adminTokenomicsSettings, b as user } from "../../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}
const PATCH = async ({ locals, request }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const payload = await request.json();
  if (!payload?.revenueDistribution) return json({ error: "Missing distribution" }, { status: 400 });
  const existing = await db.select({ id: adminTokenomicsSettings.id }).from(adminTokenomicsSettings).then((r) => r[0]);
  if (existing) {
    await db.update(adminTokenomicsSettings).set({ revenueDistribution: payload.revenueDistribution, updatedAt: /* @__PURE__ */ new Date() }).where(eq(adminTokenomicsSettings.id, existing.id));
  } else {
    await db.insert(adminTokenomicsSettings).values({ revenueDistribution: payload.revenueDistribution });
  }
  return json({ success: true });
};
export {
  PATCH
};
