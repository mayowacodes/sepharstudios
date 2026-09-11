import { k as head } from './index.js-BP8aAXBX.js';
import { W as Wallet } from './wallet-Bahp6I3V.js';
import { P as PortalHero } from './PortalHero-B80SkUjg.js';
import './Icon-DOH8dWtn.js';

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
//# sourceMappingURL=_page.svelte-B5JoyVsN.js.map
