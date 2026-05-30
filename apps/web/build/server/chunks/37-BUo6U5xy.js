import { r as redirect } from './index-5kYmxIr9.js';
import './index-DBqjc0Yf.js';

//#region src/routes/(app)/apply/creator/+page.server.ts
var load = (async ({ locals, url }) => {
	if (!locals.user) throw redirect(303, `/auth/login?redirectTo=${url.pathname}`);
	return {};
});

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 37;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-_vt1heOy.js')).default;
const server_id = "src/routes/(app)/apply/creator/+page.server.ts";
const imports = ["_app/immutable/nodes/37.xDiqOXdV.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/DXFs0FbB2.js","_app/immutable/chunks/Cy442Xic.js","_app/immutable/chunks/Dg9nBQ42.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/B2ZiIdaP.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=37-BUo6U5xy.js.map
