import { e as error } from './index.js-DwRgOKlO.js';

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
	const url = `${path.startsWith("/") ? path : `/${path}`}`;
	const merged = new Headers(headers);
	if (!merged.has("accept")) merged.set("accept", "application/json");
	const res = await doFetch(url, {
		...init,
		headers: merged,
		credentials: "same-origin"
	});
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

export { api as a, apiOrError as b, apiSafe as c };
//# sourceMappingURL=client2-BoVNkloV.js.map
