import { n as apiOrError } from "../../../../../chunks/client2.js";
//#region src/routes/kids/kiddies/[slug]/+page.ts
/**
* Kids detail page. Resolves any media row with category='kids' regardless of media type, so one route serves movies, shows and documentaries alike.
*
* Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
* render this route. `apiOrError` maps the endpoint's 404 onto SvelteKit's
* error page, matching what `loadMediaDetail` did when it ran server-side.
*/
var load = async ({ params, fetch }) => {
	return apiOrError("/api/catalog/detail/kiddies/" + encodeURIComponent(params.slug), { fetch });
};
//#endregion
export { load };
