import { kt as head } from "../../../chunks/ui-libs.js";
import { t as Arrow_right } from "../../../chunks/arrow-right.js";
import { t as Baby } from "../../../chunks/baby.js";
import { t as Users } from "../../../chunks/users.js";
//#region src/routes/kids/+page.svelte
function _page($$renderer) {
	head("pal6k6", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Kids · Sephar Studios</title>`);
		});
		$$renderer.push(`<meta name="description" content="Choose between Kiddies and Teens — safe, faith-aware viewing for every age."/>`);
	});
	$$renderer.push(`<main id="main-content" class="flex-1 flex items-center justify-center p-6"><div class="max-w-3xl w-full text-center space-y-8"><header class="space-y-3"><h1 class="text-4xl md:text-5xl font-extrabold text-primary">Welcome to Kids</h1> <p class="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">Safe, faith-aware viewing for every age. Pick the experience that fits.</p></header> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><a href="/kids/kiddies" class="group bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3"><div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">`);
	Baby($$renderer, { class: "w-8 h-8 text-primary" });
	$$renderer.push(`<!----></div> <h2 class="text-2xl font-bold">Kiddies</h2> <p class="text-sm text-muted-foreground">Bright stories and gentle lessons for younger viewers.</p> <span class="inline-flex items-center text-primary font-medium gap-1 group-hover:gap-2 transition-all">Open Kiddies `);
	Arrow_right($$renderer, { class: "w-4 h-4" });
	$$renderer.push(`<!----></span></a> <a href="/kids/teens" class="group bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all flex flex-col items-center text-center space-y-3"><div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">`);
	Users($$renderer, { class: "w-8 h-8 text-primary" });
	$$renderer.push(`<!----></div> <h2 class="text-2xl font-bold">Teens</h2> <p class="text-sm text-muted-foreground">Bigger questions, deeper stories — built for older kids.</p> <span class="inline-flex items-center text-primary font-medium gap-1 group-hover:gap-2 transition-all">Open Teens `);
	Arrow_right($$renderer, { class: "w-4 h-4" });
	$$renderer.push(`<!----></span></a></div></div></main>`);
}
//#endregion
export { _page as default };
