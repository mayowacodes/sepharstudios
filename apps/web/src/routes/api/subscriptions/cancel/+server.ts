import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';
import { sendCancellationConfirmation } from '$lib/server/notifications';

export const POST: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [sub] = await db.select()
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, session.user.id))
		.orderBy(desc(paystackSubscriptions.createdAt))
		.limit(1);

	if (!sub) return json({ error: 'No active subscription' }, { status: 404 });

	// Mark as cancelled — access continues until period end
	await db.update(paystackSubscriptions)
		.set({ status: 'cancelled', cancelledAt: new Date(), updatedAt: new Date() })
		.where(eq(paystackSubscriptions.id, sub.id));

	const accessUntil = sub.trialEndDate ?? sub.currentPeriodEnd ?? new Date();
	await sendCancellationConfirmation(session.user.email, session.user.name, accessUntil as Date);

	return json({ success: true, accessUntil });
};
