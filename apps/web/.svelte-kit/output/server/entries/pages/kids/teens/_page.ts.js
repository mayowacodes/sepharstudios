import { r as apiSafe } from "../../../../chunks/client2.js";
//#region src/routes/kids/teens/+page.ts
/** Teens portal feed. See kids/kiddies/+page.ts. */
var load = async ({ fetch }) => {
	return apiSafe("/api/catalog/audience/teens", { content: [] }, { fetch });
};
//#endregion
export { load };
