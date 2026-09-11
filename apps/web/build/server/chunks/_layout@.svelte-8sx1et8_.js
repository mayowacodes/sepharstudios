import { f as derived } from './index.js-BP8aAXBX.js';
import { p as page } from './state-DL22RgpG.js';
import './client-ZoNwVBKD.js';

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
//# sourceMappingURL=_layout@.svelte-8sx1et8_.js.map
