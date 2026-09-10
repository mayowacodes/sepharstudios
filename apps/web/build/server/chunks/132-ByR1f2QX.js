import { b as apiOrError } from './client2-BoVNkloV.js';
import './index.js-DwRgOKlO.js';

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

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 132;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-vuTpZMhr.js')).default;
const universal_id = "src/routes/watch/[id]/+page.ts";
const imports = ["_app/immutable/nodes/132.D47XPiB8.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/DRUPmJi1.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/6JL9benz.js","_app/immutable/chunks/Dy8qoEGg2.js","_app/immutable/chunks/KNAn0aWZ.js","_app/immutable/chunks/BbLGmibz.js","_app/immutable/chunks/D_1j4v0d2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/8rVQHtDa.js","_app/immutable/chunks/B9LjkC4M2.js","_app/immutable/chunks/jz5m4ZJj2.js","_app/immutable/chunks/CcfisAwp2.js","_app/immutable/chunks/C9Hg4rJI.js","_app/immutable/chunks/DAgTFWXQ.js","_app/immutable/chunks/HclGiUj8.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=132-ByR1f2QX.js.map
