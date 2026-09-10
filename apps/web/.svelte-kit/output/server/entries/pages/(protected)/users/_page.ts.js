import { c as usersRoles, t as Constants } from "../../../../chunks/constants.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/(protected)/users/+page.ts
/**
* User management page. Role-gated to `usersRoles`.
*
* `parent()` resolves against (protected)/+layout.ts, which has already
* redirected anonymous visitors — so `user` is present here in practice; the
* null check remains because the type permits it and a redirect is cheaper than
* a crash. Every /api/users/* endpoint re-checks the role server-side.
*/
var load = async ({ parent, url }) => {
	const { user } = await parent();
	if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	if (!usersRoles.includes(user.role)) throw redirect(303, Constants.AFTERAUTH);
	return {};
};
//#endregion
export { load };
