import { k as head } from './index.js-BP8aAXBX.js';
import { A as Arrow_left } from './arrow-left-D1BMS_q0.js';
import { b as LazyWalletConnect } from './web3-lazy-BlGCZ0xc.js';
import './Icon-DOH8dWtn.js';
import './utils2-CqskQpUP.js';

//#region src/routes/(web3)/wallet/+page.svelte
function _page($$renderer) {
	head("vb5o55", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Wallet Connection - Sephar Studios</title>`);
		});
		$$renderer.push(`<meta name="description" content="Connect your wallet to access Web3 features on Sephar Studios"/>`);
	});
	$$renderer.push(`<div class="wallet-page"><div class="mb-6"><a href="/browse" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">`);
	Arrow_left($$renderer, { class: "mr-2 h-4 w-4" });
	$$renderer.push(`<!----> Back to Browse</a></div> <div class="mb-8"><h1 class="text-3xl font-bold tracking-tight">Connect Your Wallet</h1> <p class="mt-2 text-muted-foreground">Access Web3 features including STC tokens, NFT subscriptions, and creator payments</p></div> `);
	LazyWalletConnect($$renderer);
	$$renderer.push(`<!----></div>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte--BKxHRKR.js.map
