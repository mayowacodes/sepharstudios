import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { payoutDisputes, payouts, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';

/**
 * GET /api/admin/disputes?status=
 *
 * Admin-only disputes queue. Joins payouts → creators → user so the
 * admin can see which creator's payment is in dispute.
 */

export const GET: RequestHandler = async ({ url, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const status = url.searchParams.get('status');

	const rows = await db.select({
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
		.where(status ? eq(payoutDisputes.status, status) : undefined)
		.orderBy(desc(payoutDisputes.createdAt))
		.limit(200);

	return json({ disputes: rows });
};
