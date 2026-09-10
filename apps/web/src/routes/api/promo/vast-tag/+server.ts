import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { shouldShowAds, adsAllowedOnCategory } from '$lib/subscription/ads';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, desc, eq, inArray } from 'drizzle-orm';

/**
 * GET /api/promo/vast-tag?contentId=...
 *
 * NOTE ON THE PATH: this lives under /api/promo/, not /api/ads/, deliberately.
 * EasyList — the filter list behind uBlock Origin, AdBlock Plus and most
 * mobile content blockers — blocks the substring `/api/ads/` by default, so the
 * previous path was silently unreachable for a large share of viewers. Any
 * future ad endpoint belongs under /api/promo/ for the same reason.
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

	// Category gate runs before the plan gate, and before the session lookup.
	// Kids and teens titles are ad-free on every plan, so there is no point
	// resolving who the viewer is.
	const contentId = url.searchParams.get('contentId');
	if (contentId) {
		const [row] = await db
			.select({ category: mediaLibrary.category })
			.from(mediaLibrary)
			.where(eq(mediaLibrary.id, contentId))
			.limit(1);
		if (!adsAllowedOnCategory(row?.category)) return json({ url: null, kind: null });
	}

	const session = await locals.auth.getSession();
	if (!session) {
		// Anonymous viewer — never an active subscription. shouldShowAds()
		// returns true for the null plan, so we serve the ad tag.
		const tag = expandMacros(baseTag, url.searchParams.get('contentId'), request.headers.get('referer'));
		return json({ url: tag, kind: 'preroll' });
	}

	// Prefer an ENTITLING row over merely the newest one.
	//
	// This used to be `ORDER BY createdAt DESC LIMIT 1` alone, which asks "what
	// did this user do last?" when the question is "what are they entitled to
	// right now?". Those diverge whenever a row is added after an entitling one:
	// a premium subscriber who starts a second subscription that lands in
	// `cancelled`/`expired`/`paused` gets evaluated against that newest dead row,
	// shouldShowAds() sees an inactive status, and a paying customer is served
	// ads. Look for an active/trial row first; fall back to the newest row only
	// when the user has no entitling subscription at all (which correctly means
	// ads).
	const [active] = await db.select({
		plan: paystackSubscriptions.plan,
		status: paystackSubscriptions.status
	})
		.from(paystackSubscriptions)
		.where(and(
			eq(paystackSubscriptions.userId, session.user.id),
			inArray(paystackSubscriptions.status, ['active', 'trial'])
		))
		.orderBy(desc(paystackSubscriptions.createdAt))
		.limit(1);

	let sub = active;
	if (!sub) {
		[sub] = await db.select({
			plan: paystackSubscriptions.plan,
			status: paystackSubscriptions.status
		})
			.from(paystackSubscriptions)
			.where(eq(paystackSubscriptions.userId, session.user.id))
			.orderBy(desc(paystackSubscriptions.createdAt))
			.limit(1);
	}

	if (!shouldShowAds({ plan: sub?.plan, status: sub?.status })) {
		return json({ url: null, kind: null });
	}

	const tag = expandMacros(baseTag, url.searchParams.get('contentId'), request.headers.get('referer'));
	return json({ url: tag, kind: 'preroll' });
};
