import { a as auth } from "./auth.js";
import "@better-auth/core/db";
import "better-call";
import "@better-auth/core/env";
import "@better-auth/core/error";
import "@better-auth/core/utils";
import "@better-auth/utils/base64";
import "@better-auth/utils/binary";
import "@better-auth/utils/hmac";
import "@better-auth/core/api";
import { b as building } from "./environment.js";
import { d as db, E as session } from "./drizzle.js";
import { eq } from "drizzle-orm";
const svelteKitHandler = async ({ auth: auth2, event, resolve, building: building2 }) => {
  if (building2) return resolve(event);
  const { request, url } = event;
  if (isAuthPath(url.toString(), auth2.options)) return auth2.handler(request);
  return resolve(event);
};
function isAuthPath(url, options) {
  const _url = new URL(url);
  const baseURL = new URL(`${options.baseURL || _url.origin}${options.basePath || "/api/auth"}`);
  if (_url.origin !== baseURL.origin) return false;
  if (!_url.pathname.startsWith(baseURL.pathname.endsWith("/") ? baseURL.pathname : `${baseURL.pathname}/`)) return false;
  return true;
}
async function handle({ event, resolve }) {
  const rawHost = event.request.headers.get("x-forwarded-host") || event.request.headers.get("host") || "";
  const host = rawHost.split(",")[0].trim().toLowerCase();
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
  if (path.startsWith("/admin") && !isAdminSubdomain && !hostname.includes("localhost")) {
    return new Response("Not Found", { status: 404 });
  }
  if (path.startsWith("/creator") && !isCreatorsSubdomain && !hostname.includes("localhost")) {
    return new Response("Not Found", { status: 404 });
  }
  let session$1 = null;
  try {
    session$1 = await auth.api.getSession({
      headers: event.request.headers
    });
  } catch (error) {
    console.error("Failed to load auth session:", error);
  }
  if (session$1) {
    event.locals.session = session$1.session;
    event.locals.user = session$1.user;
    if (event.locals.session.deviceType !== deviceType) {
      db.update(session).set({ deviceType }).where(eq(session.id, event.locals.session.id)).execute().catch((err) => console.error("Failed to update session deviceType:", err));
    }
  } else {
    event.locals.session = void 0;
    event.locals.user = void 0;
  }
  event.locals.activeProfileId = event.cookies.get("activeProfileId") || void 0;
  const user = event.locals.user;
  if (isAdminSubdomain) {
    if (!user || user.role !== "admin") {
      return Response.redirect(`${event.url.origin}/auth/login`, 307);
    }
    if (deviceType === "tv" || deviceType === "mobile") {
      return new Response("Access Denied: Admin portal is not available on this device.", { status: 403 });
    }
  }
  if (isCreatorsSubdomain) {
    if (!user || user.role !== "creator" && user.role !== "admin") {
      return Response.redirect(`${event.url.origin}/auth/login`, 307);
    }
    if (deviceType === "tv" || deviceType === "mobile") {
      return new Response("Access Denied: Creator tools are not available on this device.", { status: 403 });
    }
  }
  if (isCreatorsSubdomain && path === "/") {
    return Response.redirect(`${event.url.origin}/creator`, 307);
  }
  if (isAdminSubdomain && path === "/") {
    return Response.redirect(`${event.url.origin}/admin`, 307);
  }
  if (isKidsSubdomain && path === "/") {
    return Response.redirect(`${event.url.origin}/kids`, 307);
  }
  return svelteKitHandler({ event, resolve, auth, building });
}
export {
  handle
};
