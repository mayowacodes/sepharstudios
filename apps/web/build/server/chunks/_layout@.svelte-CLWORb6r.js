import { f as derived } from './index.js-CxPEndTa.js';
import { p as page } from './state-p7jw8P-1.js';
import './client-DsZfmj3l.js';

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
//# sourceMappingURL=_layout@.svelte-CLWORb6r.js.map
