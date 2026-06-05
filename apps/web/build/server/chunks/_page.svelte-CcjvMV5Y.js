import { as as ensure_array_like, ai as attr_class, au as escape_html } from './ui-libs-BjzLDLAh.js';
import { F as File_text } from './file-text-C_v9vOk2.js';
import { S as Skeleton } from './skeleton-DCiPgxrC.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './utils2-BaRxD-PE.js';

//#region src/routes/(admin)/admin/tax-forms/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let filter = "submitted";
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-6xl space-y-6">`);
		PageHeader($$renderer, {
			icon: File_text,
			title: "Tax forms",
			subtitle: "Review submitted W-9 / W-8BEN / W-8BEN-E forms before annual 1099 generation."
		});
		$$renderer.push(`<!----> <div class="flex gap-2"><!--[-->`);
		const each_array = ensure_array_like([
			"submitted",
			"verified",
			"rejected",
			"expired",
			"all"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`px-3 py-1.5 rounded text-xs capitalize ${filter === f ? "bg-purple-600 text-foreground" : "surface-2 text-foreground/80 text-white hover:text-white"}`)}>${escape_html(f)}</button>`);
		}
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_1 = ensure_array_like(Array(4));
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				each_array_1[$$index_1];
				Skeleton($$renderer, { class: "h-16 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CcjvMV5Y.js.map
