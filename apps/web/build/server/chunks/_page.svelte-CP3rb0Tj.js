import { aA as head } from './ui-libs-BjzLDLAh.js';
import { W as Wallet } from './wallet-DRYG0lzr.js';
import { P as PageHeader } from './PageHeader-BBRgxTMe.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';

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

export { _page as default };
//# sourceMappingURL=_page.svelte-CP3rb0Tj.js.map
