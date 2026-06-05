import { Lt as attr, vt as attr_class, wt as ensure_array_like, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import { t as Banknote } from "../../../../../chunks/banknote.js";
import { t as Search } from "../../../../../chunks/search.js";
import { t as Skeleton } from "../../../../../chunks/skeleton.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
//#region src/routes/(admin)/admin/refunds/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let status = "all";
		let q = "";
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-6xl space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button type="button" class="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium">Issue refund</button>`);
			}
			PageHeader($$renderer, {
				icon: Banknote,
				title: "Refunds",
				subtitle: "Issue and audit refunds against Paystack transactions.",
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> <div class="flex flex-wrap gap-3 items-center"><div class="flex gap-2"><!--[-->`);
		const each_array = ensure_array_like([
			"all",
			"pending",
			"success",
			"failed"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let s = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`px-3 py-1.5 rounded text-xs capitalize ${status === s ? "bg-purple-600 text-foreground" : "surface-1 text-white/80 hover:surface-2"}`)}>${escape_html(s)}</button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="relative ml-auto w-72">`);
		Search($$renderer, { class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" });
		$$renderer.push(`<!----> <input type="text"${attr("value", q)} placeholder="Search reference, email, name…" class="w-full surface-1 border border-border/40 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder-gray-500"/></div></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(5));
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				each_array_1[$$index_1];
				Skeleton($$renderer, { class: "h-12 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };
