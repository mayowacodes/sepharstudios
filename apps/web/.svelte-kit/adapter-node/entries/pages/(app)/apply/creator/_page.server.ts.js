import { redirect } from "@sveltejs/kit";
//#region src/routes/(app)/apply/creator/+page.server.ts
var load = (async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	return {};
});
//#endregion
export { load };
