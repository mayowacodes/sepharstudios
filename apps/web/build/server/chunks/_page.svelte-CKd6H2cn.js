import { h as head, b as push_element, d as pop_element, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { A as Arrow_left, L as LazySubscriptionNFT } from './LazySubscriptionNFT-Bys4qPp-.js';
import './Icon-DVHDtCfs.js';
import './utils2-DYlu6U_t.js';

_page[FILENAME] = "src/routes/(web3)/subscription/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("13wsfl1", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Premium Subscription - Sephar Studios</title>`);
        });
        $$renderer3.push(`<meta name="description" content="Subscribe to Sephar Studios with NFT subscriptions"/>`);
        push_element($$renderer3, "meta", 8, 1);
        pop_element();
      });
      $$renderer2.push(`<div class="subscription-page">`);
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
      $$renderer2.push(`Premium Subscription</h1>`);
      pop_element();
      $$renderer2.push(` <p class="mt-2 text-muted-foreground">`);
      push_element($$renderer2, "p", 26, 2);
      $$renderer2.push(`Get premium access to all content with our NFT subscription system</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      LazySubscriptionNFT($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CKd6H2cn.js.map
