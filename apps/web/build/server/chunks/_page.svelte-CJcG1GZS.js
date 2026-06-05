import { aA as head } from './ui-libs-BjzLDLAh.js';
import { A as Arrow_left } from './arrow-left-DITrNWiS.js';
import { a as LazySubscriptionNFT } from './web3-lazy-DNT6wXkD.js';
import './rolldown-runtime-pTpnEGsq.js';
import './Icon-CM89Lxh4.js';
import './utils2-BaRxD-PE.js';

//#region src/routes/(web3)/subscription/+page.svelte
function _page($$renderer) {
	head("13wsfl1", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Premium Subscription - Sephar Studios</title>`);
		});
		$$renderer.push(`<meta name="description" content="Subscribe to Sephar Studios with NFT subscriptions"/>`);
	});
	$$renderer.push(`<div class="subscription-page"><div class="mb-6"><a href="/browse" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">`);
	Arrow_left($$renderer, { class: "mr-2 h-4 w-4" });
	$$renderer.push(`<!----> Back to Browse</a></div> <div class="mb-8"><h1 class="text-3xl font-bold tracking-tight">Premium Subscription</h1> <p class="mt-2 text-muted-foreground">Get premium access to all content with our NFT subscription system</p></div> `);
	LazySubscriptionNFT($$renderer);
	$$renderer.push(`<!----></div>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CJcG1GZS.js.map
