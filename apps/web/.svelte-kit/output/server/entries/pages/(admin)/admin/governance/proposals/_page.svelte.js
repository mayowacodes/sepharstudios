import { _t as head } from "../../../../../../chunks/ui-libs.js";
//#region src/routes/(admin)/admin/governance/proposals/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1fzek9k", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Proposals - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-4"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-white">Governance Proposals</h1> <a href="/admin/governance/create" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">Create Proposal</a></div> <div class="rounded-xl border border-white/10 overflow-hidden"><table class="w-full text-sm"><thead class="bg-white/5 text-gray-300"><tr><th class="px-4 py-3 text-left">Title</th><th class="px-4 py-3 text-left">Type</th><th class="px-4 py-3 text-left">Risk</th><th class="px-4 py-3 text-left">Approvals</th><th class="px-4 py-3 text-left">Status</th><th class="px-4 py-3 text-left">Created</th></tr></thead><tbody>`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<tr><td colspan="6" class="px-4 py-6 text-center text-gray-400">Loading proposals...</td></tr>`);
		$$renderer.push(`<!--]--></tbody></table></div></div>`);
	});
}
//#endregion
export { _page as default };
