import { json } from "@sveltejs/kit";
import { d as db, b as user } from "../../../../../chunks/drizzle.js";
import { R as Role } from "../../../../../chunks/index.js";
import { eq } from "drizzle-orm";
const requireAdmin = async (locals) => {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ status: "error", message: "Unauthorized" }, { status: 401 }) };
  if (session.user.role !== Role.ADMIN) {
    return { error: json({ status: "error", message: "Forbidden" }, { status: 403 }) };
  }
  return { error: null };
};
const PATCH = async ({ locals, params, request }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const { data } = await request.json();
  if (!data) return json({ status: "error", message: "Missing payload" }, { status: 400 });
  const updatePayload = {};
  if (typeof data.name === "string") updatePayload.name = data.name.trim();
  if (typeof data.role === "string") {
    const allowedRoles = [Role.ADMIN, Role.EDITOR, Role.CREATOR, Role.USER];
    if (!allowedRoles.includes(data.role)) {
      return json({ status: "error", message: "Invalid role" }, { status: 400 });
    }
    updatePayload.role = data.role;
  }
  if (Object.keys(updatePayload).length === 0) {
    return json({ status: "error", message: "No changes provided" }, { status: 400 });
  }
  const [updated] = await db.update(user).set({ ...updatePayload, updatedAt: /* @__PURE__ */ new Date() }).where(eq(user.id, params.id)).returning();
  return json({ status: "success", data: updated });
};
const DELETE = async ({ locals, params }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  await db.delete(user).where(eq(user.id, params.id));
  return json({ status: "success", message: "User deleted" });
};
export {
  DELETE,
  PATCH
};
