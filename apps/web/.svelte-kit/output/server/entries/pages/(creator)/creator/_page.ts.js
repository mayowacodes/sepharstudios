import { r as apiSafe } from "../../../../chunks/client2.js";
//#region src/routes/(creator)/creator/+page.ts
/**
* Creator dashboard. The previous server load caught its own query errors and
* rendered an empty list rather than failing the page — `apiSafe` keeps that.
*/
var load = async ({ fetch }) => {
	return apiSafe("/api/creator/in-flight-encodes", { inFlightEncodes: [] }, { fetch });
};
//#endregion
export { load };
