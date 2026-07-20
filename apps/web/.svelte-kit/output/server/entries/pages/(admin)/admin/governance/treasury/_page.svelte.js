import { kt as head } from "../../../../../../chunks/ui-libs.js";
import { t as Wallet } from "../../../../../../chunks/wallet.js";
import { t as PortalHero } from "../../../../../../chunks/PortalHero.js";
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
		$$renderer.push(`<div class="mx-auto px-4 py-8 space-y-6 max-w-7xl">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "DAO · Vault",
			title: "Treasury monitor",
			subtitle: "Pool balances, flows, and buyback execution.",
			icon: Wallet
		});
		$$renderer.push(`<!----> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<p class="text-sm text-muted-foreground">Loading treasury data...</p>`);
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
