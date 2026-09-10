import { r as apiSafe } from "../../../../chunks/client2.js";
import { t as faithTVShows } from "../../../../chunks/shows.js";
//#region src/routes/(app)/shows/+page.ts
/** Shows catalog. See (app)/movies/+page.ts for why this is universal. */
var load = async ({ fetch }) => {
	const data = await apiSafe("/api/catalog/shows", {
		items: faithTVShows,
		comingSoon: []
	}, { fetch });
	return {
		shows: data.items,
		comingSoon: data.comingSoon
	};
};
//#endregion
export { load };
