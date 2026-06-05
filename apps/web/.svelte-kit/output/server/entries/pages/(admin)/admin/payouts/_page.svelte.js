import { vt as attr_class, wt as ensure_array_like, zt as escape_html } from "../../../../../chunks/ui-libs.js";
import "../../../../../chunks/Icon.js";
import "../../../../../chunks/circle-check.js";
import "../../../../../chunks/rotate-ccw.js";
import { t as Wallet } from "../../../../../chunks/wallet.js";
import { t as Skeleton } from "../../../../../chunks/skeleton.js";
import { t as PageHeader } from "../../../../../chunks/PageHeader.js";
//#endregion
//#region src/routes/(admin)/admin/payouts/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let status = "pending";
		let processor = "all";
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		PageHeader($$renderer, {
			icon: Wallet,
			title: "Payouts",
			subtitle: "Review and approve creator payouts. Stripe transfers fire immediately on approve; Paystack payouts are queued for the existing settlement worker."
		});
		$$renderer.push(`<!----> <div class="space-y-3"><div class="flex flex-wrap gap-2 items-center"><span class="text-xs text-muted-foreground mr-2">Status:</span> <!--[-->`);
		const each_array = ensure_array_like([
			"pending",
			"approved",
			"in_transit",
			"paid",
			"failed",
			"on_hold",
			"all"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let s = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`px-3 py-1 rounded text-xs capitalize ${status === s ? "bg-purple-600 text-foreground" : "surface-1 text-white/80 hover:surface-2"}`)}>${escape_html(s.replace("_", " "))}</button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-2 items-center"><span class="text-xs text-muted-foreground mr-2">Processor:</span> <!--[-->`);
		const each_array_1 = ensure_array_like([
			"all",
			"paystack",
			"stripe"
		]);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let p = each_array_1[$$index_1];
			$$renderer.push(`<button type="button"${attr_class(`px-3 py-1 rounded text-xs capitalize ${processor === p ? "bg-purple-700 text-foreground" : "surface-1 text-white/80 hover:surface-2"}`)}>${escape_html(p)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_2 = ensure_array_like(Array(5));
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				each_array_2[$$index_2];
				Skeleton($$renderer, { class: "h-12 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
