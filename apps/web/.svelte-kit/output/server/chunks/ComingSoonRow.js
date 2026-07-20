import { Ht as attr, Ot as ensure_array_like, Wt as escape_html, jt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
import { t as Sparkles } from "./sparkles.js";
import { t as ComingSoonCard } from "./ComingSoonCard.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/volume-2.svelte
function Volume_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "volume-2" },
		props,
		{ iconNode: [
			["path", { "d": "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" }],
			["path", { "d": "M16 9a5 5 0 0 1 0 6" }],
			["path", { "d": "M19.364 18.364a9 9 0 0 0 0-12.728" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/sections/ComingSoonRow.svelte
function ComingSoonRow($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { items, title = "Coming Soon", seeMoreHref = "/coming-soon" } = $$props;
		if (items.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<section class="mb-10"><div class="flex items-center justify-between mb-3 px-4"><div class="flex items-center gap-3"><span class="h-5 w-1 rounded-full bg-[#FFBF00] shadow-[0_0_12px_rgba(255,191,0,0.4)]"></span> <h2 class="text-xl font-semibold text-white inline-flex items-center gap-2">`);
			Sparkles($$renderer, { class: "h-5 w-5 text-[#FFBF00]" });
			$$renderer.push(`<!----> ${escape_html(title)}</h2></div> <a${attr("href", seeMoreHref)} class="text-sm text-white/60 hover:text-white">See all →</a></div> <div class="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth snap-x"><!--[-->`);
			const each_array = ensure_array_like(items);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<div class="shrink-0 w-44 sm:w-48 lg:w-56 snap-start">`);
				ComingSoonCard($$renderer, { item });
				$$renderer.push(`<!----></div>`);
			}
			$$renderer.push(`<!--]--></div></section>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { Volume_2 as n, ComingSoonRow as t };
