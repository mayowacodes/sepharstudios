import { at as head, al as ensure_array_like } from './ui-libs-TtGtWAGI.js';
import './rolldown-runtime-pTpnEGsq.js';

//#region src/routes/(admin)/admin/governance/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("1vxzpf4", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6"><div class="flex items-center justify-between"><h1 class="text-3xl font-bold text-white">Governance Control Center</h1> <a href="/admin/governance/create" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">New Proposal</a></div> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid md:grid-cols-4 gap-4"><!--[-->`);
			const each_array = ensure_array_like([
				1,
				2,
				3,
				4
			]);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				each_array[$$index];
				$$renderer.push(`<div class="h-24 rounded-xl bg-white/5 animate-pulse"></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--> <div class="grid md:grid-cols-3 gap-4"><a href="/admin/governance/proposals" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"><h3 class="text-white font-semibold">Proposals</h3> <p class="text-xs text-gray-400 mt-1">View and review governance proposals</p></a> <a href="/admin/governance/execution" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"><h3 class="text-white font-semibold">Execution</h3> <p class="text-xs text-gray-400 mt-1">Queue and execute timelock actions</p></a> <a href="/admin/governance/treasury" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"><h3 class="text-white font-semibold">Treasury</h3> <p class="text-xs text-gray-400 mt-1">Monitor pools, inflows and runway</p></a> <a href="/admin/governance/emergency" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"><h3 class="text-white font-semibold">Emergency</h3> <p class="text-xs text-gray-400 mt-1">Pause controls and incident logs</p></a> <a href="/admin/governance/roles" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"><h3 class="text-white font-semibold">Roles</h3> <p class="text-xs text-gray-400 mt-1">Permissions matrix and admin roster</p></a> <a href="/admin/governance/reports" class="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"><h3 class="text-white font-semibold">Reports</h3> <p class="text-xs text-gray-400 mt-1">Generate governance transparency reports</p></a></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D40lfYaX.js.map
