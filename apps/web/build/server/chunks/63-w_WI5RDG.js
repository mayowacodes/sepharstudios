import { b as apiOrError } from './client2-BoVNkloV.js';
import './index.js-DwRgOKlO.js';

//#region src/routes/(app)/movies/[slug]/+page.ts
/**
* Movie detail page.
*
* Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
* render this route. `apiOrError` maps the endpoint's 404 onto SvelteKit's
* error page, matching what `loadMediaDetail` did when it ran server-side.
*/
var load = async ({ params, fetch }) => {
	return apiOrError("/api/catalog/detail/movies/" + encodeURIComponent(params.slug), { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 63;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C9blICk5.js')).default;
const universal_id = "src/routes/(app)/movies/[slug]/+page.ts";
const imports = ["_app/immutable/nodes/63.Bu5lJhLg.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DRUPmJi1.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/B4DOQfb_.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/BPrL8_Z8.js","_app/immutable/chunks/CZ0iejYq.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/KpxQ6l5r2.js","_app/immutable/chunks/Dy8qoEGg2.js","_app/immutable/chunks/XsAVRn8p2.js","_app/immutable/chunks/CRgpiKAP.js","_app/immutable/chunks/6JL9benz.js","_app/immutable/chunks/KNAn0aWZ.js","_app/immutable/chunks/BbLGmibz.js","_app/immutable/chunks/D_1j4v0d2.js","_app/immutable/chunks/8rVQHtDa.js","_app/immutable/chunks/BctpoitP2.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/CcfisAwp2.js","_app/immutable/chunks/D3r3jRQz.js","_app/immutable/chunks/DLupASnU2.js","_app/immutable/chunks/C01nDjOm.js","_app/immutable/chunks/VZm97ZWC2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=63-w_WI5RDG.js.map
