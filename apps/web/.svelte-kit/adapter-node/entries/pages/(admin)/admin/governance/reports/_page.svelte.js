import { _t as head, kt as attr } from "../../../../../../chunks/ui-libs.js";
//#region src/routes/(admin)/admin/governance/reports/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("182zabw", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Reports - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-white">Governance Reports</h1> <button class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm"${attr("disabled", true, true)}>Export CSV</button></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-gray-400">Generating report...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
