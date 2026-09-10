import { c as apiSafe } from './client2-BoVNkloV.js';
import { f as faithMovies } from './movies-DFhk2mG9.js';
import './index.js-DwRgOKlO.js';

//#region src/routes/(app)/movies/+page.ts
/**
* Movies catalog.
*
* Universal rather than a `+page.server.ts` so the Capacitor/Tauri bundle can
* render this route — a server load has no server to answer it there. On the
* web build this still executes on the server during SSR, and SvelteKit invokes
* the same-origin endpoint in-process rather than over the network, so there is
* no extra round trip and no SEO change.
*
* `apiSafe` preserves the previous behaviour on failure: the old load caught its
* own errors and rendered a fallback rather than throwing a 500.
*/
var load = async ({ fetch }) => {
	const data = await apiSafe("/api/catalog/movies", {
		items: faithMovies,
		comingSoon: []
	}, { fetch });
	return {
		movies: data.items,
		comingSoon: data.comingSoon
	};
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 62;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-N2G-orIz.js')).default;
const universal_id = "src/routes/(app)/movies/+page.ts";
const imports = ["_app/immutable/nodes/62.BkoVbZDz.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/B9LjkC4M2.js","_app/immutable/chunks/CcfisAwp2.js","_app/immutable/chunks/BMBNBL0Z2.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/VZm97ZWC2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js","_app/immutable/chunks/C1klr1j-2.js","_app/immutable/chunks/BK_Y07D6.js","_app/immutable/chunks/BnJD9Jdk2.js","_app/immutable/chunks/BPrL8_Z8.js","_app/immutable/chunks/CZ0iejYq.js","_app/immutable/chunks/B1hreagU2.js","_app/immutable/chunks/XsAVRn8p2.js","_app/immutable/chunks/BctpoitP2.js","_app/immutable/chunks/D3r3jRQz.js","_app/immutable/chunks/DLupASnU2.js","_app/immutable/chunks/C01nDjOm.js","_app/immutable/chunks/MX87cxx_2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=62-CtDihOsy.js.map
