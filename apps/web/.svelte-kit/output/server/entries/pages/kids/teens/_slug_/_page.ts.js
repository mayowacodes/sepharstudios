import { n as apiOrError } from "../../../../../chunks/client2.js";
//#region src/routes/kids/teens/[slug]/+page.ts
/**
* Teens detail page. Same category-not-mediaType rule as the kiddies route.
*
* Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
* render this route. `apiOrError` maps the endpoint's 404 onto SvelteKit's
* error page, matching what `loadMediaDetail` did when it ran server-side.
*/
var load = async ({ params, fetch }) => {
	return apiOrError("/api/catalog/detail/teens/" + encodeURIComponent(params.slug), { fetch });
};
//#endregion
export { load };
