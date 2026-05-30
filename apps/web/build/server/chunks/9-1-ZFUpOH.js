import { r as redirect } from './index-5kYmxIr9.js';
import './index-DBqjc0Yf.js';

//#region src/routes/(web3)/+layout.server.ts
/**
* Guards every route under (web3)/* — wallet, tokens, subscription, etc.
* These pages display a user's STC balance, NFT subscription state, and
* staking position. Anonymous users have no use for them, and the underlying
* web3 calls require knowing which user-account scope to operate in.
*
* Mirrors the auth guard pattern in (admin)/+layout.server.ts and
* (creator)/+layout.server.ts.
*/
var load = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	return { user: locals.user };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 9;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-Bb3fHJpx.js')).default;
const server_id = "src/routes/(web3)/+layout.server.ts";
const imports = ["_app/immutable/nodes/9.tMK9le0J.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/9.tLQ6TuLX.css"];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=9-1-ZFUpOH.js.map
