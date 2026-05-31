import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { account } from '$lib/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';

/**
 * GET /api/users/me/auth-providers
 *
 * Returns the set of auth providers linked to the signed-in user, plus
 * whether they have a credential (password) account. The profile page
 * uses this to decide whether to render the "Change password" form —
 * showing it for an OAuth-only account would just frustrate the user
 * (better-auth would reject the change because no password exists).
 *
 * Shape:
 *   { providers: ['credential','google','github'], hasPassword: true }
 *
 * `providers` is a sorted unique array of `account.providerId` values.
 * `hasPassword` is true iff a credential row has a non-null password.
 */

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const rows = await db
		.select({ providerId: account.providerId })
		.from(account)
		.where(eq(account.userId, session.user.id));

	const providers = Array.from(new Set(rows.map((r) => r.providerId))).sort();

	const [hasCred] = await db
		.select({ id: account.id })
		.from(account)
		.where(and(
			eq(account.userId, session.user.id),
			eq(account.providerId, 'credential'),
			isNotNull(account.password)
		))
		.limit(1);

	return json({ providers, hasPassword: !!hasCred });
};
