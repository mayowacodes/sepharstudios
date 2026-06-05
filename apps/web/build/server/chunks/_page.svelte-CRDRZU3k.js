import { as as ensure_array_like, ai as attr_class, au as escape_html } from './ui-libs-BjzLDLAh.js';
import { S as Shield_alert } from './shield-alert-B18q9sfB.js';
import { S as Skeleton } from './skeleton-DCiPgxrC.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './utils2-BaRxD-PE.js';

//#region src/routes/(admin)/admin/abuse/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let filter = "all";
		let statusFilter = "open";
		$$renderer.push(`<div class="container mx-auto py-8 px-4 max-w-5xl space-y-6">`);
		PageHeader($$renderer, {
			icon: Shield_alert,
			title: "Abuse queue",
			subtitle: "Triage user-submitted reports. Resolve to action the target, dismiss for false reports, or escalate when senior review is needed."
		});
		$$renderer.push(`<!----> <div class="space-y-3"><div class="flex flex-wrap gap-2 items-center"><span class="text-xs text-muted-foreground mr-2">Type:</span> <!--[-->`);
		const each_array = ensure_array_like([
			"all",
			"review",
			"forum_thread",
			"forum_reply",
			"content",
			"user"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button type="button"${attr_class(`px-3 py-1.5 rounded text-xs ${filter === f ? "bg-purple-600 text-foreground" : "surface-1 text-white/80 hover:surface-2"}`)}>${escape_html(f.replace("_", " "))}</button>`);
		}
		$$renderer.push(`<!--]--></div> <div class="flex flex-wrap gap-2 items-center"><span class="text-xs text-muted-foreground mr-2">Status:</span> <!--[-->`);
		const each_array_1 = ensure_array_like([
			"open",
			"resolved",
			"all"
		]);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let s = each_array_1[$$index_1];
			$$renderer.push(`<button type="button"${attr_class(`px-3 py-1.5 rounded text-xs capitalize ${statusFilter === s ? "bg-purple-700 text-foreground" : "surface-1 text-white/80 hover:surface-2"}`)}>${escape_html(s)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array_2 = ensure_array_like(Array(4));
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				each_array_2[$$index_2];
				Skeleton($$renderer, { class: "h-20 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CRDRZU3k.js.map
