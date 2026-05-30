import { ai as derived } from './ui-libs-TtGtWAGI.js';
import { p as page } from './state-Cm-InHWy.js';
import './client-CZa6R-ON.js';
import './rolldown-runtime-pTpnEGsq.js';
import './internal-CB1sTboO.js';
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
//# sourceMappingURL=_layout@.svelte-DGLF-6JN.js.map
