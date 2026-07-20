import { Et as derived, Ot as ensure_array_like, kt as head } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/Icon.js";
import "../../../../chunks/star.js";
import { t as Trophy } from "../../../../chunks/trophy.js";
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
