import { r as apiSafe } from "../../../../chunks/client2.js";
//#region src/routes/(app)/coming-soon/+page.ts
/**
* Dedicated Coming Soon listing. The page groups items by month client-side
* from `scheduledPublishAt`, so the endpoint returns the full set unlimited.
*/
var load = async ({ fetch }) => {
	return { items: (await apiSafe("/api/catalog/coming-soon", { items: [] }, { fetch })).items };
};
//#endregion
export { load };
