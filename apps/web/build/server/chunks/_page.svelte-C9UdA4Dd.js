import { aA as head, as as ensure_array_like, aO as spread_props } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';
import './button-DY9ayrhs.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-BaRxD-PE.js';
import './index-DHDJW1Vo.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/list.svelte
function List($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "list" },
		props,
		{ iconNode: [
			["path", { "d": "M3 5h.01" }],
			["path", { "d": "M3 12h.01" }],
			["path", { "d": "M3 19h.01" }],
			["path", { "d": "M8 5h13" }],
			["path", { "d": "M8 12h13" }],
			["path", { "d": "M8 19h13" }]
		] }
	]));
}
//#endregion
//#region src/routes/(protected)/watchlist/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("4hkdye", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>My List - Sephar Studios</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-background px-4 py-10"><div class="max-w-5xl mx-auto"><div class="flex items-center gap-3 mb-8">`);
		List($$renderer, { class: "w-6 h-6 text-primary" });
		$$renderer.push(`<!----> <h1 class="text-2xl font-bold">My List</h1> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="space-y-2"><div class="aspect-2/3 bg-white/5 rounded-lg animate-pulse"></div> <div class="h-3 bg-white/5 rounded w-3/4 animate-pulse"></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-C9UdA4Dd.js.map
