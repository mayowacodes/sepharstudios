import { aI as redirect } from './index.js-BP8aAXBX.js';

//#region src/routes/(web3)/+layout.ts
/**
* Guards every route under (web3)/* — wallet, tokens, subscription, etc.
* These pages display a user's STC balance, NFT subscription state, and
* staking position. Anonymous users have no use for them, and the underlying
* web3 calls require knowing which user-account scope to operate in.
*
* Mirrors the auth guard pattern in (admin)/+layout.ts and (creator)/+layout.ts.
*/
var load = async ({ parent, url }) => {
	const { user } = await parent();
	if (!user) throw redirect(302, `/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	return { user };
};

var _layout_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-WA1FhPBQ.js')).default;
const universal_id = "src/routes/(web3)/+layout.ts";
const imports = ["_app/immutable/nodes/7.CFkjBySe.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/7.tLQ6TuLX.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _layout_ts as universal, universal_id };
//# sourceMappingURL=7-BYdH0Qob.js.map
