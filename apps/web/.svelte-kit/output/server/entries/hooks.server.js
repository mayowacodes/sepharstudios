import { t as building } from "../chunks/internal2.js";
import { i as session, t as db } from "../chunks/drizzle.js";
import { t as auth } from "../chunks/auth.js";
import { eq } from "drizzle-orm";
//#region ../../node_modules/.bun/better-auth@1.6.23+3a31d3dd3b463ac7/node_modules/better-auth/dist/integrations/svelte-kit.mjs
var svelteKitHandler = async ({ auth, event, resolve, building }) => {
	if (building) return resolve(event);
	const { request, url } = event;
	if (isAuthPath(url.toString(), auth.options)) return auth.handler(request);
	return resolve(event);
};
function isAuthPath(url, options) {
	const _url = new URL(url);
	const baseURLStr = typeof options.baseURL === "string" ? options.baseURL : void 0;
	const baseURL = new URL(`${baseURLStr || _url.origin}${options.basePath || "/api/auth"}`);
	if (_url.origin !== baseURL.origin) return false;
	if (!_url.pathname.startsWith(baseURL.pathname.endsWith("/") ? baseURL.pathname : `${baseURL.pathname}/`)) return false;
	return true;
}
//#endregion
//#region src/hooks.server.ts
var SCANNER_PATTERNS = [
	/^\/config\//,
	/^\/storage\//,
	/^\/var\/log\//,
	/^\/var\/(www|task)\//,
	/^\/logs?\//,
	/^\/(database|dump|backup|db)\.sql$/,
	/^\/\.npmrc$/,
	/^\/\.yarnrc(?:\.yml)?$/,
	/^\/composer\.json$/,
	/^\/\.pypirc$/,
	/^\/\.vscode\//,
	/^\/\.idea\//,
	/^\/\.github\//,
	/^\/\.gitlab-ci\.yml$/,
	/^\/Jenkinsfile$/,
	/^\/(next|nuxt|vite)\.config\.js$/,
	/^\/(firebase|amplify|vercel)\.(json|yml)$/,
	/^\/\.firebase\//,
	/^\/\.env(\.|$)/,
	/^\/aws\.env$/,
	/^\/[^/]+\/\.env(\.|$)/,
	/^\/[^/]+\/env\.js$/,
	/^\/[^/]+\/(?:config\/)?constants?\.js$/,
	/^\/\.git(\/|-?credentials$|$)/,
	/^\/wp-(admin|login|content|includes)\//,
	/^\/wp-config\.php(\.|$)/,
	/^\/wp-login\.php$/,
	/^\/wp-json\//,
	/^\/wp_mail_smtp\.ini$/,
	/^\/(phpmyadmin|pma|adminer)\//,
	/^\/webhooks?(?:-test|-waiting)?(?:\/|$)/,
	/^\/webmin\//,
	/^\/\.aws\//,
	/^\/\.ssh\//
];
var FORM_PROBE_POST_PATHS = /* @__PURE__ */ new Set([
	"/",
	"/login",
	"/wp-login.php",
	"/admin/login",
	"/user/login"
]);
function isScannerPath(pathname) {
	return SCANNER_PATTERNS.some((re) => re.test(pathname));
}
function isFormProbePost(method, pathname) {
	return method === "POST" && FORM_PROBE_POST_PATHS.has(pathname);
}
/**
* Origins the Capacitor (Android) and Tauri (desktop) shells can present.
*
* These are fixed strings baked into the platforms — Android WebView serves the
* bundle from `http://localhost` (or `capacitor://localhost` on the older
* scheme), Tauri from `tauri://localhost` on Linux/macOS and
* `https://tauri.localhost` on Windows/WebView2. No remote website can claim
* them, so allowing them is not the same class of risk as a wildcard.
*
* Deliberately NOT `*`: these responses carry user data, and the native builds
* authenticate with a bearer token, so an echo-any-origin policy would let any
* page that got hold of a token read the API from a browser context too.
*/
var NATIVE_ORIGINS = /* @__PURE__ */ new Set([
	"capacitor://localhost",
	"http://localhost",
	"tauri://localhost",
	"https://tauri.localhost"
]);
function nativeCorsHeaders(origin) {
	return {
		"access-control-allow-origin": origin,
		"access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
		"access-control-allow-headers": "content-type, authorization",
		"access-control-expose-headers": "set-auth-token",
		"access-control-max-age": "86400",
		"vary": "origin"
	};
}
async function handle({ event, resolve }) {
	if (isScannerPath(event.url.pathname)) return new Response("Not Found", {
		status: 404,
		headers: { "cache-control": "no-store" }
	});
	const reqOrigin = event.request.headers.get("origin") ?? "";
	const isNativeOrigin = NATIVE_ORIGINS.has(reqOrigin);
	const isNativeApiPath = event.url.pathname.startsWith("/api/");
	if (isNativeOrigin && isNativeApiPath && event.request.method === "OPTIONS") return new Response(null, {
		status: 204,
		headers: nativeCorsHeaders(reqOrigin)
	});
	if (isFormProbePost(event.request.method, event.url.pathname)) return new Response("Method Not Allowed", {
		status: 405,
		headers: {
			"cache-control": "no-store",
			"allow": "GET, HEAD"
		}
	});
	const host = (event.request.headers.get("x-forwarded-host") || event.request.headers.get("host") || "").split(",")[0].trim().toLowerCase();
	const hostname = host.split(":")[0];
	const ua = event.request.headers.get("user-agent") || "";
	const isTV = /TV|Large Screen|SmartTV|AppleTV|AndroidTV|STB/i.test(ua);
	const isTablet = /Tablet|iPad|PlayBook|Silk/i.test(ua);
	const isMobile = /Mobi/i.test(ua) && !isTablet;
	const deviceType = isTV ? "tv" : isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
	event.locals.deviceType = deviceType;
	const isCreatorsSubdomain = hostname.startsWith("creator.") || hostname.startsWith("creators.");
	const isAdminSubdomain = hostname.startsWith("admin.");
	const isKidsSubdomain = hostname.startsWith("kids.");
	event.locals.subdomain = isCreatorsSubdomain ? "creator" : isAdminSubdomain ? "admin" : isKidsSubdomain ? "kids" : "app";
	const path = event.url.pathname;
	const isAuthPath = path.startsWith("/auth") || path.startsWith("/api/auth");
	if (path.startsWith("/admin") && !isAdminSubdomain && !hostname.includes("localhost")) return Response.redirect(`https://admin.sepharstudios.com${path}`, 307);
	if (path.startsWith("/creator") && !isCreatorsSubdomain && !hostname.includes("localhost")) return Response.redirect(`https://creators.sepharstudios.com${path}`, 307);
	let session$1 = null;
	try {
		session$1 = await auth.api.getSession({ headers: event.request.headers });
	} catch (error) {
		console.error("Failed to load auth session:", error);
	}
	if (session$1) {
		event.locals.session = session$1.session;
		event.locals.user = session$1.user;
		if (event.locals.session.deviceType !== deviceType) db.update(session).set({ deviceType }).where(eq(session.id, event.locals.session.id)).execute().catch((err) => console.error("Failed to update session deviceType:", err));
	} else {
		event.locals.session = void 0;
		event.locals.user = void 0;
	}
	event.locals.auth = { getSession: async () => session$1 };
	event.locals.activeProfileId = event.cookies.get("activeProfileId") || void 0;
	const user = event.locals.user;
	const apexOrigin = `https://${hostname.includes("localhost") ? hostname : hostname.split(".").slice(-2).join(".")}`;
	const isApiPath = path.startsWith("/api/");
	if (isAdminSubdomain && !isAuthPath) {
		if (!user) return Response.redirect(`${apexOrigin}/auth/login?redirectTo=${encodeURIComponent("https://admin.sepharstudios.com/admin")}`, 307);
		if (user.role !== "admin") return Response.redirect(`${apexOrigin}/access-denied?reason=admin`, 307);
		if (!isApiPath && (deviceType === "tv" || deviceType === "mobile")) return new Response("Access Denied: Admin portal is not available on this device.", { status: 403 });
	}
	if (isCreatorsSubdomain && !isAuthPath) {
		if (!user) return Response.redirect(`${apexOrigin}/auth/login?redirectTo=${encodeURIComponent("https://creators.sepharstudios.com/creator")}`, 307);
		if (user.role !== "creator" && user.role !== "admin") return Response.redirect(`${apexOrigin}/access-denied?reason=creator`, 307);
		if (!isApiPath && (deviceType === "tv" || deviceType === "mobile")) return new Response("Access Denied: Creator tools are not available on this device.", { status: 403 });
	}
	const sameOriginBase = `${event.request.headers.get("x-forwarded-proto") ?? event.url.protocol.replace(":", "") ?? "https"}://${host}`;
	if (isCreatorsSubdomain && path === "/") return Response.redirect(`${sameOriginBase}/creator`, 307);
	if (isAdminSubdomain && path === "/") return Response.redirect(`${sameOriginBase}/admin`, 307);
	if (isKidsSubdomain && path === "/") return Response.redirect(`${sameOriginBase}/kids`, 307);
	const response = await svelteKitHandler({
		event,
		resolve,
		auth,
		building
	});
	if (isNativeOrigin && isNativeApiPath) for (const [k, v] of Object.entries(nativeCorsHeaders(reqOrigin))) response.headers.set(k, v);
	return response;
}
//#endregion
export { handle };
