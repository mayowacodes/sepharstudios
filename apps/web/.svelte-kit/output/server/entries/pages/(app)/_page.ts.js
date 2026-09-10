import { r as apiSafe } from "../../../chunks/client2.js";
//#region src/routes/(app)/+page.ts
/**
* Landing page.
*
* The previous server load swallowed its own errors and rendered empty rows
* rather than failing the highest-traffic route in the app — `apiSafe` keeps
* exactly that behaviour.
*/
var load = async ({ fetch }) => {
	return apiSafe("/api/home", {
		shows: [],
		movies: [],
		documentaries: [],
		continueWatching: [],
		comingSoon: []
	}, { fetch });
};
//#endregion
export { load };
