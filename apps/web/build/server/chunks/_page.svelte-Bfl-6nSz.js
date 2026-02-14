import { E as escape_html, p as prevent_snippet_stringification, M as store_get, N as unsubscribe_stores } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Button } from './button-B5TxIyzE.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { W as Wallet, i as isConnected } from './wallet-B7_7GztS.js';
import './config-Bjr_iq_c.js';
import { W as WalletConnect } from './WalletConnect-kbrpxgJC.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { D as Dollar_sign } from './dollar-sign-DitbSj8h.js';
import { T as Trending_up } from './trending-up-DO-Ljp1I.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { S as Settings } from './settings-RkmMlorm.js';
import { C as Credit_card } from './credit-card-VZyYc4T_.js';
import { A as Activity } from './activity-utKZCrS9.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './utils2-C-_3GP94.js';
import './Icon-DLeFNkXp.js';
import '@wagmi/core';
import '@wagmi/connectors';
import './index3-CnQVvK5M.js';
import '@wagmi/core/chains';
import './external-link-DQXvFabB.js';
import './zap-BWprV7m9.js';

_page[FILENAME] = "src/routes/(creator)/creator/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let creatorStats = {
        totalContent: 0,
        pendingReview: 0,
        published: 0,
        totalViews: 0,
        monthlyEarnings: 0
      };
      let tokenomicsStats = {
        stcBalance: "0",
        usdcBalance: "0",
        revenueShare: 30,
        tier: "standard",
        paymentPreference: "fiat"
      };
      function updatePaymentPreference(preference) {
        tokenomicsStats.paymentPreference = preference;
      }
      $$renderer2.push(`<div class="space-y-8">`);
      push_element($$renderer2, "div", 100, 0);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 102, 2);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 103, 4);
      $$renderer2.push(`Welcome to Creator Studio</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 104, 4);
      $$renderer2.push(`Manage your faith-based content and reach believers worldwide</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">`);
      push_element($$renderer2, "div", 108, 2);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 109, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 110, 6);
      $$renderer2.push(`${escape_html(creatorStats.totalContent)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 111, 6);
      $$renderer2.push(`Total Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 114, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-yellow-400">`);
      push_element($$renderer2, "div", 115, 6);
      $$renderer2.push(`${escape_html(creatorStats.pendingReview)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 116, 6);
      $$renderer2.push(`Pending Review</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 119, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 120, 6);
      $$renderer2.push(`${escape_html(creatorStats.published)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 121, 6);
      $$renderer2.push(`Published</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 124, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 125, 6);
      $$renderer2.push(`${escape_html(creatorStats.totalViews.toLocaleString())}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 126, 6);
      $$renderer2.push(`Total Views</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 129, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-pink-400">`);
      push_element($$renderer2, "div", 130, 6);
      $$renderer2.push(`$${escape_html(creatorStats.monthlyEarnings.toFixed(2))}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 131, 6);
      $$renderer2.push(`This Month</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      Card($$renderer2, {
        class: "bg-gradient-to-r from-primary/20 to-secondary/20",
        children: prevent_snippet_stringification(($$renderer3) => {
          Card_header($$renderer3, {
            children: prevent_snippet_stringification(($$renderer4) => {
              Card_title($$renderer4, {
                class: "flex items-center space-x-2 text-white",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Coins($$renderer5, { class: "h-6 w-6" });
                  $$renderer5.push(`<!----> <span>`);
                  push_element($$renderer5, "span", 140, 8);
                  $$renderer5.push(`Creator Earnings &amp; Tokenomics</span>`);
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
              if (!store_get($$store_subs ??= {}, "$isConnected", isConnected)) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="text-center py-8">`);
                push_element($$renderer4, "div", 145, 8);
                Wallet($$renderer4, { class: "h-12 w-12 text-gray-400 mx-auto mb-4" });
                $$renderer4.push(`<!----> <h3 class="text-lg font-medium text-white mb-2">`);
                push_element($$renderer4, "h3", 147, 10);
                $$renderer4.push(`Connect Your Wallet</h3>`);
                pop_element();
                $$renderer4.push(` <p class="text-gray-300 mb-4">`);
                push_element($$renderer4, "p", 148, 10);
                $$renderer4.push(`Connect your wallet to access Web3 earning features and tokenomics benefits.</p>`);
                pop_element();
                $$renderer4.push(` `);
                WalletConnect($$renderer4);
                $$renderer4.push(`<!----></div>`);
                pop_element();
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push(`<div class="space-y-6">`);
                push_element($$renderer4, "div", 152, 8);
                $$renderer4.push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4">`);
                push_element($$renderer4, "div", 154, 10);
                $$renderer4.push(`<div class="text-center p-3 bg-white/10 rounded-lg">`);
                push_element($$renderer4, "div", 155, 12);
                Coins($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-orange-400" });
                $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
                push_element($$renderer4, "div", 157, 14);
                $$renderer4.push(`${escape_html(parseFloat(tokenomicsStats.stcBalance).toLocaleString())}</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-xs text-gray-300">`);
                push_element($$renderer4, "div", 158, 14);
                $$renderer4.push(`STC Balance</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
                push_element($$renderer4, "div", 160, 12);
                Dollar_sign($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-green-400" });
                $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
                push_element($$renderer4, "div", 162, 14);
                $$renderer4.push(`$${escape_html(parseFloat(tokenomicsStats.usdcBalance).toLocaleString())}</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-xs text-gray-300">`);
                push_element($$renderer4, "div", 163, 14);
                $$renderer4.push(`USDC Balance</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
                push_element($$renderer4, "div", 165, 12);
                Trending_up($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-blue-400" });
                $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
                push_element($$renderer4, "div", 167, 14);
                $$renderer4.push(`${escape_html(tokenomicsStats.revenueShare)}%</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-xs text-gray-300">`);
                push_element($$renderer4, "div", 168, 14);
                $$renderer4.push(`Revenue Share</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
                push_element($$renderer4, "div", 170, 12);
                Crown($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-purple-400" });
                $$renderer4.push(`<!----> `);
                Badge($$renderer4, {
                  class: "text-xs",
                  variant: "outline",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html("Standard")}`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="space-y-4">`);
                push_element($$renderer4, "div", 182, 10);
                $$renderer4.push(`<h4 class="text-lg font-medium text-white flex items-center">`);
                push_element($$renderer4, "h4", 183, 12);
                Settings($$renderer4, { class: "h-5 w-5 mr-2" });
                $$renderer4.push(`<!----> Payment Preferences</h4>`);
                pop_element();
                $$renderer4.push(` <div class="grid grid-cols-2 md:grid-cols-4 gap-3">`);
                push_element($$renderer4, "div", 187, 12);
                Button($$renderer4, {
                  variant: tokenomicsStats.paymentPreference === "fiat" ? "default" : "outline",
                  size: "sm",
                  onclick: () => updatePaymentPreference("fiat"),
                  class: "flex items-center justify-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Credit_card($$renderer5, { class: "h-4 w-4 mr-2" });
                    $$renderer5.push(`<!----> Fiat Only`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  variant: tokenomicsStats.paymentPreference === "usdc" ? "default" : "outline",
                  size: "sm",
                  onclick: () => updatePaymentPreference("usdc"),
                  class: "flex items-center justify-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Dollar_sign($$renderer5, { class: "h-4 w-4 mr-2" });
                    $$renderer5.push(`<!----> USDC Only`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  variant: tokenomicsStats.paymentPreference === "stc" ? "default" : "outline",
                  size: "sm",
                  onclick: () => updatePaymentPreference("stc"),
                  class: "flex items-center justify-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Coins($$renderer5, { class: "h-4 w-4 mr-2" });
                    $$renderer5.push(`<!----> STC Only`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  variant: tokenomicsStats.paymentPreference === "mixed" ? "default" : "outline",
                  size: "sm",
                  onclick: () => updatePaymentPreference("mixed"),
                  class: "flex items-center justify-center",
                  children: prevent_snippet_stringification(($$renderer5) => {
                    Wallet($$renderer5, { class: "h-4 w-4 mr-2" });
                    $$renderer5.push(`<!----> Mixed`);
                  }),
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></div>`);
                pop_element();
                $$renderer4.push(` <p class="text-xs text-gray-400">`);
                push_element($$renderer4, "p", 225, 12);
                $$renderer4.push(`Current: ${escape_html(tokenomicsStats.paymentPreference === "fiat" ? "Bank transfer payments" : tokenomicsStats.paymentPreference === "usdc" ? "USDC crypto payments" : tokenomicsStats.paymentPreference === "stc" ? "STC token payments" : "50% Fiat + 30% USDC + 20% STC")}</p>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="p-4 bg-accent/10 border border-accent/20 rounded-lg">`);
                push_element($$renderer4, "div", 234, 10);
                $$renderer4.push(`<h4 class="font-medium text-white mb-2">`);
                push_element($$renderer4, "h4", 235, 12);
                $$renderer4.push(`Your Creator Benefits</h4>`);
                pop_element();
                $$renderer4.push(` <div class="grid md:grid-cols-2 gap-4 text-sm">`);
                push_element($$renderer4, "div", 236, 12);
                $$renderer4.push(`<div class="space-y-2">`);
                push_element($$renderer4, "div", 237, 14);
                $$renderer4.push(`<div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 238, 16);
                Activity($$renderer4, { class: "h-4 w-4 text-primary" });
                $$renderer4.push(`<!----> <span class="text-gray-300">`);
                push_element($$renderer4, "span", 240, 18);
                $$renderer4.push(`${escape_html(tokenomicsStats.revenueShare)}% revenue share on content</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` `);
                {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
                pop_element();
                $$renderer4.push(` <div class="space-y-2">`);
                push_element($$renderer4, "div", 249, 14);
                $$renderer4.push(`<div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 250, 16);
                Crown($$renderer4, { class: "h-4 w-4 text-accent" });
                $$renderer4.push(`<!----> <span class="text-gray-300">`);
                push_element($$renderer4, "span", 252, 18);
                $$renderer4.push(`${escape_html(tokenomicsStats.tier)} tier exclusive features</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(` <div class="flex items-center space-x-2">`);
                push_element($$renderer4, "div", 254, 16);
                Trending_up($$renderer4, { class: "h-4 w-4 text-green-400" });
                $$renderer4.push(`<!----> <span class="text-gray-300">`);
                push_element($$renderer4, "span", 256, 18);
                $$renderer4.push(`STC token growth participation</span>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
                $$renderer4.push(`</div>`);
                pop_element();
              }
              $$renderer4.push(`<!--]-->`);
            }),
            $$slots: { default: true }
          });
          $$renderer3.push(`<!---->`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 267, 2);
      $$renderer2.push(`<a href="/creator/upload" class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-center hover:from-purple-700 hover:to-blue-700 transition-all">`);
      push_element($$renderer2, "a", 268, 4);
      $$renderer2.push(`<div class="text-4xl mb-4">`);
      push_element($$renderer2, "div", 269, 6);
      $$renderer2.push(`🎬</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 270, 6);
      $$renderer2.push(`Upload New Content</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200">`);
      push_element($$renderer2, "p", 271, 6);
      $$renderer2.push(`Share your ministry with the world</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/content" class="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-center hover:from-green-700 hover:to-teal-700 transition-all">`);
      push_element($$renderer2, "a", 274, 4);
      $$renderer2.push(`<div class="text-4xl mb-4">`);
      push_element($$renderer2, "div", 275, 6);
      $$renderer2.push(`📚</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 276, 6);
      $$renderer2.push(`Manage Content</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200">`);
      push_element($$renderer2, "p", 277, 6);
      $$renderer2.push(`Edit and organize your library</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/analytics" class="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-center hover:from-orange-700 hover:to-red-700 transition-all">`);
      push_element($$renderer2, "a", 280, 4);
      $$renderer2.push(`<div class="text-4xl mb-4">`);
      push_element($$renderer2, "div", 281, 6);
      $$renderer2.push(`📊</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 282, 6);
      $$renderer2.push(`View Analytics</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200">`);
      push_element($$renderer2, "p", 283, 6);
      $$renderer2.push(`Track your impact and growth</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/creator/earnings" class="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-8 text-center hover:from-amber-700 hover:to-orange-700 transition-all">`);
      push_element($$renderer2, "a", 286, 4);
      $$renderer2.push(`<div class="text-4xl mb-4">`);
      push_element($$renderer2, "div", 287, 6);
      $$renderer2.push(`💰</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h3", 288, 6);
      $$renderer2.push(`Earnings Dashboard</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200">`);
      push_element($$renderer2, "p", 289, 6);
      $$renderer2.push(`Track STC tokens &amp; payments</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 294, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-4">`);
      push_element($$renderer2, "h2", 295, 4);
      $$renderer2.push(`Recent Activity</h2>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 296, 4);
      $$renderer2.push(`<div class="flex items-center justify-between py-3 border-b border-gray-700">`);
      push_element($$renderer2, "div", 297, 6);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 298, 8);
      $$renderer2.push(`<div class="text-white font-medium">`);
      push_element($$renderer2, "div", 299, 10);
      $$renderer2.push(`"Faith in Action" submitted for review</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-400 text-sm">`);
      push_element($$renderer2, "div", 300, 10);
      $$renderer2.push(`2 hours ago</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">`);
      push_element($$renderer2, "span", 302, 8);
      $$renderer2.push(`Pending</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center justify-between py-3 border-b border-gray-700">`);
      push_element($$renderer2, "div", 305, 6);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 306, 8);
      $$renderer2.push(`<div class="text-white font-medium">`);
      push_element($$renderer2, "div", 307, 10);
      $$renderer2.push(`"Sunday Sermon Series" approved</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-400 text-sm">`);
      push_element($$renderer2, "div", 308, 10);
      $$renderer2.push(`1 day ago</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm">`);
      push_element($$renderer2, "span", 310, 8);
      $$renderer2.push(`Approved</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center justify-between py-3">`);
      push_element($$renderer2, "div", 313, 6);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 314, 8);
      $$renderer2.push(`<div class="text-white font-medium">`);
      push_element($$renderer2, "div", 315, 10);
      $$renderer2.push(`"Worship Night Live" published</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-400 text-sm">`);
      push_element($$renderer2, "div", 316, 10);
      $$renderer2.push(`3 days ago</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">`);
      push_element($$renderer2, "span", 318, 8);
      $$renderer2.push(`Published</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
//# sourceMappingURL=_page.svelte-Bfl-6nSz.js.map
