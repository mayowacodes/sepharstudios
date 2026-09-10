import { n as apiOrError } from "../../../../chunks/client2.js";
//#region src/routes/watch/[id]/+page.ts
/**
* Watch page.
*
* All the work lives in `/api/playback/:id`, which is the former server load
* moved intact. It must stay on the server: that handler strips playback URLs
* for unpurchased PPV titles, and the encoder bucket is public-read, so a URL
* that reaches the client is a free stream. This load only forwards the query
* string and hands the response through.
*/
var load = async ({ params, url, fetch }) => {
	return apiOrError(`/api/playback/${encodeURIComponent(params.id)}${url.search}`, { fetch });
};
//#endregion
export { load };
