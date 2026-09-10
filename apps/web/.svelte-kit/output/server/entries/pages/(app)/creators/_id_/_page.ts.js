import { n as apiOrError } from "../../../../../chunks/client2.js";
//#region src/routes/(app)/creators/[id]/+page.ts
/** Public creator profile. */
var load = async ({ params, fetch }) => {
	return apiOrError(`/api/creators/${encodeURIComponent(params.id)}/page`, { fetch });
};
//#endregion
export { load };
