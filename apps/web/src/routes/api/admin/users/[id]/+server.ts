import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user, session } from '$lib/db/schema';
import { abuseReports, ppvPurchases, paymentIntents, subscriptions, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, desc, eq, sql } from 'drizzle-orm';

/**
 * GET /api/admin/users/[id]
 *
 * Per-user detail page payload. Returns the user row plus their abuse
 * report history, recent PPV purchases, subscription, recent watch
 * activity. Admin-only.
 */

export const GET: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [u] = await db.select().from(user).where(eq(user.id, params.id!)).limit(1);
	if (!u) return json({ error: 'Not found' }, { status: 404 });

	const [recentSessions, ppv, sub, abuseAgainst, abuseBy, ownedContent] = await Promise.all([
		db.select({
			ip: session.ipAddress,
			deviceType: session.deviceType,
			expiresAt: session.expiresAt
		})
			.from(session)
			.where(eq(session.userId, u.id))
			.orderBy(desc(session.expiresAt))
			.limit(5),
		db.select({
			id: ppvPurchases.id,
			contentId: ppvPurchases.contentId,
			amountPaidCents: ppvPurchases.amountPaidCents,
			currency: ppvPurchases.currency,
			createdAt: ppvPurchases.createdAt,
			contentTitle: mediaLibrary.title
		})
			.from(ppvPurchases)
			.leftJoin(mediaLibrary, eq(mediaLibrary.id, ppvPurchases.contentId))
			.where(eq(ppvPurchases.userId, u.id))
			.orderBy(desc(ppvPurchases.createdAt))
			.limit(20),
		db.select({
			id: subscriptions.id,
			tier: subscriptions.tier,
			startDate: subscriptions.startDate,
			endDate: subscriptions.endDate,
			isActive: subscriptions.isActive,
			autoRenew: subscriptions.autoRenew
		})
			.from(subscriptions)
			.where(eq(subscriptions.userId, u.id))
			.orderBy(desc(subscriptions.startDate))
			.limit(1),
		// Reports filed AGAINST this user.
		db.select({
			id: abuseReports.id,
			category: abuseReports.category,
			status: abuseReports.status,
			createdAt: abuseReports.createdAt
		})
			.from(abuseReports)
			.where(and(eq(abuseReports.targetType, 'user'), eq(abuseReports.targetId, u.id)))
			.orderBy(desc(abuseReports.createdAt))
			.limit(20),
		// Reports filed BY this user.
		db.select({
			id: abuseReports.id,
			targetType: abuseReports.targetType,
			category: abuseReports.category,
			status: abuseReports.status,
			createdAt: abuseReports.createdAt
		})
			.from(abuseReports)
			.where(eq(abuseReports.reporterId, u.id))
			.orderBy(desc(abuseReports.createdAt))
			.limit(20),
		// If they're a creator, list their content.
		db.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			status: mediaLibrary.status,
			viewCount: mediaLibrary.viewCount
		})
			.from(mediaLibrary)
			.where(eq(mediaLibrary.creatorId, u.id))
			.orderBy(desc(mediaLibrary.createdAt))
			.limit(20)
	]);

	const ppvLifetimeCents = ppv.reduce((s, p) => s + Number(p.amountPaidCents ?? 0), 0);

	return json({
		user: {
			id: u.id,
			name: u.name,
			email: u.email,
			role: u.role,
			image: u.image,
			banned: u.banned,
			banReason: u.banReason,
			banExpires: u.banExpires,
			createdAt: u.createdAt,
			dateOfBirth: u.dateOfBirth,
			gender: u.gender
		},
		recentSessions,
		ppvPurchases: ppv,
		ppvLifetimeCents,
		subscription: sub[0] ?? null,
		abuseReportsAgainst: abuseAgainst,
		abuseReportsBy: abuseBy,
		ownedContent
	});
};
