import { Tt as head, wt as ensure_array_like } from "../../../../../chunks/ui-libs.js";
import { t as Book_open } from "../../../../../chunks/book-open.js";
import "../../../../../chunks/star.js";
//#region src/routes/kids/kiddies/bible-quiz/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1dpte59", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Bible Quiz - Sephar Kids</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-background px-4 py-8"><div class="max-w-3xl mx-auto">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<div class="text-center mb-8"><div class="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">`);
		Book_open($$renderer, { class: "w-8 h-8 text-indigo-300" });
		$$renderer.push(`<!----></div> <h1 class="text-2xl font-bold text-white mb-2">Bible Quiz Time!</h1> <p class="text-white/60 text-sm">Pick a story and answer questions to earn STC stars!</p></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-2 sm:grid-cols-3 gap-4"><!--[-->`);
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
				$$renderer.push(`<div class="aspect-square bg-white/5 rounded-2xl animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]-->`);
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
