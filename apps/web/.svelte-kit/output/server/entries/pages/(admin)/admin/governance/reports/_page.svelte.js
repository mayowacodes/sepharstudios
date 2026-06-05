import { Lt as attr, Tt as head } from "../../../../../../chunks/ui-libs.js";
import { t as Chart_column } from "../../../../../../chunks/chart-column.js";
import { t as Download } from "../../../../../../chunks/download.js";
import { t as PageHeader } from "../../../../../../chunks/PageHeader.js";
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
