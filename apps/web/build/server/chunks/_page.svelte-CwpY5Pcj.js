import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as prevent_snippet_stringification, E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import './config-Bjr_iq_c.js';
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from './card-title-C-y0C6UW.js';
import { B as Badge } from './badge-DBgw54iF.js';
import { B as Button } from './button-B5TxIyzE.js';
import { C as Coins } from './coins-CelX_gXX.js';
import { D as Dollar_sign } from './dollar-sign-DitbSj8h.js';
import { C as Crown } from './crown-GX5CuJGO.js';
import { T as Trending_up } from './trending-up-DO-Ljp1I.js';
import { A as Activity } from './activity-utKZCrS9.js';
import { U as Users } from './users-CMHMaCG6.js';
import '@wagmi/core';
import '@wagmi/core/chains';
import '@wagmi/connectors';
import './utils2-C-_3GP94.js';
import './Icon-DLeFNkXp.js';

_page[FILENAME] = "src/routes/(admin)/admin/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let adminStats = {
        pendingReviews: 0,
        totalCreators: 0,
        publishedContent: 0,
        rejectedContent: 0,
        totalViews: 0
      };
      let tokenomicsStats = {
        stcPrice: "0",
        totalStaked: "0",
        activeNFTs: 0,
        monthlyRevenue: "0",
        revenuePool: "0",
        buybackAmount: "0"
      };
      let adminWeb3Status = {
        stcBalance: "0"
      };
      $$renderer2.push(`<div class="space-y-8">`);
      push_element($$renderer2, "div", 101, 0);
      $$renderer2.push(`<div class="text-center">`);
      push_element($$renderer2, "div", 103, 2);
      $$renderer2.push(`<div class="flex justify-center items-center space-x-4 mb-4">`);
      push_element($$renderer2, "div", 104, 4);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white">`);
      push_element($$renderer2, "h1", 105, 6);
      $$renderer2.push(`Admin Dashboard</h1>`);
      pop_element();
      $$renderer2.push(` `);
      Badge($$renderer2, {
        variant: "outline",
        class: "bg-green-500/20 text-green-400 border-green-400",
        children: prevent_snippet_stringification(($$renderer3) => {
          $$renderer3.push(`<!---->${escape_html("Web3 Disconnected")}`);
        }),
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      if (parseFloat(adminWeb3Status.stcBalance) > 1e3) {
        $$renderer2.push("<!--[-->");
        Badge($$renderer2, {
          variant: "outline",
          class: "bg-yellow-500/20 text-yellow-400 border-yellow-400",
          children: prevent_snippet_stringification(($$renderer3) => {
            $$renderer3.push(`<!---->Super Admin`);
          }),
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <p class="text-xl text-gray-300">`);
      push_element($$renderer2, "p", 120, 4);
      $$renderer2.push(`Manage platform content and creator community</p>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">`);
      push_element($$renderer2, "div", 129, 2);
      $$renderer2.push(`<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 130, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-yellow-400">`);
      push_element($$renderer2, "div", 131, 6);
      $$renderer2.push(`${escape_html(adminStats.pendingReviews)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 132, 6);
      $$renderer2.push(`Pending Reviews</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 135, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-blue-400">`);
      push_element($$renderer2, "div", 136, 6);
      $$renderer2.push(`${escape_html(adminStats.totalCreators)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 137, 6);
      $$renderer2.push(`Active Creators</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 140, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-green-400">`);
      push_element($$renderer2, "div", 141, 6);
      $$renderer2.push(`${escape_html(adminStats.publishedContent)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 142, 6);
      $$renderer2.push(`Published Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 145, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-red-400">`);
      push_element($$renderer2, "div", 146, 6);
      $$renderer2.push(`${escape_html(adminStats.rejectedContent)}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 147, 6);
      $$renderer2.push(`Rejected Content</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">`);
      push_element($$renderer2, "div", 150, 4);
      $$renderer2.push(`<div class="text-3xl font-bold text-purple-400">`);
      push_element($$renderer2, "div", 151, 6);
      $$renderer2.push(`${escape_html(adminStats.totalViews.toLocaleString())}</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-300 text-sm">`);
      push_element($$renderer2, "div", 152, 6);
      $$renderer2.push(`Platform Views</div>`);
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
                  push_element($$renderer5, "span", 161, 8);
                  $$renderer5.push(`Platform Tokenomics Overview</span>`);
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
              $$renderer4.push(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">`);
              push_element($$renderer4, "div", 165, 6);
              $$renderer4.push(`<div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 166, 8);
              Dollar_sign($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-green-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 168, 10);
              $$renderer4.push(`$${escape_html(tokenomicsStats.stcPrice.slice(0, 8))}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 169, 10);
              $$renderer4.push(`STC Price</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 171, 8);
              Crown($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-yellow-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 173, 10);
              $$renderer4.push(`${escape_html(tokenomicsStats.activeNFTs.toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 174, 10);
              $$renderer4.push(`Active NFTs</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 176, 8);
              Trending_up($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-blue-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 178, 10);
              $$renderer4.push(`$${escape_html(parseFloat(tokenomicsStats.monthlyRevenue).toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 179, 10);
              $$renderer4.push(`Monthly Revenue</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 181, 8);
              Coins($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-orange-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 183, 10);
              $$renderer4.push(`${escape_html(parseFloat(tokenomicsStats.totalStaked).toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 184, 10);
              $$renderer4.push(`STC Staked</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 186, 8);
              Activity($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-purple-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 188, 10);
              $$renderer4.push(`$${escape_html(parseFloat(tokenomicsStats.buybackAmount).toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 189, 10);
              $$renderer4.push(`Monthly Buyback</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-center p-3 bg-white/10 rounded-lg">`);
              push_element($$renderer4, "div", 191, 8);
              Users($$renderer4, { class: "h-6 w-6 mx-auto mb-2 text-cyan-400" });
              $$renderer4.push(`<!----> <div class="text-lg font-bold text-white">`);
              push_element($$renderer4, "div", 193, 10);
              $$renderer4.push(`$${escape_html(parseFloat(tokenomicsStats.revenuePool).toLocaleString())}</div>`);
              pop_element();
              $$renderer4.push(` <div class="text-xs text-gray-300">`);
              push_element($$renderer4, "div", 194, 10);
              $$renderer4.push(`Creator Pool</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(`</div>`);
              pop_element();
              $$renderer4.push(` <div class="mt-4 flex space-x-3">`);
              push_element($$renderer4, "div", 197, 6);
              Button($$renderer4, {
                href: "/admin/tokenomics",
                class: "bg-primary hover:bg-primary/90",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Coins($$renderer5, { class: "mr-2 h-4 w-4" });
                  $$renderer5.push(`<!----> Manage Tokenomics`);
                }),
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                href: "/admin/creators",
                variant: "outline",
                children: prevent_snippet_stringification(($$renderer5) => {
                  Users($$renderer5, { class: "mr-2 h-4 w-4" });
                  $$renderer5.push(`<!----> Creator Payments`);
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
      $$renderer2.push(`<!----> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">`);
      push_element($$renderer2, "div", 211, 2);
      $$renderer2.push(`<a href="/admin/review" class="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-center hover:from-yellow-700 hover:to-orange-700 transition-all">`);
      push_element($$renderer2, "a", 212, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 213, 6);
      $$renderer2.push(`👁️</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 214, 6);
      $$renderer2.push(`Review Queue</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 215, 6);
      $$renderer2.push(`Review pending content</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/content" class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-center hover:from-blue-700 hover:to-indigo-700 transition-all">`);
      push_element($$renderer2, "a", 218, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 219, 6);
      $$renderer2.push(`🎬</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 220, 6);
      $$renderer2.push(`Content Library</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 221, 6);
      $$renderer2.push(`Manage all content</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/creators" class="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-center hover:from-green-700 hover:to-teal-700 transition-all">`);
      push_element($$renderer2, "a", 224, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 225, 6);
      $$renderer2.push(`👥</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 226, 6);
      $$renderer2.push(`Creators</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 227, 6);
      $$renderer2.push(`Manage creator accounts</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/tokenomics" class="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-6 text-center hover:from-orange-700 hover:to-amber-700 transition-all">`);
      push_element($$renderer2, "a", 230, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 231, 6);
      $$renderer2.push(`💰</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 232, 6);
      $$renderer2.push(`Tokenomics</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 233, 6);
      $$renderer2.push(`STC &amp; Revenue Control</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/policies" class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-center hover:from-purple-700 hover:to-indigo-700 transition-all">`);
      push_element($$renderer2, "a", 236, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 237, 6);
      $$renderer2.push(`📋</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 238, 6);
      $$renderer2.push(`Policies</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 239, 6);
      $$renderer2.push(`Content guidelines</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/communications" class="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-center hover:from-cyan-700 hover:to-blue-700 transition-all">`);
      push_element($$renderer2, "a", 242, 4);
      $$renderer2.push(`<div class="text-3xl mb-3">`);
      push_element($$renderer2, "div", 243, 6);
      $$renderer2.push(`💬</div>`);
      pop_element();
      $$renderer2.push(` <h3 class="text-lg font-bold text-white mb-1">`);
      push_element($$renderer2, "h3", 244, 6);
      $$renderer2.push(`Messages</h3>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-200 text-sm">`);
      push_element($$renderer2, "p", 245, 6);
      $$renderer2.push(`Creator communication</p>`);
      pop_element();
      $$renderer2.push(`</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6">`);
      push_element($$renderer2, "div", 250, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-white mb-4">`);
      push_element($$renderer2, "h2", 251, 4);
      $$renderer2.push(`Urgent Reviews Required</h2>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-4">`);
      push_element($$renderer2, "div", 252, 4);
      $$renderer2.push(`<div class="flex items-center justify-between py-3 border-b border-gray-700">`);
      push_element($$renderer2, "div", 253, 6);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 254, 8);
      $$renderer2.push(`<div class="text-white font-medium">`);
      push_element($$renderer2, "div", 255, 10);
      $$renderer2.push(`"The Gospel Truth" - Documentary</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-400 text-sm">`);
      push_element($$renderer2, "div", 256, 10);
      $$renderer2.push(`Submitted 3 days ago • Theological Review Required</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm">`);
      push_element($$renderer2, "span", 258, 8);
      $$renderer2.push(`Urgent</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center justify-between py-3 border-b border-gray-700">`);
      push_element($$renderer2, "div", 261, 6);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 262, 8);
      $$renderer2.push(`<div class="text-white font-medium">`);
      push_element($$renderer2, "div", 263, 10);
      $$renderer2.push(`"Youth Ministry Series" - Episode 1</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-400 text-sm">`);
      push_element($$renderer2, "div", 264, 10);
      $$renderer2.push(`Submitted 2 days ago • Content Review Required</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <span class="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">`);
      push_element($$renderer2, "span", 266, 8);
      $$renderer2.push(`High</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="flex items-center justify-between py-3">`);
      push_element($$renderer2, "div", 269, 6);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 270, 8);
      $$renderer2.push(`<div class="text-white font-medium">`);
      push_element($$renderer2, "div", 271, 10);
      $$renderer2.push(`"Worship &amp; Praise Collection"</div>`);
      pop_element();
      $$renderer2.push(` <div class="text-gray-400 text-sm">`);
      push_element($$renderer2, "div", 272, 10);
      $$renderer2.push(`Submitted 1 day ago • Technical Review Required</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">`);
      push_element($$renderer2, "span", 274, 8);
      $$renderer2.push(`Normal</span>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-6">`);
      push_element($$renderer2, "div", 278, 4);
      $$renderer2.push(`<a href="/admin/review" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg inline-block transition-colors">`);
      push_element($$renderer2, "a", 279, 6);
      $$renderer2.push(`Review All Pending Content</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CwpY5Pcj.js.map
