import { M as store_get, p as prevent_snippet_stringification, E as escape_html, m as ensure_array_like, x as stringify, N as unsubscribe_stores } from './index-C14HL8mA.js';
import { B as Button } from './button-B5TxIyzE.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { W as Wallet, i as isConnected, w as walletAddress } from './wallet-B7_7GztS.js';
import './config-Bjr_iq_c.js';
import { W as WalletConnect } from './WalletConnect-kbrpxgJC.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { G as Gift } from './gift-BiMWdY9f.js';
import { Z as Zap } from './zap-BWprV7m9.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { C as Check } from './check-BwxT_uMO.js';
import { S as Star } from './star-BD4Vo9gv.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './utils2-C-_3GP94.js';
import './Icon-DLeFNkXp.js';
import '@wagmi/core';
import '@wagmi/connectors';
import './index3-CnQVvK5M.js';
import '@wagmi/core/chains';
import './external-link-DQXvFabB.js';

_page[FILENAME] = "src/routes/(app)/plans/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let plans = [
        {
          id: "basic",
          name: "Basic NFT",
          price: 9.99,
          features: [
            "Access to basic content",
            "HD streaming",
            "1 device",
            "Cancel anytime"
          ],
          nftBenefits: [
            "Own your subscription as NFT",
            "Transfer to family",
            "Cross-platform access"
          ]
        },
        {
          id: "standard",
          name: "Premium NFT",
          price: 15.99,
          features: [
            "Access to premium content",
            "4K streaming",
            "2 devices",
            "Download available",
            "Cancel anytime"
          ],
          nftBenefits: [
            "Enhanced NFT benefits",
            "Exclusive member rewards",
            "Priority customer support",
            "Early access to new features"
          ],
          isPopular: true
        },
        {
          id: "premium",
          name: "Creator NFT",
          price: 25.99,
          features: [
            "Access to all content",
            "4K + HDR streaming",
            "4 devices",
            "Creator tools access",
            "Early access content",
            "Cancel anytime"
          ],
          nftBenefits: [
            "Exclusive NFT rewards",
            "Creator community access",
            "Revenue sharing opportunities",
            "Governance voting rights"
          ]
        }
      ];
      let selectedPlan = "standard";
      let isLoading = false;
      let userDiscount = 0;
      let stakingAmount = "0";
      let showWalletModal = false;
      async function handleSubscribe(planId) {
        isLoading = true;
        selectedPlan = planId;
        try {
          const response = await fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              planId,
              walletAddress: store_get($$store_subs ??= {}, "$walletAddress", walletAddress),
              discount: userDiscount
            })
          });
          if (response.ok) {
            const { url } = await response.json();
            window.location.href = url;
          }
        } catch (error) {
          console.error("Failed to subscribe:", error);
        } finally {
          isLoading = false;
        }
      }
      function getPlanIcon(planId) {
        switch (planId) {
          case "premium":
            return Crown;
          case "standard":
            return Star;
          default:
            return Coins;
        }
      }
      $$renderer2.push(`<div class="container max-w-7xl py-8">`);
      push_element($$renderer2, "div", 146, 0);
      $$renderer2.push(`<div class="text-center space-y-4 mb-8">`);
      push_element($$renderer2, "div", 147, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold gradient-text svelte-19dwmhu">`);
      push_element($$renderer2, "h1", 148, 4);
      $$renderer2.push(`Choose Your NFT Subscription</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground max-w-2xl mx-auto">`);
      push_element($$renderer2, "p", 149, 4);
      $$renderer2.push(`Own your subscription as an NFT. Get exclusive benefits, cross-platform access, and true ownership. `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="mb-8 p-6 bg-accent/5 border border-accent/20 rounded-lg">`);
        push_element($$renderer2, "div", 161, 4);
        $$renderer2.push(`<div class="grid md:grid-cols-2 gap-6 items-center">`);
        push_element($$renderer2, "div", 162, 6);
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 163, 8);
        $$renderer2.push(`<h3 class="text-lg font-semibold mb-2 flex items-center">`);
        push_element($$renderer2, "h3", 164, 10);
        Wallet($$renderer2, { class: "h-5 w-5 mr-2 text-primary" });
        $$renderer2.push(`<!----> Connect Wallet for NFT Benefits</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-sm text-muted-foreground mb-4">`);
        push_element($$renderer2, "p", 168, 10);
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
        push_element($$renderer2, "div", 181, 8);
        $$renderer2.push(`<div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 182, 10);
        Crown($$renderer2, { class: "h-4 w-4 text-primary" });
        $$renderer2.push(`<!----> <span>`);
        push_element($$renderer2, "span", 184, 12);
        $$renderer2.push(`Subscription NFT ownership</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 186, 10);
        Gift($$renderer2, { class: "h-4 w-4 text-secondary" });
        $$renderer2.push(`<!----> <span>`);
        push_element($$renderer2, "span", 188, 12);
        $$renderer2.push(`Stake STC tokens for up to 50% off</span>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <div class="flex items-center space-x-2">`);
        push_element($$renderer2, "div", 190, 10);
        Zap($$renderer2, { class: "h-4 w-4 text-accent" });
        $$renderer2.push(`<!----> <span>`);
        push_element($$renderer2, "span", 192, 12);
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
          push_element($$renderer2, "div", 198, 4);
          $$renderer2.push(`<div class="flex items-center justify-between">`);
          push_element($$renderer2, "div", 199, 6);
          $$renderer2.push(`<div class="flex items-center space-x-3">`);
          push_element($$renderer2, "div", 200, 8);
          $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">`);
          push_element($$renderer2, "div", 201, 10);
          Coins($$renderer2, { class: "h-4 w-4 text-primary-foreground" });
          $$renderer2.push(`<!----></div>`);
          pop_element();
          $$renderer2.push(` <div>`);
          push_element($$renderer2, "div", 204, 10);
          $$renderer2.push(`<h4 class="font-medium">`);
          push_element($$renderer2, "h4", 205, 12);
          $$renderer2.push(`Staking Discount Active</h4>`);
          pop_element();
          $$renderer2.push(` <p class="text-sm text-muted-foreground">`);
          push_element($$renderer2, "p", 206, 12);
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
      push_element($$renderer2, "div", 218, 2);
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
              push_element($$renderer3, "div", 223, 10);
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
                    push_element($$renderer5, "span", 233, 12);
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
                push_element($$renderer4, "div", 238, 10);
                $$renderer4.push(`<div class="flex items-baseline">`);
                push_element($$renderer4, "div", 239, 12);
                if (plan.originalPrice && plan.originalPrice !== plan.price) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<span class="text-lg line-through text-muted-foreground mr-2">`);
                  push_element($$renderer4, "span", 241, 16);
                  $$renderer4.push(`$${escape_html(plan.originalPrice.toFixed(2))}</span>`);
                  pop_element();
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> <span class="text-3xl font-bold">`);
                push_element($$renderer4, "span", 245, 14);
                $$renderer4.push(`$${escape_html(plan.price.toFixed(2))}</span>`);
                pop_element();
                $$renderer4.push(` <span class="text-muted-foreground ml-1">`);
                push_element($$renderer4, "span", 246, 14);
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
                push_element($$renderer4, "div", 256, 10);
                $$renderer4.push(`<h4 class="font-medium text-sm">`);
                push_element($$renderer4, "h4", 257, 12);
                $$renderer4.push(`Platform Features</h4>`);
                pop_element();
                $$renderer4.push(` <ul class="space-y-2">`);
                push_element($$renderer4, "ul", 258, 12);
                $$renderer4.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(plan.features);
                for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
                  let feature = each_array_1[$$index];
                  $$renderer4.push(`<li class="flex items-center">`);
                  push_element($$renderer4, "li", 260, 16);
                  Check($$renderer4, { class: "h-4 w-4 text-primary mr-2 flex-shrink-0" });
                  $$renderer4.push(`<!----> <span class="text-sm">`);
                  push_element($$renderer4, "span", 262, 18);
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
                push_element($$renderer4, "div", 269, 10);
                $$renderer4.push(`<h4 class="font-medium text-sm flex items-center">`);
                push_element($$renderer4, "h4", 270, 12);
                Crown($$renderer4, { class: "h-4 w-4 mr-1 text-secondary" });
                $$renderer4.push(`<!----> NFT Ownership Benefits</h4>`);
                pop_element();
                $$renderer4.push(` <ul class="space-y-2">`);
                push_element($$renderer4, "ul", 274, 12);
                $$renderer4.push(`<!--[-->`);
                const each_array_2 = ensure_array_like(plan.nftBenefits);
                for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
                  let benefit = each_array_2[$$index_1];
                  $$renderer4.push(`<li class="flex items-center">`);
                  push_element($$renderer4, "li", 276, 16);
                  Star($$renderer4, { class: "h-3 w-3 text-secondary mr-2 flex-shrink-0" });
                  $$renderer4.push(`<!----> <span class="text-xs text-muted-foreground">`);
                  push_element($$renderer4, "span", 278, 18);
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
                  disabled: isLoading,
                  onclick: () => handleSubscribe(plan.id),
                  children: prevent_snippet_stringification(($$renderer5) => {
                    if (isLoading && selectedPlan === plan.id) {
                      $$renderer5.push("<!--[-->");
                      $$renderer5.push(`Processing...`);
                    } else {
                      $$renderer5.push("<!--[!-->");
                      $$renderer5.push(`Subscribe &amp; Get NFT`);
                    }
                    $$renderer5.push(`<!--]-->`);
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
      push_element($$renderer2, "div", 302, 2);
      $$renderer2.push(`<div class="text-center space-y-4">`);
      push_element($$renderer2, "div", 304, 4);
      $$renderer2.push(`<h2 class="text-2xl font-bold">`);
      push_element($$renderer2, "h2", 305, 6);
      $$renderer2.push(`How NFT Subscriptions Work</h2>`);
      pop_element();
      $$renderer2.push(` <div class="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">`);
      push_element($$renderer2, "div", 306, 6);
      $$renderer2.push(`<div class="text-center space-y-2">`);
      push_element($$renderer2, "div", 307, 8);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
      push_element($$renderer2, "div", 308, 10);
      $$renderer2.push(`1</div>`);
      pop_element();
      $$renderer2.push(` <h4 class="font-medium">`);
      push_element($$renderer2, "h4", 309, 10);
      $$renderer2.push(`Subscribe</h4>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground">`);
      push_element($$renderer2, "p", 310, 10);
      $$renderer2.push(`Pay with fiat (credit card)</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center space-y-2">`);
      push_element($$renderer2, "div", 312, 8);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
      push_element($$renderer2, "div", 313, 10);
      $$renderer2.push(`2</div>`);
      pop_element();
      $$renderer2.push(` <h4 class="font-medium">`);
      push_element($$renderer2, "h4", 314, 10);
      $$renderer2.push(`NFT Minted</h4>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground">`);
      push_element($$renderer2, "p", 315, 10);
      $$renderer2.push(`Subscription NFT sent to wallet</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center space-y-2">`);
      push_element($$renderer2, "div", 317, 8);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
      push_element($$renderer2, "div", 318, 10);
      $$renderer2.push(`3</div>`);
      pop_element();
      $$renderer2.push(` <h4 class="font-medium">`);
      push_element($$renderer2, "h4", 319, 10);
      $$renderer2.push(`Own &amp; Transfer</h4>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground">`);
      push_element($$renderer2, "p", 320, 10);
      $$renderer2.push(`Share with family or friends</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-center space-y-2">`);
      push_element($$renderer2, "div", 322, 8);
      $$renderer2.push(`<div class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
      push_element($$renderer2, "div", 323, 10);
      $$renderer2.push(`4</div>`);
      pop_element();
      $$renderer2.push(` <h4 class="font-medium">`);
      push_element($$renderer2, "h4", 324, 10);
      $$renderer2.push(`Enjoy Benefits</h4>`);
      pop_element();
      $$renderer2.push(` <p class="text-xs text-muted-foreground">`);
      push_element($$renderer2, "p", 325, 10);
      $$renderer2.push(`Exclusive perks &amp; rewards</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid md:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 331, 4);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center space-x-2",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Gift($$renderer5, { class: "h-5 w-5 text-primary" });
                  $$renderer5.push(`<!----> <span>`);
                  push_element($$renderer5, "span", 336, 12);
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
              push_element($$renderer4, "div", 340, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 340, 17);
              $$renderer4.push(`True Ownership:</strong>`);
              pop_element();
              $$renderer4.push(` Your subscription is stored on the blockchain</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 341, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 341, 17);
              $$renderer4.push(`Family Sharing:</strong>`);
              pop_element();
              $$renderer4.push(` Transfer your NFT to family members</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 342, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 342, 17);
              $$renderer4.push(`Cross-Platform:</strong>`);
              pop_element();
              $$renderer4.push(` Use on partner streaming services</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 343, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 343, 17);
              $$renderer4.push(`Exclusive Rewards:</strong>`);
              pop_element();
              $$renderer4.push(` NFT holder-only benefits and airdrops</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 344, 10);
              $$renderer4.push(`✓ <strong>`);
              push_element($$renderer4, "strong", 344, 17);
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
                  push_element($$renderer5, "span", 352, 12);
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
              push_element($$renderer4, "div", 356, 10);
              $$renderer4.push(`💰 <strong>`);
              push_element($$renderer4, "strong", 356, 18);
              $$renderer4.push(`Earn Tokens:</strong>`);
              pop_element();
              $$renderer4.push(` Watch content and earn STC rewards</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 357, 10);
              $$renderer4.push(`🔒 <strong>`);
              push_element($$renderer4, "strong", 357, 18);
              $$renderer4.push(`Stake for Discounts:</strong>`);
              pop_element();
              $$renderer4.push(` Up to 50% off subscription fees</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 358, 10);
              $$renderer4.push(`🗳️ <strong>`);
              push_element($$renderer4, "strong", 358, 19);
              $$renderer4.push(`Governance Rights:</strong>`);
              pop_element();
              $$renderer4.push(` Vote on platform decisions</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 359, 10);
              $$renderer4.push(`🎁 <strong>`);
              push_element($$renderer4, "strong", 359, 18);
              $$renderer4.push(`Exclusive Access:</strong>`);
              pop_element();
              $$renderer4.push(` Early content and feature access</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 360, 10);
              $$renderer4.push(`📈 <strong>`);
              push_element($$renderer4, "strong", 360, 18);
              $$renderer4.push(`Token Growth:</strong>`);
              pop_element();
              $$renderer4.push(` Benefit from platform revenue growth</div>`);
              pop_element();
              $$renderer4.push(` <div class="pt-2">`);
              push_element($$renderer4, "div", 361, 10);
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
        push_element($$renderer2, "div", 374, 2);
        $$renderer2.push(`<div class="bg-background p-6 rounded-lg max-w-md w-full mx-4">`);
        push_element($$renderer2, "div", 375, 4);
        $$renderer2.push(`<div class="flex items-center justify-between mb-4">`);
        push_element($$renderer2, "div", 376, 6);
        $$renderer2.push(`<h3 class="text-lg font-semibold">`);
        push_element($$renderer2, "h3", 377, 8);
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
        push_element($$renderer2, "div", 381, 6);
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
//# sourceMappingURL=_page.svelte-VdPzQw8V.js.map
