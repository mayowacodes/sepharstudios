import { k as head, b as ensure_array_like, q as escape_html, i as attr, s as spread_props } from './index.js-DwRgOKlO.js';
import { I as Icon } from './Icon-C7ASqKku.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';

//#region ../../node_modules/.bun/@lucide+svelte@1.24.0+5726b9c92ebd8575/node_modules/@lucide/svelte/dist/icons/timer.svelte
function Timer($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "timer" },
		props,
		{ iconNode: [
			["line", {
				"x1": "10",
				"x2": "14",
				"y1": "2",
				"y2": "2"
			}],
			["line", {
				"x1": "12",
				"x2": "15",
				"y1": "14",
				"y2": "11"
			}],
			["circle", {
				"cx": "12",
				"cy": "14",
				"r": "8"
			}]
		] }
	]));
}
//#endregion
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
		$$renderer.push(`<div class="mx-auto px-4 py-8 space-y-6 max-w-7xl">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "DAO",
			title: "Timelock & execution",
			subtitle: "Queued proposals awaiting execution windows.",
			icon: Timer
		});
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="rounded-xl border border-border/40 surface-1 p-4"><h2 class="text-lg font-semibold text-foreground mb-3">Submitted Proposals</h2> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground">Loading...</p>`);
		}
		$$renderer.push(`<!--]--></div> <div><h2 class="text-lg font-semibold text-foreground mb-3">Queued Actions</h2> `);
		TimelockQueueTable($$renderer, {
			items: queue});
		$$renderer.push(`<!----></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D3L37L5A.js.map
