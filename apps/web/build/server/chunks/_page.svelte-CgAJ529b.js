import { b as ensure_array_like } from './index.js-CxPEndTa.js';
import { W as Wallet } from './wallet-CRqOK7UE.js';
import './toast-state.svelte-jhYVYtU8.js';
import { S as Skeleton } from './skeleton-C99_WNvK.js';
import { P as PortalHero } from './PortalHero-zB8z9paY.js';
import './Icon-Bw1rnKTC.js';
import './utils2-DZI6czOR.js';

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
//# sourceMappingURL=_page.svelte-CgAJ529b.js.map
