import { json } from "@sveltejs/kit";
import { d as db, r as reviews } from "../../../../../chunks/drizzle.js";
import { eq, desc } from "drizzle-orm";
const GET = async ({ url, locals }) => {
  if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
  const approvedParam = url.searchParams.get("approved");
  const rows = await db.select().from(reviews).where(approvedParam === "false" ? eq(reviews.isApproved, false) : void 0).orderBy(desc(reviews.createdAt)).limit(50);
  return json(rows);
};
const PATCH = async ({ request, locals }) => {
  if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
  const { id, isApproved } = await request.json();
  if (!id) return json({ error: "id required" }, { status: 400 });
  const [updated] = await db.update(reviews).set({ isApproved, updatedAt: /* @__PURE__ */ new Date() }).where(eq(reviews.id, id)).returning({ id: reviews.id, isApproved: reviews.isApproved });
  return json(updated);
};
const DELETE = async ({ request, locals }) => {
  if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
  const { id } = await request.json();
  if (!id) return json({ error: "id required" }, { status: 400 });
  await db.delete(reviews).where(eq(reviews.id, id));
  return json({ success: true });
};
export {
  DELETE,
  GET,
  PATCH
};
