import { ag as user, w as db, Z as ppvPurchases, a as abuseReports, a5 as session } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { or, ilike, eq, and, sql, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/users/+server.ts
/**
* GET /api/admin/users?q=&role=&banned=&limit=&offset=
*
* Audience management endpoint. Admin-only. Returns a list of users with
* derived aggregates: last session, abuse-report count against them,
* PPV purchases lifetime.
*/
var GET = async ({ url, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const q = url.searchParams.get("q")?.trim() ?? "";
	const role = url.searchParams.get("role");
	const banned = url.searchParams.get("banned");
	const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 200);
	const offset = Math.max(parseInt(url.searchParams.get("offset") ?? "0", 10) || 0, 0);
	const conditions = [];
	if (q) conditions.push(or(ilike(user.name, `%${q}%`), ilike(user.email, `%${q}%`)));
	if (role) conditions.push(eq(user.role, role));
	if (banned === "true") conditions.push(eq(user.banned, true));
	if (banned === "false") conditions.push(eq(user.banned, false));
	const where = conditions.length > 0 ? and(...conditions) : void 0;
	return json({ users: await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		banned: user.banned,
		banReason: user.banReason,
		banExpires: user.banExpires,
		image: user.image,
		createdAt: user.createdAt,
		lastSeenAt: sql`(SELECT MAX(${session.expiresAt}) FROM ${session} WHERE ${session.userId} = ${user.id})`,
		abuseReportsAgainst: sql`(SELECT count(*)::int FROM ${abuseReports} WHERE ${abuseReports.targetType} = 'user' AND ${abuseReports.targetId} = ${user.id})`,
		ppvLifetimeCents: sql`coalesce((SELECT sum(${ppvPurchases.amountPaidCents})::int FROM ${ppvPurchases} WHERE ${ppvPurchases.userId} = ${user.id}), 0)`
	}).from(user).where(where).orderBy(desc(user.createdAt)).limit(limit).offset(offset) });
};

export { GET };
//# sourceMappingURL=_server.ts-CePjjJUY.js.map
