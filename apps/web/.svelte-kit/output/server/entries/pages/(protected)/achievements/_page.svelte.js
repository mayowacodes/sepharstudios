import { _t as head, gt as ensure_array_like, mt as derived, yt as spread_props } from "../../../../chunks/ui-libs.js";
import { t as Icon } from "../../../../chunks/Icon.js";
import "../../../../chunks/star.js";
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/trophy.svelte
function Trophy($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "trophy" },
		props,
		{ iconNode: [
			["path", { "d": "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" }],
			["path", { "d": "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" }],
			["path", { "d": "M18 9h1.5a1 1 0 0 0 0-5H18" }],
			["path", { "d": "M4 22h16" }],
			["path", { "d": "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" }],
			["path", { "d": "M6 9H4.5a1 1 0 0 1 0-5H6" }]
		] }
	]));
}
//#endregion
//#region src/routes/(protected)/achievements/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		derived(() => []);
		derived(() => []);
		head("p5qilb", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Achievements - Sephar Studios</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-background px-4 py-10"><div class="max-w-4xl mx-auto"><div class="flex items-center gap-3 mb-8">`);
		Trophy($$renderer, { class: "w-6 h-6 text-yellow-400" });
		$$renderer.push(`<!----> <h1 class="text-2xl font-bold">Achievements</h1></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4,
				5,
				6
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="h-24 bg-white/5 rounded-xl animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
