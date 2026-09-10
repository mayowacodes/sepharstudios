import { k as head } from './index.js-DwRgOKlO.js';
import { L as Loader_circle } from './loader-circle-U736S5e7.js';
import './button-CGRNF9DE.js';
import './Icon-C7ASqKku.js';
import './utils2-DHW1aw82.js';
import './index-CMAaDatn.js';

//#endregion
//#region src/routes/(app)/apply/creator/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1fblyd", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Creator Application - Sephar Studios</title>`);
				});
				$$renderer.push(`<meta name="description" content="Apply to publish content on Sephar Studios as an individual creator or organisation."/>`);
			});
			$$renderer.push(`<div class="apply-page svelte-1fblyd"><div class="page-header svelte-1fblyd"><div class="header-eyebrow svelte-1fblyd"><span class="eyebrow-dot svelte-1fblyd"></span> <span>Creator Programme</span></div> <h1 class="page-title svelte-1fblyd">Creator Application</h1> <p class="page-subtitle svelte-1fblyd">Apply to publish content on Sephar Studios as an individual or organisation.</p></div> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="loading-state svelte-1fblyd">`);
			Loader_circle($$renderer, { class: "spin-icon" });
			$$renderer.push(`<!----> <span>Loading application…</span></div>`);
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CoJNRzFi.js.map
