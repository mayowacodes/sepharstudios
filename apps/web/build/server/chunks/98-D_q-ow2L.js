import { u as usersRoles, C as Constants } from './constants-ChVx7CIu.js';
import { r as redirect } from './index-5kYmxIr9.js';
import './ui-libs-TtGtWAGI.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CGEdwVFL.js';
import './file-text-CODLMeLI.js';
import './layout-dashboard-B00hq5k6.js';
import './user-BR-ZR5dM.js';
import './users-Bb_ynahW.js';
import './index-DBqjc0Yf.js';

//#region src/routes/(protected)/users/+page.server.ts
var load = (async ({ locals, url }) => {
	const user = locals.user;
	if (!user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	if (!usersRoles.includes(user.role)) throw redirect(303, Constants.AFTERAUTH);
	return {};
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 98;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CDuEiSfc.js')).default;
const server_id = "src/routes/(protected)/users/+page.server.ts";
const imports = ["_app/immutable/nodes/98.C6i6f2v3.js","_app/immutable/chunks/g6f9qJp6.js","_app/immutable/chunks/BVYEN9jI.js","_app/immutable/chunks/82XWPh1s.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/QvtZIkiR.js","_app/immutable/chunks/SDVjwcu-.js","_app/immutable/chunks/CkPKcep_2.js","_app/immutable/chunks/BQYPg9Bi2.js","_app/immutable/chunks/CaAB7dOD.js","_app/immutable/chunks/CGnECopF.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/C4QiHKi92.js","_app/immutable/chunks/DE6Vj2l8.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/BSFXd-fp.js","_app/immutable/chunks/B-hbAyTs2.js","_app/immutable/chunks/DXFs0FbB2.js","_app/immutable/chunks/Cy442Xic.js","_app/immutable/chunks/DTiwN7q82.js","_app/immutable/chunks/BvIpJX6k.js","_app/immutable/chunks/DJeEVz6c.js","_app/immutable/chunks/lQ-lZmSf.js","_app/immutable/chunks/BjlaZt9k.js","_app/immutable/chunks/B2ZiIdaP.js","_app/immutable/chunks/CbnapNxy.js","_app/immutable/chunks/B-_jW20x2.js","_app/immutable/chunks/B_E9PYGM2.js","_app/immutable/chunks/D3wrU__d2.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/CYoPNDXM.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=98-D_q-ow2L.js.map
