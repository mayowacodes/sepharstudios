import { ap as derived } from './ui-libs-BjzLDLAh.js';
import { p as page } from './state-D0xWVGEE.js';
import './client-Bo2aevGq.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-DGTE05DL.js';
import './index-DBqjc0Yf.js';

//#region src/lib/components/kids/KidsTopNav.svelte
function KidsTopNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		page.url.pathname.includes("/teens");
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/kids/kiddies/+layout@.svelte
function _layout_($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		if (derived(() => !page.url.pathname.endsWith("/kids") && !page.url.pathname.endsWith("/kids/profile"))()) {
			$$renderer.push("<!--[0-->");
			KidsTopNav($$renderer);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		children($$renderer);
		$$renderer.push(`<!---->`);
	});
}

export { _layout_ as default };
//# sourceMappingURL=_layout@.svelte-DJhOcamO.js.map
