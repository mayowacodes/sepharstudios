import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { ppvContent, ppvPurchases, paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { and, eq, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ canWatch: false, reason: 'unauthenticated' });

	const contentId = params.contentId!;
	const userId = session.user.id;

	// Is this content PPV?
	const [ppv] = await db.select()
		.from(ppvContent)
		.where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true)))
		.limit(1);

	if (!ppv) {
		// Not PPV — check subscription
		const [sub] = await db.select()
			.from(paystackSubscriptions)
			.where(eq(paystackSubscriptions.userId, userId))
			.orderBy(desc(paystackSubscriptions.createdAt))
			.limit(1);

		const hasActiveSub = sub && ['trial', 'active'].includes(sub.status);
		return json({ canWatch: hasActiveSub, isPPV: false, reason: hasActiveSub ? 'subscribed' : 'no_subscription' });
	}

	// PPV content — check if user already purchased it
	const [purchase] = await db.select()
		.from(ppvPurchases)
		.where(and(eq(ppvPurchases.userId, userId), eq(ppvPurchases.contentId, contentId)))
		.limit(1);

	if (purchase) {
		return json({ canWatch: true, isPPV: true, alreadyPurchased: true, priceCents: ppv.finalPriceCents });
	}

	// Not purchased — show paywall
	return json({
		canWatch: false,
		isPPV: true,
		alreadyPurchased: false,
		priceCents: ppv.finalPriceCents,
		reason: 'ppv_required'
	});
};
