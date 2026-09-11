import { db } from '$lib/db/drizzle';
import {
	adCampaigns,
	adCreatives,
	adBreaks,
	adContentSettings,
	adImpressions,
	mediaLibrary
} from '$lib/db/schema/sepharstudios';
import { and, eq, or, isNull, gt, lt, desc, asc, sql } from 'drizzle-orm';
import { getRedis } from '$lib/server/redis';
import { adsAllowedOnCategory, shouldShowAds, type AdsContext } from '$lib/subscription/ads';
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';

/**
 * Ad decisioning — the auction, targeting, frequency capping and break planning.
 *
 * Everything here is server-only. The client learns a break *schedule* up front
 * (so it can prefetch) but learns the *creative* only when the break opens, via
 * a POST. That split is deliberate: creative URLs and campaign internals must
 * not be serialized into a page payload, the same reasoning that makes the PPV
 * paywall strip playback URLs server-side.
 */

// ── Placement policy ─────────────────────────────────────────────────────────
// Confirmed with the product owner 2026-09-10: max 4 breaks, >= 5 minutes
// apart, none after 90% of runtime.
export const MAX_BREAKS_PER_TITLE = 4;
export const MIN_BREAK_GAP_SECONDS = 300;
export const NO_BREAKS_AFTER_PCT = 0.9;

/**
 * Squeeze scale. The movie keeps 60% of each edge (36% of area) while the ad
 * takes the L-shaped remainder.
 *
 * Not 1/3: a uniform scale to one third of the width is also one third of the
 * height, leaving the movie at 11% of screen area — roughly 426x240 on a
 * 1280px player, which is below watchable for narrative film.
 */
export const DEFAULT_SQUEEZE_SCALE = 0.6;

/**
 * Ads at or under this length duck the movie audio and let it keep playing.
 * Longer ads pause the movie and restore full size afterwards.
 */
export const DUCK_MAX_SECONDS = 30;

export type AdBehavior = 'duck' | 'pause';

/**
 * Sentinel campaign/creative id for the house VAST backfill.
 *
 * It has no row in ad_campaigns or ad_creatives — it is synthesized from the
 * ADS_VAST_TAG_URL env var, not from the database — so impression recording
 * MUST skip it. Inserting would violate the foreign keys on ad_impressions and
 * turn every unfilled break into a 500.
 */
export const HOUSE_BACKFILL_ID = 'house-backfill';

export interface AdBreakPlan {
	breakId: string;
	positionSeconds: number;
	kind: 'preroll' | 'midroll';
	squeezeScale: number;
}

export interface AdDecision {
	decisionId: string;
	campaignId: string;
	creativeId: string;
	src: string | null;
	kind: 'video' | 'vast';
	durationSeconds: number | null;
	behavior: AdBehavior;
	squeezeScale: number;
	clickUrl: string | null;
	ctaLabel: string | null;
	headline: string | null;
	body: string | null;
	mobileBehavior: string;
}

export interface DecisionContext {
	contentId: string;
	breakId?: string;
	userId?: string | null;
	deviceType?: string | null;
	country?: string | null;
	subscription?: AdsContext | null;
}

/** Why a campaign lost. Surfaced by the admin dry-run — "why isn't my campaign
 *  serving?" is the number-one ad-ops question and without this every answer is
 *  database archaeology. */
export interface Rejection {
	campaignId: string;
	campaignName: string;
	reason: string;
}

// ── Signing ──────────────────────────────────────────────────────────────────

function eventSecret(): string {
	const s = env.ADS_EVENT_SECRET;
	if (!s) {
		// Fail closed rather than signing with a guessable constant: an
		// unsigned decisionId means anyone can forge impressions.
		throw new Error('ADS_EVENT_SECRET is not set — ad decisioning is disabled');
	}
	return s;
}

/**
 * `<uuid>.<hmac>` — you cannot invent a decisionId, only replay one you were
 * served. Replays are then absorbed by the monotonic status machine in the
 * event endpoint, so a replay is a no-op rather than an inflated count.
 */
export function signDecisionId(uuid: string, campaignId: string, creativeId: string): string {
	const mac = createHmac('sha256', eventSecret())
		.update(`${uuid}|${campaignId}|${creativeId}`)
		.digest('base64url');
	return `${uuid}.${mac}`;
}

export function verifyDecisionId(decisionId: string, campaignId: string, creativeId: string): boolean {
	const dot = decisionId.lastIndexOf('.');
	if (dot <= 0) return false;
	const uuid = decisionId.slice(0, dot);
	const given = decisionId.slice(dot + 1);
	const expected = createHmac('sha256', eventSecret())
		.update(`${uuid}|${campaignId}|${creativeId}`)
		.digest('base64url');
	const a = Buffer.from(given);
	const b = Buffer.from(expected);
	// Length check first — timingSafeEqual throws on a length mismatch.
	return a.length === b.length && timingSafeEqual(a, b);
}

// ── Targeting ────────────────────────────────────────────────────────────────

/**
 * An empty target array means "unconstrained on this dimension", NOT "matches
 * nothing". Getting this backwards silently stops every campaign from serving,
 * which is why it is a named function rather than an inline `.includes()`.
 */
function matchesDimension(targets: string[] | null | undefined, value: string | null | undefined): boolean {
	if (!targets || targets.length === 0) return true;
	if (!value) return false;
	return targets.includes(value);
}

export function matchesTargeting(
	campaign: {
		targetGenres: string[];
		targetRegions: string[];
		targetDeviceTypes: string[];
		excludeContentIds: string[];
	},
	ctx: { genres?: string[] | null; country?: string | null; deviceType?: string | null; contentId: string }
): string | null {
	if (campaign.excludeContentIds?.includes(ctx.contentId)) return 'content excluded';

	if (campaign.targetGenres?.length) {
		const genres = ctx.genres ?? [];
		if (!genres.some((g) => campaign.targetGenres.includes(g))) return 'genre mismatch';
	}
	if (!matchesDimension(campaign.targetRegions, ctx.country)) return 'region mismatch';
	if (!matchesDimension(campaign.targetDeviceTypes, ctx.deviceType)) return 'device mismatch';
	return null;
}

// ── Frequency capping ────────────────────────────────────────────────────────

/**
 * Rolling per-viewer cap, counted in Redis rather than Postgres.
 *
 * A counter with a TTL is the right shape here: it is written on every serve,
 * read on every decision, and is worthless the moment its window closes. Anonymous
 * viewers key on a hashed client id supplied by the caller.
 */
async function underFrequencyCap(
	campaignId: string,
	viewerKey: string,
	capPerViewer: number | null,
	capWindowHours: number
): Promise<boolean> {
	if (!capPerViewer || capPerViewer <= 0) return true;
	try {
		const redis = getRedis();
		const key = `promo:cap:${campaignId}:${viewerKey}`;
		const n = await redis.get(key);
		return (n ? parseInt(n, 10) : 0) < capPerViewer;
	} catch {
		// Redis down: serve rather than block. An over-delivered impression is
		// a smaller failure than an ad-free platform, and the goal/delivered
		// counters still bound total spend.
		return true;
	}
}

export async function recordFrequency(
	campaignId: string,
	viewerKey: string,
	capWindowHours: number
): Promise<void> {
	try {
		const redis = getRedis();
		const key = `promo:cap:${campaignId}:${viewerKey}`;
		const n = await redis.incr(key);
		if (n === 1) await redis.expire(key, Math.max(1, capWindowHours) * 3600);
	} catch {
		/* non-fatal — capping is best-effort */
	}
}

// ── Break planning ───────────────────────────────────────────────────────────

/**
 * The cue schedule for a title, or an empty list when the title carries no ads.
 *
 * Placement rules are re-checked here even though they are enforced at creation
 * time, because breaks can be written by three paths (manual admin placement,
 * the chapter generator, the interval generator) and only this one runs on
 * every playback.
 */
export async function planBreaks(
	contentId: string,
	runtimeSeconds: number | null | undefined,
	subscription: AdsContext | null | undefined
): Promise<AdBreakPlan[]> {
	const [content] = await db
		.select({ category: mediaLibrary.category })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);

	// Category gate first — kids/teens are ad-free on every plan, so there is
	// no point resolving entitlements or querying breaks.
	if (!content || !adsAllowedOnCategory(content.category)) return [];
	if (!shouldShowAds(subscription)) return [];

	const [settings] = await db
		.select({ adsEnabled: adContentSettings.adsEnabled })
		.from(adContentSettings)
		.where(eq(adContentSettings.contentId, contentId))
		.limit(1);
	if (settings && !settings.adsEnabled) return [];

	const rows = await db
		.select({
			id: adBreaks.id,
			positionSeconds: adBreaks.positionSeconds,
			kind: adBreaks.kind,
			format: adBreaks.format
		})
		.from(adBreaks)
		.where(and(eq(adBreaks.contentId, contentId), eq(adBreaks.isActive, true)))
		.orderBy(asc(adBreaks.positionSeconds));

	// Runtime comes from the caller, never from the database.
	//
	// `mediaLibrary.duration` is a DISPLAY string ('2h 7m'), not seconds —
	// there is no numeric runtime column anywhere on the row. The only place
	// the true duration exists is the player, from `videoEl.duration`, which is
	// why /api/promo/plan takes `?runtime=` and is called after loadedmetadata.
	//
	// When runtime is unknown the 90% cutoff cannot be enforced here. The
	// player re-checks it before opening a break, so an unknown runtime
	// degrades to "client-enforced" rather than "unenforced".
	const cutoff = runtimeSeconds && runtimeSeconds > 0
		? runtimeSeconds * NO_BREAKS_AFTER_PCT
		: null;

	const plan: AdBreakPlan[] = [];
	let lastPosition = -Infinity;

	for (const r of rows) {
		if (plan.length >= MAX_BREAKS_PER_TITLE) break;
		// The end screen appears at 90% and auto-advance fires at 95%; a break
		// past the cutoff races both.
		if (cutoff !== null && r.positionSeconds > cutoff && r.kind !== 'preroll') continue;
		if (r.kind !== 'preroll' && r.positionSeconds - lastPosition < MIN_BREAK_GAP_SECONDS) continue;

		const scale = r.format ? Number.parseFloat(r.format) : DEFAULT_SQUEEZE_SCALE;
		plan.push({
			breakId: r.id,
			positionSeconds: r.positionSeconds,
			kind: r.kind === 'preroll' ? 'preroll' : 'midroll',
			squeezeScale: Number.isFinite(scale) && scale > 0 && scale < 1 ? scale : DEFAULT_SQUEEZE_SCALE
		});
		if (r.kind !== 'preroll') lastPosition = r.positionSeconds;
	}

	return plan;
}

// ── The auction ──────────────────────────────────────────────────────────────

/**
 * Pick a campaign and creative for one break.
 *
 * Returns the winner plus every loser with its rejection reason. The caller
 * discards the rejections in production and returns them for the admin dry-run.
 */
export async function decide(
	ctx: DecisionContext,
	opts: { explain?: boolean } = {}
): Promise<{ decision: AdDecision | null; rejections: Rejection[] }> {
	const rejections: Rejection[] = [];
	const now = new Date();

	const [content] = await db
		.select({
			category: mediaLibrary.category,
			genres: mediaLibrary.genres,
			creatorId: mediaLibrary.creatorId
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, ctx.contentId))
		.limit(1);

	if (!content) return { decision: null, rejections };
	if (!adsAllowedOnCategory(content.category)) return { decision: null, rejections };
	if (!shouldShowAds(ctx.subscription)) return { decision: null, rejections };

	const [settings] = await db
		.select({ adsEnabled: adContentSettings.adsEnabled })
		.from(adContentSettings)
		.where(eq(adContentSettings.contentId, ctx.contentId))
		.limit(1);
	if (settings && !settings.adsEnabled) return { decision: null, rejections };

	// Live flights only. `endsAt IS NULL` is an open-ended flight, not an error.
	const candidates = await db
		.select()
		.from(adCampaigns)
		.where(
			and(
				eq(adCampaigns.status, 'active'),
				lt(adCampaigns.startsAt, now),
				or(isNull(adCampaigns.endsAt), gt(adCampaigns.endsAt, now))
			)
		)
		.orderBy(desc(adCampaigns.priority), asc(adCampaigns.createdAt));

	const viewerKey = ctx.userId ?? 'anon';

	for (const c of candidates) {
		const push = (reason: string) => {
			if (opts.explain) rejections.push({ campaignId: c.id, campaignName: c.name, reason });
		};

		if (c.goalImpressions && c.deliveredImpressions >= c.goalImpressions) {
			push('goal reached');
			continue;
		}

		const miss = matchesTargeting(
			{
				targetGenres: (c.targetGenres ?? []) as string[],
				targetRegions: (c.targetRegions ?? []) as string[],
				targetDeviceTypes: (c.targetDeviceTypes ?? []) as string[],
				excludeContentIds: (c.excludeContentIds ?? []) as string[]
			},
			{
				genres: (content.genres ?? []) as string[],
				country: ctx.country,
				deviceType: ctx.deviceType,
				contentId: ctx.contentId
			}
		);
		if (miss) {
			push(miss);
			continue;
		}

		if (!(await underFrequencyCap(c.id, viewerKey, c.capPerViewer, c.capWindowHours))) {
			push('frequency cap reached');
			continue;
		}

		const creatives = await db
			.select()
			.from(adCreatives)
			.where(and(eq(adCreatives.campaignId, c.id), eq(adCreatives.isActive, true)))
			.orderBy(desc(adCreatives.weight));

		if (creatives.length === 0) {
			push('no active creatives');
			continue;
		}

		// Deterministic per viewer+content, mirroring chooseThumbnail()'s djb2
		// approach: the same viewer sees the same creative for the same title
		// rather than a different one on every replay.
		const creative = creatives[djb2(`${viewerKey}:${ctx.contentId}`) % creatives.length];

		const duration = creative.durationSeconds ?? null;
		// Unknown duration defaults to pause. Never leave a movie running
		// underneath an ad whose length we cannot bound.
		const behavior: AdBehavior = duration !== null && duration <= DUCK_MAX_SECONDS ? 'duck' : 'pause';

		const uuid = randomUUID();
		const decisionId = signDecisionId(uuid, c.id, creative.id);

		return {
			decision: {
				decisionId,
				campaignId: c.id,
				creativeId: creative.id,
				// Resolved to a signed URL by the endpoint — never a raw key.
				src: creative.videoObjectKey ?? creative.vastTagUrl ?? null,
				kind: creative.kind === 'vast' ? 'vast' : 'video',
				durationSeconds: duration,
				behavior,
				squeezeScale: DEFAULT_SQUEEZE_SCALE,
				clickUrl: creative.clickUrl,
				ctaLabel: creative.ctaLabel,
				headline: creative.headline,
				body: creative.body,
				mobileBehavior: creative.mobileBehavior
			},
			rejections
		};
	}

	// ── House backfill ────────────────────────────────────────────────────
	//
	// No campaign filled. If a house VAST tag is configured, synthesize a
	// decision from it rather than leaving the break empty.
	//
	// This preserves the ADS_VAST_TAG_URL configuration path that predates the
	// campaign system, and it guarantees the backfill tier is never empty — a
	// break that opens with nothing to show is a worse viewer experience than
	// one that shows a house promo, because the player has already committed to
	// the squeeze by the time it knows.
	const houseTag = env.ADS_VAST_TAG_URL;
	if (houseTag) {
		const uuid = randomUUID();
		const HOUSE_ID = HOUSE_BACKFILL_ID;
		return {
			decision: {
				decisionId: signDecisionId(uuid, HOUSE_ID, HOUSE_ID),
				campaignId: HOUSE_ID,
				creativeId: HOUSE_ID,
				src: houseTag,
				kind: 'vast',
				// Unknown until the tag is resolved. Null means the caller
				// defaults to pause, which is the safe choice for an ad whose
				// length we cannot bound — the VAST response then corrects it.
				durationSeconds: null,
				behavior: 'pause',
				squeezeScale: DEFAULT_SQUEEZE_SCALE,
				clickUrl: null,
				ctaLabel: null,
				headline: null,
				body: null,
				mobileBehavior: 'takeover'
			},
			rejections
		};
	}

	return { decision: null, rejections };
}

/** Same hash `chooseThumbnail()` uses, so selection behaviour is consistent. */
function djb2(s: string): number {
	let h = 5381;
	for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
	return h;
}

/** Record the served impression. Called by the decision endpoint. */
export async function recordServed(
	decision: AdDecision,
	ctx: DecisionContext,
	creatorId: string | null
): Promise<void> {
	// The house backfill is synthesized from an env var and has no campaign or
	// creative row, so its ids would violate ad_impressions' foreign keys.
	// Delivery of house inventory is not billed or reported on, so there is
	// nothing lost by not recording it.
	if (decision.campaignId === HOUSE_BACKFILL_ID) return;

	await db.insert(adImpressions).values({
		decisionId: decision.decisionId,
		campaignId: decision.campaignId,
		creativeId: decision.creativeId,
		breakId: ctx.breakId ?? null,
		contentId: ctx.contentId,
		creatorId,
		userId: ctx.userId ?? null,
		status: 'served',
		deviceType: ctx.deviceType ?? null,
		country: ctx.country ?? null,
		behavior: decision.behavior
	});
}
