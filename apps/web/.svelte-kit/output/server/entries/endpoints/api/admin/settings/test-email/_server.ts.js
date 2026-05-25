import { json } from "@sveltejs/kit";
import { d as db, b as user } from "../../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
const POST = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
  return json({ success: true, message: "Test email queued" });
};
export {
  POST
};
