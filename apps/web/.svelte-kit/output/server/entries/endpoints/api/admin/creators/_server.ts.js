import { H as mediaLibrary, T as creators, a as user, gt as transactions, t as db } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { and, eq, ilike, or, sql } from "drizzle-orm";
//#region src/routes/api/admin/creators/+server.ts
var GET = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const search = url.searchParams.get("search")?.trim() ?? "";
	const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") ?? "500", 10)));
	const searchPattern = search ? `%${search.replace(/[%_]/g, (m) => `\\${m}`)}%` : null;
	const baseQuery = db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		image: user.image,
		createdAt: user.createdAt,
		banned: user.banned
	}).from(user);
	const where = searchPattern ? and(eq(user.role, "creator"), or(ilike(user.name, searchPattern), ilike(user.email, searchPattern))) : eq(user.role, "creator");
	const users = await baseQuery.where(where).limit(limit);
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
	return json(users.map((u) => {
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
	}));
};
var PATCH = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const { id, status } = await request.json();
	if (!id || !status) return json({ error: "Missing payload" }, { status: 400 });
	await db.update(user).set({ banned: status === "suspended" }).where(eq(user.id, id));
	return json({ success: true });
};
//#endregion
export { GET, PATCH };
