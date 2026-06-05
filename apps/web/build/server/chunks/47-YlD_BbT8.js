import { r as redirect } from './index-Cv5VcsYq.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/(app)/apply/creator/+page.server.ts
var load = (async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	return {};
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 47;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-YChXT86C.js')).default;
const server_id = "src/routes/(app)/apply/creator/+page.server.ts";
const imports = ["_app/immutable/nodes/47.Dd3nN9ln.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/DTkeaA6Q2.js","_app/immutable/chunks/B5wmhr6D.js","_app/immutable/chunks/ZcdXcAV-.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/CmCztd1p.js","_app/immutable/chunks/BTb25HFS.js","_app/immutable/chunks/LPV7Tf-d.js","_app/immutable/chunks/cb_S8grP2.js","_app/immutable/chunks/B96uQR2f2.js","_app/immutable/chunks/DbP8MhBG2.js","_app/immutable/chunks/DFS-vUwq2.js","_app/immutable/chunks/C30D9w632.js","_app/immutable/chunks/CWuPlnNs.js","_app/immutable/chunks/BC4b7XLa.js","_app/immutable/chunks/Dqag1JzJ.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/47.D8u7_BJh.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=47-YlD_BbT8.js.map
