import { t as auth } from "../../../chunks/auth.js";
import { redirect } from "@sveltejs/kit";
//#region src/routes/(protected)/+layout.server.ts
var load = (async ({ request, locals, url }) => {
	const session = await auth.api.getSession({ headers: request.headers });
	if (!session) throw redirect(302, `/auth/login?redirectTo=${url.pathname}`);
	return {
		session,
		user: session.user
	};
});
//#endregion
export { load };
