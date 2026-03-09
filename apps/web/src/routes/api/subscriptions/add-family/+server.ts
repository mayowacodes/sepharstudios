import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions, familyAddons } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { chargeAuthorization } from '$lib/payment/paystack';
import { env } from '$env/dynamic/private';

const FAMILY_ADDON_CENTS = 500; // $5/month

export const POST: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	// Fetch current subscription
	const sub = await db
		.select()
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, session.user.id))
		.then(r => r[0]);

	if (!sub) return json({ error: 'No active subscription found' }, { status: 404 });
	if (!['active', 'trial'].includes(sub.status ?? '')) {
		return json({ error: 'Active subscription required to add family plan' }, { status: 400 });
	}

	// Check if family addon already active
	const existing = await db
		.select({ id: familyAddons.id, status: familyAddons.status })
		.from(familyAddons)
		.where(eq(familyAddons.subscriptionId, sub.id))
		.then(r => r[0]);

	if (existing?.status === 'active') {
		return json({ error: 'Family add-on is already active' }, { status: 409 });
	}

	if (!sub.paystackAuthorizationCode) {
		return json({ error: 'No saved payment method. Please update your billing details.' }, { status: 400 });
	}

	// Charge the saved card for $5
	const charge = await chargeAuthorization({
		authorizationCode: sub.paystackAuthorizationCode,
		email: session.user.email,
		amountKobo: FAMILY_ADDON_CENTS,
		metadata: { reason: 'family_addon' }
	});

	if (charge.status !== 'success') {
		return json({ error: 'Payment failed. Please check your card details.' }, { status: 402 });
	}

	// Create or reactivate family addon record
	if (existing) {
		await db.update(familyAddons).set({ status: 'active' }).where(eq(familyAddons.id, existing.id));
	} else {
		await db.insert(familyAddons).values({
			subscriptionId: sub.id,
			userId: session.user.id,
			maxProfiles: 8,
			status: 'active',
			paystackAuthorizationCode: sub.paystackAuthorizationCode
		});
	}

	return json({ success: true, maxProfiles: 8 });
};

export const DELETE: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const sub = await db
		.select({ id: paystackSubscriptions.id })
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, session.user.id))
		.then(r => r[0]);

	if (!sub) return json({ error: 'No subscription found' }, { status: 404 });

	await db.update(familyAddons).set({ status: 'cancelled' }).where(eq(familyAddons.subscriptionId, sub.id));

	return json({ success: true });
};
