import { r as apiSafe } from "../../../../chunks/client2.js";
import { t as faithMovies } from "../../../../chunks/movies.js";
//#region src/routes/(app)/movies/+page.ts
/**
* Movies catalog.
*
* Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
* render this route — a server load has no server to answer it there. On the
* web build this still executes on the server during SSR, and SvelteKit invokes
* the same-origin endpoint in-process rather than over the network, so there is
* no extra round trip and no SEO change.
*
* `apiSafe` preserves the previous behaviour on failure: the old load caught its
* own errors and rendered a fallback rather than throwing a 500.
*/
var load = async ({ fetch }) => {
	const data = await apiSafe("/api/catalog/movies", {
		items: faithMovies,
		comingSoon: []
	}, { fetch });
	return {
		movies: data.items,
		comingSoon: data.comingSoon
	};
};
//#endregion
export { load };
