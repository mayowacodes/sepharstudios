import { c as usersRoles, t as Constants } from "../../../../chunks/constants.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/(protected)/users/+page.server.ts
var load = (async ({ locals, url }) => {
	const user = locals.user;
	if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	if (!usersRoles.includes(user.role)) throw redirect(303, Constants.AFTERAUTH);
	return {};
});
//#endregion
export { load };
