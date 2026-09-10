import { r as apiSafe } from "../../../../chunks/client2.js";
import { t as faithDocumentaries } from "../../../../chunks/documentaries.js";
//#region src/routes/(app)/documentaries/+page.ts
/** Documentaries catalog. See (app)/movies/+page.ts for why this is universal. */
var load = async ({ fetch }) => {
	const data = await apiSafe("/api/catalog/documentaries", {
		items: faithDocumentaries,
		comingSoon: []
	}, { fetch });
	return {
		documentaries: data.items,
		comingSoon: data.comingSoon
	};
};
//#endregion
export { load };
