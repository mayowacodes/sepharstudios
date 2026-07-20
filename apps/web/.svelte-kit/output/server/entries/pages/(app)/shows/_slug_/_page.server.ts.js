import { t as loadMediaDetail } from "../../../../../chunks/media-detail-load.js";
//#region src/routes/(app)/shows/[slug]/+page.server.ts
var load = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	return loadMediaDetail({
		slug: params.slug,
		mediaType: "tv",
		userId: session?.user.id
	});
};
//#endregion
export { load };
