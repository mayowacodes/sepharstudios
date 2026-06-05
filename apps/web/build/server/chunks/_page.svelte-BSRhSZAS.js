import { aA as head, ah as attr } from './ui-libs-BjzLDLAh.js';
import { C as Chart_column } from './chart-column-Um2Jb3PR.js';
import { D as Download } from './download-CSx1ZyqC.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

//#region src/routes/(admin)/admin/governance/reports/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("182zabw", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Reports - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
		{
			function actions($$renderer) {
				$$renderer.push(`<button class="text-xs surface-1 hover:surface-2 rounded-full px-3 py-1.5 text-foreground inline-flex items-center gap-1 transition-colors disabled:opacity-50"${attr("disabled", true, true)}>`);
				Download($$renderer, { class: "w-3 h-3" });
				$$renderer.push(`<!----> Export CSV</button>`);
			}
			PageHeader($$renderer, {
				icon: Chart_column,
				title: "Governance Reports",
				subtitle: "Voting activity, proposal outcomes, treasury flows.",
				actions});
		}
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-muted-foreground">Generating report...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BSRhSZAS.js.map
