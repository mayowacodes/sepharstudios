import { t as private_env } from "./shared-server.js";
import { d as adCampaigns, f as adContentSettings, l as adBreaks, m as adImpressions, p as adCreatives, t as db, tt as mediaLibrary } from "./drizzle.js";
import { t as getRedis } from "./redis.js";
import { t as PLAN_FEATURES } from "./paystack.js";
import { and, asc, desc, eq, gt, isNull, lt, or } from "drizzle-orm";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
//#region src/lib/subscription/ads.ts
/**
* Ads gating — single source of truth for whether the current user should be
* shown ads.
*
* The old /api/promo/vast-tag endpoint is gone. Ads now go through
* /api/promo/plan (the break schedule) and /api/promo/decision (the auction),
* which gate on this function plus the category rule below. `ADS_VAST_TAG_URL`
* still works, but as the house BACKFILL inside the auction rather than as the
* only ad path — leave it unset to disable backfill.
*
* The decision tree:
*   - No subscription           → free anonymous viewer, show ads
*   - Subscription cancelled    → access ended, show ads (or paywall — depends on UX)
*   - Subscription paused       → dunning state, show ads while card is fixed
*   - plan === 'freemium'       → always show ads (defining tier feature)
*   - plan === 'basic' | 'premium' | 'creator' → ad-free
*
* Content category overrides all of the above — see `adsAllowedOnCategory`.
*/
function shouldShowAds(ctx) {
	if (!ctx || !ctx.plan) return true;
	if (ctx.status !== "active" && ctx.status !== "trial") return true;
	const features = PLAN_FEATURES[ctx.plan];
	if (!features) return true;
	return features.hasAds;
}
/**
* Audience categories that never carry advertising, on any plan.
*
* Non-skippable ads against children's content is a regulatory exposure
* (COPPA in the US, the UK CAP code on advertising to minors) that the
* available inventory does not justify, and a reputational one for a
* faith-based platform whose kids portal is a primary acquisition hook.
*
* This is a category rule, not a plan rule, and it is deliberately the outer
* check: a freemium viewer watching a kids title gets no ads even though their
* plan says `hasAds: true`.
*/
var AD_FREE_CATEGORIES = /* @__PURE__ */ new Set(["kids", "teens"]);
function adsAllowedOnCategory(category) {
	return !category || !AD_FREE_CATEGORIES.has(category);
}
var NO_BREAKS_AFTER_PCT = .9;
/**
* Squeeze scale. The movie keeps 60% of each edge (36% of area) while the ad
* takes the L-shaped remainder.
*
* Not 1/3: a uniform scale to one third of the width is also one third of the
* height, leaving the movie at 11% of screen area — roughly 426x240 on a
* 1280px player, which is below watchable for narrative film.
*/
var DEFAULT_SQUEEZE_SCALE = .6;
/**
* Sentinel campaign/creative id for the house VAST backfill.
*
* It has no row in ad_campaigns or ad_creatives — it is synthesized from the
* ADS_VAST_TAG_URL env var, not from the database — so impression recording
* MUST skip it. Inserting would violate the foreign keys on ad_impressions and
* turn every unfilled break into a 500.
*/
var HOUSE_BACKFILL_ID = "house-backfill";
function eventSecret() {
	const s = private_env.ADS_EVENT_SECRET;
	if (!s) throw new Error("ADS_EVENT_SECRET is not set — ad decisioning is disabled");
	return s;
}
/**
* `<uuid>.<hmac>` — you cannot invent a decisionId, only replay one you were
* served. Replays are then absorbed by the monotonic status machine in the
* event endpoint, so a replay is a no-op rather than an inflated count.
*/
function signDecisionId(uuid, campaignId, creativeId) {
	return `${uuid}.${createHmac("sha256", eventSecret()).update(`${uuid}|${campaignId}|${creativeId}`).digest("base64url")}`;
}
function verifyDecisionId(decisionId, campaignId, creativeId) {
	const dot = decisionId.lastIndexOf(".");
	if (dot <= 0) return false;
	const uuid = decisionId.slice(0, dot);
	const given = decisionId.slice(dot + 1);
	const expected = createHmac("sha256", eventSecret()).update(`${uuid}|${campaignId}|${creativeId}`).digest("base64url");
	const a = Buffer.from(given);
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}
/**
* An empty target array means "unconstrained on this dimension", NOT "matches
* nothing". Getting this backwards silently stops every campaign from serving,
* which is why it is a named function rather than an inline `.includes()`.
*/
function matchesDimension(targets, value) {
	if (!targets || targets.length === 0) return true;
	if (!value) return false;
	return targets.includes(value);
}
function matchesTargeting(campaign, ctx) {
	if (campaign.excludeContentIds?.includes(ctx.contentId)) return "content excluded";
	if (campaign.targetGenres?.length) {
		if (!(ctx.genres ?? []).some((g) => campaign.targetGenres.includes(g))) return "genre mismatch";
	}
	if (!matchesDimension(campaign.targetRegions, ctx.country)) return "region mismatch";
	if (!matchesDimension(campaign.targetDeviceTypes, ctx.deviceType)) return "device mismatch";
	return null;
}
/**
* Rolling per-viewer cap, counted in Redis rather than Postgres.
*
* A counter with a TTL is the right shape here: it is written on every serve,
* read on every decision, and is worthless the moment its window closes. Anonymous
* viewers key on a hashed client id supplied by the caller.
*/
async function underFrequencyCap(campaignId, viewerKey, capPerViewer, capWindowHours) {
	if (!capPerViewer || capPerViewer <= 0) return true;
	try {
		const redis = getRedis();
		const key = `promo:cap:${campaignId}:${viewerKey}`;
		const n = await redis.get(key);
		return (n ? parseInt(n, 10) : 0) < capPerViewer;
	} catch {
		return true;
	}
}
async function recordFrequency(campaignId, viewerKey, capWindowHours) {
	try {
		const redis = getRedis();
		const key = `promo:cap:${campaignId}:${viewerKey}`;
		if (await redis.incr(key) === 1) await redis.expire(key, Math.max(1, capWindowHours) * 3600);
	} catch {}
}
/**
* The cue schedule for a title, or an empty list when the title carries no ads.
*
* Placement rules are re-checked here even though they are enforced at creation
* time, because breaks can be written by three paths (manual admin placement,
* the chapter generator, the interval generator) and only this one runs on
* every playback.
*/
async function planBreaks(contentId, runtimeSeconds, subscription) {
	const [content] = await db.select({ category: mediaLibrary.category }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!content || !adsAllowedOnCategory(content.category)) return [];
	if (!shouldShowAds(subscription)) return [];
	const [settings] = await db.select({ adsEnabled: adContentSettings.adsEnabled }).from(adContentSettings).where(eq(adContentSettings.contentId, contentId)).limit(1);
	if (settings && !settings.adsEnabled) return [];
	const rows = await db.select({
		id: adBreaks.id,
		positionSeconds: adBreaks.positionSeconds,
		kind: adBreaks.kind,
		format: adBreaks.format
	}).from(adBreaks).where(and(eq(adBreaks.contentId, contentId), eq(adBreaks.isActive, true))).orderBy(asc(adBreaks.positionSeconds));
	const cutoff = runtimeSeconds && runtimeSeconds > 0 ? runtimeSeconds * NO_BREAKS_AFTER_PCT : null;
	const plan = [];
	let lastPosition = -Infinity;
	for (const r of rows) {
		if (plan.length >= 4) break;
		if (cutoff !== null && r.positionSeconds > cutoff && r.kind !== "preroll") continue;
		if (r.kind !== "preroll" && r.positionSeconds - lastPosition < 300) continue;
		const scale = r.format ? Number.parseFloat(r.format) : DEFAULT_SQUEEZE_SCALE;
		plan.push({
			breakId: r.id,
			positionSeconds: r.positionSeconds,
			kind: r.kind === "preroll" ? "preroll" : "midroll",
			squeezeScale: Number.isFinite(scale) && scale > 0 && scale < 1 ? scale : DEFAULT_SQUEEZE_SCALE
		});
		if (r.kind !== "preroll") lastPosition = r.positionSeconds;
	}
	return plan;
}
/**
* Pick a campaign and creative for one break.
*
* Returns the winner plus every loser with its rejection reason. The caller
* discards the rejections in production and returns them for the admin dry-run.
*/
async function decide(ctx, opts = {}) {
	const rejections = [];
	const now = /* @__PURE__ */ new Date();
	const [content] = await db.select({
		category: mediaLibrary.category,
		genres: mediaLibrary.genres,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, ctx.contentId)).limit(1);
	if (!content) return {
		decision: null,
		rejections
	};
	if (!adsAllowedOnCategory(content.category)) return {
		decision: null,
		rejections
	};
	if (!shouldShowAds(ctx.subscription)) return {
		decision: null,
		rejections
	};
	const [settings] = await db.select({ adsEnabled: adContentSettings.adsEnabled }).from(adContentSettings).where(eq(adContentSettings.contentId, ctx.contentId)).limit(1);
	if (settings && !settings.adsEnabled) return {
		decision: null,
		rejections
	};
	const candidates = await db.select().from(adCampaigns).where(and(eq(adCampaigns.status, "active"), lt(adCampaigns.startsAt, now), or(isNull(adCampaigns.endsAt), gt(adCampaigns.endsAt, now)))).orderBy(desc(adCampaigns.priority), asc(adCampaigns.createdAt));
	const viewerKey = ctx.userId ?? "anon";
	for (const c of candidates) {
		const push = (reason) => {
			if (opts.explain) rejections.push({
				campaignId: c.id,
				campaignName: c.name,
				reason
			});
		};
		if (c.goalImpressions && c.deliveredImpressions >= c.goalImpressions) {
			push("goal reached");
			continue;
		}
		const miss = matchesTargeting({
			targetGenres: c.targetGenres ?? [],
			targetRegions: c.targetRegions ?? [],
			targetDeviceTypes: c.targetDeviceTypes ?? [],
			excludeContentIds: c.excludeContentIds ?? []
		}, {
			genres: content.genres ?? [],
			country: ctx.country,
			deviceType: ctx.deviceType,
			contentId: ctx.contentId
		});
		if (miss) {
			push(miss);
			continue;
		}
		if (!await underFrequencyCap(c.id, viewerKey, c.capPerViewer, c.capWindowHours)) {
			push("frequency cap reached");
			continue;
		}
		const creatives = await db.select().from(adCreatives).where(and(eq(adCreatives.campaignId, c.id), eq(adCreatives.isActive, true))).orderBy(desc(adCreatives.weight));
		if (creatives.length === 0) {
			push("no active creatives");
			continue;
		}
		const creative = creatives[djb2(`${viewerKey}:${ctx.contentId}`) % creatives.length];
		const duration = creative.durationSeconds ?? null;
		const behavior = duration !== null && duration <= 30 ? "duck" : "pause";
		return {
			decision: {
				decisionId: signDecisionId(randomUUID(), c.id, creative.id),
				campaignId: c.id,
				creativeId: creative.id,
				src: creative.videoObjectKey ?? creative.vastTagUrl ?? null,
				kind: creative.kind === "vast" ? "vast" : "video",
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
	const houseTag = private_env.ADS_VAST_TAG_URL;
	if (houseTag) {
		const uuid = randomUUID();
		const HOUSE_ID = HOUSE_BACKFILL_ID;
		return {
			decision: {
				decisionId: signDecisionId(uuid, HOUSE_ID, HOUSE_ID),
				campaignId: HOUSE_ID,
				creativeId: HOUSE_ID,
				src: houseTag,
				kind: "vast",
				durationSeconds: null,
				behavior: "pause",
				squeezeScale: DEFAULT_SQUEEZE_SCALE,
				clickUrl: null,
				ctaLabel: null,
				headline: null,
				body: null,
				mobileBehavior: "takeover"
			},
			rejections
		};
	}
	return {
		decision: null,
		rejections
	};
}
/** Same hash `chooseThumbnail()` uses, so selection behaviour is consistent. */
function djb2(s) {
	let h = 5381;
	for (let i = 0; i < s.length; i++) h = (h << 5) + h + s.charCodeAt(i) >>> 0;
	return h;
}
/** Record the served impression. Called by the decision endpoint. */
async function recordServed(decision, ctx, creatorId) {
	if (decision.campaignId === "house-backfill") return;
	await db.insert(adImpressions).values({
		decisionId: decision.decisionId,
		campaignId: decision.campaignId,
		creativeId: decision.creativeId,
		breakId: ctx.breakId ?? null,
		contentId: ctx.contentId,
		creatorId,
		userId: ctx.userId ?? null,
		status: "served",
		deviceType: ctx.deviceType ?? null,
		country: ctx.country ?? null,
		behavior: decision.behavior
	});
}
//#endregion
export { planBreaks as a, verifyDecisionId as c, decide as i, HOUSE_BACKFILL_ID as n, recordFrequency as o, NO_BREAKS_AFTER_PCT as r, recordServed as s, DEFAULT_SQUEEZE_SCALE as t };
