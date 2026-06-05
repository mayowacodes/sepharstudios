//#region src/lib/server/ua-country.ts
function fingerprintFromHeaders(headers) {
	const ua = headers.get("user-agent") ?? "";
	const country = (headers.get("cf-ipcountry") ?? headers.get("x-vercel-ip-country") ?? headers.get("x-country-code") ?? null)?.toUpperCase() ?? null;
	if (!ua) return {
		deviceType: null,
		browser: null,
		osName: null,
		country
	};
	const lower = ua.toLowerCase();
	const isBot = /bot|crawl|spider|slurp|facebookexternalhit|googlebot|bingbot/.test(lower);
	const isTv = /smart-tv|smarttv|appletv|googletv|roku|hbbtv|netcast/.test(lower);
	const isTablet = /ipad|tablet|playbook|silk|kindle/.test(lower);
	const isMobile = !isTablet && /mobi|iphone|ipod|android(?!.*tablet)|blackberry|iemobile|opera m(ob|in)i/.test(lower);
	return {
		deviceType: isBot ? "bot" : isTv ? "tv" : isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
		browser: matchFirst(lower, [
			["edg/", "Edge"],
			["chrome/", "Chrome"],
			["firefox/", "Firefox"],
			["safari/", "Safari"],
			["opera/", "Opera"],
			["msie ", "IE"],
			["trident/", "IE"]
		]),
		osName: matchFirst(lower, [
			["windows nt 10", "Windows 10"],
			["windows nt 11", "Windows 11"],
			["windows nt", "Windows"],
			["mac os x", "macOS"],
			["android", "Android"],
			["iphone os", "iOS"],
			["ipad; cpu os", "iPadOS"],
			["linux", "Linux"]
		]),
		country
	};
}
function matchFirst(haystack, pairs) {
	for (const [needle, label] of pairs) if (haystack.includes(needle)) return label;
	return null;
}

export { fingerprintFromHeaders as f };
//# sourceMappingURL=ua-country-BNOH1xSS.js.map
