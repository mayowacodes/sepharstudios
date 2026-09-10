import { json, error, type RequestHandler } from '@sveltejs/kit';
import { planBreaks, DEFAULT_SQUEEZE_SCALE, DUCK_MAX_SECONDS, type AdBreakPlan } from '$lib/server/ads/decision';
import { paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { db } from '$lib/db/drizzle';
import { and, desc, eq, inArray } from 'drizzle-orm';

/**
 * GET /api/promo/plan?contentId=&runtime=  →  AdPlanPayload
 *
 * The cue-point schedule for a title, fetched once when the player mounts so it
 * can prefetch a creative shortly before each break rather than stalling at the
 * cue.
 *
 * Deliberately returns NO creative information. Which ad runs is decided at the
 * break itself via POST /api/promo/decision — putting creative URLs in a
 * response the page holds for the whole session would leak campaign internals
 * and let a viewer fetch (or block) them ahead of time.
 *
 * An empty `breaks` array is the normal answer for a paying subscriber, a
 * kids/teens title, or a title with ads switched off. The player treats it as
 * "no ad behaviour at all" and never calls the decision endpoint.
 */
export type AdPlanPayload = {
	breaks: AdBreakPlan[];
	/** Ads at or under this many seconds duck; longer ones pause the movie. */
	duckMaxSeconds: number;
	/** Fraction of each edge the movie keeps while squeezed. */
	defaultSqueezeScale: number;
};

async function buildAdPlanPayload(
	contentId: string,
	runtimeSeconds: number | null,
	userId: string | null
): Promise<AdPlanPayload> {
	// Prefer an entitling row over the newest one — a lapsed second
	// subscription must not make a paying subscriber ad-supported.
	let subscription: { plan: string; status: string } | null = null;
	if (userId) {
		const [active] = await db
			.select({ plan: paystackSubscriptions.plan, status: paystackSubscriptions.status })
			.from(paystackSubscriptions)
			.where(
				and(
					eq(paystackSubscriptions.userId, userId),
					inArray(paystackSubscriptions.status, ['active', 'trial'])
				)
			)
			.orderBy(desc(paystackSubscriptions.createdAt))
			.limit(1);
		subscription = active ?? null;
	}

	const breaks = await planBreaks(contentId, runtimeSeconds, subscription);

	return {
		breaks,
		duckMaxSeconds: DUCK_MAX_SECONDS,
		defaultSqueezeScale: DEFAULT_SQUEEZE_SCALE
	};
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const contentId = url.searchParams.get('contentId');
	if (!contentId) throw error(400, 'contentId is required');

	const runtimeRaw = url.searchParams.get('runtime');
	const runtime = runtimeRaw ? Number.parseInt(runtimeRaw, 10) : null;

	const session = await locals.auth.getSession();

	return json(
		await buildAdPlanPayload(
			contentId,
			Number.isFinite(runtime) ? runtime : null,
			session?.user.id ?? null
		)
	);
};
