import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions, familyAddons } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [sub] = await db.select()
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, session.user.id))
		.orderBy(desc(paystackSubscriptions.createdAt))
		.limit(1);

	if (!sub) {
		return json({ hasSubscription: false, plan: null, status: null });
	}

	const [addon] = await db.select()
		.from(familyAddons)
		.where(eq(familyAddons.userId, session.user.id))
		.limit(1);

	const now = new Date();
	const trialDaysLeft = sub.trialEndDate
		? Math.max(0, Math.ceil((new Date(sub.trialEndDate).getTime() - now.getTime()) / 86400000))
		: null;

	// Effective profile cap: prefer the subscription's snapshotted max (set at
	// sub creation from PLAN_FEATURES) but honor any legacy active family
	// add-on row that grants more.
	const effectiveMaxProfiles = Math.max(
		sub.maxProfiles ?? 1,
		addon?.status === 'active' ? (addon.maxProfiles ?? 8) : 0
	);

	return json({
		hasSubscription: true,
		plan: sub.plan,
		status: sub.status,
		isTrial: sub.status === 'trial',
		trialEndDate: sub.trialEndDate,
		trialDaysLeft,
		currentPeriodEnd: sub.currentPeriodEnd,
		hasFamilyAddon: !!addon && addon.status === 'active',
		maxProfiles: effectiveMaxProfiles,
		kidsAllowed: sub.kidsAllowed,
		// Recurring-billing state — surfaces "your next charge is …" and any
		// in-progress dunning so the user can fix their card before access cuts.
		nextChargeAt: sub.nextChargeAt,
		failedAttempts: sub.failedAttempts,
		cardLast4: sub.cardLast4,
		cardBrand: sub.cardBrand
	});
};
