import { kt as head } from "../../../../../../chunks/ui-libs.js";
import { t as Chart_column } from "../../../../../../chunks/chart-column.js";
import { t as Download } from "../../../../../../chunks/download.js";
import { t as PortalHero } from "../../../../../../chunks/PortalHero.js";
import { t as PortalButton } from "../../../../../../chunks/PortalButton.js";
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
				actions,
				$$slots: { actions: true }
			});
		}
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-muted-foreground">Generating report...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
