import { json } from "@sveltejs/kit";
import { d as db, b as user, g as creators, m as mediaLibrary, t as transactions } from "../../../../../chunks/drizzle.js";
import { eq, sql, and } from "drizzle-orm";
const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
  const users = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    banned: user.banned
  }).from(user).where(eq(user.role, "creator"));
  const creatorProfiles = await db.select({
    userId: creators.userId,
    displayName: creators.displayName,
    avatarUrl: creators.avatarUrl,
    isVerified: creators.isVerified
  }).from(creators);
  const contentAgg = await db.select({
    creatorId: mediaLibrary.creatorId,
    contentCount: sql`count(*)`,
    totalViews: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`,
    lastActivity: sql`max(${mediaLibrary.updatedAt})`
  }).from(mediaLibrary).where(sql`${mediaLibrary.creatorId} is not null`).groupBy(mediaLibrary.creatorId);
  const now = /* @__PURE__ */ new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const earningsAgg = await db.select({
    userId: transactions.userId,
    monthlyEarnings: sql`coalesce(sum(${transactions.amount}), 0)`
  }).from(transactions).where(and(eq(transactions.type, "earn"), sql`${transactions.createdAt} >= ${monthStart}`)).groupBy(transactions.userId);
  const profileByUser = new Map(creatorProfiles.map((p) => [p.userId, p]));
  const contentByUser = new Map(contentAgg.map((c) => [c.creatorId, c]));
  const earningsByUser = new Map(earningsAgg.map((e) => [e.userId, e]));
  const payload = users.map((u) => {
    const profile = profileByUser.get(u.id);
    const content = contentByUser.get(u.id);
    const earnings = earningsByUser.get(u.id);
    const name = profile?.displayName || u.name;
    return {
      id: u.id,
      name,
      email: u.email,
      ministryName: profile?.displayName || name,
      joinDate: u.createdAt,
      status: u.banned ? "suspended" : "active",
      contentCount: Number(content?.contentCount ?? 0),
      totalViews: Number(content?.totalViews ?? 0),
      monthlyEarnings: Number(earnings?.monthlyEarnings ?? 0),
      lastActivity: (content?.lastActivity ?? u.createdAt).toISOString(),
      verificationStatus: profile?.isVerified ? "verified" : "pending",
      avatar: profile?.avatarUrl || u.image || "",
      paymentPreference: "fiat",
      revenueShare: 30,
      tier: "standard"
    };
  });
  return json(payload);
};
const PATCH = async ({ locals, request }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
  const { id, status } = await request.json();
  if (!id || !status) return json({ error: "Missing payload" }, { status: 400 });
  await db.update(user).set({ banned: status === "suspended" }).where(eq(user.id, id));
  return json({ success: true });
};
export {
  GET,
  PATCH
};
