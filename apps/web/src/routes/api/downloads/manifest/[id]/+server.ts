import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import {
	mediaLibrary,
	paystackSubscriptions,
	ppvContent,
	ppvPurchases
} from '$lib/db/schema/sepharstudios';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { canonicalPlan } from '$lib/payment/paystack';

/**
 * GET /api/downloads/manifest/:id → { manifestUrl, contentId, expiresAt }
 *
 * Authorises an offline download and hands back the HLS master playlist URL.
 * The client walks that playlist and caches the segments itself — see
 * `$lib/client/download-manager.ts`.
 *
 * This endpoint is an AUTHORISATION BOUNDARY, not a convenience. A download is
 * a permanent local copy, so anything it lets through cannot be revoked later.
 */

/** Plans entitled to offline downloads. Free/ad-supported is not among them. */
const DOWNLOAD_PLANS = new Set(['premium', 'creator']);

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const contentId = params.id;
	if (!contentId) return json({ error: 'Missing content id' }, { status: 400 });

	// Prefer an ENTITLING row over merely the first one returned.
	//
	// This previously did `.then(r => r[0])` with no ORDER BY and no LIMIT,
	// so Postgres could hand back any of the user's subscription rows — a
	// lapsed one for a current subscriber, or a current one for someone who
	// had churned. Ask for what they are entitled to now, and only fall back
	// to the newest row to produce an accurate refusal message.
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

	if (!active) {
		return json({ error: 'Active subscription required for downloads' }, { status: 403 });
	}
	if (!DOWNLOAD_PLANS.has(canonicalPlan(active.plan ?? ''))) {
		return json({ error: 'Downloads require Premium or Creator' }, { status: 403 });
	}

	const [content] = await db
		.select({
			videoUrl: mediaLibrary.videoUrl,
			isActive: mediaLibrary.isActive,
			title: mediaLibrary.title
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);

	if (!content || !content.isActive) return json({ error: 'Content not found' }, { status: 404 });
	if (!content.videoUrl) return json({ error: 'No video available for this content' }, { status: 404 });

	// ── PPV gate ──────────────────────────────────────────────────────────
	//
	// This check did not exist. A pay-per-view title could be downloaded by any
	// Premium subscriber without ever buying it — and unlike streaming, where
	// the watch page strips playback URLs behind the paywall, a download hands
	// over a permanent copy that cannot be withdrawn afterwards.
	const [ppv] = await db
		.select({ id: ppvContent.id })
		.from(ppvContent)
		.where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true)))
		.limit(1);

	if (ppv) {
		const [purchase] = await db
			.select({ id: ppvPurchases.id })
			.from(ppvPurchases)
			.where(
				and(eq(ppvPurchases.userId, session.user.id), eq(ppvPurchases.contentId, contentId))
			)
			.limit(1);
		if (!purchase) {
			return json(
				{ error: 'This title must be purchased before it can be downloaded' },
				{ status: 403 }
			);
		}
	}

	let manifestUrl = content.videoUrl;
	if (!manifestUrl.startsWith('http')) {
		const minioBase = env.MINIO_PUBLIC_URL ?? env.S3_ENDPOINT ?? '';
		manifestUrl = `${minioBase}/${manifestUrl}`;
	}

	return json({
		contentId,
		title: content.title,
		manifestUrl,
		// Advisory only — the client uses it to decide when to re-authorise
		// before a long download. It is not a capability token; the URL's own
		// lifetime is what actually bounds access.
		expiresAt: new Date(Date.now() + 24 * 3600_000).toISOString()
	});
};
