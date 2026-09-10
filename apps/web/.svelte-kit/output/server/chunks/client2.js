import { error } from "@sveltejs/kit";
//#region src/lib/api/client.ts
/**
* The one door every route's data goes through.
*
* Why this exists: the app ships in two shapes from one codebase. The web build
* runs adapter-node, so a load function executes on the server and can talk to
* Postgres directly. The Capacitor/Tauri builds are a static SPA — there is no
* server in the bundle at all, so the *same* load function has to reach the
* deployed origin over HTTPS instead.
*
* `+page.ts` universal loads satisfy both: SvelteKit runs them on the server for
* the web build (SSR and SEO unaffected) and in the WebView for native. The only
* thing that differs is the origin and how credentials travel, which is exactly
* what this module absorbs.
*
* Credentials:
*   web    — same-origin cookies, already attached. Nothing to do.
*   native — a capacitor:// or tauri:// page is cross-origin to
*            sepharstudios.com, so cookies are not sent. We use better-auth's
*            bearer token instead, held in `tokenStore`.
*/
/** Origin serving /api/*. '' on web (same-origin), the https origin on native. */
var API_ORIGIN = "https://sepharstudios.com";
/**
* Bearer token storage for the native builds.
*
* localStorage is deliberate rather than lazy: both Capacitor's WebView and
* Tauri's WebView persist it across launches, and it is scoped to the app's own
* origin, which no other app can reach. It is read on every request rather than
* cached in a module variable so a sign-out in one tab/window can't leave a
* stale token behind in another.
*/
var tokenStore = {
	get() {
		return null;
	},
	set(token) {},
	clear() {}
};
var ApiError = class extends Error {
	status;
	path;
	constructor(status, path, message) {
		super(message);
		this.status = status;
		this.path = path;
		this.name = "ApiError";
	}
};
/**
* Fetch JSON from the platform API.
*
* Throws ApiError on a non-2xx so load functions can map failures onto
* SvelteKit's `error()` instead of silently rendering empty state.
*/
async function api(path, options = {}) {
	const { fetch: fetchImpl, headers, ...init } = options;
	const doFetch = fetchImpl ?? globalThis.fetch;
	const url = `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
	const merged = new Headers(headers);
	if (!merged.has("accept")) merged.set("accept", "application/json");
	{
		const token = tokenStore.get();
		if (token) merged.set("authorization", `Bearer ${token}`);
	}
	const res = await doFetch(url, {
		...init,
		headers: merged,
		credentials: "omit"
	});
	{
		const rotated = res.headers.get("set-auth-token");
		if (rotated) tokenStore.set(rotated);
	}
	if (!res.ok) {
		let detail = res.statusText;
		try {
			const body = await res.json();
			detail = body?.message ?? body?.error ?? detail;
		} catch {}
		throw new ApiError(res.status, path, detail);
	}
	if (res.status === 204) return void 0;
	return await res.json();
}
/**
* Same as `api`, but returns `fallback` instead of throwing.
*
* The catalog pages already swallow their own errors and render an empty row
* rather than a 500 — this preserves that behaviour while keeping the throwing
* version available for routes where a failure genuinely is a page error.
*/
async function apiSafe(path, fallback, options = {}) {
	try {
		return await api(path, options);
	} catch (e) {
		console.error(`[api] ${path} failed:`, e instanceof Error ? e.message : e);
		return fallback;
	}
}
/**
* `api`, but failures become SvelteKit errors instead of ApiError.
*
* Load functions that fetch a single resource want a 404 from the API to render
* the not-found page, not to surface as an unhandled exception. This preserves
* the status so `+error.svelte` sees the same code the endpoint returned; only
* a genuine transport failure (no status) degrades to 500.
*/
async function apiOrError(path, options = {}) {
	try {
		return await api(path, options);
	} catch (e) {
		if (e instanceof ApiError) throw error(e.status, e.message);
		throw error(500, e instanceof Error ? e.message : "Request failed");
	}
}
//#endregion
export { apiOrError as n, apiSafe as r, api as t };
