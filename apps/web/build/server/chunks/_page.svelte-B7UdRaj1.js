import { k as head } from './index.js-DwRgOKlO.js';
import { W as Wallet } from './wallet-DReqm_Mo.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';
import './Icon-C7ASqKku.js';

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

export { _page as default };
//# sourceMappingURL=_page.svelte-B7UdRaj1.js.map
