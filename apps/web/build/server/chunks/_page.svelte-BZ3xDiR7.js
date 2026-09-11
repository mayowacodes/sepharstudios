import { k as head } from './index.js-CxPEndTa.js';
import { A as Arrow_left } from './arrow-left-B6xUHJVB.js';
import { a as LazySTCTokenDashboard } from './web3-lazy-YzCQqxWA.js';
import './Icon-Bw1rnKTC.js';
import './utils2-DZI6czOR.js';

//#region src/routes/(web3)/tokens/+page.svelte
function _page($$renderer) {
	head("1fv98rq", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>STC Tokens - Sephar Studios</title>`);
		});
		$$renderer.push(`<meta name="description" content="Manage your STC tokens and participate in the Sephar Studios ecosystem"/>`);
	});
	$$renderer.push(`<div class="tokens-page"><div class="mb-6"><a href="/browse" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">`);
	Arrow_left($$renderer, { class: "mr-2 h-4 w-4" });
	$$renderer.push(`<!----> Back to Browse</a></div> <div class="mb-8"><h1 class="text-3xl font-bold tracking-tight">STC Token Dashboard</h1> <p class="mt-2 text-muted-foreground">Manage your StudioChain tokens, stake for discounts, and swap on the AMM</p></div> `);
	LazySTCTokenDashboard($$renderer);
	$$renderer.push(`<!----></div>`);
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BZ3xDiR7.js.map
