import { json, error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { decide, recordServed, recordFrequency, DUCK_MAX_SECONDS, HOUSE_BACKFILL_ID, type AdDecision } from '$lib/server/ads/decision';
import { fingerprintFromHeaders } from '$lib/server/ua-country';
import { getPresignedUrl } from '$lib/server/minio';
import { enforceRateLimit } from '$lib/server/rate-limit';
import { env } from '$env/dynamic/private';
import { fetchVast, fireTrackers } from '$lib/server/ads/vast';

/**
 * POST /api/promo/decision  →  AdDecisionPayload
 *
 * Runs the auction for one break and returns the winning creative, resolved to
 * a short-lived signed URL.
 *
 * POST rather than GET, and called at the break rather than up front, for the
 * same reason the PPV paywall strips playback URLs server-side: anything
 * returned from a page load is serialized into the payload and readable in the
 * network tab. A creative URL held for the whole session is one a viewer can
 * enumerate, pre-block, or scrape for campaign intelligence.
 *
 * Must never be called during SSR — the native builds reach it cross-origin
 * with a bearer token, and it depends on request headers for device/country.
 */

const CREATIVE_URL_TTL_SECONDS = 900; // 15 min — longer than any ad, short enough to expire

export type AdDecisionPayload = {
	/** null means no fill: the player skips the break entirely. */
	ad: (Omit<AdDecision, 'src'> & { src: string }) | null;
	/** Present only for admins with ?explain=1. */
	rejections?: Array<{ campaignId: string; campaignName: string; reason: string }>;
};

export const POST: RequestHandler = async ({ request, locals, url, getClientAddress }) => {
	const session = await locals.auth.getSession();

	// One ad break legitimately produces one decision. This bounds a caller
	// that loops the endpoint to enumerate campaigns.
	await enforceRateLimit(`promo:decision:${session?.user.id ?? getClientAddress()}`, {
		capacity: 20,
		refillPerSec: 0.5
	});

	const body = (await request.json().catch(() => null)) as {
		contentId?: string;
		breakId?: string;
	} | null;

	const contentId = body?.contentId;
	if (!contentId) throw error(400, 'contentId is required');

	const fp = fingerprintFromHeaders(request.headers);

	// Entitling row, not merely the newest.
	let subscription: { plan: string; status: string } | null = null;
	if (session) {
		const [active] = await db
			.select({ plan: paystackSubscriptions.plan, status: paystackSubscriptions.status })
			.from(paystackSubscriptions)
			.where(
				and(
					eq(paystackSubscriptions.userId, session.user.id),
					inArray(paystackSubscriptions.status, ['active', 'trial'])
				)
			)
			.orderBy(desc(paystackSubscriptions.createdAt))
			.limit(1);
		subscription = active ?? null;
	}

	const isAdmin = session?.user.role === 'admin';
	const explain = isAdmin && url.searchParams.get('explain') === '1';

	const { decision, rejections } = await decide(
		{
			contentId,
			breakId: body?.breakId,
			userId: session?.user.id ?? null,
			deviceType: fp.deviceType,
			country: fp.country,
			subscription
		},
		{ explain }
	);

	if (!decision) {
		return json({ ad: null, ...(explain ? { rejections } : {}) } satisfies AdDecisionPayload);
	}

	// Resolve the stored object key to a signed, expiring URL. A raw key must
	// never reach the client, and the creative bucket is private.
	let src: string;
	if (decision.kind === 'vast') {
		// Resolve the tag server-side. The page never sees the VAST URL, only
		// the resulting media file — so there is no third-party request from
		// the browser for an ad blocker to intercept, and the behaviour is
		// identical inside the Capacitor WebView.
		if (!decision.src) return json({ ad: null } satisfies AdDecisionPayload);
		try {
			const vast = await fetchVast(decision.src, {
				// A ducked ad plays alongside a still-running movie and shares
				// its bandwidth; a heavy creative would force hls.js to
				// downshift the film, which viewers read as the ad degrading
				// the content.
				preferLowBitrate: decision.behavior === 'duck',
				contentId,
				referrer: request.headers.get('referer')
			});
			if (!vast) return json({ ad: null } satisfies AdDecisionPayload);

			src = vast.mediaUrl;

			// VAST duration overrides the stored estimate, and can flip the
			// behaviour: a tag that returns a 60s creative must pause the movie
			// even if the campaign row guessed it would duck.
			if (vast.durationSeconds > 0) {
				decision.durationSeconds = vast.durationSeconds;
				decision.behavior = vast.durationSeconds <= DUCK_MAX_SECONDS ? 'duck' : 'pause';
			}
			if (vast.clickThrough) decision.clickUrl = vast.clickThrough;

			// Impression pixels fire now, at decision time, matching how the
			// first-party path records `served`. Fire-and-forget: a partner's
			// slow pixel must never delay the ad starting.
			void fireTrackers(vast.trackers.impression);
		} catch (err) {
			console.error('[promo/decision] VAST resolution failed:', err instanceof Error ? err.message : err);
			return json({ ad: null } satisfies AdDecisionPayload);
		}
	} else {
		if (!decision.src) return json({ ad: null } satisfies AdDecisionPayload);
		src = await getPresignedUrl(
			env.ADS_CREATIVE_BUCKET || 'sephar-promo',
			decision.src,
			CREATIVE_URL_TTL_SECONDS
		);
	}

	const [content] = await db
		.select({ creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);

	// Record the serve and tick the frequency counter before responding, so a
	// client that never reports back is still counted as served — that gap
	// (served without started) is the ad-block measurement.
	await recordServed(decision, {
		contentId,
		breakId: body?.breakId,
		userId: session?.user.id ?? null,
		deviceType: fp.deviceType,
		country: fp.country
	}, content?.creatorId ?? null);

	// House inventory is unlimited by definition — capping it would leave
	// breaks empty once a viewer hit the cap, which is the opposite of what a
	// backfill is for.
	if (decision.campaignId !== HOUSE_BACKFILL_ID) {
		void recordFrequency(decision.campaignId, session?.user.id ?? 'anon', 24);
	}

	return json({
		ad: { ...decision, src },
		...(explain ? { rejections } : {})
	} satisfies AdDecisionPayload);
};
