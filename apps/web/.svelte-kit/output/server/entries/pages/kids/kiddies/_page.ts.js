import { r as apiSafe } from "../../../../chunks/client2.js";
//#region src/routes/kids/kiddies/+page.ts
/**
* Kids portal feed. Universal so the native bundle can render it; the previous
* server load swallowed its own errors and rendered an empty grid, which
* `apiSafe` preserves.
*/
var load = async ({ fetch }) => {
	return apiSafe("/api/catalog/audience/kids", { content: [] }, { fetch });
};
//#endregion
export { load };
