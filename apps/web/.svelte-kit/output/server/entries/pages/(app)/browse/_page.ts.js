import { r as apiSafe } from "../../../../chunks/client2.js";
//#region src/routes/(app)/browse/+page.ts
/** Browse landing rows. See (app)/movies/+page.ts for why this is universal. */
var load = async ({ fetch }) => {
	return apiSafe("/api/catalog/browse", {
		shows: [],
		movies: [],
		documentaries: []
	}, { fetch });
};
//#endregion
export { load };
