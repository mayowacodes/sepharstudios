import { ai as attr_class, as as ensure_array_like, au as escape_html } from './ui-libs-BjzLDLAh.js';
import { S as Shield_check } from './shield-check-BMw6bQZG.js';
import { S as Skeleton } from './skeleton-DCiPgxrC.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './utils2-BaRxD-PE.js';

//#region src/routes/(creator)/creator/moderation/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let reviewFilter = "pending";
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-5xl space-y-6">`);
		PageHeader($$renderer, {
			icon: Shield_check,
			title: "Moderation",
			subtitle: "Review feedback and forum activity on your content. Hide spam, approve thoughtful reviews, or lock heated threads."
		});
		$$renderer.push(`<!----> <div class="flex gap-2"><button type="button"${attr_class(`px-4 py-2 rounded-lg text-sm bg-purple-600 text-foreground`)}>Reviews on my content</button> <button type="button"${attr_class(`px-4 py-2 rounded-lg text-sm surface-2 text-white/80 hover:surface-3`)}>My forum threads</button></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array = ensure_array_like([
				"pending",
				"flagged",
				"all"
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let f = each_array[$$index];
				$$renderer.push(`<button type="button"${attr_class(`px-3 py-1.5 rounded text-xs capitalize ${reviewFilter === f ? "bg-purple-700 text-foreground" : "surface-1 text-white/80 hover:surface-2"}`)}>${escape_html(f)}</button>`);
			}
			$$renderer.push(`<!--]--></div> `);
			{
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="space-y-2"><!--[-->`);
				const each_array_1 = ensure_array_like(Array(3));
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					each_array_1[$$index_1];
					Skeleton($$renderer, { class: "h-24 rounded-xl" });
				}
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B6xuChvv.js.map
