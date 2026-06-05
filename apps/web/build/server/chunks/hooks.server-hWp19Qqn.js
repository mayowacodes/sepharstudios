import { w as db, a5 as session } from './drizzle-CKUH7ukq.js';
import { d as auth } from './auth-B1iRtYym.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './constants-BEpeHz1K.js';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './server2-D6YOLBns.js';
import './string-DVvRuJqu.js';
import './analytics-C04NmVoh.js';
import '@openpanel/sdk';
import 'zod';
import './hmac-DQSDUlCl.js';
import './utils-BQDJK5Ro.js';
import 'node:crypto';
import './sha2-Cn2-4DsP.js';
import 'node:fs';
import 'node:fs/promises';
import 'node:os';
import 'node:path';

//#region \0virtual:__sveltekit/environment
var building = false;

//#region ../../node_modules/better-auth/dist/integrations/svelte-kit.mjs
var svelteKitHandler = async ({ auth, event, resolve, building }) => {
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
async function handle({ event, resolve }) {
	const hostname = (event.request.headers.get("x-forwarded-host") || event.request.headers.get("host") || "").split(",")[0].trim().toLowerCase().split(":")[0];
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
	if (isAdminSubdomain && !isAuthPath) {
		if (!user) return Response.redirect(`${apexOrigin}/auth/login?redirectTo=${encodeURIComponent("https://admin.sepharstudios.com/admin")}`, 307);
		if (user.role !== "admin") return Response.redirect(`${apexOrigin}/access-denied?reason=admin`, 307);
		if (deviceType === "tv" || deviceType === "mobile") return new Response("Access Denied: Admin portal is not available on this device.", { status: 403 });
	}
	if (isCreatorsSubdomain && !isAuthPath) {
		if (!user) return Response.redirect(`${apexOrigin}/auth/login?redirectTo=${encodeURIComponent("https://creators.sepharstudios.com/creator")}`, 307);
		if (user.role !== "creator" && user.role !== "admin") return Response.redirect(`${apexOrigin}/access-denied?reason=creator`, 307);
		if (deviceType === "tv" || deviceType === "mobile") return new Response("Access Denied: Creator tools are not available on this device.", { status: 403 });
	}
	if (isCreatorsSubdomain && path === "/") return Response.redirect(`${event.url.origin}/creator`, 307);
	if (isAdminSubdomain && path === "/") return Response.redirect(`${event.url.origin}/admin`, 307);
	if (isKidsSubdomain && path === "/") return Response.redirect(`${event.url.origin}/kids`, 307);
	return svelteKitHandler({
		event,
		resolve,
		auth,
		building
	});
}

export { handle };
//# sourceMappingURL=hooks.server-hWp19Qqn.js.map
