import { b as push_element, d as pop_element, j as store_get, p as prevent_snippet_stringification, l as escape_html, e as ensure_array_like, i as stringify, u as unsubscribe_stores, s as spread_props, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { B as Button } from './button-C1v8XzqW.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-Bb6tCQUO.js';
import { B as Badge } from './badge-D_nuztXS.js';
import { W as Wallet, i as isConnected } from './wallet-DdtFC4L6.js';
import './config-DiSGGbdB.js';
import { W as WalletConnect } from './WalletConnect-Ce3t-cUa.js';
import { G as Gift } from './gift-DM5QqSI7.js';
import { C as Crown } from './crown-D96XsnbH.js';
import { Z as Zap } from './zap-CnVnzt1j.js';
import { C as Coins } from './coins-CTU1RUMc.js';
import { C as Check } from './check-BU5QHt2h.js';
import { I as Icon } from './Icon-DVHDtCfs.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import './getAccount-CAZUvBhV.js';
import 'node:crypto';
import './external-link-tdQgWcLh.js';

Star[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/star.svelte";
function Star($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
          }
        ]
      ];
      Icon($$renderer2, spread_props([
        { name: "star" },
        /**
         * @component @name Star
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEuNTI1IDIuMjk1YS41My41MyAwIDAgMSAuOTUgMGwyLjMxIDQuNjc5YTIuMTIzIDIuMTIzIDAgMCAwIDEuNTk1IDEuMTZsNS4xNjYuNzU2YS41My41MyAwIDAgMSAuMjk0LjkwNGwtMy43MzYgMy42MzhhMi4xMjMgMi4xMjMgMCAwIDAtLjYxMSAxLjg3OGwuODgyIDUuMTRhLjUzLjUzIDAgMCAxLS43NzEuNTZsLTQuNjE4LTIuNDI4YTIuMTIyIDIuMTIyIDAgMCAwLTEuOTczIDBMNi4zOTYgMjEuMDFhLjUzLjUzIDAgMCAxLS43Ny0uNTZsLjg4MS01LjEzOWEyLjEyMiAyLjEyMiAwIDAgMC0uNjExLTEuODc5TDIuMTYgOS43OTVhLjUzLjUzIDAgMCAxIC4yOTQtLjkwNmw1LjE2NS0uNzU1YTIuMTIyIDIuMTIyIDAgMCAwIDEuNTk3LTEuMTZ6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/star
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Star
  );
}
Star.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/plans/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let plans = [
        {
          id: "basic",
          name: "Basic",
          price: 3,
          features: [
            "HD streaming",
            "1 screen at a time",
            "Access to standard library",
            "Download on 1 device",
            "Cancel anytime"
          ],
          nftBenefits: [
            "Subscription NFT on Polygon",
            "Earn 5 STC/day watching",
            "Stake STC for up to 10% off"
          ]
        },
        {
          id: "premium",
          name: "Premium",
          price: 10,
          features: [
            "4K Ultra HD streaming",
            "2 screens at a time",
            "Full content library",
            "Downloads on 2 devices",
            "Offline viewing",
            "Cancel anytime"
          ],
          nftBenefits: [
            "Enhanced NFT benefits",
            "Earn 5 STC/day watching",
            "Stake STC for up to 50% off",
            "Early access to new content"
          ],
          isPopular: true
        },
        {
          id: "creator",
          name: "Creator",
          price: 15,
          features: [
            "Everything in Premium",
            "Upload & publish content",
            "Revenue share dashboard",
            "Creator analytics",
            "Priority support",
            "Cancel anytime"
          ],
          nftBenefits: [
            "Creator NFT badge",
            "30% revenue share on your content",
            "Governance voting rights",
            "Exclusive creator community"
          ]
        }
      ];
      let userDiscount = 0;
      let stakingAmount = "0";
      let showWalletModal = false;
      function getPlanIcon(planId) {
        switch (planId) {
          case "creator":
            return Crown;
          case "premium":
            return Star;
          default:
            return Coins;
        }
      }
      $$renderer2.push(`<div class="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl pt-32 pb-16">`);
      push_element($$renderer2, "div", 148, 0);
      $$renderer2.push(`<div class="text-center space-y-4 mb-8">`);
      push_element($$renderer2, "div", 149, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold gradient-text svelte-19dwmhu">`);
      push_element($$renderer2, "h1", 150, 4);
      $$renderer2.push(`Choose Your Plan</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground max-w-2xl mx-auto">`);
      push_element($$renderer2, "p", 151, 4);
      $$renderer2.push(`Start with 3 months free — no charge today. Cancel anytime before your trial ends. `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></p>`);
      pop_element();
      $$renderer2.push(` <div class="inline-flex items-center gap-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-full px-4 py-1.5 text-sm">`);
      push_element($$renderer2, "div", 159, 4);
      Gift($$renderer2, { class: "h-4 w-4" });
      $$renderer2.push(`<!----> 3 months free on all plans</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mb-8 p-6 bg-accent/5 border border-accent/20 rounded-lg">`);
        push_element($$renderer2, "div", 167, 4);
        $$renderer2.push(`<div class="grid md:grid-cols-2 gap-6 items-center">`);
        push_element($$renderer2, "div", 168, 6);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 169, 8);
        $$renderer2.push(`<h3 class="text-lg font-semibold mb-2 flex items-center">`);
        push_element($$renderer2, "h3", 170, 10);
        Wallet($$renderer2, { class: "h-5 w-5 mr-2 text-primary" });
        $$renderer2.push(`<!----> Connect Wallet for NFT Benefits</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-sm text-muted-foreground mb-4">`);
        push_element($$renderer2, "p", 174, 10);
        $$renderer2.push(`Connect your wallet to get your subscription as an NFT and unlock exclusive Web3 features.
            You can still subscribe without a wallet using traditional payments.</p>`);
        pop_element();
        $$renderer2.push(` `);
        Button($$renderer2, {
          variant: "outline",
          size: "sm",
          onclick: () => showWalletModal = true,
          children: prevent_snippet_stringification(($$renderer3) => {
            Wallet($$renderer3, { class: "h-4 w-4 mr-2" });
            $$renderer3.push(`<!----> Connect Wallet`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` <div class="space-y-2 text-sm">`);
        push_element($$renderer2, "div", 187, 8);
        $$renderer2.push(`<div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 188, 10);
        Crown($$renderer2, { class: "h-4 w-4 text-primary" });
        $$renderer2.push(`<!----> <span>`);
        push_element($$renderer2, "span", 190, 12);
        $$renderer2.push(`Subscription NFT ownership</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 192, 10);
        Gift($$renderer2, { class: "h-4 w-4 text-secondary" });
        $$renderer2.push(`<!----> <span>`);
        push_element($$renderer2, "span", 194, 12);
        $$renderer2.push(`Stake STC tokens for up to 50% off</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 196, 10);
        Zap($$renderer2, { class: "h-4 w-4 text-accent" });
        $$renderer2.push(`<!----> <span>`);
        push_element($$renderer2, "span", 198, 12);
        $$renderer2.push(`Cross-platform verification</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        if (parseFloat(stakingAmount) > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">`);
          push_element($$renderer2, "div", 204, 4);
          $$renderer2.push(`<div class="flex items-center justify-between">`);
          push_element($$renderer2, "div", 205, 6);
          $$renderer2.push(`<div class="flex items-center space-x-3">`);
          push_element($$renderer2, "div", 206, 8);
          $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">`);
          push_element($$renderer2, "div", 207, 10);
          Coins($$renderer2, { class: "h-4 w-4 text-primary-foreground" });
          $$renderer2.push(`<!----></div>`);
          pop_element();
          $$renderer2.push(` <div>`);
          push_element($$renderer2, "div", 210, 10);
          $$renderer2.push(`<h4 class="font-medium">`);
          push_element($$renderer2, "h4", 211, 12);
          $$renderer2.push(`Staking Discount Active</h4>`);
          pop_element();
          $$renderer2.push(` <p class="text-sm text-muted-foreground">`);
          push_element($$renderer2, "p", 212, 12);
          $$renderer2.push(`${escape_html(parseFloat(stakingAmount).toLocaleString())} STC staked • ${escape_html(userDiscount)}% discount applied</p>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
          $$renderer2.push(` `);
          Button($$renderer2, {
            variant: "outline",
            size: "sm",
            href: "/tokens",
            children: prevent_snippet_stringification(($$renderer3) => {
              $$renderer3.push(`<!---->Manage Staking`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----></div>`);
          pop_element();
          $$renderer2.push(`</div>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--> <div class="grid gap-6 lg:grid-cols-3">`);
      push_element($$renderer2, "div", 224, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(plans);
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let plan = each_array[$$index_2];
        const PlanIcon = getPlanIcon(plan.id);
        Card($$renderer2, {
          class: `relative ${stringify(plan.isPopular ? "border-primary/50 bg-primary/5" : "")}`,
          children: prevent_snippet_stringification(($$renderer3) => {
            if (plan.isPopular) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<div class="absolute -top-2 left-1/2 -translate-x-1/2">`);
              push_element($$renderer3, "div", 229, 10);
              Badge($$renderer3, {
                class: "bg-primary text-primary-foreground",
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<!---->Most Popular`);
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!----></div>`);
              pop_element();
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> `);
            Card_header($$renderer3, {
              children: prevent_snippet_stringification(($$renderer4) => {
                Card_title($$renderer4, {
                  class: "flex items-center space-x-2",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->`);
                    PlanIcon($$renderer5, {
                      class: `h-5 w-5 text-${stringify(plan.isPopular ? "primary" : "muted-foreground")}`
                    });
                    $$renderer5.push(`<!----> <span>`);
                    push_element($$renderer5, "span", 239, 12);
                    $$renderer5.push(`${escape_html(plan.name)}</span>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Card_content($$renderer3, {
              class: "space-y-6",
              children: prevent_snippet_stringification(($$renderer4) => {
                $$renderer4.push(`<div class="space-y-2">`);
                push_element($$renderer4, "div", 244, 10);
                $$renderer4.push(`<div class="flex items-baseline">`);
                push_element($$renderer4, "div", 245, 12);
                if (plan.originalPrice && plan.originalPrice !== plan.price) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<span class="text-lg line-through text-muted-foreground mr-2">`);
                  push_element($$renderer4, "span", 247, 16);
                  $$renderer4.push(`$${escape_html(plan.originalPrice.toFixed(2))}</span>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> <span class="text-3xl font-bold">`);
                push_element($$renderer4, "span", 251, 14);
                $$renderer4.push(`$${escape_html(plan.price.toFixed(2))}</span>`);
                pop_element();
                $$renderer4.push(` <span class="text-muted-foreground ml-1">`);
                push_element($$renderer4, "span", 252, 14);
                $$renderer4.push(`/month</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` `);
                {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
                $$renderer4.push(` <div class="space-y-3">`);
                push_element($$renderer4, "div", 262, 10);
                $$renderer4.push(`<h4 class="font-medium text-sm">`);
                push_element($$renderer4, "h4", 263, 12);
                $$renderer4.push(`Platform Features</h4>`);
                pop_element();
                $$renderer4.push(` <ul class="space-y-2">`);
                push_element($$renderer4, "ul", 264, 12);
                $$renderer4.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(plan.features);
                for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                  let feature = each_array_1[$$index];
                  $$renderer4.push(`<li class="flex items-center">`);
                  push_element($$renderer4, "li", 266, 16);
                  Check($$renderer4, { class: "h-4 w-4 text-primary mr-2 shrink-0" });
                  $$renderer4.push(`<!----> <span class="text-sm">`);
                  push_element($$renderer4, "span", 268, 18);
                  $$renderer4.push(`${escape_html(feature)}</span>`);
                  pop_element();
                  $$renderer4.push(`</li>`);
                  pop_element();
                }
                $$renderer4.push(`<!--]--></ul>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="space-y-3 pt-3 border-t border-border">`);
                push_element($$renderer4, "div", 275, 10);
                $$renderer4.push(`<h4 class="font-medium text-sm flex items-center">`);
                push_element($$renderer4, "h4", 276, 12);
                Crown($$renderer4, { class: "h-4 w-4 mr-1 text-secondary" });
                $$renderer4.push(`<!----> NFT Ownership Benefits</h4>`);
                pop_element();
                $$renderer4.push(` <ul class="space-y-2">`);
                push_element($$renderer4, "ul", 280, 12);
                $$renderer4.push(`<!--[-->`);
                const each_array_2 = ensure_array_like(plan.nftBenefits);
                for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                  let benefit = each_array_2[$$index_1];
                  $$renderer4.push(`<li class="flex items-center">`);
                  push_element($$renderer4, "li", 282, 16);
                  Star($$renderer4, { class: "h-3 w-3 text-secondary mr-2 shrink-0" });
                  $$renderer4.push(`<!----> <span class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "span", 284, 18);
                  $$renderer4.push(`${escape_html(benefit)}</span>`);
                  pop_element();
                  $$renderer4.push(`</li>`);
                  pop_element();
                }
                $$renderer4.push(`<!--]--></ul>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` `);
                Button($$renderer4, {
                  class: "w-full",
                  variant: plan.isPopular ? "default" : "outline",
                  href: `/checkout?plan=${stringify(plan.id)}`,
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->Start Free Trial`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!---->`);
              }),
              $$slots: { default: true }
            });
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        });
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-12 space-y-8">`);
      push_element($$renderer2, "div", 303, 2);
      $$renderer2.push(`<div class="text-center space-y-4">`);
      push_element($$renderer2, "div", 305, 4);
      $$renderer2.push(`<h2 class="text-2xl font-bold">`);
      push_element($$renderer2, "h2", 306, 6);
      $$renderer2.push(`How NFT Subscriptions Work</h2>`);
      pop_element();
      $$renderer2.push(` <div class="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">`);
      push_element($$renderer2, "div", 307, 6);
      $$renderer2.push(`<div class="text-center space-y-2">`);
      push_element($$renderer2, "div", 308, 8);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
      push_element($$renderer2, "div", 309, 10);
      $$renderer2.push(`1</div>`);
      pop_element();
      $$renderer2.push(` <h4 class="font-medium">`);
      push_element($$renderer2, "h4", 310, 10);
      $$renderer2.push(`Subscribe</h4>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground">`);
      push_element($$renderer2, "p", 311, 10);
      $$renderer2.push(`Pay with fiat (credit card)</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center space-y-2">`);
      push_element($$renderer2, "div", 313, 8);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
      push_element($$renderer2, "div", 314, 10);
      $$renderer2.push(`2</div>`);
      pop_element();
      $$renderer2.push(` <h4 class="font-medium">`);
      push_element($$renderer2, "h4", 315, 10);
      $$renderer2.push(`NFT Minted</h4>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground">`);
      push_element($$renderer2, "p", 316, 10);
      $$renderer2.push(`Subscription NFT sent to wallet</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center space-y-2">`);
      push_element($$renderer2, "div", 318, 8);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
      push_element($$renderer2, "div", 319, 10);
      $$renderer2.push(`3</div>`);
      pop_element();
      $$renderer2.push(` <h4 class="font-medium">`);
      push_element($$renderer2, "h4", 320, 10);
      $$renderer2.push(`Own &amp; Transfer</h4>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground">`);
      push_element($$renderer2, "p", 321, 10);
      $$renderer2.push(`Share with family or friends</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center space-y-2">`);
      push_element($$renderer2, "div", 323, 8);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
      push_element($$renderer2, "div", 324, 10);
      $$renderer2.push(`4</div>`);
      pop_element();
      $$renderer2.push(` <h4 class="font-medium">`);
      push_element($$renderer2, "h4", 325, 10);
      $$renderer2.push(`Enjoy Benefits</h4>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground">`);
      push_element($$renderer2, "p", 326, 10);
      $$renderer2.push(`Exclusive perks &amp; rewards</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div>`);
      push_element($$renderer2, "div", 332, 4);
      $$renderer2.push(`<h2 class="text-xl font-bold mb-4 text-center">`);
      push_element($$renderer2, "h2", 333, 6);
      $$renderer2.push(`Staking Discounts</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-sm text-muted-foreground text-center mb-6">`);
      push_element($$renderer2, "p", 334, 6);
      $$renderer2.push(`Lock STC tokens to reduce your monthly price. Earn STC free by watching — no purchase needed.</p>`);
      pop_element();
      $$renderer2.push(` <div class="overflow-hidden rounded-xl border border-border">`);
      push_element($$renderer2, "div", 335, 6);
      $$renderer2.push(`<table class="w-full text-sm">`);
      push_element($$renderer2, "table", 336, 8);
      $$renderer2.push(`<thead class="bg-muted/30">`);
      push_element($$renderer2, "thead", 337, 10);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 338, 12);
      $$renderer2.push(`<th class="text-left px-4 py-3 text-muted-foreground font-medium">`);
      push_element($$renderer2, "th", 339, 14);
      $$renderer2.push(`Tier</th>`);
      pop_element();
      $$renderer2.push(`<th class="text-left px-4 py-3 text-muted-foreground font-medium">`);
      push_element($$renderer2, "th", 340, 14);
      $$renderer2.push(`Discount</th>`);
      pop_element();
      $$renderer2.push(`<th class="text-left px-4 py-3 text-muted-foreground font-medium">`);
      push_element($$renderer2, "th", 341, 14);
      $$renderer2.push(`How to reach</th>`);
      pop_element();
      $$renderer2.push(`<th class="text-left px-4 py-3 text-muted-foreground font-medium">`);
      push_element($$renderer2, "th", 342, 14);
      $$renderer2.push(`Price on $10/mo</th>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
      $$renderer2.push(`<tbody class="divide-y divide-border">`);
      push_element($$renderer2, "tbody", 345, 10);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 346, 12);
      $$renderer2.push(`<td class="px-4 py-3">`);
      push_element($$renderer2, "td", 346, 16);
      $$renderer2.push(`Tier 1</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3 text-green-400">`);
      push_element($$renderer2, "td", 346, 49);
      $$renderer2.push(`10% off</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3 text-muted-foreground">`);
      push_element($$renderer2, "td", 346, 98);
      $$renderer2.push(`1,000+ STC locked 90d+</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3">`);
      push_element($$renderer2, "td", 346, 169);
      $$renderer2.push(`$9</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 347, 12);
      $$renderer2.push(`<td class="px-4 py-3">`);
      push_element($$renderer2, "td", 347, 16);
      $$renderer2.push(`Tier 2</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3 text-green-400">`);
      push_element($$renderer2, "td", 347, 49);
      $$renderer2.push(`20% off</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3 text-muted-foreground">`);
      push_element($$renderer2, "td", 347, 98);
      $$renderer2.push(`3,500+ STC or 1,000+ for 2yr</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3">`);
      push_element($$renderer2, "td", 347, 175);
      $$renderer2.push(`$8</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 348, 12);
      $$renderer2.push(`<td class="px-4 py-3">`);
      push_element($$renderer2, "td", 348, 16);
      $$renderer2.push(`Tier 3</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3 text-green-400">`);
      push_element($$renderer2, "td", 348, 49);
      $$renderer2.push(`35% off</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3 text-muted-foreground">`);
      push_element($$renderer2, "td", 348, 98);
      $$renderer2.push(`10,000+ STC or 3,500+ for 2yr</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3">`);
      push_element($$renderer2, "td", 348, 176);
      $$renderer2.push(`$6.50</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 349, 12);
      $$renderer2.push(`<td class="px-4 py-3">`);
      push_element($$renderer2, "td", 349, 16);
      $$renderer2.push(`Tier 4</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3 text-green-400">`);
      push_element($$renderer2, "td", 349, 49);
      $$renderer2.push(`50% off</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3 text-muted-foreground">`);
      push_element($$renderer2, "td", 349, 98);
      $$renderer2.push(`35,000+ STC or 10,000+ for 2yr</td>`);
      pop_element();
      $$renderer2.push(`<td class="px-4 py-3">`);
      push_element($$renderer2, "td", 349, 177);
      $$renderer2.push(`$5</td>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</tbody>`);
      pop_element();
      $$renderer2.push(`</table>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground mt-3 text-center">`);
      push_element($$renderer2, "p", 353, 6);
      $$renderer2.push(`Tier 1 is reachable in ~200 days of watching at 5 STC/day — no purchase needed.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid md:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 357, 4);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center space-x-2",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Gift($$renderer5, { class: "h-5 w-5 text-primary" });
                  $$renderer5.push(`<!----> <span>`);
                  push_element($$renderer5, "span", 362, 12);
                  $$renderer5.push(`Why Choose NFT Subscriptions?</span>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-3 text-sm",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div>`);
              push_element($$renderer4, "div", 366, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 366, 17);
              $$renderer4.push(`True Ownership:</strong>`);
              pop_element();
              $$renderer4.push(` Your subscription is stored on the blockchain</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 367, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 367, 17);
              $$renderer4.push(`Family Sharing:</strong>`);
              pop_element();
              $$renderer4.push(` Transfer your NFT to family members</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 368, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 368, 17);
              $$renderer4.push(`Cross-Platform:</strong>`);
              pop_element();
              $$renderer4.push(` Use on partner streaming services</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 369, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 369, 17);
              $$renderer4.push(`Exclusive Rewards:</strong>`);
              pop_element();
              $$renderer4.push(` NFT holder-only benefits and airdrops</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 370, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 370, 17);
              $$renderer4.push(`Transparent:</strong>`);
              pop_element();
              $$renderer4.push(` View your payment history on-chain</div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center space-x-2",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Coins($$renderer5, { class: "h-5 w-5 text-secondary" });
                  $$renderer5.push(`<!----> <span>`);
                  push_element($$renderer5, "span", 378, 12);
                  $$renderer5.push(`STC Token Benefits</span>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-3 text-sm",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div>`);
              push_element($$renderer4, "div", 382, 10);
              $$renderer4.push(`💰 <strong>`);
              push_element($$renderer4, "strong", 382, 18);
              $$renderer4.push(`Earn Tokens:</strong>`);
              pop_element();
              $$renderer4.push(` Watch content and earn STC rewards</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 383, 10);
              $$renderer4.push(`🔒 <strong>`);
              push_element($$renderer4, "strong", 383, 18);
              $$renderer4.push(`Stake for Discounts:</strong>`);
              pop_element();
              $$renderer4.push(` Up to 50% off subscription fees</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 384, 10);
              $$renderer4.push(`🗳️ <strong>`);
              push_element($$renderer4, "strong", 384, 19);
              $$renderer4.push(`Governance Rights:</strong>`);
              pop_element();
              $$renderer4.push(` Vote on platform decisions</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 385, 10);
              $$renderer4.push(`🎁 <strong>`);
              push_element($$renderer4, "strong", 385, 18);
              $$renderer4.push(`Exclusive Access:</strong>`);
              pop_element();
              $$renderer4.push(` Early content and feature access</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 386, 10);
              $$renderer4.push(`📈 <strong>`);
              push_element($$renderer4, "strong", 386, 18);
              $$renderer4.push(`Token Growth:</strong>`);
              pop_element();
              $$renderer4.push(` Benefit from platform revenue growth</div>`);
              pop_element();
              $$renderer4.push(` <div class="pt-2">`);
              push_element($$renderer4, "div", 387, 10);
              Button($$renderer4, {
                variant: "outline",
                size: "sm",
                href: "/tokens",
                class: "w-full",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->Learn About STC Tokens`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (showWalletModal) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">`);
        push_element($$renderer2, "div", 400, 2);
        $$renderer2.push(`<div class="bg-background p-6 rounded-lg max-w-md w-full mx-4">`);
        push_element($$renderer2, "div", 401, 4);
        $$renderer2.push(`<div class="flex items-center justify-between mb-4">`);
        push_element($$renderer2, "div", 402, 6);
        $$renderer2.push(`<h3 class="text-lg font-semibold">`);
        push_element($$renderer2, "h3", 403, 8);
        $$renderer2.push(`Connect Wallet</h3>`);
        pop_element();
        $$renderer2.push(` `);
        Button($$renderer2, {
          variant: "ghost",
          size: "sm",
          onclick: () => showWalletModal = false,
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->×`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` `);
        WalletConnect($$renderer2);
        $$renderer2.push(`<!----> <div class="mt-4 text-center">`);
        push_element($$renderer2, "div", 407, 6);
        Button($$renderer2, {
          variant: "ghost",
          size: "sm",
          onclick: () => showWalletModal = false,
          class: "text-muted-foreground",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Continue without wallet`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-BvRuX_gV.js.map
