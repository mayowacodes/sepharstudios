import { ah as attr, au as escape_html, as as ensure_array_like } from './ui-libs-BjzLDLAh.js';
import { S as Skeleton } from './skeleton-DCiPgxrC.js';
import { C as Chart_column } from './chart-column-Um2Jb3PR.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './utils2-BaRxD-PE.js';
import './Icon-CM89Lxh4.js';

//#region src/routes/(creator)/creator/analytics/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedPeriod = "30d";
		let aiLoading = false;
		$$renderer.push(`<div class="space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.select({
					value: selectedPeriod,
					class: "px-3 py-1.5 surface-2 rounded-lg text-sm text-foreground focus:ring-2 focus:ring-purple-600"
				}, ($$renderer) => {
					$$renderer.option({ value: "7d" }, ($$renderer) => {
						$$renderer.push(`Last 7 days`);
					});
					$$renderer.option({ value: "30d" }, ($$renderer) => {
						$$renderer.push(`Last 30 days`);
					});
					$$renderer.option({ value: "90d" }, ($$renderer) => {
						$$renderer.push(`Last 90 days`);
					});
					$$renderer.option({ value: "1y" }, ($$renderer) => {
						$$renderer.push(`Last year`);
					});
				});
			}
			PageHeader($$renderer, {
				icon: Chart_column,
				title: "Analytics",
				subtitle: "Track your content performance and audience engagement.",
				actions});
		}
		$$renderer.push(`<!----> <div class="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6"><div class="flex items-start justify-between gap-4 mb-4"><div><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1"><span>✨</span> AI Insights</div> <h2 class="text-xl font-bold text-foreground">What your data is telling us</h2></div> <button type="button"${attr("disabled", aiLoading, true)} class="text-xs text-purple-200 hover:text-foreground border border-purple-500/40 hover:border-purple-400 rounded-md px-3 py-1.5 transition-colors disabled:opacity-40">${escape_html("Refresh")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
			const each_array_4 = ensure_array_like(Array(4));
			for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
				each_array_4[$$index_4];
				Skeleton($$renderer, { class: "h-28 rounded-xl" });
			}
			$$renderer.push(`<!--]--></div> `);
			Skeleton($$renderer, { class: "h-64 rounded-xl" });
			$$renderer.push(`<!---->`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BpwdBa3q.js.map
