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

import { error as svelteError } from '@sveltejs/kit';
import { browser } from '$app/environment';

/** Origin serving /api/*. '' on web (same-origin), the https origin on native. */
export const API_ORIGIN = __API_ORIGIN__;

/** True in the Capacitor/Tauri bundle. Dead-code-eliminated on web. */
export const IS_NATIVE = __NATIVE_BUILD__;

const TOKEN_KEY = 'sephar.auth.token';

/**
 * Bearer token storage for the native builds.
 *
 * localStorage is deliberate rather than lazy: both Capacitor's WebView and
 * Tauri's WebView persist it across launches, and it is scoped to the app's own
 * origin, which no other app can reach. It is read on every request rather than
 * cached in a module variable so a sign-out in one tab/window can't leave a
 * stale token behind in another.
 */
export const tokenStore = {
	get(): string | null {
		if (!browser) return null;
		try {
			return localStorage.getItem(TOKEN_KEY);
		} catch {
			// Private-mode / storage-blocked WebViews throw on access rather
			// than returning null. Treat as signed out instead of crashing.
			return null;
		}
	},
	set(token: string) {
		if (!browser) return;
		try {
			localStorage.setItem(TOKEN_KEY, token);
		} catch {
			/* non-fatal: the session just won't survive a relaunch */
		}
	},
	clear() {
		if (!browser) return;
		try {
			localStorage.removeItem(TOKEN_KEY);
		} catch {
			/* ignore */
		}
	}
};

export class ApiError extends Error {
	constructor(
		readonly status: number,
		readonly path: string,
		message: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

type FetchLike = typeof globalThis.fetch;

export interface ApiOptions extends RequestInit {
	/**
	 * Pass the `fetch` given to your load function. On the web build that is
	 * SvelteKit's instrumented fetch, which forwards the incoming request's
	 * cookies during SSR and lets the response be serialized into the payload
	 * so the browser doesn't refetch on hydration. Omitting it during SSR means
	 * an unauthenticated request and a double fetch — always pass it.
	 */
	fetch?: FetchLike;
}

/**
 * Fetch JSON from the platform API.
 *
 * Throws ApiError on a non-2xx so load functions can map failures onto
 * SvelteKit's `error()` instead of silently rendering empty state.
 */
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
	const { fetch: fetchImpl, headers, ...init } = options;
	const doFetch: FetchLike = fetchImpl ?? globalThis.fetch;

	const url = `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;

	const merged = new Headers(headers);
	if (!merged.has('accept')) merged.set('accept', 'application/json');

	if (IS_NATIVE) {
		const token = tokenStore.get();
		if (token) merged.set('authorization', `Bearer ${token}`);
	}

	const res = await doFetch(url, {
		...init,
		headers: merged,
		// Native has no cookies to send and 'include' on a cross-origin request
		// would force a CORS preflight for nothing; web relies on them entirely.
		credentials: IS_NATIVE ? 'omit' : 'same-origin'
	});

	// better-auth hands back a refreshed bearer token on this header whenever it
	// rotates the session. Capture it or native users get logged out on rotation.
	if (IS_NATIVE) {
		const rotated = res.headers.get('set-auth-token');
		if (rotated) tokenStore.set(rotated);
	}

	if (!res.ok) {
		let detail = res.statusText;
		try {
			const body = await res.json();
			detail = body?.message ?? body?.error ?? detail;
		} catch {
			/* non-JSON error body; statusText is the best we have */
		}
		throw new ApiError(res.status, path, detail);
	}

	if (res.status === 204) return undefined as T;
	return (await res.json()) as T;
}

/**
 * Same as `api`, but returns `fallback` instead of throwing.
 *
 * The catalog pages already swallow their own errors and render an empty row
 * rather than a 500 — this preserves that behaviour while keeping the throwing
 * version available for routes where a failure genuinely is a page error.
 */
export async function apiSafe<T>(path: string, fallback: T, options: ApiOptions = {}): Promise<T> {
	try {
		return await api<T>(path, options);
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
export async function apiOrError<T>(path: string, options: ApiOptions = {}): Promise<T> {
	try {
		return await api<T>(path, options);
	} catch (e) {
		if (e instanceof ApiError) throw svelteError(e.status, e.message);
		throw svelteError(500, e instanceof Error ? e.message : 'Request failed');
	}
}
