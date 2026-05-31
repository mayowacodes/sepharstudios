import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user, session } from '$lib/db/schema';
import { abuseReports, ppvPurchases } from '$lib/db/schema/sepharstudios';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';

/**
 * GET /api/admin/users?q=&role=&banned=&limit=&offset=
 *
 * Audience management endpoint. Admin-only. Returns a list of users with
 * derived aggregates: last session, abuse-report count against them,
 * PPV purchases lifetime.
 */

export const GET: RequestHandler = async ({ url, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const q = url.searchParams.get('q')?.trim() ?? '';
	const role = url.searchParams.get('role');
	const banned = url.searchParams.get('banned');
	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10) || 50, 200);
	const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0', 10) || 0, 0);

	const conditions = [];
	if (q) conditions.push(or(ilike(user.name, `%${q}%`), ilike(user.email, `%${q}%`))!);
	if (role) conditions.push(eq(user.role, role));
	if (banned === 'true') conditions.push(eq(user.banned, true));
	if (banned === 'false') conditions.push(eq(user.banned, false));
	const where = conditions.length > 0 ? and(...conditions) : undefined;

	// Aggregate sub-queries inlined as columns.
	const rows = await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		banned: user.banned,
		banReason: user.banReason,
		banExpires: user.banExpires,
		image: user.image,
		createdAt: user.createdAt,
		// Last session — `session.expiresAt` is the freshest signal we have
		// without joining heavy analytics tables.
		lastSeenAt: sql<Date | null>`(SELECT MAX(${session.expiresAt}) FROM ${session} WHERE ${session.userId} = ${user.id})`,
		abuseReportsAgainst: sql<number>`(SELECT count(*)::int FROM ${abuseReports} WHERE ${abuseReports.targetType} = 'user' AND ${abuseReports.targetId} = ${user.id})`,
		ppvLifetimeCents: sql<number>`coalesce((SELECT sum(${ppvPurchases.amountPaidCents})::int FROM ${ppvPurchases} WHERE ${ppvPurchases.userId} = ${user.id}), 0)`
	})
		.from(user)
		.where(where)
		.orderBy(desc(user.createdAt))
		.limit(limit)
		.offset(offset);

	return json({ users: rows });
};
