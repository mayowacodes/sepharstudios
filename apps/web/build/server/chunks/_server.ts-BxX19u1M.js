import { e as error, j as json, p as private_env } from './index.js-CxPEndTa.js';
import { d as db, P as paystackSubscriptions, m as mediaLibrary } from './drizzle-C3SH12nS.js';
import { f as getPresignedUrl } from './minio-CSpfiG3D.js';
import { d as decide, r as recordServed, a as recordFrequency } from './decision-D3MG31ZT.js';
import { e as enforceRateLimit } from './rate-limit-Bpg0lNN3.js';
import { f as fingerprintFromHeaders } from './ua-country-BNOH1xSS.js';
import { and, eq, inArray, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'minio';
import './redis-7fSdOjSS.js';
import 'ioredis';
import './paystack-DWLDZ9qO.js';
import 'node:crypto';

//#region src/lib/server/ads/vast.ts
/**
* VAST parsing for third-party ad demand.
*
* SERVER-SIDE, deliberately — the Google IMA SDK is not used. Four reasons,
* each of which alone would be disqualifying for the squeeze-back format:
*
*   1. IMA wants to own the content <video> element for pause/resume. That is a
*      direct collision with the rule that exactly one code path may ever touch
*      the HLS-owned element (see VideoPlayer's src effect).
*   2. Duration must be known BEFORE the ad element exists, because it decides
*      pause-vs-duck at the instant the break opens. IMA only surfaces duration
*      after LOADED — too late.
*   3. On iOS, IMA forces fullscreen, which destroys the squeeze layout.
*   4. It has no support story for capacitor:// or tauri:// origins, so it
*      would silently break the Android and desktop builds.
*
* Parsed output is normalised to the same shape as a first-party creative, so
* the player has exactly one rendering path.
*
* SECURITY: this consumes untrusted XML fetched from a URL an operator typed.
* Both an XXE and an SSRF guard are load-bearing, not defensive decoration.
*/
var MAX_WRAPPER_DEPTH = 5;
var FETCH_TIMEOUT_MS = 3e3;
var MAX_CHAIN_MS = 5e3;
var MAX_BODY_BYTES = 256 * 1024;
function emptyTrackers() {
	return {
		impression: [],
		start: [],
		firstQuartile: [],
		midpoint: [],
		thirdQuartile: [],
		complete: [],
		skip: [],
		clickTracking: [],
		error: []
	};
}
/**
* Reject anything that could make our server fetch an internal address.
*
* The tag URL comes from an admin form, so a compromised or careless operator
* could point it at the metadata service, a database, or localhost. DNS is not
* re-resolved here, so this does not close a rebinding attack — it closes the
* far more likely case of a literal private address.
*/
function assertSafeUrl(raw) {
	let url;
	try {
		url = new URL(raw);
	} catch {
		throw new Error("VAST tag URL is not a valid URL");
	}
	if (url.protocol !== "https:") throw new Error("VAST tag URL must be https");
	const host = url.hostname.toLowerCase();
	if (host === "localhost" || host === "::1" || host.endsWith(".localhost") || host.endsWith(".internal") || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || /^169\.254\./.test(host) || /^0\./.test(host)) throw new Error("VAST tag URL resolves to a private address");
	return url;
}
/**
* Strip anything that could trigger entity expansion before parsing.
*
* A general XML parser with entities enabled will happily read
* `/etc/passwd` — or the cloud metadata endpoint — out of a DOCTYPE. The VAST
* subset consumed here is genuinely shallow (eight element types), so a
* hand-rolled extractor is both sufficient and safer than pulling in a parser
* that has to be configured correctly to be safe.
*/
function stripDoctype(xml) {
	return xml.replace(/<!DOCTYPE[\s\S]*?>/gi, "").replace(/<!ENTITY[\s\S]*?>/gi, "");
}
function decodeEntities(s) {
	return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&").trim();
}
function allTags(xml, tag) {
	const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
	const out = [];
	let m;
	while ((m = re.exec(xml)) !== null) out.push(decodeEntities(m[1] ?? ""));
	return out;
}
function attr(openTag, name) {
	return new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i").exec(openTag)?.[1] ?? null;
}
/** `HH:MM:SS(.mmm)` → seconds. */
function parseVastDuration(v) {
	const parts = v.trim().split(":").map((p) => Number.parseFloat(p));
	if (parts.some((n) => !Number.isFinite(n))) return 0;
	if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
	if (parts.length === 2) return parts[0] * 60 + parts[1];
	return parts[0] ?? 0;
}
/** `00:00:05` or `25%` → seconds, given the ad's duration. */
function parseSkipOffset(v, durationSeconds) {
	if (!v) return null;
	if (v.trim().endsWith("%")) {
		const pct = Number.parseFloat(v);
		return Number.isFinite(pct) ? Math.round(pct / 100 * durationSeconds) : null;
	}
	const secs = parseVastDuration(v);
	return secs > 0 ? secs : null;
}
function collectTrackers(xml, into) {
	into.impression.push(...allTags(xml, "Impression").filter(Boolean));
	into.error.push(...allTags(xml, "Error").filter(Boolean));
	into.clickTracking.push(...allTags(xml, "ClickTracking").filter(Boolean));
	const re = /<Tracking\b([^>]*)>([\s\S]*?)<\/Tracking>/gi;
	let m;
	while ((m = re.exec(xml)) !== null) {
		const event = (attr(m[1] ?? "", "event") ?? "").toLowerCase();
		const url = decodeEntities(m[2] ?? "");
		if (!url) continue;
		switch (event) {
			case "start":
				into.start.push(url);
				break;
			case "firstquartile":
				into.firstQuartile.push(url);
				break;
			case "midpoint":
				into.midpoint.push(url);
				break;
			case "thirdquartile":
				into.thirdQuartile.push(url);
				break;
			case "complete":
				into.complete.push(url);
				break;
			case "skip":
				into.skip.push(url);
				break;
		}
	}
}
/**
* Pick the best MediaFile.
*
* Progressive MP4/WebM only: the ad plays in a plain <video> alongside the
* movie, and an HLS or DASH ad would need a second streaming engine running
* concurrently with the one already decoding the film.
*
* In duck mode the ad shares bandwidth with a still-playing movie, so a
* lower-bitrate file is preferred — a heavyweight ad would force hls.js to
* downshift the film's quality, which the viewer experiences as the ad
* degrading the content.
*/
function chooseMediaFile(xml, preferLowBitrate) {
	const re = /<MediaFile\b([^>]*)>([\s\S]*?)<\/MediaFile>/gi;
	const candidates = [];
	let m;
	while ((m = re.exec(xml)) !== null) {
		const attrs = m[1] ?? "";
		const url = decodeEntities(m[2] ?? "");
		if (!url) continue;
		const type = (attr(attrs, "type") ?? "").toLowerCase();
		if (!/^video\/(mp4|webm)$/.test(type)) continue;
		const delivery = (attr(attrs, "delivery") ?? "").toLowerCase();
		if (delivery && delivery !== "progressive") continue;
		candidates.push({
			url,
			width: Number(attr(attrs, "width")) || null,
			height: Number(attr(attrs, "height")) || null,
			bitrate: Number(attr(attrs, "bitrate")) || null
		});
	}
	if (candidates.length === 0) return null;
	const score = (c) => c.bitrate ?? c.height ?? 0;
	return candidates.reduce((best, c) => preferLowBitrate ? score(c) < score(best) ? c : best : score(c) > score(best) ? c : best);
}
async function fetchXml(url, signal) {
	const res = await fetch(url, {
		signal,
		redirect: "follow",
		headers: { accept: "application/xml, text/xml" }
	});
	if (!res.ok) throw new Error(`VAST fetch failed: HTTP ${res.status}`);
	const reader = res.body?.getReader();
	if (!reader) return (await res.text()).slice(0, MAX_BODY_BYTES);
	const chunks = [];
	let total = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		if (value) {
			total += value.byteLength;
			if (total > MAX_BODY_BYTES) break;
			chunks.push(value);
		}
	}
	return new TextDecoder().decode(chunks.reduce((acc, c) => {
		const merged = new Uint8Array(acc.length + c.length);
		merged.set(acc);
		merged.set(c, acc.length);
		return merged;
	}, /* @__PURE__ */ new Uint8Array()));
}
function expandMacros(template, ctx) {
	const cacheBuster = Math.floor(Math.random() * 1e9).toString();
	return template.replaceAll("[CONTENT_ID]", ctx.contentId ?? "").replaceAll("[CACHEBUSTER]", cacheBuster).replaceAll("[TIMESTAMP]", (/* @__PURE__ */ new Date()).toISOString()).replaceAll("[REFERRER]", ctx.referrer ? encodeURIComponent(ctx.referrer) : "").replaceAll("[PLAYER_WIDTH]", String(ctx.playerWidth ?? 0)).replaceAll("[PLAYER_HEIGHT]", String(ctx.playerHeight ?? 0)).replaceAll("[CONTENTPLAYHEAD]", String(ctx.playhead ?? 0));
}
/**
* Resolve a VAST tag to a playable creative, following wrapper redirects.
*
* Wrapper trackers from EVERY level are accumulated, not just the final inline
* ad's. Dropping them is the classic VAST integration bug: intermediaries
* under-count, and the partner concludes the inventory does not deliver.
*/
async function fetchVast(tagUrl, opts = {}) {
	const deadline = Date.now() + MAX_CHAIN_MS;
	const trackers = emptyTrackers();
	let currentUrl = expandMacros(tagUrl, {
		contentId: opts.contentId,
		referrer: opts.referrer
	});
	for (let depth = 0; depth < MAX_WRAPPER_DEPTH; depth++) {
		if (Date.now() > deadline) throw new Error("VAST wrapper chain exceeded its time budget");
		const url = assertSafeUrl(currentUrl);
		const controller = new AbortController();
		const perRequest = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
		let xml;
		try {
			xml = stripDoctype(await fetchXml(url, controller.signal));
		} finally {
			clearTimeout(perRequest);
		}
		collectTrackers(xml, trackers);
		const next = allTags(xml, "VASTAdTagURI")[0];
		if (next) {
			currentUrl = next;
			continue;
		}
		const durationRaw = allTags(xml, "Duration")[0];
		const durationSeconds = durationRaw ? parseVastDuration(durationRaw) : 0;
		const media = chooseMediaFile(xml, opts.preferLowBitrate ?? false);
		if (!media) return null;
		const linearOpen = /<Linear\b([^>]*)>/i.exec(xml)?.[1] ?? "";
		return {
			mediaUrl: media.url,
			durationSeconds,
			clickThrough: allTags(xml, "ClickThrough")[0] ?? null,
			skipOffsetSeconds: parseSkipOffset(attr(linearOpen, "skipoffset"), durationSeconds),
			width: media.width,
			height: media.height,
			bitrateKbps: media.bitrate,
			trackers
		};
	}
	throw new Error(`VAST wrapper chain exceeded ${MAX_WRAPPER_DEPTH} levels`);
}
/**
* Fire third-party pixels from the server.
*
* Server-side by default: no third-party network calls from the page, nothing
* for an ad blocker to intercept, identical behaviour inside the Capacitor
* WebView, and the viewer's IP is never handed to the partner.
*
* The trade-off is real — some demand partners discount server-fired pixels
* because the IP and UA are ours. `ad_campaigns.trackingMode` exists so a
* partner whose contract requires client-side firing can have it per campaign.
*/
async function fireTrackers(urls) {
	await Promise.allSettled(urls.map(async (raw) => {
		try {
			const url = assertSafeUrl(raw);
			const controller = new AbortController();
			const t = setTimeout(() => controller.abort(), 2e3);
			try {
				await fetch(url, {
					signal: controller.signal,
					redirect: "follow"
				});
			} finally {
				clearTimeout(t);
			}
		} catch {}
	}));
}
//#endregion
//#region src/routes/api/promo/decision/+server.ts
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
var CREATIVE_URL_TTL_SECONDS = 900;
var POST = async ({ request, locals, url, getClientAddress }) => {
	const session = await locals.auth.getSession();
	await enforceRateLimit(`promo:decision:${session?.user.id ?? getClientAddress()}`, {
		capacity: 20,
		refillPerSec: .5
	});
	const body = await request.json().catch(() => null);
	const contentId = body?.contentId;
	if (!contentId) throw error(400, "contentId is required");
	const fp = fingerprintFromHeaders(request.headers);
	let subscription = null;
	if (session) {
		const [active] = await db.select({
			plan: paystackSubscriptions.plan,
			status: paystackSubscriptions.status
		}).from(paystackSubscriptions).where(and(eq(paystackSubscriptions.userId, session.user.id), inArray(paystackSubscriptions.status, ["active", "trial"]))).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
		subscription = active ?? null;
	}
	const explain = session?.user.role === "admin" && url.searchParams.get("explain") === "1";
	const { decision, rejections } = await decide({
		contentId,
		breakId: body?.breakId,
		userId: session?.user.id ?? null,
		deviceType: fp.deviceType,
		country: fp.country,
		subscription
	}, { explain });
	if (!decision) return json({
		ad: null,
		...explain ? { rejections } : {}
	});
	let src;
	if (decision.kind === "vast") {
		if (!decision.src) return json({ ad: null });
		try {
			const vast = await fetchVast(decision.src, {
				preferLowBitrate: decision.behavior === "duck",
				contentId,
				referrer: request.headers.get("referer")
			});
			if (!vast) return json({ ad: null });
			src = vast.mediaUrl;
			if (vast.durationSeconds > 0) {
				decision.durationSeconds = vast.durationSeconds;
				decision.behavior = vast.durationSeconds <= 30 ? "duck" : "pause";
			}
			if (vast.clickThrough) decision.clickUrl = vast.clickThrough;
			fireTrackers(vast.trackers.impression);
		} catch (err) {
			console.error("[promo/decision] VAST resolution failed:", err instanceof Error ? err.message : err);
			return json({ ad: null });
		}
	} else {
		if (!decision.src) return json({ ad: null });
		src = await getPresignedUrl(private_env.ADS_CREATIVE_BUCKET || "sephar-promo", decision.src, CREATIVE_URL_TTL_SECONDS);
	}
	const [content] = await db.select({ creatorId: mediaLibrary.creatorId }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	await recordServed(decision, {
		contentId,
		breakId: body?.breakId,
		userId: session?.user.id ?? null,
		deviceType: fp.deviceType,
		country: fp.country
	}, content?.creatorId ?? null);
	if (decision.campaignId !== "house-backfill") recordFrequency(decision.campaignId, session?.user.id ?? "anon", 24);
	return json({
		ad: {
			...decision,
			src
		},
		...explain ? { rejections } : {}
	});
};

export { POST };
//# sourceMappingURL=_server.ts-BxX19u1M.js.map
