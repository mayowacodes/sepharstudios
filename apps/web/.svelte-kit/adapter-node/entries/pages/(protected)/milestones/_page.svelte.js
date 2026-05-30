import { _t as head, gt as ensure_array_like } from "../../../../chunks/ui-libs.js";
import { t as Coins } from "../../../../chunks/coins.js";
//#region src/routes/(protected)/milestones/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1dqmcwa", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Milestones - Sephar Studios</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-background px-4 py-10"><div class="max-w-3xl mx-auto"><div class="flex items-center gap-3 mb-2">`);
		Coins($$renderer, { class: "w-6 h-6 text-yellow-400" });
		$$renderer.push(`<!----> <h1 class="text-2xl font-bold">Milestones</h1></div> <p class="text-muted-foreground text-sm mb-8">Earn STC tokens by reaching watch and community milestones.</p> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4,
				5
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="h-20 bg-white/5 rounded-xl animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
