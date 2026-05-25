import { json } from "@sveltejs/kit";
import { d as db, p as ppvContent } from "../../../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
const POST = async ({ params, request, locals }) => {
  if (locals.user?.role !== "admin") {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  const contentId = params.id;
  const { finalPriceCents, isActive } = await request.json();
  if (!finalPriceCents || finalPriceCents < 99) {
    return json({ error: "Final price must be at least $0.99 (99 cents)" }, { status: 400 });
  }
  const existing = await db.select({ id: ppvContent.id }).from(ppvContent).where(eq(ppvContent.contentId, contentId)).then((r) => r[0]);
  if (existing) {
    await db.update(ppvContent).set({
      finalPriceCents,
      isActive,
      adminApprovedAt: isActive ? /* @__PURE__ */ new Date() : null
    }).where(eq(ppvContent.id, existing.id));
  } else {
    await db.insert(ppvContent).values({
      contentId,
      finalPriceCents,
      isActive,
      adminApprovedAt: isActive ? /* @__PURE__ */ new Date() : null
    });
  }
  return json({ success: true, finalPriceCents, isActive });
};
const DELETE = async ({ params, locals }) => {
  if (locals.user?.role !== "admin") {
    return json({ error: "Forbidden" }, { status: 403 });
  }
  await db.delete(ppvContent).where(eq(ppvContent.contentId, params.id));
  return json({ success: true });
};
export {
  DELETE,
  POST
};
