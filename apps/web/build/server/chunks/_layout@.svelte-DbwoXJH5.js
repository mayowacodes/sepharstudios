import { f as derived } from './index.js-DwRgOKlO.js';
import { p as page } from './state-Dt886Sc8.js';
import './client-BnGpewQC.js';

//#region src/lib/components/kids/KidsTopNav.svelte
function KidsTopNav($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
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
//# sourceMappingURL=_layout@.svelte-DbwoXJH5.js.map
