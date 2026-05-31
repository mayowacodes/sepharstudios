import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { shouldShowAds } from '$lib/subscription/ads';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { desc, eq } from 'drizzle-orm';

/**
 * GET /api/ads/vast-tag?contentId=...
 *
 * Returns the VAST tag URL the VideoPlayer should request for a pre-roll
 * ad. Resolves the viewer's plan to decide whether ads apply.
 *
 * Response: { url: string | null, kind: 'preroll' | null }
 *
 * `url=null` means "no ad" — either the user is paying, the network env
 * isn't configured, or the content opted out. The VideoPlayer treats
 * `null` as "skip the pre-roll" so this endpoint is safe to call always.
 *
 * Configuration:
 *   ADS_VAST_TAG_URL — base URL of the VAST tag (e.g. Google IMA, Magnite).
 *                      The endpoint appends standard macros: `[CONTENT_ID]`,
 *                      `[CACHEBUSTER]`, `[REFERRER]`.
 *   ADS_DESCRIPTION_URL — optional canonical content URL passed to the ad
 *                          network for contextual targeting.
 */

function expandMacros(template: string, contentId: string | null, referrer: string | null): string {
	const cacheBuster = Math.floor(Math.random() * 1_000_000_000).toString();
	let out = template
		.replaceAll('[CONTENT_ID]', contentId ?? '')
		.replaceAll('[CACHEBUSTER]', cacheBuster);
	if (referrer) out = out.replaceAll('[REFERRER]', encodeURIComponent(referrer));
	return out;
}

export const GET: RequestHandler = async ({ locals, url, request }) => {
	const baseTag = env.ADS_VAST_TAG_URL;
	if (!baseTag) return json({ url: null, kind: null });

	const session = await locals.auth.getSession();
	if (!session) {
		// Anonymous viewer — never an active subscription. shouldShowAds()
		// returns true for the null plan, so we serve the ad tag.
		const tag = expandMacros(baseTag, url.searchParams.get('contentId'), request.headers.get('referer'));
		return json({ url: tag, kind: 'preroll' });
	}

	const [sub] = await db.select({
		plan: paystackSubscriptions.plan,
		status: paystackSubscriptions.status
	})
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, session.user.id))
		.orderBy(desc(paystackSubscriptions.createdAt))
		.limit(1);

	if (!shouldShowAds({ plan: sub?.plan, status: sub?.status })) {
		return json({ url: null, kind: null });
	}

	const tag = expandMacros(baseTag, url.searchParams.get('contentId'), request.headers.get('referer'));
	return json({ url: tag, kind: 'preroll' });
};
