import { St as derived, Tt as head, wt as ensure_array_like } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/eye.js";
import "../../../../chunks/file-text.js";
import "../../../../chunks/lock.js";
import { t as Shield } from "../../../../chunks/shield.js";
import "../../../../chunks/button.js";
//#region src/routes/(protected)/parental-controls/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let profiles = [];
		let selectedProfileId = null;
		derived(() => profiles.find((p) => p.id === selectedProfileId));
		head("nw2a33", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Parental Controls - Sephar Studios</title>`);
			});
		});
		$$renderer.push(`<div class="min-h-screen bg-background px-4 py-10"><div class="max-w-3xl mx-auto"><div class="flex items-center gap-3 mb-2">`);
		Shield($$renderer, { class: "w-6 h-6 text-green-400" });
		$$renderer.push(`<!----> <h1 class="text-2xl font-bold">Parental Controls</h1></div> <p class="text-muted-foreground text-sm mb-8">Set PIN locks and content restrictions per profile.</p> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
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
//#endregion
export { _page as default };
