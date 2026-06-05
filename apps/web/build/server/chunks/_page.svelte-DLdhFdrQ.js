import { aA as head, au as escape_html, ah as attr, as as ensure_array_like } from './ui-libs-BjzLDLAh.js';
import { T as Triangle_alert } from './triangle-alert-Cv6gABx4.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

//#region src/routes/(admin)/admin/governance/emergency/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let reason = "";
		let history = [];
		head("16r52sy", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Emergency - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
		PageHeader($$renderer, {
			icon: Triangle_alert,
			title: "Emergency Controls",
			subtitle: "Security-incident pause + audit log."
		});
		$$renderer.push(`<!----> <div class="rounded-xl border border-border/40 surface-1 p-4 space-y-3"><h2 class="text-lg text-foreground font-semibold">Trigger Emergency Pause</h2> <p class="text-xs text-muted-foreground">Use only for security incidents. Reason is mandatory and audited.</p> <textarea class="w-full min-h-24 bg-black/40 border border-white/15 rounded px-3 py-2 text-foreground">`);
		const $$body = escape_html(reason);
		if ($$body) $$renderer.push(`${$$body}`);
		$$renderer.push(`</textarea> <button class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"${attr("disabled", false, true)}>${escape_html("Trigger Pause")}</button> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="rounded-xl border border-border/40 surface-1 p-4"><h2 class="text-lg text-foreground font-semibold mb-2">Active Incident</h2> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<p class="text-sm text-green-300">No active emergency pause.</p>`);
		$$renderer.push(`<!--]--></div> <div class="rounded-xl border border-border/40 surface-1 p-4"><h2 class="text-lg text-foreground font-semibold mb-2">Pause History</h2> `);
		if (history.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground">No incidents logged.</p>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<ul class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(history);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let evt = each_array[$$index];
				$$renderer.push(`<li class="text-sm text-foreground/80 border-t border-border/40 pt-2"><p>${escape_html(evt.reason)}</p> <p class="text-xs text-muted-foreground">By ${escape_html(evt.triggeredByName)} at ${escape_html(new Date(evt.triggeredAt).toLocaleString())}</p></li>`);
			}
			$$renderer.push(`<!--]--></ul>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DLdhFdrQ.js.map
