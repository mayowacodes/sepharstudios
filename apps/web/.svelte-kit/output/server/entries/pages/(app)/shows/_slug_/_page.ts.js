import { n as apiOrError } from "../../../../../chunks/client2.js";
//#region src/routes/(app)/shows/[slug]/+page.ts
/**
* Show detail page. Uses the 'tv' media type server-side.
*
* Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
* render this route. `apiOrError` maps the endpoint's 404 onto SvelteKit's
* error page, matching what `loadMediaDetail` did when it ran server-side.
*/
var load = async ({ params, fetch }) => {
	return apiOrError("/api/catalog/detail/shows/" + encodeURIComponent(params.slug), { fetch });
};
//#endregion
export { load };
