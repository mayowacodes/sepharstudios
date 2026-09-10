import { n as apiOrError } from "../../../../chunks/client2.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/(protected)/profiles/+page.ts
/**
* Profile picker. The endpoint coerces each PIN to a boolean before returning,
* so no PIN reaches the client.
*/
var load = async ({ parent, fetch }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, "/auth/login?redirectTo=/profiles");
	return apiOrError("/api/profiles/overview", { fetch });
};
//#endregion
export { load };
