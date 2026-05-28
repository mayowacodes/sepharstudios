import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { newsletterSubscriptions } from '$lib/db/schema/sepharstudios';
import { and, eq, sql } from 'drizzle-orm';

/**
 * POST /api/creator/newsletter/subscribe
 *
 * Subscribes the caller's email to the creator newsletter, or updates their
 * preferences if already subscribed. Auth-optional (logged-in users get
 * user_id back-linked); anonymous signups also accepted.
 *
 * Body: { email: string, preferences?: Record<string, boolean> }
 *
 * Returns the subscription row's unsubscribe_token so the client can offer a
 * "manage preferences" link without requiring login.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession().catch(() => null);

	const body = await request.json() as {
		email?: string;
		preferences?: Record<string, boolean>;
	};

	const email = (body.email ?? '').trim().toLowerCase();
	if (!email || !EMAIL_RE.test(email)) {
		return json({ error: 'A valid email is required' }, { status: 400 });
	}

	// Upsert keyed on (email, audience). Re-submission from the same email
	// updates preferences and re-activates a previously unsubscribed row.
	const inserted = await db
		.insert(newsletterSubscriptions)
		.values({
			email,
			userId: session?.user.id ?? null,
			audience: 'creator',
			preferences: body.preferences ?? {},
			status: 'active'
		})
		.onConflictDoUpdate({
			target: [newsletterSubscriptions.email, newsletterSubscriptions.audience],
			set: {
				preferences: body.preferences ?? {},
				status: 'active',
				userId: session?.user.id ?? sql`${newsletterSubscriptions.userId}`,
				updatedAt: new Date()
			}
		})
		.returning({
			id: newsletterSubscriptions.id,
			unsubscribeToken: newsletterSubscriptions.unsubscribeToken
		});

	return json({ success: true, ...inserted[0] });
};

/**
 * DELETE /api/creator/newsletter/subscribe?token=…
 *
 * One-click unsubscribe. The link in every newsletter email points here with
 * the row's `unsubscribe_token`. Required by CAN-SPAM (US) / GDPR (EU).
 */
export const DELETE: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) return json({ error: 'Missing token' }, { status: 400 });

	const result = await db
		.update(newsletterSubscriptions)
		.set({ status: 'unsubscribed', updatedAt: new Date() })
		.where(and(
			eq(newsletterSubscriptions.unsubscribeToken, token),
			eq(newsletterSubscriptions.status, 'active')
		))
		.returning({ id: newsletterSubscriptions.id });

	if (result.length === 0) {
		return json({ error: 'Subscription not found or already unsubscribed' }, { status: 404 });
	}
	return json({ success: true });
};
