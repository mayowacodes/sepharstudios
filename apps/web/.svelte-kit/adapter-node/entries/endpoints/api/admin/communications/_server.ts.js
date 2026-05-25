import { json } from "@sveltejs/kit";
import { d as db, b as user, c as adminMessages, m as mediaLibrary } from "../../../../../chunks/drizzle.js";
import { eq, desc, inArray } from "drizzle-orm";
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
  const rows = await db.select({
    id: adminMessages.id,
    contentId: adminMessages.contentId,
    contentTitle: mediaLibrary.title,
    creatorId: adminMessages.creatorId,
    adminId: adminMessages.adminId,
    subject: adminMessages.subject,
    message: adminMessages.message,
    type: adminMessages.type,
    status: adminMessages.status,
    isFromAdmin: adminMessages.isFromAdmin,
    attachments: adminMessages.attachments,
    createdAt: adminMessages.createdAt,
    creatorName: user.name,
    creatorEmail: user.email
  }).from(adminMessages).leftJoin(user, eq(adminMessages.creatorId, user.id)).leftJoin(mediaLibrary, eq(adminMessages.contentId, mediaLibrary.id)).orderBy(desc(adminMessages.createdAt));
  const adminIds = rows.map((r) => r.adminId).filter(Boolean);
  const admins = adminIds.length ? await db.select({ id: user.id, name: user.name }).from(user).where(inArray(user.id, adminIds)) : [];
  const adminNameMap = new Map(admins.map((a) => [a.id, a.name]));
  return json(rows.map((r) => ({
    ...r,
    adminName: r.adminId ? adminNameMap.get(r.adminId) ?? "Admin" : void 0
  })));
};
const POST = async ({ locals, request }) => {
  const { session, error } = await requireAdmin(locals);
  if (error || !session) return error;
  const payload = await request.json();
  if (!payload.creatorId || !payload.subject || !payload.message) {
    return json({ error: "Missing required fields" }, { status: 400 });
  }
  const [row] = await db.insert(adminMessages).values({
    creatorId: payload.creatorId,
    contentId: payload.contentId,
    subject: payload.subject,
    message: payload.message,
    type: payload.type ?? "general",
    status: "sent",
    isFromAdmin: true,
    adminId: session.user.id,
    attachments: payload.attachments ?? []
  }).returning();
  return json({ success: true, id: row.id });
};
const PATCH = async ({ locals, request }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const payload = await request.json();
  if (!payload.id || !payload.status) return json({ error: "Missing payload" }, { status: 400 });
  await db.update(adminMessages).set({ status: payload.status }).where(eq(adminMessages.id, payload.id));
  return json({ success: true });
};
export {
  GET,
  PATCH,
  POST
};
