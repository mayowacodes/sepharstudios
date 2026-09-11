import { b as apiOrError } from './client2-DMA58bua.js';
import './index.js-CxPEndTa.js';

//#region src/routes/kids/kiddies/[slug]/+page.ts
/**
* Kids detail page. Resolves any media row with category='kids' regardless of media type, so one route serves movies, shows and documentaries alike.
*
* Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
* render this route. `apiOrError` maps the endpoint's 404 onto SvelteKit's
* error page, matching what `loadMediaDetail` did when it ran server-side.
*/
var load = async ({ params, fetch }) => {
	return apiOrError("/api/catalog/detail/kiddies/" + encodeURIComponent(params.slug), { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 130;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Ddn-msxO.js')).default;
const universal_id = "src/routes/kids/kiddies/[slug]/+page.ts";
const imports = ["_app/immutable/nodes/130.BNfj5IUw.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/hZsclpc0.js","_app/immutable/chunks/B3nkk3ZW.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/8IOMfqDv.js","_app/immutable/chunks/Jzq66i-T.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/BPrL8_Z8.js","_app/immutable/chunks/CZ0iejYq.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/KpxQ6l5r2.js","_app/immutable/chunks/Dy8qoEGg2.js","_app/immutable/chunks/XsAVRn8p2.js","_app/immutable/chunks/CRgpiKAP.js","_app/immutable/chunks/Di3wADSQ.js","_app/immutable/chunks/KNAn0aWZ.js","_app/immutable/chunks/BbLGmibz.js","_app/immutable/chunks/D_1j4v0d2.js","_app/immutable/chunks/8rVQHtDa.js","_app/immutable/chunks/BctpoitP2.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/Dglv-lwY2.js","_app/immutable/chunks/CrPz1wRa.js","_app/immutable/chunks/DLupASnU.js","_app/immutable/chunks/DLkOmWsm.js","_app/immutable/chunks/BslTakuj2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=130-D581TWXN.js.map
