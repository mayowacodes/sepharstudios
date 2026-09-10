import { n as apiOrError } from "../../../../../chunks/client2.js";
//#region src/routes/watch/live/[id]/+page.ts
/**
* Live stream watch page. The visibility and moderation checks live in
* `/api/playback/live/:id` so they run server-side; this only forwards.
*/
var load = async ({ params, fetch }) => {
	return apiOrError(`/api/playback/live/${encodeURIComponent(params.id)}`, { fetch });
};
//#endregion
export { load };
