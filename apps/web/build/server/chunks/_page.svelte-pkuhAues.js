import { k as head } from './index.js-BP8aAXBX.js';
import { C as Chart_column } from './chart-column-CCJFc6e2.js';
import { D as Download } from './download-BwbiyQq4.js';
import { P as PortalHero } from './PortalHero-B80SkUjg.js';
import { P as PortalButton } from './PortalButton-CmQGGkb7.js';
import './Icon-DOH8dWtn.js';

//#region src/routes/(admin)/admin/governance/reports/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function exportCsv() {}
		head("182zabw", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Reports - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="mx-auto px-4 py-8 space-y-6 max-w-7xl">`);
		{
			function actions($$renderer) {
				PortalButton($$renderer, {
					variant: "secondary",
					size: "sm",
					onclick: exportCsv,
					disabled: true,
					children: ($$renderer) => {
						Download($$renderer, { class: "w-3.5 h-3.5" });
						$$renderer.push(`<!----> Export CSV`);
					},
					$$slots: { default: true }
				});
			}
			PortalHero($$renderer, {
				compact: true,
				eyebrow: "DAO · Reports",
				title: "Governance reports",
				subtitle: "Voting activity, proposal outcomes, treasury flows.",
				icon: Chart_column,
				actions});
		}
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-muted-foreground">Generating report...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-pkuhAues.js.map
