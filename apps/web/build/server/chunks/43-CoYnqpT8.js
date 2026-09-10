import { c as apiSafe } from './client2-BoVNkloV.js';
import './index.js-DwRgOKlO.js';

//#region src/routes/(app)/+page.ts
/**
* Landing page.
*
* The previous server load swallowed its own errors and rendered empty rows
* rather than failing the highest-traffic route in the app — `apiSafe` keeps
* exactly that behaviour.
*/
var load = async ({ fetch }) => {
	return apiSafe("/api/home", {
		shows: [],
		movies: [],
		documentaries: [],
		continueWatching: [],
		comingSoon: []
	}, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 43;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-dpQ8nK9l.js')).default;
const universal_id = "src/routes/(app)/+page.ts";
const imports = ["_app/immutable/nodes/43.CjNgl1Qk.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/B8N3I6Xu.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/DRUPmJi1.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/XsAVRn8p2.js","_app/immutable/chunks/B90YRj3u2.js","_app/immutable/chunks/CF9GtAUl2.js","_app/immutable/chunks/C2Srfcjv.js","_app/immutable/chunks/SVV4XpEn.js","_app/immutable/chunks/BbLGmibz.js","_app/immutable/chunks/DqPknR3P.js","_app/immutable/chunks/CFKu6x7M.js","_app/immutable/chunks/BK_Y07D6.js","_app/immutable/chunks/Cuaybsl-2.js","_app/immutable/chunks/BctpoitP2.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/CMVhVUDw2.js","_app/immutable/chunks/B9LjkC4M2.js","_app/immutable/chunks/CcfisAwp2.js","_app/immutable/chunks/D3r3jRQz.js","_app/immutable/chunks/DLupASnU2.js","_app/immutable/chunks/C01nDjOm.js","_app/immutable/chunks/C9Hg4rJI.js","_app/immutable/chunks/CAFBQFxS2.js","_app/immutable/chunks/BMBNBL0Z2.js","_app/immutable/chunks/Bgr-f01o.js","_app/immutable/chunks/Du0slnHU.js","_app/immutable/chunks/VZm97ZWC2.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/iFmHYOlC2.js","_app/immutable/chunks/Cr4roabJ2.js","_app/immutable/chunks/DTGrwegR2.js","_app/immutable/chunks/C1klr1j-2.js","_app/immutable/chunks/BnJD9Jdk2.js","_app/immutable/chunks/BPrL8_Z8.js","_app/immutable/chunks/CZ0iejYq.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/43.CGSypq3K.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=43-CoYnqpT8.js.map
