import { Et as derived, Ht as attr, Ot as ensure_array_like, Pt as stringify, St as attr_class, Wt as escape_html, jt as spread_props } from "./ui-libs.js";
import { i as SiteMeta } from "./constants.js";
import { t as Icon } from "./Icon.js";
import "./ReportButton.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/share-2.svelte
function Share_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "share-2" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "18",
				"cy": "5",
				"r": "3"
			}],
			["circle", {
				"cx": "6",
				"cy": "12",
				"r": "3"
			}],
			["circle", {
				"cx": "18",
				"cy": "19",
				"r": "3"
			}],
			["line", {
				"x1": "8.59",
				"x2": "15.42",
				"y1": "13.51",
				"y2": "17.49"
			}],
			["line", {
				"x1": "15.41",
				"x2": "8.59",
				"y1": "6.51",
				"y2": "10.49"
			}]
		] }
	]));
}
//#endregion
//#region src/lib/components/widgets/ShareButton.svelte
function ShareButton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { contentId, title, description = "" } = $$props;
		let open = false;
		const url = derived(() => `${SiteMeta.link}/watch/${contentId}`);
		derived(() => encodeURIComponent(url()));
		derived(() => encodeURIComponent(title));
		derived(() => encodeURIComponent(description.slice(0, 200)));
		$$renderer.push(`<div class="relative inline-block"><button type="button" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors" aria-haspopup="menu"${attr("aria-expanded", open)}>`);
		Share_2($$renderer, { class: "w-4 h-4" });
		$$renderer.push(`<!----> Share</button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/widgets/ReviewSection.svelte
function ReviewSection($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { contentId, contentType = "movie" } = $$props;
		let reviews = [];
		let userRating = 0;
		const avgRating = derived(() => reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null);
		function starClass(star, current) {
			return star <= current ? "text-[#FFBF00]" : "text-gray-600";
		}
		$$renderer.push(`<div class="space-y-6"><div class="flex items-center gap-4"><h3 class="text-lg font-semibold text-white">Reviews</h3> `);
		if (avgRating()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-1"><span class="text-[#FFBF00] font-bold">${escape_html(avgRating())}</span> <span class="text-[#FFBF00]">★</span> <span class="text-gray-400 text-sm">(${escape_html(reviews.length)})</span></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"><p class="text-sm text-gray-400">Rate this content</p> <div class="flex gap-1"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4,
				5
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let star = each_array[$$index];
				$$renderer.push(`<button${attr_class(`text-2xl transition-colors ${stringify(starClass(star, userRating))}`)}${attr("aria-label", `Rate ${stringify(star)} star`)}>★</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-3"><!--[-->`);
			const each_array_1 = ensure_array_like([1, 2]);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				each_array_1[$$index_1];
				$$renderer.push(`<div class="h-20 bg-white/5 rounded-xl animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { ShareButton as n, ReviewSection as t };
