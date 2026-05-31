import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { payoutDisputes, payouts, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

/**
 * GET /api/admin/disputes?status=&page=&pageSize=
 *
 * Admin-only disputes queue. Joins payouts → creators → user so the
 * admin can see which creator's payment is in dispute. Paginated so the
 * client never has to render all 200+ rows at once.
 */

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 25;

export const GET: RequestHandler = async ({ url, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const status = url.searchParams.get('status');
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);
	const requested = parseInt(url.searchParams.get('pageSize') ?? `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE;
	const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, requested));
	const offset = (page - 1) * pageSize;

	const whereExpr = status ? eq(payoutDisputes.status, status) : undefined;

	const [rows, totalRows] = await Promise.all([
		db.select({
			id: payoutDisputes.id,
			processor: payoutDisputes.processor,
			processorDisputeId: payoutDisputes.processorDisputeId,
			amountCents: payoutDisputes.amountCents,
			currency: payoutDisputes.currency,
			reason: payoutDisputes.reason,
			status: payoutDisputes.status,
			evidenceDueAt: payoutDisputes.evidenceDueAt,
			createdAt: payoutDisputes.createdAt,
			closedAt: payoutDisputes.closedAt,
			payoutId: payoutDisputes.payoutId,
			creatorDisplayName: creators.displayName,
			creatorEmail: user.email
		})
			.from(payoutDisputes)
			.leftJoin(payouts, eq(payoutDisputes.payoutId, payouts.id))
			.leftJoin(creators, eq(creators.id, payouts.creatorId))
			.leftJoin(user, eq(user.id, creators.userId))
			.where(whereExpr)
			.orderBy(desc(payoutDisputes.createdAt))
			.limit(pageSize)
			.offset(offset),
		db.select({ count: sql<number>`count(*)::int` })
			.from(payoutDisputes)
			.where(whereExpr)
	]);

	const total = totalRows[0]?.count ?? 0;
	return json({
		disputes: rows,
		pagination: {
			page,
			pageSize,
			total,
			totalPages: Math.max(1, Math.ceil(total / pageSize))
		}
	});
};
