import { b as ensure_array_like } from './index.js-DwRgOKlO.js';
import { W as Wallet } from './wallet-DReqm_Mo.js';
import './toast-state.svelte-_bigiMZf.js';
import { S as Skeleton } from './skeleton-DrNJG5oW.js';
import { P as PortalHero } from './PortalHero-cuWNLrHh.js';
import './Icon-C7ASqKku.js';
import './utils2-DHW1aw82.js';

//#endregion
//#region src/routes/(admin)/admin/payouts/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="mx-auto py-8 px-4 max-w-7xl space-y-6">`);
		PortalHero($$renderer, {
			compact: true,
			eyebrow: "Finance",
			title: "Payouts",
			subtitle: "Review and approve creator payouts. Stripe transfers fire immediately on approve; Paystack payouts are queued for the existing settlement worker.",
			icon: Wallet
		});
		$$renderer.push(`<!----> `);
		{
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="space-y-2"><!--[-->`);
			const each_array = ensure_array_like(Array(5));
			for (let i = 0, $$length = each_array.length; i < $$length; i++) {
				each_array[i];
				Skeleton($$renderer, { class: "h-12 rounded-lg" });
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Cmca-CN5.js.map
