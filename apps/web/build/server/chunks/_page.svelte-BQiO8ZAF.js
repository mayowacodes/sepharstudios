import { at as head, al as ensure_array_like, an as escape_html, aa as attr } from './ui-libs-TtGtWAGI.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/lib/components/admin/governance/TimelockQueueTable.svelte
function TimelockQueueTable($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { items} = $$props;
		function isReady(eta) {
			return !!eta && Date.now() >= Date.parse(eta);
		}
		$$renderer.push(`<div class="overflow-x-auto rounded-xl border border-white/10"><table class="w-full text-sm"><thead class="bg-white/5 text-gray-300"><tr><th class="text-left px-4 py-3">Proposal</th><th class="text-left px-4 py-3">Type</th><th class="text-left px-4 py-3">ETA</th><th class="text-left px-4 py-3">Status</th><th class="text-left px-4 py-3">Action</th></tr></thead><tbody>`);
		if (items.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<tr><td colspan="5" class="px-4 py-6 text-center text-gray-400">No queued actions.</td></tr>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(items);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let item = each_array[$$index];
				$$renderer.push(`<tr class="border-t border-white/10"><td class="px-4 py-3 text-white">${escape_html(item.title)}</td><td class="px-4 py-3 text-gray-300">${escape_html(item.type)}</td><td class="px-4 py-3 text-gray-300">${escape_html(item.eta ? new Date(item.eta).toLocaleString() : "-")}</td><td class="px-4 py-3"><span class="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs">${escape_html(item.status)}</span></td><td class="px-4 py-3"><button class="px-3 py-1 rounded text-xs bg-green-600 hover:bg-green-700 disabled:opacity-40"${attr("disabled", !isReady(item.eta), true)}>Execute</button></td></tr>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></tbody></table></div>`);
	});
}
//#endregion
//#region src/routes/(admin)/admin/governance/execution/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let queue = [];
		head("1s2fzhj", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Execution - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6"><h1 class="text-2xl font-bold text-white">Timelock Queue &amp; Execution</h1> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="rounded-xl border border-white/10 bg-white/5 p-4"><h2 class="text-lg font-semibold text-white mb-3">Submitted Proposals</h2> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-gray-400">Loading...</p>`);
		}
		$$renderer.push(`<!--]--></div> <div><h2 class="text-lg font-semibold text-white mb-3">Queued Actions</h2> `);
		TimelockQueueTable($$renderer, {
			items: queue});
		$$renderer.push(`<!----></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BQiO8ZAF.js.map
