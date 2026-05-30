import { jt as escape_html, kt as attr } from "../../../../../chunks/ui-libs.js";
//#region src/routes/(creator)/creator/analytics/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedPeriod = "30d";
		let selectedContent = "all";
		let aiLoading = false;
		$$renderer.push(`<div class="space-y-6"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1> <p class="text-gray-300">Track your content performance and audience engagement</p></div> <div class="mt-4 sm:mt-0 flex space-x-3">`);
		$$renderer.select({
			value: selectedPeriod,
			class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
		$$renderer.push(` `);
		$$renderer.select({
			value: selectedContent,
			class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
		}, ($$renderer) => {
			$$renderer.option({ value: "all" }, ($$renderer) => {
				$$renderer.push(`All Content`);
			});
			$$renderer.option({ value: "3" }, ($$renderer) => {
				$$renderer.push(`Worship Night Live`);
			});
			$$renderer.option({ value: "1" }, ($$renderer) => {
				$$renderer.push(`Faith in Action`);
			});
			$$renderer.option({ value: "2" }, ($$renderer) => {
				$$renderer.push(`Sunday Sermon Series`);
			});
		});
		$$renderer.push(`</div></div> <div class="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6"><div class="flex items-start justify-between gap-4 mb-4"><div><div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1"><span>✨</span> AI Insights</div> <h2 class="text-xl font-bold text-white">What your data is telling us</h2></div> <button type="button"${attr("disabled", aiLoading, true)} class="text-xs text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-400 rounded-md px-3 py-1.5 transition-colors disabled:opacity-40">${escape_html("Refresh")}</button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div> <p class="text-white ml-4">Loading analytics...</p></div>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
