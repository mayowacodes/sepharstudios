import { b as apiOrError } from './client2-CYVUBClx.js';
import './index.js-BP8aAXBX.js';

//#region src/routes/watch/live/[id]/+page.ts
/**
* Live stream watch page. The visibility and moderation checks live in
* `/api/playback/live/:id` so they run server-side; this only forwards.
*/
var load = async ({ params, fetch }) => {
	return apiOrError(`/api/playback/live/${encodeURIComponent(params.id)}`, { fetch });
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 131;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Ds8taXeu.js')).default;
const universal_id = "src/routes/watch/live/[id]/+page.ts";
const imports = ["_app/immutable/nodes/131.D4Zf-Rr9.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/BfO_mE1L2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/DrrcI8R92.js","_app/immutable/chunks/C3Xmh3sp2.js","_app/immutable/chunks/BMr-SSC6.js","_app/immutable/chunks/D12XbnNS.js","_app/immutable/chunks/PnT1f7q6.js","_app/immutable/chunks/DQIHq--d2.js","_app/immutable/chunks/PIDQPO3q2.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/CohY8NGO.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/C9Hg4rJI.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=131-CrI1gH_J.js.map
