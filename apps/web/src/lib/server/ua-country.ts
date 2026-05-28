/**
 * Minimal UA + country fingerprinting helpers for analytics. Intentionally
 * dependency-free — we don't need `ua-parser-js` precision for "mobile vs
 * desktop vs tv" bucket counts, and adding a dep for it would be overkill.
 *
 * Country comes from edge headers set by the upstream CDN (Cloudflare's
 * `cf-ipcountry`, Bunny's `cdn-loop` doesn't carry it but `x-forwarded-for`
 * via MaxMind would — Bunny doesn't add country directly today, so this
 * helper returns null when the header isn't present, which is honest.
 */

export type DeviceType = 'mobile' | 'tablet' | 'tv' | 'desktop' | 'bot';

export interface ClientFingerprint {
	deviceType: DeviceType | null;
	browser: string | null;
	osName: string | null;
	country: string | null;
}

export function fingerprintFromHeaders(headers: Headers): ClientFingerprint {
	const ua = headers.get('user-agent') ?? '';
	const country = (
		headers.get('cf-ipcountry')
		?? headers.get('x-vercel-ip-country')
		?? headers.get('x-country-code')
		?? null
	)?.toUpperCase() ?? null;

	if (!ua) return { deviceType: null, browser: null, osName: null, country };

	const lower = ua.toLowerCase();
	const isBot = /bot|crawl|spider|slurp|facebookexternalhit|googlebot|bingbot/.test(lower);
	const isTv = /smart-tv|smarttv|appletv|googletv|roku|hbbtv|netcast/.test(lower);
	const isTablet = /ipad|tablet|playbook|silk|kindle/.test(lower);
	const isMobile = !isTablet && /mobi|iphone|ipod|android(?!.*tablet)|blackberry|iemobile|opera m(ob|in)i/.test(lower);

	const deviceType: DeviceType = isBot
		? 'bot'
		: isTv
			? 'tv'
			: isTablet
				? 'tablet'
				: isMobile
					? 'mobile'
					: 'desktop';

	const browser = matchFirst(lower, [
		['edg/', 'Edge'],
		['chrome/', 'Chrome'],
		['firefox/', 'Firefox'],
		['safari/', 'Safari'],
		['opera/', 'Opera'],
		['msie ', 'IE'],
		['trident/', 'IE']
	]);

	const osName = matchFirst(lower, [
		['windows nt 10', 'Windows 10'],
		['windows nt 11', 'Windows 11'],
		['windows nt', 'Windows'],
		['mac os x', 'macOS'],
		['android', 'Android'],
		['iphone os', 'iOS'],
		['ipad; cpu os', 'iPadOS'],
		['linux', 'Linux']
	]);

	return { deviceType, browser, osName, country };
}

function matchFirst(haystack: string, pairs: Array<[string, string]>): string | null {
	for (const [needle, label] of pairs) {
		if (haystack.includes(needle)) return label;
	}
	return null;
}
