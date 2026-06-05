import { aA as head, as as ensure_array_like } from './ui-libs-BjzLDLAh.js';
import './button-DY9ayrhs.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-BaRxD-PE.js';
import './index-DHDJW1Vo.js';

//#endregion
//#region src/routes/(protected)/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("a7mnu8", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Settings - Sephar Studios</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-background px-4 py-10"><div class="max-w-2xl mx-auto"><h1 class="text-2xl font-bold mb-8">Settings</h1> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="h-16 bg-white/5 rounded-xl animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-epHzS-xP.js.map
