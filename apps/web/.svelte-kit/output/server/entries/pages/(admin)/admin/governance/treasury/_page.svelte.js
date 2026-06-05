import { Tt as head } from "../../../../../../chunks/ui-libs.js";
import { t as Wallet } from "../../../../../../chunks/wallet.js";
import { t as PageHeader } from "../../../../../../chunks/PageHeader.js";
import "../../../../../../chunks/GovernanceStatusCard.js";
//#endregion
//#region src/routes/(admin)/admin/governance/treasury/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		head("18e5mwm", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Governance Treasury - Admin</title>`);
			});
		});
		$$renderer.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
		PageHeader($$renderer, {
			icon: Wallet,
			title: "Treasury Monitor",
			subtitle: "Pool balances, flows, and buyback execution."
		});
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-muted-foreground">Loading treasury data...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
