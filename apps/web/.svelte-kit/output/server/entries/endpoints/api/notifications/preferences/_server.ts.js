import { json } from "@sveltejs/kit";
import { d as db, n as notificationPreferences } from "../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const [prefs] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, session.user.id)).limit(1);
  if (!prefs) {
    return json({ newReleases: true, trialExpiry: true, paymentConfirmation: true, weeklyDigest: false, creatorUpdates: false });
  }
  return json(prefs);
};
const PUT = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  const [existing] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, session.user.id)).limit(1);
  if (existing) {
    const [updated] = await db.update(notificationPreferences).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(notificationPreferences.userId, session.user.id)).returning();
    return json(updated);
  }
  const [created] = await db.insert(notificationPreferences).values({ userId: session.user.id, ...data }).returning();
  return json(created);
};
export {
  GET,
  PUT
};
