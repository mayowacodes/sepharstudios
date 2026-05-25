import { o as head, a as push_element, b as pop_element, F as FILENAME } from "../../../../chunks/ui-libs.js";
import { A as Arrow_left, b as LazyWalletConnect } from "../../../../chunks/LazySubscriptionNFT.js";
_page[FILENAME] = "src/routes/(web3)/wallet/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("vb5o55", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Wallet Connection - Sephar Studios</title>`);
        });
        $$renderer3.push(`<meta name="description" content="Connect your wallet to access Web3 features on Sephar Studios"/>`);
        push_element($$renderer3, "meta", 8, 1);
        pop_element();
      });
      $$renderer2.push(`<div class="wallet-page">`);
      push_element($$renderer2, "div", 11, 0);
      $$renderer2.push(`<div class="mb-6">`);
      push_element($$renderer2, "div", 13, 1);
      $$renderer2.push(`<a href="/dashboard" class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">`);
      push_element($$renderer2, "a", 14, 2);
      Arrow_left($$renderer2, { class: "mr-2 h-4 w-4" });
      $$renderer2.push(`<!----> Back to Dashboard</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mb-8">`);
      push_element($$renderer2, "div", 24, 1);
      $$renderer2.push(`<h1 class="text-3xl font-bold tracking-tight">`);
      push_element($$renderer2, "h1", 25, 2);
      $$renderer2.push(`Connect Your Wallet</h1>`);
      pop_element();
      $$renderer2.push(` <p class="mt-2 text-muted-foreground">`);
      push_element($$renderer2, "p", 26, 2);
      $$renderer2.push(`Access Web3 features including STC tokens, NFT subscriptions, and creator payments</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      LazyWalletConnect($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  _page as default
};
