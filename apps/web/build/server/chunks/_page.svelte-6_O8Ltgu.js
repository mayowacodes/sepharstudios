import { k as head, b as ensure_array_like } from './index.js-BP8aAXBX.js';
import { S as Shield } from './shield-CYzS1HJ4.js';
import './button--do5FSjb.js';
import './Icon-DOH8dWtn.js';
import './utils2-CqskQpUP.js';
import './index-D1eQaiDA.js';

//#region src/routes/(protected)/parental-controls/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
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

export { _page as default };
//# sourceMappingURL=_page.svelte-6_O8Ltgu.js.map
