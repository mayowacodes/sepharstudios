import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { payouts, creators } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

/**
 * GET /api/admin/payouts
 *
 * Lists payouts across creators. Admin payouts queue surfaces the
 * `pending` rows for approval; the `paid` view is for audit.
 *
 * Query: ?status=&processor=&limit=&offset=
 */

export const GET: RequestHandler = async ({ url, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const status = url.searchParams.get('status');
	const processor = url.searchParams.get('processor');
	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '100', 10) || 100, 500);
	const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0', 10) || 0, 0);

	const conditions = [] as ReturnType<typeof eq>[];
	if (status) conditions.push(eq(payouts.status, status));
	if (processor) conditions.push(eq(payouts.processor, processor));
	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const rows = await db.select({
		id: payouts.id,
		creatorId: payouts.creatorId,
		processor: payouts.processor,
		processorPayoutId: payouts.processorPayoutId,
		periodStart: payouts.periodStart,
		periodEnd: payouts.periodEnd,
		grossCents: payouts.grossCents,
		platformFeeCents: payouts.platformFeeCents,
		netCents: payouts.netCents,
		currency: payouts.currency,
		status: payouts.status,
		failureReason: payouts.failureReason,
		createdAt: payouts.createdAt,
		paidAt: payouts.paidAt,
		creatorDisplayName: creators.displayName,
		creatorName: user.name,
		creatorEmail: user.email,
		stripeAccountStatus: creators.stripeAccountStatus,
		stripePayoutsEnabled: creators.stripePayoutsEnabled
	})
		.from(payouts)
		.leftJoin(creators, eq(payouts.creatorId, creators.id))
		.leftJoin(user, eq(creators.userId, user.id))
		.where(where)
		.orderBy(desc(payouts.createdAt))
		.limit(limit)
		.offset(offset);

	return json({ payouts: rows });
};
