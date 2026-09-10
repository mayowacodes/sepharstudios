import { redirect } from "@sveltejs/kit";
//#region src/routes/(protected)/+layout.ts
/**
* Requires a signed-in user for everything under (protected)/*.
*
* The server version called `auth.api.getSession()` directly. That is not
* reachable from a universal load, and does not need to be: the root
* `+layout.ts` already resolves the session once via /api/auth/get-session,
* and `parent()` reuses that result rather than issuing a second lookup.
*/
var load = async ({ parent, url }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	return { user };
};
//#endregion
export { load };
