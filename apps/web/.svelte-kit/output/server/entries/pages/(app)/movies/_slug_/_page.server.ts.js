import { t as loadMediaDetail } from "../../../../../chunks/media-detail-load.js";
//#region src/routes/(app)/movies/[slug]/+page.server.ts
var load = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	return loadMediaDetail({
		slug: params.slug,
		mediaType: "movie",
		userId: session?.user.id
	});
};
//#endregion
export { load };
