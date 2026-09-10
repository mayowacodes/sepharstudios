import { json, type RequestHandler } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/admin-auth';
import { decide } from '$lib/server/ads/decision';

/**
 * POST /api/admin/promo/preview
 *
 * Dry-runs the auction against a synthetic viewer and returns the winner AND
 * every loser with its rejection reason.
 *
 * This exists because "why isn't my campaign serving?" is the number-one
 * ad-ops question, and without it every answer is a database archaeology
 * session across flight windows, targeting arrays, frequency caps and goal
 * counters. The rejection list turns that into one request.
 *
 * Writes nothing. Unlike /api/promo/decision it does not record an impression
 * or tick the frequency counter, so an admin can run it repeatedly without
 * polluting delivery numbers or exhausting a cap they are trying to diagnose.
 *
 * Body: { contentId, deviceType?, country?, plan?, status? }
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	const { error: authError } = await requireAdmin(locals);
	if (authError) return authError;

	const body = (await request.json().catch(() => null)) as {
		contentId?: string;
		deviceType?: string;
		country?: string;
		plan?: string;
		status?: string;
	} | null;

	const contentId = body?.contentId;
	if (!contentId) return json({ error: 'contentId is required' }, { status: 400 });

	const { decision, rejections } = await decide(
		{
			contentId,
			// Defaults describe an ad-supported viewer, since that is the case an
			// operator is almost always debugging. Passing an ad-free plan here
			// is a useful negative test.
			userId: null,
			deviceType: body?.deviceType ?? 'desktop',
			country: body?.country ?? null,
			subscription: body?.plan ? { plan: body.plan, status: body.status ?? 'active' } : null
		},
		{ explain: true }
	);

	return json({
		wouldServe: decision !== null,
		// The creative src here is the raw object key, not a signed URL — this is
		// a diagnostic, and minting a playable URL for it would be a side effect.
		winner: decision
			? {
					campaignId: decision.campaignId,
					creativeId: decision.creativeId,
					behavior: decision.behavior,
					durationSeconds: decision.durationSeconds
				}
			: null,
		rejections
	});
};
