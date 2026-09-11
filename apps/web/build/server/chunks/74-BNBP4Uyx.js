//#region src/routes/(app)/sponsorships/+page.ts
/**
* Sponsorship pitch form.
*
* The old server load returned a trimmed user for the "are you signed in?"
* branch; the root layout already resolves the session, so `parent()` supplies
* it with no extra request. The submit action became POST /api/sponsorships.
*/
var load = async ({ parent }) => {
	const { user } = await parent();
	return { user: user ? {
		id: user.id,
		email: user.email,
		name: user.name
	} : null };
};

var _page_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 74;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Cwd7n8Vc.js')).default;
const universal_id = "src/routes/(app)/sponsorships/+page.ts";
const imports = ["_app/immutable/nodes/74.f_2T4tDr.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/BqNJycsl.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/DPRDCEcT2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/DqzUUf7Y2.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/DLupASnU.js","_app/immutable/chunks/Dck08oA8.js","_app/immutable/chunks/CrPz1wRa.js","_app/immutable/chunks/DLkOmWsm.js","_app/immutable/chunks/q2Vb4eal.js","_app/immutable/chunks/Bkpf_Ads.js","_app/immutable/chunks/D07Fs7-n.js","_app/immutable/chunks/CYOB6MKU2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=74-BNBP4Uyx.js.map
