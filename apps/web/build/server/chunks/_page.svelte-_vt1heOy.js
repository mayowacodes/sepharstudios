import { at as head } from './ui-libs-TtGtWAGI.js';
import { L as Loader_circle } from './loader-circle-D0NWL6sB.js';
import './button-D9M18H3C.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CGEdwVFL.js';
import './utils2-C8dWVCac.js';
import './index-CGfbhb6a.js';

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
			});
			$$renderer.push(`<div class="mx-auto max-w-4xl px-4 py-10"><div class="mb-8"><h1 class="text-3xl font-bold text-white">Creator Application</h1> <p class="text-gray-300 mt-2">Apply to publish content on Sephar Studios as an individual or organization.</p></div> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center justify-center py-16">`);
			Loader_circle($$renderer, { class: "h-8 w-8 animate-spin text-primary" });
			$$renderer.push(`<!----></div>`);
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
//# sourceMappingURL=_page.svelte-_vt1heOy.js.map
