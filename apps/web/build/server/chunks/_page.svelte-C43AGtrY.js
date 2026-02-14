import { p as prevent_snippet_stringification, M as store_get, N as unsubscribe_stores, E as escape_html } from './index-C14HL8mA.js';
import { W as WalletConnect } from './WalletConnect-kbrpxgJC.js';
import { B as Button } from './button-B5TxIyzE.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { i as isConnected } from './wallet-B7_7GztS.js';
import './config-Bjr_iq_c.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { T as Trending_up } from './trending-up-DO-Ljp1I.js';
import { D as Dollar_sign } from './dollar-sign-DitbSj8h.js';
import { R as Refresh_cw } from './refresh-cw-BTej-Wkl.js';
import { C as Calendar } from './calendar-OU4WsVKb.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { G as Gift } from './gift-BiMWdY9f.js';
import { S as Star } from './star-BD4Vo9gv.js';
import { U as Users } from './users-CMHMaCG6.js';
import { Z as Zap } from './zap-BWprV7m9.js';
import { A as Arrow_right } from './arrow-right-OsfR0UoT.js';
import './external-link-DQXvFabB.js';
import './Icon-DLeFNkXp.js';
import './coins-CelX_gXX.js';
import './utils2-C-_3GP94.js';
import '@wagmi/core';
import '@wagmi/connectors';
import './index3-CnQVvK5M.js';
import '@wagmi/core/chains';

SubscriptionNFT[FILENAME] = "src/lib/components/web3/SubscriptionNFT.svelte";
function SubscriptionNFT($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let subscriptionDetails = {
        renewalCount: 0
      };
      let nftBalance = 0;
      if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        Card($$renderer2, {
          children: prevent_snippet_stringification(($$renderer3) => {
            Card_content($$renderer3, {
              class: "p-6 text-center",
              children: prevent_snippet_stringification(($$renderer4) => {
                Crown($$renderer4, { class: "mx-auto h-12 w-12 text-muted-foreground mb-4" });
                $$renderer4.push(`<!----> <h3 class="text-lg font-semibold mb-2">`);
                push_element($$renderer4, "h3", 157, 6);
                $$renderer4.push(`Connect Wallet</h3>`);
                pop_element();
                $$renderer4.push(` <p class="text-muted-foreground">`);
                push_element($$renderer4, "p", 158, 6);
                $$renderer4.push(`Connect your wallet to view subscription NFTs</p>`);
                pop_element();
              }),
              $$slots: { default: true }
            });
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-6">`);
        push_element($$renderer2, "div", 162, 2);
        {
          $$renderer2.push("<!--[!-->");
          {
            $$renderer2.push("<!--[!-->");
            Card($$renderer2, {
              children: prevent_snippet_stringification(($$renderer3) => {
                Card_content($$renderer3, {
                  class: "p-6 text-center space-y-4",
                  children: prevent_snippet_stringification(($$renderer4) => {
                    $$renderer4.push(`<div class="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">`);
                    push_element($$renderer4, "div", 295, 12);
                    Crown($$renderer4, { class: "h-8 w-8 text-muted-foreground" });
                    $$renderer4.push(`<!----></div>`);
                    pop_element();
                    $$renderer4.push(` <div>`);
                    push_element($$renderer4, "div", 298, 12);
                    $$renderer4.push(`<h3 class="text-lg font-semibold mb-2">`);
                    push_element($$renderer4, "h3", 299, 14);
                    $$renderer4.push(`No Active Subscription</h3>`);
                    pop_element();
                    $$renderer4.push(` <p class="text-muted-foreground">`);
                    push_element($$renderer4, "p", 300, 14);
                    $$renderer4.push(`Subscribe to get your exclusive NFT membership and unlock premium content.</p>`);
                    pop_element();
                    $$renderer4.push(`</div>`);
                    pop_element();
                    $$renderer4.push(` `);
                    {
                      $$renderer4.push("<!--[!-->");
                    }
                    $$renderer4.push(`<!--]--> <div class="flex gap-2 justify-center">`);
                    push_element($$renderer4, "div", 316, 12);
                    Button($$renderer4, {
                      href: "/plans",
                      class: "bg-primary hover:bg-primary/90",
                      children: prevent_snippet_stringification(($$renderer5) => {
                        Crown($$renderer5, { class: "mr-2 h-4 w-4" });
                        $$renderer5.push(`<!----> Subscribe Now`);
                      }),
                      $$slots: { default: true }
                    });
                    $$renderer4.push(`<!----> `);
                    {
                      $$renderer4.push("<!--[!-->");
                    }
                    $$renderer4.push(`<!--]--></div>`);
                    pop_element();
                  }),
                  $$slots: { default: true }
                });
              }),
              $$slots: { default: true }
            });
          }
          $$renderer2.push(`<!--]--> `);
          Card($$renderer2, {
            children: prevent_snippet_stringification(($$renderer3) => {
              Card_header($$renderer3, {
                children: prevent_snippet_stringification(($$renderer4) => {
                  Card_title($$renderer4, {
                    class: "flex items-center space-x-2",
                    children: prevent_snippet_stringification(($$renderer5) => {
                      Trending_up($$renderer5, { class: "h-5 w-5" });
                      $$renderer5.push(`<!----> <span>`);
                      push_element($$renderer5, "span", 337, 12);
                      $$renderer5.push(`Subscription Analytics</span>`);
                      pop_element();
                    }),
                    $$slots: { default: true }
                  });
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!----> `);
              Card_content($$renderer3, {
                children: prevent_snippet_stringification(($$renderer4) => {
                  $$renderer4.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4">`);
                  push_element($$renderer4, "div", 341, 10);
                  $$renderer4.push(`<div class="text-center p-4 bg-primary/5 rounded-lg">`);
                  push_element($$renderer4, "div", 342, 12);
                  Crown($$renderer4, { class: "h-6 w-6 text-primary mx-auto mb-2" });
                  $$renderer4.push(`<!----> <p class="text-sm text-muted-foreground">`);
                  push_element($$renderer4, "p", 344, 14);
                  $$renderer4.push(`NFTs Owned</p>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-lg font-semibold">`);
                  push_element($$renderer4, "p", 345, 14);
                  $$renderer4.push(`${escape_html(nftBalance)}</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-secondary/5 rounded-lg">`);
                  push_element($$renderer4, "div", 348, 12);
                  Dollar_sign($$renderer4, { class: "h-6 w-6 text-secondary mx-auto mb-2" });
                  $$renderer4.push(`<!----> <p class="text-sm text-muted-foreground">`);
                  push_element($$renderer4, "p", 350, 14);
                  $$renderer4.push(`Total Spent</p>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-lg font-semibold">`);
                  push_element($$renderer4, "p", 351, 14);
                  $$renderer4.push(`$${escape_html("0.00")}</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-accent/5 rounded-lg">`);
                  push_element($$renderer4, "div", 356, 12);
                  Refresh_cw($$renderer4, { class: "h-6 w-6 text-accent mx-auto mb-2" });
                  $$renderer4.push(`<!----> <p class="text-sm text-muted-foreground">`);
                  push_element($$renderer4, "p", 358, 14);
                  $$renderer4.push(`Renewals</p>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-lg font-semibold">`);
                  push_element($$renderer4, "p", 359, 14);
                  $$renderer4.push(`${escape_html(subscriptionDetails.renewalCount)}</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(` <div class="text-center p-4 bg-muted/20 rounded-lg">`);
                  push_element($$renderer4, "div", 362, 12);
                  Calendar($$renderer4, { class: "h-6 w-6 text-muted-foreground mx-auto mb-2" });
                  $$renderer4.push(`<!----> <p class="text-sm text-muted-foreground">`);
                  push_element($$renderer4, "p", 364, 14);
                  $$renderer4.push(`Member Since</p>`);
                  pop_element();
                  $$renderer4.push(` <p class="text-lg font-semibold">`);
                  push_element($$renderer4, "p", 365, 14);
                  $$renderer4.push(`${escape_html("N/A")}</p>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                  $$renderer4.push(`</div>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
              $$renderer3.push(`<!---->`);
            }),
            $$slots: { default: true }
          });
          $$renderer2.push(`<!----> `);
          {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--> `);
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    SubscriptionNFT
  );
}
SubscriptionNFT.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/subscription/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      $$renderer2.push(`<div class="container max-w-6xl py-8">`);
      push_element($$renderer2, "div", 11, 0);
      $$renderer2.push(`<div class="text-center space-y-4 mb-8">`);
      push_element($$renderer2, "div", 13, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold gradient-text svelte-156u7ab">`);
      push_element($$renderer2, "h1", 14, 4);
      $$renderer2.push(`NFT Subscriptions</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground max-w-2xl mx-auto">`);
      push_element($$renderer2, "p", 17, 4);
      $$renderer2.push(`Own your subscription as an NFT. Get exclusive benefits, cross-platform access,
      and truly own your membership with blockchain transparency.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid lg:grid-cols-3 gap-6">`);
      push_element($$renderer2, "div", 23, 2);
      $$renderer2.push(`<div class="lg:col-span-1 space-y-6">`);
      push_element($$renderer2, "div", 25, 4);
      WalletConnect($$renderer2);
      $$renderer2.push(`<!----> `);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center space-x-2 text-sm",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Gift($$renderer5, { class: "h-4 w-4 text-primary" });
                  $$renderer5.push(`<!----> <span>`);
                  push_element($$renderer5, "span", 33, 12);
                  $$renderer5.push(`NFT Benefits</span>`);
                  pop_element();
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-3",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="flex items-start space-x-2">`);
              push_element($$renderer4, "div", 37, 10);
              Star($$renderer4, { class: "h-3 w-3 text-primary mt-1 flex-shrink-0" });
              $$renderer4.push(`<!----> <span class="text-xs">`);
              push_element($$renderer4, "span", 39, 12);
              $$renderer4.push(`Own your subscription forever</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-start space-x-2">`);
              push_element($$renderer4, "div", 41, 10);
              Star($$renderer4, { class: "h-3 w-3 text-secondary mt-1 flex-shrink-0" });
              $$renderer4.push(`<!----> <span class="text-xs">`);
              push_element($$renderer4, "span", 43, 12);
              $$renderer4.push(`Transfer to family members</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-start space-x-2">`);
              push_element($$renderer4, "div", 45, 10);
              Star($$renderer4, { class: "h-3 w-3 text-accent mt-1 flex-shrink-0" });
              $$renderer4.push(`<!----> <span class="text-xs">`);
              push_element($$renderer4, "span", 47, 12);
              $$renderer4.push(`Cross-platform verification</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-start space-x-2">`);
              push_element($$renderer4, "div", 49, 10);
              Star($$renderer4, { class: "h-3 w-3 text-primary mt-1 flex-shrink-0" });
              $$renderer4.push(`<!----> <span class="text-xs">`);
              push_element($$renderer4, "span", 51, 12);
              $$renderer4.push(`Exclusive member rewards</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
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
      $$renderer2.push(` <div class="lg:col-span-2">`);
      push_element($$renderer2, "div", 58, 4);
      if (store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
        $$renderer2.push("<!--[-->");
        SubscriptionNFT($$renderer2);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="h-full flex items-center justify-center p-8 bg-muted/10 border-2 border-dashed border-muted rounded-lg">`);
        push_element($$renderer2, "div", 62, 8);
        $$renderer2.push(`<div class="text-center space-y-4">`);
        push_element($$renderer2, "div", 63, 10);
        Crown($$renderer2, { class: "mx-auto h-12 w-12 text-muted-foreground" });
        $$renderer2.push(`<!----> <div class="space-y-2">`);
        push_element($$renderer2, "div", 65, 12);
        $$renderer2.push(`<h3 class="text-lg font-medium text-muted-foreground">`);
        push_element($$renderer2, "h3", 66, 14);
        $$renderer2.push(`Connect Your Wallet</h3>`);
        pop_element();
        $$renderer2.push(` <p class="text-sm text-muted-foreground">`);
        push_element($$renderer2, "p", 67, 14);
        $$renderer2.push(`Connect your wallet to view your subscription NFTs</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` `);
        Button($$renderer2, {
          variant: "outline",
          href: "/plans",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->View Plans Instead`);
          }),
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-12 space-y-8">`);
      push_element($$renderer2, "div", 79, 2);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 80, 4);
      $$renderer2.push(`<h2 class="text-2xl font-bold mb-4">`);
      push_element($$renderer2, "h2", 81, 6);
      $$renderer2.push(`Why Choose NFT Subscriptions?</h2>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground max-w-3xl mx-auto">`);
      push_element($$renderer2, "p", 82, 6);
      $$renderer2.push(`Traditional subscriptions are just database entries. Our NFT subscriptions give you true ownership,
        transparency, and unique benefits that can't be taken away.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid md:grid-cols-2 gap-6">`);
      push_element($$renderer2, "div", 88, 4);
      $$renderer2.push(`<div class="space-y-4">`);
      push_element($$renderer2, "div", 90, 6);
      $$renderer2.push(`<h3 class="text-lg font-semibold text-center">`);
      push_element($$renderer2, "h3", 91, 8);
      $$renderer2.push(`Traditional Subscriptions</h3>`);
      pop_element();
      $$renderer2.push(` `);
      Card($$renderer2, {
        class: "bg-muted/20",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_content($$renderer3, {
            class: "p-6 space-y-3",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="flex items-center space-x-2 text-sm text-muted-foreground">`);
              push_element($$renderer4, "div", 94, 12);
              $$renderer4.push(`<span class="w-2 h-2 rounded-full bg-muted-foreground">`);
              push_element($$renderer4, "span", 95, 14);
              $$renderer4.push(`</span>`);
              pop_element();
              $$renderer4.push(` <span>`);
              push_element($$renderer4, "span", 96, 14);
              $$renderer4.push(`Platform controls your access</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center space-x-2 text-sm text-muted-foreground">`);
              push_element($$renderer4, "div", 98, 12);
              $$renderer4.push(`<span class="w-2 h-2 rounded-full bg-muted-foreground">`);
              push_element($$renderer4, "span", 99, 14);
              $$renderer4.push(`</span>`);
              pop_element();
              $$renderer4.push(` <span>`);
              push_element($$renderer4, "span", 100, 14);
              $$renderer4.push(`No ownership rights</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center space-x-2 text-sm text-muted-foreground">`);
              push_element($$renderer4, "div", 102, 12);
              $$renderer4.push(`<span class="w-2 h-2 rounded-full bg-muted-foreground">`);
              push_element($$renderer4, "span", 103, 14);
              $$renderer4.push(`</span>`);
              pop_element();
              $$renderer4.push(` <span>`);
              push_element($$renderer4, "span", 104, 14);
              $$renderer4.push(`Can't transfer or share</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center space-x-2 text-sm text-muted-foreground">`);
              push_element($$renderer4, "div", 106, 12);
              $$renderer4.push(`<span class="w-2 h-2 rounded-full bg-muted-foreground">`);
              push_element($$renderer4, "span", 107, 14);
              $$renderer4.push(`</span>`);
              pop_element();
              $$renderer4.push(` <span>`);
              push_element($$renderer4, "span", 108, 14);
              $$renderer4.push(`Limited to one platform</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center space-x-2 text-sm text-muted-foreground">`);
              push_element($$renderer4, "div", 110, 12);
              $$renderer4.push(`<span class="w-2 h-2 rounded-full bg-muted-foreground">`);
              push_element($$renderer4, "span", 111, 14);
              $$renderer4.push(`</span>`);
              pop_element();
              $$renderer4.push(` <span>`);
              push_element($$renderer4, "span", 112, 14);
              $$renderer4.push(`No payment history proof</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 118, 6);
      $$renderer2.push(`<h3 class="text-lg font-semibold text-center gradient-text svelte-156u7ab">`);
      push_element($$renderer2, "h3", 119, 8);
      $$renderer2.push(`NFT Subscriptions</h3>`);
      pop_element();
      $$renderer2.push(` `);
      Card($$renderer2, {
        class: "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_content($$renderer3, {
            class: "p-6 space-y-3",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="flex items-center space-x-2 text-sm">`);
              push_element($$renderer4, "div", 122, 12);
              Crown($$renderer4, { class: "w-4 h-4 text-primary flex-shrink-0" });
              $$renderer4.push(`<!----> <span>`);
              push_element($$renderer4, "span", 124, 14);
              $$renderer4.push(`You own your subscription NFT</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center space-x-2 text-sm">`);
              push_element($$renderer4, "div", 126, 12);
              Users($$renderer4, { class: "w-4 h-4 text-secondary flex-shrink-0" });
              $$renderer4.push(`<!----> <span>`);
              push_element($$renderer4, "span", 128, 14);
              $$renderer4.push(`Transfer to family members</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center space-x-2 text-sm">`);
              push_element($$renderer4, "div", 130, 12);
              Zap($$renderer4, { class: "w-4 h-4 text-accent flex-shrink-0" });
              $$renderer4.push(`<!----> <span>`);
              push_element($$renderer4, "span", 132, 14);
              $$renderer4.push(`Cross-platform compatibility</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center space-x-2 text-sm">`);
              push_element($$renderer4, "div", 134, 12);
              Gift($$renderer4, { class: "w-4 h-4 text-primary flex-shrink-0" });
              $$renderer4.push(`<!----> <span>`);
              push_element($$renderer4, "span", 136, 14);
              $$renderer4.push(`Exclusive NFT holder benefits</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="flex items-center space-x-2 text-sm">`);
              push_element($$renderer4, "div", 138, 12);
              Star($$renderer4, { class: "w-4 h-4 text-secondary flex-shrink-0" });
              $$renderer4.push(`<!----> <span>`);
              push_element($$renderer4, "span", 140, 14);
              $$renderer4.push(`Immutable payment history</span>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Card($$renderer2, {
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "text-center",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<!---->How NFT Subscriptions Work`);
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="grid md:grid-cols-4 gap-4">`);
              push_element($$renderer4, "div", 153, 8);
              $$renderer4.push(`<div class="text-center space-y-2">`);
              push_element($$renderer4, "div", 154, 10);
              $$renderer4.push(`<div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
              push_element($$renderer4, "div", 155, 12);
              $$renderer4.push(`1</div>`);
              pop_element();
              $$renderer4.push(` <h4 class="font-medium">`);
              push_element($$renderer4, "h4", 156, 12);
              $$renderer4.push(`Subscribe</h4>`);
              pop_element();
              $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
              push_element($$renderer4, "p", 157, 12);
              $$renderer4.push(`Choose your plan and pay with fiat (Stripe)</p>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` `);
              Arrow_right($$renderer4, { class: "mx-auto text-muted-foreground mt-4" });
              $$renderer4.push(`<!----> <div class="text-center space-y-2">`);
              push_element($$renderer4, "div", 160, 10);
              $$renderer4.push(`<div class="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
              push_element($$renderer4, "div", 161, 12);
              $$renderer4.push(`2</div>`);
              pop_element();
              $$renderer4.push(` <h4 class="font-medium">`);
              push_element($$renderer4, "h4", 162, 12);
              $$renderer4.push(`NFT Minted</h4>`);
              pop_element();
              $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
              push_element($$renderer4, "p", 163, 12);
              $$renderer4.push(`Subscription NFT automatically minted to your wallet</p>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` `);
              Arrow_right($$renderer4, { class: "mx-auto text-muted-foreground mt-4" });
              $$renderer4.push(`<!----> <div class="text-center space-y-2">`);
              push_element($$renderer4, "div", 166, 10);
              $$renderer4.push(`<div class="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto text-sm font-bold">`);
              push_element($$renderer4, "div", 167, 12);
              $$renderer4.push(`3</div>`);
              pop_element();
              $$renderer4.push(` <h4 class="font-medium">`);
              push_element($$renderer4, "h4", 168, 12);
              $$renderer4.push(`Enjoy Benefits</h4>`);
              pop_element();
              $$renderer4.push(` <p class="text-xs text-muted-foreground">`);
              push_element($$renderer4, "p", 169, 12);
              $$renderer4.push(`Access premium content with NFT ownership perks</p>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="space-y-6">`);
      push_element($$renderer2, "div", 176, 4);
      $$renderer2.push(`<h3 class="text-xl font-bold text-center">`);
      push_element($$renderer2, "h3", 177, 6);
      $$renderer2.push(`NFT Subscription Tiers</h3>`);
      pop_element();
      $$renderer2.push(` <div class="grid md:grid-cols-3 gap-6">`);
      push_element($$renderer2, "div", 178, 6);
      Card($$renderer2, {
        class: "relative",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center justify-between",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 182, 14);
                  $$renderer5.push(`Basic NFT</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Badge($$renderer5, {
                    variant: "outline",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->$9.99/mo`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="space-y-2 text-sm">`);
              push_element($$renderer4, "div", 187, 12);
              $$renderer4.push(`<div>`);
              push_element($$renderer4, "div", 188, 14);
              $$renderer4.push(`✓ HD streaming</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 189, 14);
              $$renderer4.push(`✓ 1 device</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 190, 14);
              $$renderer4.push(`✓ Basic content library</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 191, 14);
              $$renderer4.push(`✓ NFT ownership benefits</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
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
        class: "relative border-primary/50 bg-primary/5",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<div class="absolute -top-2 left-1/2 -translate-x-1/2">`);
          push_element($$renderer3, "div", 197, 10);
          Badge($$renderer3, {
            class: "bg-primary text-primary-foreground",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<!---->Most Popular`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
          pop_element();
          $$renderer3.push(` `);
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center justify-between",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 202, 14);
                  $$renderer5.push(`Premium NFT</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Badge($$renderer5, {
                    class: "bg-primary text-primary-foreground",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->$15.99/mo`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="space-y-2 text-sm">`);
              push_element($$renderer4, "div", 207, 12);
              $$renderer4.push(`<div>`);
              push_element($$renderer4, "div", 208, 14);
              $$renderer4.push(`✓ 4K streaming</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 209, 14);
              $$renderer4.push(`✓ 2 devices</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 210, 14);
              $$renderer4.push(`✓ Premium content library</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 211, 14);
              $$renderer4.push(`✓ Download for offline</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 212, 14);
              $$renderer4.push(`✓ Enhanced NFT benefits</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
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
        class: "relative border-secondary/50 bg-secondary/5",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center justify-between",
                children: prevent_snippet_stringification(($$renderer5) => {
                  $$renderer5.push(`<span>`);
                  push_element($$renderer5, "span", 220, 14);
                  $$renderer5.push(`Creator NFT</span>`);
                  pop_element();
                  $$renderer5.push(` `);
                  Badge($$renderer5, {
                    class: "bg-secondary text-secondary-foreground",
                    children: prevent_snippet_stringification(($$renderer6) => {
                      $$renderer6.push(`<!---->$25.99/mo`);
                    }),
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!---->`);
                }),
                $$slots: { default: true }
              });
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Card_content($$renderer3, {
            class: "space-y-4",
            children: prevent_snippet_stringification(($$renderer4) => {
              $$renderer4.push(`<div class="space-y-2 text-sm">`);
              push_element($$renderer4, "div", 225, 12);
              $$renderer4.push(`<div>`);
              push_element($$renderer4, "div", 226, 14);
              $$renderer4.push(`✓ 4K + HDR streaming</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 227, 14);
              $$renderer4.push(`✓ 4 devices</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 228, 14);
              $$renderer4.push(`✓ All content + early access</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 229, 14);
              $$renderer4.push(`✓ Creator tools access</div>`);
              pop_element();
              $$renderer4.push(` <div>`);
              push_element($$renderer4, "div", 230, 14);
              $$renderer4.push(`✓ Exclusive NFT rewards</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
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
      $$renderer2.push(` <div class="text-center space-y-4 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">`);
      push_element($$renderer2, "div", 238, 4);
      $$renderer2.push(`<h3 class="text-xl font-bold">`);
      push_element($$renderer2, "h3", 239, 6);
      $$renderer2.push(`Ready to Own Your Subscription?</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 240, 6);
      $$renderer2.push(`Join thousands of users who chose NFT subscriptions for true ownership and exclusive benefits.</p>`);
      pop_element();
      $$renderer2.push(` <div class="flex gap-4 justify-center">`);
      push_element($$renderer2, "div", 241, 6);
      Button($$renderer2, {
        href: "/plans",
        class: "bg-primary hover:bg-primary/90",
        children: prevent_snippet_stringification(($$renderer3) => {
          Crown($$renderer3, { class: "mr-2 h-4 w-4" });
          $$renderer3.push(`<!----> Choose Your Plan`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        variant: "outline",
        href: "/tokens",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->Learn About STC Tokens`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-C43AGtrY.js.map
